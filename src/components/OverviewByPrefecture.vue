<script setup lang="ts">
import { GetDataOfPrefecture } from "@/types/store.js";
import axios from "axios";
import { ref, toRefs, watch, watchEffect } from "vue";
import { useStore } from "vuex";
import Papa from "papaparse";
import { parse } from "path";

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

const graphDataByApi = [
  {
    currentPatients: 0,
    deaths: 0,
  },
];
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
  console.log(displayDataByStore.value);
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
  try {
    const res = await axios.get(
      `https://www.stopcovid19.jp/data/covid19japan/pref/${props.prefName}.csv`
    );
    const parsed: any = Papa.parse(res.data, {
      header: true,
    }).data;
    console.log(parsed);

    // const returnRes = parsed.find(
    //   (data: { [x: string]: string }) => data.都道府県 === nameJp
    // );
    // return returnRes;
  } catch (e) {
    console.log(e);
  }
};

watchEffect(() => {
  getDisplayDataByStore();
  getGraphData();
});

// const created = async () => {
//
// };
// created();
</script>

<template>
  <teleport to="body">
    <div
      class="modal fixed inset-0 bg-gray-400 bg-opacity-70 flex flex-col items-center justify-center"
      v-show="isVisible"
    ></div>
    <div
      class="modal-content fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center bg-white w-3/4 h-auto p-5"
      v-show="isVisible"
    >
      <div class="modal-wrapper">
        <!-- コンテンツ配置 -->
        テストだよ
      </div>
      <div class="btn">
        <!-- ボタン配置 -->
      </div>
    </div>
  </teleport>
</template>
