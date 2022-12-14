<script setup lang="ts">
import { GetDataOfPrefecture } from "@/types/store.js";
import axios from "axios";
import { onMounted, ref, watch } from "vue";
import { useStore } from "vuex";
import Papa from "papaparse";
import Chart, { ChartItem } from "chart.js/auto";
import BaseButton from "@/components/presentation/BaseButton.vue";
import { useRouter } from "vue-router";
const store = useStore();

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
const municipalityOfTokyo = ref({
  update: "",
  data: [
    {
      name: "",
      count: 0,
      class: "",
    },
  ],
  outOfTokyo: 0,
  investigating: 0,
  subTotal: 0,
});

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
  displayDataByStore.value.clinicalEngineer = Number(ventRes["???CE?????????"]);
  displayDataByStore.value.ventilator =
    Number(ventRes["?????????????????????????????????????????????"]) +
    Number(ventRes["??????????????????????????????"]);
  displayDataByStore.value.ecmo = Number(ventRes["ECMO?????????????????????"]);

  if (props.prefCode === "JP-13") {
    getMunicipalityOfTokyo();
  }
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
      (data: { [x: string]: string }) => data.???????????? === nameJp
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
const getMunicipalityOfTokyo = async () => {
  municipalityOfTokyo.value.data.splice(0);
  const res = await axios.get(
    "https://raw.githubusercontent.com/tokyo-metropolitan-gov/covid19/master/data/patient.json"
  );
  municipalityOfTokyo.value.update = res.data.date;
  for (let data of res.data.datasets.data) {
    if (data.label === "??????") {
      municipalityOfTokyo.value.outOfTokyo = data.count;
    } else if (data.label === "?????????") {
      municipalityOfTokyo.value.investigating = data.count;
    } else if (data.label === "??????") {
      municipalityOfTokyo.value.subTotal = data.count;
    } else {
      municipalityOfTokyo.value.data.push({
        name: data.label,
        count: data.count,
        class: (function (count) {
          if (count >= 1 && count <= 300) {
            return "bg-red-50";
          } else if (count <= 500) {
            return "bg-red-100";
          } else if (count <= 1000) {
            return "bg-red-200";
          } else if (count <= 3000) {
            return "bg-red-300";
          } else if (count <= 5000) {
            return "bg-red-400";
          } else if (count <= 10000) {
            return "bg-red-500";
          } else if (count >= 10001) {
            return "bg-red-600";
          } else {
            return "bg-white";
          }
        })(data.count),
      });
    }
  }
};

// ?????????
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
  let ctx1 = document.getElementById("pieChart") as ChartItem;

  if (pieChart) {
    pieChart.destroy();
  }
  pieChart = new Chart(ctx1, {
    type: "pie",
    data: {
      labels: [
        `???????????????(${displayDataByStore.value.currentPatients})`,
        `??????????????????(${bedsRemaining()})`,
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
          label: "???????????????????????????",
          data: graphDataByApi.currentPatients,
          backgroundColor: ["rgba(255, 99, 132, 0.2)"],
          borderColor: ["rgba(255,99,132,1)"],
          borderWidth: 1,
          yAxisID: "y",
        },
        {
          label: "??????????????????",
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
            text: "???????????????????????????",
            font: { size: 10 },
          },
        },
        y2: {
          type: "linear",
          position: "left",
          title: {
            display: true,
            text: "??????????????????",
            font: { size: 10 },
          },
        },
      },
    },
  });
};

const clickButton = () => {
  getDisplayDataByStore();
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
  //   await getDisplayDataByStore();
  //   await getGraphData();
  renderChart();
});
// watchEffect(() => {
//   getDisplayDataByStore();
//   getGraphData();
// });
watch(
  () => props,
  (next, prev) => {
    getDisplayDataByStore();
    getGraphData();
  },
  {
    deep: true,
  }
);

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
        <!-- ????????????????????? -->
        <div class="text-center text-3xl">
          {{ store.getters.getNameJp(props.prefCode) }} ???????????????/???????????????
          {{ props.bedRate }}%
        </div>
        <div class="w-full px-32 my-1">
          <canvas id="pieChart"></canvas>
        </div>
        <div class="text-center text-2xl">
          ???????????????: {{ displayDataByStore.patients.toLocaleString() }}???
          ???????????????: {{ displayDataByStore.exits.toLocaleString() }}???
          <br />
          ????????????: {{ displayDataByStore.deaths.toLocaleString() }}???
          ???????????????:
          {{ (props.bedsOfHospital + props.bedsOfHotel).toLocaleString() }}???
        </div>
        <div class="text-center">
          ??????????????? ??????:
          <a :href="displayDataByStore.sourceUrl" class="underline">{{
            displayDataByStore.source
          }}</a
          >(?????????: {{ displayDataByStore.lastUpdate }})
          <br />
          <a
            href="http://www.jibika.or.jp/members/information/info_corona.html"
            class="underline"
            >?????????????????? ???????????????????????????</a
          >?????????????????????????????????????????????????????????
          {{ displayDataByStore.currentPatients }}??? >= 10??????
          <br />
          ??????????????? ????????????{{ props.bedsOfHospital }}???+????????????{{
            props.bedsOfHotel
          }}??? ??????:
          <a
            href="https://www.mhlw.go.jp/stf/seisakunitsuite/newpage_00023.html"
            class="underline"
            >???????????????????????????????????????????????????????????????</a
          >(?????????: {{ props.bedsUpdate }})
        </div>
        <div class="pt-6 pb-3 text-center">
          (??????) ??????????????????:{{ displayDataByStore.clinicalEngineer }}???
          ??????????????????????????????????????????:{{ displayDataByStore.ventilator }}???
          ECMO????????????:{{ displayDataByStore.ecmo }}???
          <br />
          2020???2????????? ??????:
          <a
            href="https://www.ja-ces.or.jp/info-ce/%e4%ba%ba%e5%b7%a5%e5%91%bc%e5%90%b8%e5%99%a8%e3%81%8a%e3%82%88%e3%81%b3ecmo%e8%a3%85%e7%bd%ae%e3%81%ae%e5%8f%96%e6%89%b1%e5%8f%b0%e6%95%b0%e7%ad%89%e3%81%ab%e9%96%a2%e3%81%99%e3%82%8b%e7%b7%8a/"
            class="underline"
            >?????????????????? ??????????????????????????? ?????????????????? ???????????????????????????</a
          >
        </div>
        <div class="w-full h-4/5">
          <canvas id="lineChart"></canvas>
        </div>
      </div>
      <div v-if="props.prefCode === 'JP-13'">
        <div class="text-center pt-10">
          ????????????????????????????????????????????????????????? ??????:
          {{ municipalityOfTokyo.update }}
        </div>
        <div class="grid grid-cols-8 gap-1">
          <div
            v-for="data of municipalityOfTokyo.data"
            :key="data.name"
            class="cursor-pointer grid place-items-center text-black text-center"
            :class="data.class"
          >
            {{ data.name }}
            <br />
            {{ data.count }}
          </div>
        </div>
        <div class="text-center text-xs pt-2">
          ?????????:{{
            municipalityOfTokyo.outOfTokyo.toLocaleString()
          }}????????????:{{
            municipalityOfTokyo.investigating.toLocaleString()
          }}?????????:{{ municipalityOfTokyo.subTotal.toLocaleString() }}???
        </div>
      </div>
      <div class="btn flex justify-center py-8">
        <BaseButton display-name="?????????" @click="closeModal"></BaseButton>
        <BaseButton
          v-if="displayDataByStore.appUrl !== ''"
          display-name="????????????"
          @click="jumpAppPage"
        ></BaseButton>
        <BaseButton
          display-name="??????????????????"
          @click="jumpOfficialPage"
        ></BaseButton>
      </div>
    </div>
  </teleport>
</template>
