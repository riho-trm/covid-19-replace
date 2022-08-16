<script setup lang="ts">
import { useStore } from "vuex";

const store = useStore();

interface Props {
  promptChecked: boolean;
  prefCode: string;
  prefName: string;
  beds: number;
  bedRate: number;
  bedsUPdate: string;
}
defineProps<Props>();

const graphData = [
  {
    currentPatients: 0,
    deaths: 0,
  },
];
const displayData = {
  prefJp: "",
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
};
</script>

<template>
  <div></div>
</template>
