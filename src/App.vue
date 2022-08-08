<script setup lang="ts">
import "sanitize.css";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import BaseCheckbox from "./components/presentation/BaseCheckbox.vue";
import { ref, watchEffect } from "vue";
import { computed } from "@vue/reactivity";

let checkbox = ref(false);
watchEffect(() => console.log(checkbox.value));
</script>

<template>
  <Header></Header>
  <router-view />
  <BaseCheckbox
    id="checkbox1"
    label="チェックしてね"
    v-model="checkbox"
  ></BaseCheckbox>
  <Footer></Footer>
</template>

<style lang="scss">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  color: black;
  font-family: "Helvetica Neue", Arial, "Hiragino Kaku Gothic ProN",
    "Hiragino Sans", Meiryo, sans-serif;
  word-wrap: break-word;
  margin: 0;
  font-size: 1vmax;
}
</style>
