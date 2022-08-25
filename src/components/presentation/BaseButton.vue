<script setup lang="ts">
interface Props {
  displayName: string;
}
const props = defineProps<Props>();

interface Emits {
  (e: "click"): void;
}
const emit = defineEmits<Emits>();

const handleClick = () => {
  emit("click");
};
</script>

<template>
  <button
    type="button"
    class="border border-gray-700 bg-gray-700 text-white rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:bg-white hover:text-gray-700 focus:outline-none focus:shadow-outline"
    @click="handleClick"
  >
    {{ displayName }}
  </button>
</template>
