<template>
  <div>
    <WeatherWidget />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import WeatherWidget from "@/components/WeatherWidget.vue";

export default defineComponent({
  components: { WeatherWidget },
});
</script>

<style lang="scss">
@import './assets/styles.scss';
</style>