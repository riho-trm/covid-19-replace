<script setup lang="ts">
import BaseButton from "./presentation/BaseButton.vue";
</script>

<template>
  <footer class="flex justify-around">
    <div class="w-1/3 object-cover p-4">
      <a class="" href="https://note.stopcovid19.jp/n/n0b078f2b3dce"
        ><img
          class=""
          alt="コロナの専門家"
          src="../assets/notestopcovid19-banner.png"
      /></a>
    </div>
    <div class="w-1/3 object-cover p-4">
      <a class="">
        <img class="" alt="元気ですか？" src="../assets/howareyou.png" />
      </a>
    </div>
    <div class="w-1/3 object-cover p-4">
      <a
        class=""
        href="https://whowatch.tv/"
        xhref="https://fukuno.jig.jp/?q=%E3%81%B5%E3%82%8F%E3%81%A3%E3%81%A1"
        ><img
          class=""
          alt="#STAYHOME x ふわっち"
          src="../assets/whowatch-banner.png"
      /></a>
    </div>
  </footer>
  <BaseButton display-name="テスト"> </BaseButton>
</template>

<style scoped lang="scss"></style>
