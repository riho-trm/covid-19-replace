<script setup lang="ts">
import axios from "axios";
import { ref } from "vue";
import { useStore } from "vuex";
import {
  AllOverview,
  ComparisonWithPreviousDay,
  OverviewByPrefecture,
  ComparisonRes,
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
let comparisonWithPreviousDay = ref([
  {
    name: "",
    todayCurrentPatients: 0,
    yesterdayCurrentPatients: 0,
  },
] as ComparisonWithPreviousDay[]);

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
  overviewByPrefecture.value = await store.getters.getOverviewByPrefecture;
  const comparisonRes = await axios.get(
    "https://www.stopcovid19.jp/data/covid19japan-trend.json"
  );
  const comparisonResOfData: ComparisonRes[] = comparisonRes.data;
  comparisonWithPreviousDay.value.splice(0, 1);
  for (const res of comparisonResOfData) {
    comparisonWithPreviousDay.value.push({
      name: res.name,
      todayCurrentPatients: res.ncurrentpatients,
      yesterdayCurrentPatients: res.dcurrentpatients,
    });
  }
  console.log(comparisonWithPreviousDay.value);
};
created();

const bedRateByPrefecture = (
  hospitalBeds: number,
  hotelBeds: number,
  currentPatients: number
) => {
  return Math.floor(
    (currentPatients / (hospitalBeds + hotelBeds)) * 100
  ).toLocaleString();
};
const upOrDown = (prefName: string, currentPatients: number) => {
  const res = comparisonWithPreviousDay.value.find(
    (data) => data.name === prefName
  );
  console.log(res);

  if (
    res?.todayCurrentPatients !== currentPatients ||
    res === undefined ||
    res.yesterdayCurrentPatients === 0
  ) {
    return 0;
  } else if (res.yesterdayCurrentPatients < 0) {
    return 1;
  } else if (res.yesterdayCurrentPatients > 0) {
    return 2;
  }
};
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
      <div class="grid grid-cols-7 gap-1">
        <div
          class="grid place-items-center bg-black text-white h-12 text-center col-span-2"
        >
          <div>
            {{ allOverview.currentPatients.toLocaleString() }}/{{
              allOverview.beds.toLocaleString()
            }}
          </div>
          <div>(全国)現在患者数/対策病床数</div>
        </div>
        <div
          v-for="overview of overviewByPrefecture"
          :key="overview.code"
          class="grid place-items-center bg-black text-white h-12 text-center"
        >
          <div>
            {{ overview.nameJp }}
            <fa
              v-if="upOrDown(overview.name, overview.currentpatients) === 2"
              icon="fa-solid fa-arrow-up"
              class="text-red-500"
            />
            <fa
              v-else-if="
                upOrDown(overview.name, overview.currentpatients) === 1
              "
              icon="fa-solid fa-arrow-down"
              class="text-blue-700"
            />
          </div>
          <div>
            {{
              bedRateByPrefecture(
                overview.bedsOfHospital,
                overview.bedsOfHotel,
                overview.currentpatients
              )
            }}%
          </div>
          <div>
            {{ overview.currentpatients.toLocaleString() }}/{{
              (overview.bedsOfHospital + overview.bedsOfHotel).toLocaleString()
            }}
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="supplement text-center">
    新型コロナウイルス感染症（国内事例） 現在患者数 / 対策病床数
    ※軽症者等は自宅療養など、病床を使用しないことがあります（<a
      href="https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000164708_00001.html"
      class="underline"
      >詳細</a
    >）
    <br />
    （現在患者数 前日より増加<fa
      icon="fa-solid fa-arrow-up"
      class="text-red-500"
    />
    前日より減少<fa icon="fa-solid fa-arrow-down" class="text-blue-700" />）
  </div>
</template>
