import {
  Beds,
  PatientsNumberByPrefecture,
  PatientsNumberOfAll,
  PrefAppUrl,
  PromptReport,
} from "@/types/store";
import axios from "axios";
import { createStore } from "vuex";

export default createStore({
  state: {
    // 全国患者数
    patientsNumberOfAll: {} as PatientsNumberOfAll,
    // 県別患者数
    patientsNumberByPrefecture: [] as Array<PatientsNumberByPrefecture>,
    // 速報患者数（東京都
    promptReport: [] as Array<PromptReport>,
    // 県別対策病床数
    beds: [] as Array<Beds>,
    // 県別アプリURL
    prefAppUrl: [] as Array<PrefAppUrl>,
  },
  getters: {
    getAppUrl(state, prefUrl: string) {
      for (const data of state.prefAppUrl) {
        if (data.code === prefUrl) {
          return data.url;
        }
      }
    },
  },
  mutations: {
    setPatientsNumber(state, data) {
      // ステートのpatientsNumberOfAllにデータ格納
      const patientsNumberOfAll = state.patientsNumberOfAll;
      patientsNumberOfAll.patients = data.npatients;
      patientsNumberOfAll.currentPatients = data.ncurrentpatients;
      patientsNumberOfAll.exits = data.nexits;
      patientsNumberOfAll.deaths = data.ndeaths;
      patientsNumberOfAll.lastUpdate = data.lastUpdate;

      // ステートのpatientsNumberByPrefectureにデータ格納
      const patientsNumberByPrefecture = state.patientsNumberByPrefecture;
      for (const areaData of data.area) {
        patientsNumberByPrefecture.push({
          prefName: areaData.name,
          nameJp: areaData.name_jp,
          patients: areaData.npatients,
          currentPatients: areaData.ncurrentpatients,
          exits: areaData.nexits,
          deaths: areaData.nexits,
          code: areaData["ISO3155-2"],
        });
      }
    },
    setPromptReport(state, data) {
      for (const promptData of data) {
        state.promptReport.push({
          prefName: promptData.name,
          patients: promptData.npatients,
          currentpatients: promptData.ncurrentpatients,
          exits: promptData.nexits,
          deaths: promptData.ndeaths,
          lastUpdate: promptData.astUpdate,
        });
      }
    },
    setBeds(state, data) {
      for (const bedData of data) {
        state.beds.push({
          prefName: bedData.都道府県名,
          bedsOfHospital: bedData.入院患者受入確保病床,
          bedsOfHotel: bedData.宿泊施設受入可能室数,
          lastUpdate: bedData.更新日,
        });
      }
    },
  },
  actions: {
    async getPatientsNumber(context) {
      try {
        const res = await axios.get(
          "https://www.stopcovid19.jp/data/covid19japan.json"
        );
        context.commit("setPatientsNumber", res.data);
      } catch (e) {
        console.log(e);
      }
    },
    async getPromptReport(context) {
      try {
        const res = await axios.get(
          "https://www.stopcovid19.jp/data/covid19japan-fast.json"
        );
        context.commit("setPromptReport", res.data);
      } catch (e) {
        console.log(e);
      }
    },
    async getBedsData(context) {
      try {
        const res = await axios.get(
          "https://www.stopcovid19.jp/data/covid19japan_beds/latest.json"
        );
        context.commit("setBeds", res.data);
      } catch (e) {
        console.log(e);
      }
    },
  },
  modules: {},
});
