<script setup lang="ts">
    
</script>

<template>
<div class="overview-wrapper">
    <!-- 左側の全国概況テーブル -->
  <div class="all-overview">
    <div class="table">
    <table class="border-collapse border-2 border-gray-500">
        <tr>
            <th class="border border-gray-400 px-4 py-2 text-gray-800">現在患者数/対策病床数</th>
            <th class="border border-gray-400 px-4 py-2 text-gray-800">現在患者数</th>
        </tr>
        <tr>
            <td class="border border-gray-400 px-4 py-2">1,688%</td>
            <td class="border border-gray-400 px-4 py-2">1,925,104%</td>
        </tr>
        <tr>
            <th class="border border-gray-400 px-4 py-2 text-gray-800">累積退院者</th>
            <th class="border border-gray-400 px-4 py-2 text-gray-800">累積退院者</th>
        </tr>
        <tr>
            <td class="border border-gray-400 px-4 py-2">11,993,031人</td>
            <td class="border border-gray-400 px-4 py-2">33,513人</td>
        </tr>
        <tr>
            <th class="border border-gray-400 px-4 py-2 text-gray-800">対策病床数 </th>
            <th class="border border-gray-400 px-4 py-2 text-gray-800">PCR検査陽性者数</th>
        </tr>
        <th>
            <td class="border border-gray-400 px-4 py-2">臨床工学技士 14,378人 / 人工呼吸器 28,197台 / ECMO 1,412台 2020年2月回答 出典 一般社団法人 日本呼吸療法医学会 公益社団法人 日本臨床工学技士会</td>
        </th>
    </table>
    </div>
    <div class="update-date">
    </div>
  </div>
  <!-- 右側の県別概況の表、v-forで書く -->
  <div class="overview-by-prefecture"> 
  </div>
  </div>
  <div class="supplement">

  </div>
</template>
