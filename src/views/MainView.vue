<script setup lang="ts">
import { ref } from "vue";
import AllOverview from "../components/AllOverview.vue";
import Footer from "../components/Footer.vue";

let openTab = ref(1);

const toggleTabs = (tabNumber: number) => {
  openTab.value = tabNumber;
};
</script>

<template>
  <div class="flex flex-wrap justify-center">
    <div class="w-11/12">
      <ul class="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row">
        <li class="-mb-px mr-2 last:mr-0 flex-auto text-center">
          <a
            class="text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal"
            v-on:click="toggleTabs(1)"
            v-bind:class="{
              'text-red-800 bg-white': openTab !== 1,
              'text-white bg-red-800': openTab === 1,
            }"
          >
            コロナ概況データ
          </a>
        </li>
        <li class="-mb-px mr-2 last:mr-0 flex-auto text-center">
          <a
            class="text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal"
            v-on:click="toggleTabs(2)"
            v-bind:class="{
              'text-red-800 bg-white': openTab !== 2,
              'text-white bg-red-800': openTab === 2,
            }"
          >
            概況グラフデータ
          </a>
        </li>
      </ul>
      <div
        class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded"
      >
        <div class="px-4 py-5 flex-auto">
          <div class="tab-content tab-space">
            <div v-bind:class="{ hidden: openTab !== 1, block: openTab === 1 }">
              <AllOverview></AllOverview>
            </div>
            <div v-bind:class="{ hidden: openTab !== 2, block: openTab === 2 }">
              <Footer></Footer>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
