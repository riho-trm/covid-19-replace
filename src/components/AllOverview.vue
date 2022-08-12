<script setup lang="ts">
import { reactive, ref, toRefs } from "vue";
import { useStore } from "vuex";
import {
  AllOverview,
  ComparisonWithPreviousDay,
  OverviewByPrefecture,
} from "../types/overview";
const store = useStore();

let allOverview = ref({
  bedRate: 0,
  currentPatients: 0,
  exits: 0,
  deaths: 0,
  beds: 0,
  patients: 0,
  clinicalEngineer: 0,
  ventilator: 0,
  ecmo: 0,
  patientsUpdate: new Date(),
  bedsUPdate: new Date(),
} as AllOverview);
let overviewByPrefecture = ref([
  {
    name: "",
    nameJp: "",
    currentpatients: 0,
    bedsOfHospital: 0,
    bedsOfHotel: 0,
    code: "",
  },
] as OverviewByPrefecture[]);
let comparisonWithPreviousDay: ComparisonWithPreviousDay;
let naniwaChan = reactive([
  { id: 1, name: "西畑" },
  { id: 2, name: "大西" },
  { id: 3, name: "道枝" },
  { id: 4, name: "高橋" },
  { id: 5, name: "長尾" },
  { id: 6, name: "藤原" },
  { id: 7, name: "大橋" },
]);

const setApiData = async () => {
  try {
    store.commit("resetState");
    await store.dispatch("getPatientsNumber");
    await store.dispatch("getPromptReport");
    await store.dispatch("getBedsData");
    await store.dispatch("getAppUrl");
    await store.dispatch("getVentilator");
  } catch (e) {
    console.log(e);
  }
};

const created = async () => {
  await setApiData();
  allOverview.value = await store.getters.getAllOverView;
  overviewByPrefecture = await store.getters.getOverviewByPrefecture;
};
created();
</script>

<template>
  <div class="overview-wrapper">
    <!-- 左側の全国概況テーブル -->
    <div class="all-overview">
      <div class="table">
        <table class="border-collapse border-2 border-red-800">
          <tr>
            <th class="border-2 border-red-800 px-4 text-sm font-normal">
              現在患者数/対策病床数
            </th>
            <th class="border-2 border-red-800 px-4 text-sm font-normal">
              現在患者数
            </th>
          </tr>
          <tr>
            <td
              class="border-2 border-red-800 px-4 py-2 text-3xl text-white font-medium text-center bg-red-800"
            >
              {{ allOverview.bedRate.toLocaleString() }}%
            </td>
            <td
              class="border-2 border-red-800 px-4 py-2 text-3xl text-white font-medium text-center bg-red-800"
            >
              {{ allOverview.currentPatients.toLocaleString() }}人
            </td>
          </tr>
          <tr>
            <th class="border border-red-800 px-4 text-sm font-normal">
              累積退院者
            </th>
            <th class="border-2 border-red-800 px-4 text-sm font-normal">
              死亡者
            </th>
          </tr>
          <tr>
            <td
              class="border-2 border-red-800 px-4 py-2 text-3xl text-white font-medium text-center bg-red-800"
            >
              {{ allOverview.exits.toLocaleString() }}人
            </td>
            <td
              class="border-2 border-red-800 px-4 py-2 text-3xl text-white font-medium text-center bg-red-800"
            >
              {{ allOverview.deaths.toLocaleString() }}人
              <fa icon="fa-solid fa-arrow-up" class="text-blue-700" />
            </td>
          </tr>
          <tr>
            <th class="border-2 border-red-800 px-4 text-sm font-normal">
              対策病床数 {{ allOverview.beds.toLocaleString() }}床
            </th>
            <th class="border-2 border-red-800 px-4 text-sm font-normal">
              PCR検査陽性者数 {{ allOverview.patients.toLocaleString() }}人
            </th>
          </tr>
          <tr>
            <td colspan="2" class="border border-red-800 px-4 py-2 text-center">
              <p>
                臨床工学技士
                {{ allOverview.clinicalEngineer.toLocaleString() }}人 /
                人工呼吸器 {{ allOverview.ventilator.toLocaleString() }}台 /
                ECMO
                {{ allOverview.ecmo.toLocaleString() }}台<br />2020年2月回答
                <a
                  href="https://www.ja-ces.or.jp/info-ce/%e4%ba%ba%e5%b7%a5%e5%91%bc%e5%90%b8%e5%99%a8%e3%81%8a%e3%82%88%e3%81%b3ecmo%e8%a3%85%e7%bd%ae%e3%81%ae%e5%8f%96%e6%89%b1%e5%8f%b0%e6%95%b0%e7%ad%89%e3%81%ab%e9%96%a2%e3%81%99%e3%82%8b%e7%b7%8a/"
                  class="underline"
                  >出典 一般社団法人 日本呼吸療法医学会 公益社団法人
                  日本臨床工学技士会</a
                >
              </p>
            </td>
          </tr>
        </table>
        <div class="update-date">
          <div class="text-sm text-center">
            <p>
              現在患者数 更新日：{{ allOverview.patientsUpdate }} <br />
              対策病床数 更新日：{{ allOverview.bedsUPdate }}
            </p>
          </div>
        </div>
        <!-- あとで速報チェックを追加する -->
      </div>
    </div>
    <!-- 右側の県別概況の表、v-forで書く -->
    <div class="overview-by-prefecture">
      <div class="grid grid-cols-3 gap-1">
        <div
          class="grid place-items-center bg-black text-white h-12 text-center col-span-2"
        >
          1
        </div>
        <div
          v-for="naniwa in naniwaChan"
          :key="naniwa.id"
          class="grid place-items-center bg-black text-white h-12 text-center"
        >
          <div>{{ naniwa.id }}</div>
          <div>{{ naniwa.name }}</div>
        </div>
      </div>
    </div>
  </div>
  <div class="supplement"></div>
</template>
