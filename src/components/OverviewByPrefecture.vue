<script setup lang="ts">
import { GetDataOfPrefecture } from "@/types/store.js";
import axios from "axios";
import { onMounted, ref, watchEffect } from "vue";
import { useStore } from "vuex";
import Papa from "papaparse";
import Chart, { ChartItem } from "chart.js/auto";
import BaseButton from "@/components/presentation/BaseButton.vue";
import { useRouter } from "vue-router";
const store = useStore();
const router = useRouter();

interface Props {
  isVisible: boolean;
  promptChecked: boolean;
  prefCode: string;
  prefName: string;
  bedsOfHospital: number;
  bedsOfHotel: number;
  bedRate: number;
  bedsUpdate: string;
}
const props = defineProps<Props>();

const displayDataByStore = ref({
  nameJp: "",
  patients: 0,
  currentPatients: 0,
  exits: 0,
  deaths: 0,
  source: "",
  sourceUrl: "",
  lastUpdate: "",
  url: "",
  appUrl: "",
  clinicalEngineer: 0,
  ventilator: 0,
  ecmo: 0,
});
const graphDataByApi = {
  labels: [] as string[],
  currentPatients: [] as number[],
  deaths: [] as number[],
};

const getDisplayDataByStore = async () => {
  const urlRes = await store.getters.getAppUrl(props.prefCode);
  const nameJp = await store.getters.getNameJp(props.prefCode);
  const ventRes = await getVentilator(nameJp);

  let dataOfPrefRes = {} as GetDataOfPrefecture;
  if (props.promptChecked === true) {
    const res = await store.getters.getPromptReportByPrefecture(props.prefName);
    if (res === undefined) {
      dataOfPrefRes = await store.getters.getDataOfPrefecture(props.prefCode);
    } else {
      dataOfPrefRes = res;
    }
  } else if (props.promptChecked === false) {
    dataOfPrefRes = await store.getters.getDataOfPrefecture(props.prefCode);
  }

  displayDataByStore.value.nameJp = dataOfPrefRes.nameJp;
  displayDataByStore.value.patients = dataOfPrefRes.patients;
  displayDataByStore.value.currentPatients = dataOfPrefRes.currentPatients;
  displayDataByStore.value.exits = dataOfPrefRes.exits;
  displayDataByStore.value.deaths = dataOfPrefRes.deaths;
  displayDataByStore.value.source = dataOfPrefRes.source;
  displayDataByStore.value.sourceUrl = dataOfPrefRes.sourceUrl;
  displayDataByStore.value.lastUpdate = dataOfPrefRes.lastUpdate;
  displayDataByStore.value.url = urlRes.url;
  displayDataByStore.value.appUrl = urlRes.appUrl;
  displayDataByStore.value.clinicalEngineer = Number(ventRes["総CE（名）"]);
  displayDataByStore.value.ventilator =
    Number(ventRes["マスク専用人工呼吸器取扱（台）"]) +
    Number(ventRes["人工呼吸器取扱（台）"]);
  displayDataByStore.value.ecmo = Number(ventRes["ECMO装置取扱（台）"]);
};

const getVentilator = async (nameJp: string) => {
  try {
    const res = await axios.get(
      "https://www.stopcovid19.jp/data/ventilator-20200306.csv"
    );
    const parsed: any = Papa.parse(res.data, {
      header: true,
    }).data;
    const returnRes = parsed.find(
      (data: { [x: string]: string }) => data.都道府県 === nameJp
    );
    return returnRes;
  } catch (e) {
    console.log(e);
  }
};
const getGraphData = async () => {
  graphDataByApi.labels.splice(0);
  graphDataByApi.currentPatients.splice(0);
  graphDataByApi.deaths.splice(0);
  try {
    const res = await axios.get(
      `https://www.stopcovid19.jp/data/covid19japan/pref/${props.prefName}.csv`
    );
    const parsed: any = Papa.parse(res.data, {
      header: true,
    }).data;
    for (const data of parsed) {
      graphDataByApi.labels.push(data.date);
      graphDataByApi.currentPatients.push(Number(data.ncurrentpatients));
      graphDataByApi.deaths.push(Number(data.ndeaths));
    }
  } catch (e) {
    console.log(e);
  }
};

// グラフ
const bedsRemaining = () => {
  return (
    props.bedsOfHospital +
    props.bedsOfHotel -
    displayDataByStore.value.currentPatients
  );
};
const pieBeds = () => {
  const res = bedsRemaining();
  if (res < 0) {
    return 0;
  } else {
    return res;
  }
};

let pieChart: Chart<"pie", number[], string>;
let lineChart: Chart<"line", number[], string>;
const renderChart = () => {
  console.log("renderChartがよばれた");

  let ctx1 = document.getElementById("pieChart") as ChartItem;

  if (pieChart) {
    pieChart.destroy();
  }
  pieChart = new Chart(ctx1, {
    type: "pie",
    data: {
      labels: [
        `現在患者数(${displayDataByStore.value.currentPatients})`,
        `想定病床残数(${bedsRemaining()})`,
      ],
      datasets: [
        {
          backgroundColor: ["#fa8072", "#a9a9a9"],
          data: [displayDataByStore.value.currentPatients, pieBeds()],
        },
      ],
    },
    options: {
      responsive: true,
    },
  });

  if (lineChart) {
    lineChart.destroy();
  }
  let ctx = document.getElementById("lineChart") as ChartItem;
  lineChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: graphDataByApi.labels,
      datasets: [
        {
          label: "入院治療を要する者",
          data: graphDataByApi.currentPatients,
          backgroundColor: ["rgba(255, 99, 132, 0.2)"],
          borderColor: ["rgba(255,99,132,1)"],
          borderWidth: 1,
          yAxisID: "y",
        },
        {
          label: "累計死亡者数",
          data: graphDataByApi.deaths,
          backgroundColor: ["rgba(54, 162, 235, 0.2)"],
          borderColor: ["rgba(54, 162, 235, 1)"],
          borderWidth: 1,
          yAxisID: "y2",
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          type: "linear",
          position: "right",
          title: {
            display: true,
            text: "入院治療を要する者",
            font: { size: 10 },
          },
        },
        y2: {
          type: "linear",
          position: "left",
          title: {
            display: true,
            text: "累計死亡者数",
            font: { size: 10 },
          },
        },
      },
    },
  });
  console.log(graphDataByApi.currentPatients);
};

const clickButton = () => {
  renderChart();
};

interface Emits {
  (e: "close"): void;
}
const emit = defineEmits<Emits>();
const closeModal = () => {
  emit("close");
};
const jumpOfficialPage = () => {
  window.open(displayDataByStore.value.url, "_blank");
};
const jumpAppPage = () => {
  window.open(displayDataByStore.value.appUrl, "_blank");
};

onMounted(async () => {
  await getDisplayDataByStore();
  await getGraphData();
  renderChart();
});
watchEffect(() => {
  getDisplayDataByStore();
  getGraphData();
});

defineExpose({
  renderChart,
  clickButton,
});
</script>

<template>
  <teleport to="body">
    <div
      class="modal fixed inset-0 bg-gray-400 bg-opacity-70 flex flex-col items-center justify-center"
      v-show="isVisible"
    ></div>
    <div
      class="modal-content fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-white w-3/4 h-screen p-5 overflow-y-scroll"
      v-show="isVisible"
    >
      <div class="modal-wrapper">
        <div class="text-right">
          <fa
            icon="fa-solid fa-xmark"
            class="text-gray-500 text-4xl cursor-pointer"
            @click="closeModal"
          />
        </div>
        <!-- コンテンツ配置 -->
        <div class="text-center text-3xl">
          {{ store.getters.getNameJp(props.prefCode) }} 現在患者数/対策病床数
          {{ props.bedRate }}%
        </div>
        <div class="w-full px-32 my-1">
          <canvas id="pieChart"></canvas>
        </div>
        <div class="text-center text-2xl">
          累積陽性者: {{ displayDataByStore.patients.toLocaleString() }}人
          累積退院者: {{ displayDataByStore.exits.toLocaleString() }}人
          <br />
          累積死者: {{ displayDataByStore.deaths.toLocaleString() }}人
          対策病床数:
          {{ (props.bedsOfHospital + props.bedsOfHotel).toLocaleString() }}床
        </div>
        <div class="text-center">
          現在患者数 出典:
          <a :href="displayDataByStore.sourceUrl" class="underline">{{
            displayDataByStore.source
          }}</a
          >(更新日: {{ displayDataByStore.lastUpdate }})
          <br />
          <a
            href="http://www.jibika.or.jp/members/information/info_corona.html"
            class="underline"
            >一般社団法人 日本耳鼻咽喉科学会</a
          >定義におけるハイリスク地域（現在患者数
          {{ displayDataByStore.currentPatients }}名 >= 10名）
          <br />
          対策病床数 医療機関{{ props.bedsOfHospital }}床+宿泊施設{{
            props.bedsOfHotel
          }}室 出典:
          <a
            href="https://www.mhlw.go.jp/stf/seisakunitsuite/newpage_00023.html"
            class="underline"
            >新型コロナウイルス対策病床数オープンデータ</a
          >(発表日: {{ props.bedsUpdate }})
        </div>
        <div class="pt-6 pb-3 text-center">
          (参考) 臨床工学技士:{{ displayDataByStore.clinicalEngineer }}人
          マスク専用含む人工呼吸器取扱:{{ displayDataByStore.ventilator }}台
          ECMO装置取扱:{{ displayDataByStore.ecmo }}台
          <br />
          2020年2月回答 出典:
          <a
            href="https://www.ja-ces.or.jp/info-ce/%e4%ba%ba%e5%b7%a5%e5%91%bc%e5%90%b8%e5%99%a8%e3%81%8a%e3%82%88%e3%81%b3ecmo%e8%a3%85%e7%bd%ae%e3%81%ae%e5%8f%96%e6%89%b1%e5%8f%b0%e6%95%b0%e7%ad%89%e3%81%ab%e9%96%a2%e3%81%99%e3%82%8b%e7%b7%8a/"
            class="underline"
            >一般社団法人 日本呼吸療法医学会 公益社団法人 日本臨床工学技士会</a
          >
        </div>
        <div class="w-full h-4/5">
          <canvas id="lineChart"></canvas>
        </div>
      </div>
      <div class="btn flex justify-center py-8">
        <BaseButton display-name="とじる" @click="closeModal"></BaseButton>
        <BaseButton
          v-if="displayDataByStore.appUrl !== ''"
          display-name="アプリへ"
          @click="jumpAppPage"
        ></BaseButton>
        <BaseButton
          display-name="公式サイトへ"
          @click="jumpOfficialPage"
        ></BaseButton>
      </div>
    </div>
  </teleport>
</template>
