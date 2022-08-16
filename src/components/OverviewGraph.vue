<script setup lang="ts">
import axios from "axios";
import Chart, { ChartItem } from "chart.js/auto";
import { onMounted } from "vue";
import {
  RequiringInpatientCare,
  EmargencyTransportDifficult,
} from "../types/graph";
import Papa from "papaparse";
import { format, parse } from "date-fns";

let date: never[] = [];
let requiringInpatientCare: never[] = [];
let emargencyTransportDifficult: { x: string; y: number }[] = [];

const renderChart = () => {
  let ctx = document.getElementById("myChart") as ChartItem;

  new Chart(ctx, {
    type: "line",
    data: {
      labels: date,
      datasets: [
        {
          label: "入院治療を要する者",
          data: requiringInpatientCare,
          backgroundColor: ["rgba(255, 99, 132, 0.2)"],
          borderColor: ["rgba(255,99,132,1)"],
          borderWidth: 1,
          yAxisID: "y",
        },
        {
          label: "救急搬送困難事案",
          data: emargencyTransportDifficult,
          backgroundColor: ["rgba(54, 162, 235, 0.2)"],
          borderColor: ["rgba(54, 162, 235, 1)"],
          borderWidth: 1,
          yAxisID: "y2",
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "COVID-19 日本の新型コロナウイルス概況",
          font: { size: 12 },
        },
      },
      scales: {
        y: {
          type: "linear",
          position: "right",
          title: {
            display: true,
            text: "現在入院を要する者",
            font: { size: 10 },
          },
        },
        y2: {
          type: "linear",
          position: "left",
          title: {
            display: true,
            text: "救急搬送困難事案数",
            font: { size: 10 },
          },
        },
      },
    },
  });
};

onMounted(async () => {
  await getDate();
  await getRequiringInpatientCare();
  await getEmargencyTransportDifficult();
  renderChart();
});

const getDate = async () => {
  try {
    const res = await axios.get(
      "https://www.stopcovid19.jp/data/mhlw_go_jp/opendata/requiring_inpatient_care_etc_daily.csv"
    );
    const parsed: RequiringInpatientCare[] = Papa.parse(res.data, {
      header: true,
    }).data as unknown as RequiringInpatientCare[];
    for (const data of parsed) {
      date.push(data.Date as never);
    }
  } catch (e) {
    console.log(e);
  }
};
const getRequiringInpatientCare = async () => {
  try {
    const res = await axios.get(
      "https://www.stopcovid19.jp/data/mhlw_go_jp/opendata/requiring_inpatient_care_etc_daily.csv"
    );
    const parsed: RequiringInpatientCare[] = Papa.parse(res.data, {
      header: true,
    }).data as unknown as RequiringInpatientCare[];
    for (const data of parsed) {
      requiringInpatientCare.push(
        data["(ALL) Requiring inpatient care"] as never
      );
    }
  } catch (e) {
    console.log(e);
  }
};
const getEmargencyTransportDifficult = async () => {
  try {
    const res = await axios.get(
      "https://code4fukui.github.io/fdma_go_jp/emergencytransport_difficult_all.csv"
    );
    const parsed: EmargencyTransportDifficult[] = Papa.parse(res.data, {
      header: true,
    }).data as unknown as EmargencyTransportDifficult[];
    console.log(parsed);
    console.log(new Date(parsed[0].終了日));
    for (const data of parsed) {
      const date = parse(data.終了日, "yyyy-MM-dd", new Date());
      if (
        date < parse("2020-05-09", "yyyy-MM-dd", new Date()) ||
        data.開始日 === ""
      ) {
        continue;
      }
      const formatDate = format(date, "yyyy/M/d");
      emargencyTransportDifficult.push({
        x: formatDate,
        y: data.救急搬送困難事案数,
      });
    }
  } catch (e) {
    console.log(e);
  }
  console.log(emargencyTransportDifficult);
};
</script>

<template>
  <div style="width: 100%">
    <canvas id="myChart"></canvas>
  </div>
</template>
