<script setup lang="ts">
interface Props {
  id: string;
  checked?: boolean;
}
withDefaults(defineProps<Props>(), {
  checked: false,
});

interface Emits {
  (e: "update:modelValue", value: boolean): void;
}
defineEmits<Emits>();
</script>

<template>
  <div class="flex items-center mb-4 justify-center">
    <input
      :id="id"
      aria-describedby="checkbox-1"
      type="checkbox"
      class="bg-gray-50 border-gray-300 focus:ring-3 focus:ring-blue-300 h-4 w-4 rounded cursor-pointer"
      :checked="checked"
      @change="
        $emit('update:modelValue', ($event.target as HTMLInputElement).checked)
      "
    />
    <label :for="id" class="text-xs ml-3 font-medium text-gray-900">
      <slot></slot>
    </label>
  </div>
</template>
