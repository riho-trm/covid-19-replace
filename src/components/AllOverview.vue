<script setup lang="ts">
import axios from "axios";
import { ref, watchEffect } from "vue";
import { useStore } from "vuex";
import {
  AllOverview,
  ComparisonWithPreviousDay,
  OverviewByPrefecture,
  ComparisonRes,
} from "../types/overview";
import BaseCheckbox from "@/components/presentation/BaseCheckbox.vue";
import OverviewByPrefectureVue from "./OverviewByPrefecture.vue";
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
let promptChecked = ref(false);
let modalData = ref({
  isVisible: false,
  prefCode: "",
  prefName: "",
  bedsOfHospital: 0,
  bedsOfHotel: 0,
  bedRate: 0,
  bedsUpdate: "",
});

const childRef = ref();

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
};
created();

const bedRateByPrefecture = (
  hospitalBeds: number,
  hotelBeds: number,
  currentPatients: number
) => {
  return Math.floor((currentPatients / (hospitalBeds + hotelBeds)) * 100);
};
const upOrDown = (prefName: string, currentPatients: number) => {
  const res = comparisonWithPreviousDay.value.find(
    (data) => data.name === prefName
  );
  //   if (
  //   res?.todayCurrentPatients !== currentPatients ||
  //   res === undefined ||
  //   res.yesterdayCurrentPatients === 0
  // ) {
  //   return 0;
  // }
  if (res === undefined) {
    return 0;
  } else if (res.yesterdayCurrentPatients < 0) {
    return 1;
  } else if (res.yesterdayCurrentPatients > 0) {
    return 2;
  }
};
watchEffect(async () => {
  if (promptChecked.value === true) {
    const byPrefDataRes = await store.getters
      .getDataByPrefectureWithPromptReport;
    for (const data of byPrefDataRes) {
      allOverview.value.currentPatients -= data.currentPatients;
      allOverview.value.exits -= data.exits;
      allOverview.value.deaths -= data.deaths;
      allOverview.value.patients -= data.patients;
    }

    const promptRes = await store.getters.getPromptReport;
    for (const data of promptRes) {
      for (const [index, prefData] of overviewByPrefecture.value.entries()) {
        if (prefData.name === data.prefName) {
          prefData.currentpatients = data.currentPatients;
        }
      }
      allOverview.value.currentPatients += data.currentPatients;
      allOverview.value.exits += data.exits;
      allOverview.value.deaths += data.deaths;
      allOverview.value.patients += data.patients;
    }
    allOverview.value.bedRate = Math.floor(
      (allOverview.value.currentPatients / allOverview.value.beds) * 100
    );
  }
  if (promptChecked.value === false) {
    const promptRes = await store.getters.getPromptReport;
    for (const data of promptRes) {
      allOverview.value.currentPatients -= data.currentPatients;
      allOverview.value.exits -= data.exits;
      allOverview.value.deaths -= data.deaths;
      allOverview.value.patients -= data.patients;
    }
    const byPrefDataRes = await store.getters
      .getDataByPrefectureWithPromptReport;
    for (const data of byPrefDataRes) {
      for (const [index, prefData] of overviewByPrefecture.value.entries()) {
        if (prefData.name === data.prefName) {
          prefData.currentpatients = data.currentPatients;
        }
      }
      allOverview.value.currentPatients += data.currentPatients;
      allOverview.value.exits += data.exits;
      allOverview.value.deaths += data.deaths;
      allOverview.value.patients += data.patients;
    }
    allOverview.value.bedRate = Math.floor(
      (allOverview.value.currentPatients / allOverview.value.beds) * 100
    );
  }
});

const showModal = (
  code: string,
  name: string,
  bedsOfHospital: number,
  bedsOfHotel: number,
  currentPatients: number
) => {
  modalData.value.isVisible = true;
  modalData.value.prefCode = code;
  modalData.value.prefName = name;
  modalData.value.bedsOfHospital = bedsOfHospital;
  modalData.value.bedsOfHotel = bedsOfHotel;
  modalData.value.bedRate = bedRateByPrefecture(
    bedsOfHospital,
    bedsOfHotel,
    currentPatients
  );
  modalData.value.bedsUpdate = allOverview.value
    .bedsUPdate as unknown as string;

  setTimeout(childRef.value.clickButton, 500);
};
const closeModal = () => {
  modalData.value.isVisible = false;
};
</script>

<template>
  <div class="overview-wrapper flex">
    <!-- ????????????????????????????????? -->
    <div class="all-overview w-1/2">
      <div class="table">
        <table class="border-collapse border-2 border-red-800">
          <tr>
            <th class="border-2 border-red-800 px-1 text-sm font-normal">
              ???????????????/???????????????
            </th>
            <th class="border-2 border-red-800 px-1 text-sm font-normal">
              ???????????????
            </th>
          </tr>
          <tr>
            <td
              class="border-2 border-red-800 px-1 py-2 text-3xl text-white font-medium text-center bg-red-800"
            >
              {{ allOverview.bedRate.toLocaleString() }}%
            </td>
            <td
              class="border-2 border-red-800 px-1 py-2 text-3xl text-white font-medium text-center bg-red-800"
            >
              {{ allOverview.currentPatients.toLocaleString() }}???
            </td>
          </tr>
          <tr>
            <th class="border border-red-800 px-1 text-sm font-normal">
              ???????????????
            </th>
            <th class="border-2 border-red-800 px-1 text-sm font-normal">
              ?????????
            </th>
          </tr>
          <tr>
            <td
              class="border-2 border-red-800 px-1 py-2 text-3xl text-white font-medium text-center bg-red-800"
            >
              {{ allOverview.exits.toLocaleString() }}???
            </td>
            <td
              class="border-2 border-red-800 px-1 py-2 text-3xl text-white font-medium text-center bg-red-800"
            >
              {{ allOverview.deaths.toLocaleString() }}???
            </td>
          </tr>
          <tr>
            <th class="border-2 border-red-800 px-1 text-sm font-normal">
              ??????????????? {{ allOverview.beds.toLocaleString() }}???
            </th>
            <th class="border-2 border-red-800 px-1 text-sm font-normal">
              PCR?????????????????? {{ allOverview.patients.toLocaleString() }}???
            </th>
          </tr>
          <tr>
            <td colspan="2" class="border border-red-800 px-1 py-2 text-center">
              <p>
                ??????????????????
                {{ allOverview.clinicalEngineer.toLocaleString() }}??? /
                ??????????????? {{ allOverview.ventilator.toLocaleString() }}??? /
                ECMO
                {{ allOverview.ecmo.toLocaleString() }}???<br />2020???2?????????
                <a
                  href="https://www.ja-ces.or.jp/info-ce/%e4%ba%ba%e5%b7%a5%e5%91%bc%e5%90%b8%e5%99%a8%e3%81%8a%e3%82%88%e3%81%b3ecmo%e8%a3%85%e7%bd%ae%e3%81%ae%e5%8f%96%e6%89%b1%e5%8f%b0%e6%95%b0%e7%ad%89%e3%81%ab%e9%96%a2%e3%81%99%e3%82%8b%e7%b7%8a/"
                  class="underline"
                  >?????? ?????????????????? ??????????????????????????? ??????????????????
                  ???????????????????????????</a
                >
              </p>
            </td>
          </tr>
        </table>
        <div class="update-date py-1.5">
          <div class="text-xs text-center">
            <div class="flex-wrapper flex justify-center">
              <div>??????????????? ????????????{{ allOverview.patientsUpdate }}</div>
              <div v-if="promptChecked">
                ????????? {{ store.state.promptReport[0].lastUpdate }}???
              </div>
            </div>
            <div>??????????????? ????????????{{ allOverview.bedsUPdate }}</div>
          </div>
        </div>
        <div class="use-prompt-report">
          <BaseCheckbox v-model="promptChecked" id="prompt-report-check">
            ???<a
              href="https://docs.google.com/spreadsheets/d/1SPqnO0yLn8ubax96sDJZVDcjAH8QT1suLCIgroPGVHY/edit?usp=sharing"
              class="underline"
              >?????????????????????????????????????????????????????????</a
            >????????????(??????)
          </BaseCheckbox>
        </div>
      </div>
    </div>
    <div class="overview-by-prefecture ml-2">
      <div class="grid grid-cols-7 gap-1">
        <div
          class="grid place-items-center bg-black text-white text-center col-span-2"
        >
          <div>
            {{ allOverview.currentPatients.toLocaleString() }}/{{
              allOverview.beds.toLocaleString()
            }}
          </div>
          <div>(??????)???????????????/???????????????</div>
          <div></div>
        </div>
        <div
          v-for="overview of overviewByPrefecture"
          v-on:click="
            showModal(
              overview.code,
              overview.name,
              overview.bedsOfHospital,
              overview.bedsOfHotel,
              overview.currentpatients
            )
          "
          :key="overview.code"
          class="cursor-pointer grid place-items-center bg-black text-white text-center"
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
              ).toLocaleString()
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
  <div class="supplement text-center pt-4">
    ?????????????????????????????????????????????????????? ??????????????? / ???????????????
    ???????????????????????????????????????????????????????????????????????????????????????<a
      href="https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000164708_00001.html"
      class="underline"
      >??????</a
    >???
    <br />
    ?????????????????? ??????????????????<fa
      icon="fa-solid fa-arrow-up"
      class="text-red-500"
    />
    ??????????????????<fa icon="fa-solid fa-arrow-down" class="text-blue-700" />???
  </div>
  <!-- ???????????? -->
  <OverviewByPrefectureVue
    ref="childRef"
    :is-visible="modalData.isVisible"
    :prompt-checked="promptChecked"
    :pref-code="modalData.prefCode"
    :pref-name="modalData.prefName"
    :beds-of-hospital="modalData.bedsOfHospital"
    :beds-of-hotel="modalData.bedsOfHotel"
    :bed-rate="modalData.bedRate"
    :beds-update="modalData.bedsUpdate"
    @close="closeModal"
  ></OverviewByPrefectureVue>
</template>
