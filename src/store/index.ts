import {
  Beds,
  PatientsNumberByPrefecture,
  PatientsNumberOfAll,
  PrefAppUrl,
  PromptReport,
  Ventilator,
} from "@/types/store";
import axios from "axios";
import { createStore } from "vuex";
import Papa from "papaparse";
import { OverviewByPrefecture } from "@/types/overview";

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
    // 人工呼吸器、ECMO数
    ventilator: [] as Array<Ventilator>,
  },
  getters: {
    getAllOverView(state, getters) {
      return {
        bedRate: Math.floor(
          (state.patientsNumberOfAll.currentPatients / getters.getAllBeds) * 100
        ),
        currentPatients: state.patientsNumberOfAll.currentPatients,
        exits: state.patientsNumberOfAll.exits,
        deaths: state.patientsNumberOfAll.deaths,
        beds: getters.getAllBeds,
        patients: state.patientsNumberOfAll.patients,
        clinicalEngineer: state.ventilator.find(
          (pref) => pref.prefName === "全国"
        )?.clinicalEngineer,
        ventilator: state.ventilator.find((pref) => pref.prefName === "全国")
          ?.ventilator,
        ecmo: state.ventilator.find((pref) => pref.prefName === "全国")?.ecmo,
        patientsUpdate: state.patientsNumberOfAll.lastUpdate,
        bedsUPdate: state.beds[0].lastUpdate,
      };
    },
    getAllBeds(state) {
      let allBeds = 0;
      for (const beds of state.beds) {
        allBeds += beds.bedsOfHospital + beds.bedsOfHotel;
      }
      return allBeds;
    },
    getOverviewByPrefecture(state) {
      const overviewByPrefecture = [] as OverviewByPrefecture[];
      for (const data of state.patientsNumberByPrefecture) {
        overviewByPrefecture.push({
          name: data.prefName,
          nameJp: data.nameJp,
          currentpatients: data.currentPatients,
          bedsOfHospital: state.beds.find((bed) => bed.prefName === data.nameJp)
            ?.bedsOfHospital as number,
          bedsOfHotel: state.beds.find((bed) => bed.prefName === data.nameJp)
            ?.bedsOfHotel as number,
          code: data.code,
        });
      }
      return overviewByPrefecture;
    },
    getPromptReport(state) {
      return state.promptReport;
    },
    getDataByPrefectureWithPromptReport(state) {
      const promptPref: string[] = [];
      state.promptReport.forEach((promptData) =>
        promptPref.push(promptData.prefName)
      );
      const dataByPromptPref = [];
      for (const pref of promptPref) {
        dataByPromptPref.push(
          state.patientsNumberByPrefecture.find(
            (data) => data.prefName === pref
          )
        );
      }
    },
    getAppUrl(state, prefUrl: string) {
      for (const data of state.prefAppUrl) {
        if (data.code === prefUrl) {
          return data.url;
        }
      }
    },
  },
  mutations: {
    resetState(state) {
      state.patientsNumberOfAll = {} as PatientsNumberOfAll;
      state.patientsNumberByPrefecture =
        [] as Array<PatientsNumberByPrefecture>;
      state.promptReport = [] as Array<PromptReport>;
      state.beds = [] as Array<Beds>;
      state.prefAppUrl = [] as Array<PrefAppUrl>;
      state.ventilator = [] as Array<Ventilator>;
    },
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
          source:
            "厚生労働省 新型コロナウイルス感染症 各都道府県の検査陽性者の状況",
          sourceUrl: "https://www.mhlw.go.jp/content/10906000/000974744.pdf",
        });
      }
      console.dir(JSON.stringify(state.patientsNumberOfAll));
      console.dir(JSON.stringify(state.patientsNumberByPrefecture));
    },
    setPromptReport(state, data) {
      for (const promptData of data) {
        state.promptReport.push({
          prefName: promptData.name,
          patients: promptData.npatients,
          currentpatients: promptData.ncurrentpatients,
          exits: promptData.nexits,
          deaths: promptData.ndeaths,
          source: "東京都 新型コロナウイルス患者数オープンデータ",
          sourceUrl:
            "https://catalog.data.metro.tokyo.lg.jp/organization/t000010?q=%E6%96%B0%E5%9E%8B%E3%82%B3%E3%83%AD%E3%83%8A&sort=score+desc%2C+metadata_modified+desc",
          lastUpdate: promptData.lastUpdate,
        });
      }
      console.dir(JSON.stringify(state.promptReport));
    },
    setBeds(state, data) {
      for (const bedData of data) {
        state.beds.push({
          prefName: bedData.都道府県名,
          bedsOfHospital: Number(bedData.入院患者受入確保病床),
          bedsOfHotel: Number(bedData.宿泊施設受入可能室数),
          lastUpdate: bedData.更新日,
        });
      }
      console.dir(JSON.stringify(state.beds));
    },
    setAppUrl(state, data) {
      for (const urlData of data) {
        if (urlData.url_app === "") {
          continue;
        }
        state.prefAppUrl.push({
          code: urlData["ISO3166-2"],
          url: urlData.url_app,
        });
      }
      console.dir(JSON.stringify(state.prefAppUrl));
    },
    setVentilator(state, data) {
      for (const ventilatorData of data) {
        state.ventilator.push({
          prefName: ventilatorData.都道府県,
          clinicalEngineer: Number(ventilatorData["総CE（名）"]),
          ventilator:
            Number(ventilatorData["マスク専用人工呼吸器取扱（台）"]) +
            Number(ventilatorData["人工呼吸器取扱（台）"]),
          ecmo: Number(ventilatorData["ECMO装置取扱（台）"]),
        });
      }
      console.dir(JSON.stringify(state.ventilator));
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
    async getAppUrl(context) {
      const res = await axios.get(
        "https://www.stopcovid19.jp/data/covid19pref.json"
      );
      context.commit("setAppUrl", res.data);
    },
    async getVentilator(context) {
      try {
        const res = await axios.get(
          "https://www.stopcovid19.jp/data/ventilator-20200306.csv"
        );
        const parsed = Papa.parse(res.data, {
          header: true,
        });
        context.commit("setVentilator", parsed.data);
      } catch (e) {
        console.log(e);
      }
    },
  },
  modules: {},
});
