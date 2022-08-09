import { createStore } from "vuex";

export default createStore({
  state: {
    // 県別アプリ一覧
    prefAppUrl: [
      {
        code: "JP-01",
        url: "https://stopcovid19.hokkaido.dev/",
      },
      {
        code: "JP-02",
        url: "https://covid19.codeforaomori.org/",
      },
      {
        code: "JP-04",
        url: "https://covid19.pref.miyagi.jp/",
      },
      {
        code: "JP-07",
        url: "https://fukushima-covid19.firebaseapp.com/",
      },
      {
        code: "JP-08",
        url: "https://ibaraki.stopcovid19.jp/",
      },
      {
        code: "JP-10",
        url: "https://stopcovid19.pref.gunma.jp/",
      },
      {
        code: "JP-11",
        url: "https://saitama.stopcovid19.jp/",
      },
      {
        code: "JP-12",
        url: "https://covid19.civictech.chiba.jp/",
      },
      {
        code: "JP-13",
        url: "https://stopcovid19.metro.tokyo.lg.jp/",
      },
      {
        code: "JP-14",
        url: "https://www.pref.kanagawa.jp/osirase/1369/",
      },
      {
        code: "JP-15",
        url: "https://niigata.stopcovid19.jp/",
      },
      {
        code: "JP-18",
        url: "https://covid19-fukui.com/",
      },
      {
        code: "JP-19",
        url: "https://stopcovid19.yamanashi.dev/",
      },
      {
        code: "JP-20",
        url: "https://nagano.stopcovid19.jp/",
      },
      {
        code: "JP-21",
        url: "https://covid19-gifu.netlify.app/",
      },
      {
        code: "JP-23",
        url: "https://stopcovid19.code4.nagoya/",
      },
      {
        code: "JP-24",
        url: "https://covid19-mie.netlify.app/",
      },
      {
        code: "JP-26",
        url: "https://kyoto.stopcovid19.jp/",
      },
      {
        code: "JP-27",
        url: "https://covid19-osaka.info/",
      },
      {
        code: "JP-28",
        url: "https://stop-covid19-hyogo.org/",
      },
      {
        code: "JP-29",
        url: "https://stopcovid19.code4nara.org/",
      },
      {
        code: "JP-34",
        url: "https://hiroshima.stopcovid19.jp/",
      },
      {
        code: "JP-35",
        url: "https://yamaguchi.stopcovid19.jp/",
      },
      {
        code: "JP-37",
        url: "https://kagawa.stopcovid19.jp/",
      },
      {
        code: "JP-38",
        url: "https://ehime-covid19.com/",
      },
      {
        code: "JP-42",
        url: "https://nagasaki.stopcovid19.jp/",
      },
      {
        code: "JP-43",
        url: "https://stop-covid19-kumamoto.netlify.app/",
      },
      {
        code: "JP-44",
        url: "https://oita.stopcovid19.jp/",
      },
      {
        code: "JP-46",
        url: "https://covid19.code4kagoshima.org/",
      },
      {
        code: "JP-47",
        url: "https://okinawa.stopcovid19.jp/",
      },
    ],
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
  mutations: {},
  actions: {},
  modules: {},
});
