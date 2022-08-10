<script setup lang="ts">
import { useStore } from "vuex";

const store = useStore();
const created = async () => {
  try {
    await store.dispatch("getPatientsNumber");
    await store.dispatch("getPromptReport");
    await store.dispatch("getBedsData");
    await store.dispatch("getAppUrl");
    await store.dispatch("getVentilator");
  } catch (e) {
    console.log(e);
  }
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
              1,688%
            </td>
            <td
              class="border-2 border-red-800 px-4 py-2 text-3xl text-white font-medium text-center bg-red-800"
            >
              1,925,104%
            </td>
          </tr>
          <tr>
            <th class="border border-red-800 px-4 text-sm font-normal">
              累積退院者
            </th>
            <th class="border-2 border-red-800 px-4 text-sm font-normal">
              累積退院者
            </th>
          </tr>
          <tr>
            <td
              class="border-2 border-red-800 px-4 py-2 text-3xl text-white font-medium text-center bg-red-800"
            >
              11,993,031人
            </td>
            <td
              class="border-2 border-red-800 px-4 py-2 text-3xl text-white font-medium text-center bg-red-800"
            >
              33,513人
            </td>
          </tr>
          <tr>
            <th class="border-2 border-red-800 px-4 text-sm font-normal">
              対策病床数 115,400床
            </th>
            <th class="border-2 border-red-800 px-4 text-sm font-normal">
              PCR検査陽性者数 14,429,600人
            </th>
          </tr>
          <tr>
            <td colspan="2" class="border border-red-800 px-4 py-2 text-center">
              <p>
                臨床工学技士 14,378人 / 人工呼吸器 28,197台 / ECMO 1,412台<br />2020年2月回答
                出典 一般社団法人 日本呼吸療法医学会 公益社団法人
                日本臨床工学技士会
              </p>
            </td>
          </tr>
        </table>
      </div>
      <div class="update-date"></div>
    </div>
    <!-- 右側の県別概況の表、v-forで書く -->
    <div class="overview-by-prefecture"></div>
  </div>
  <div class="supplement"></div>
</template>
