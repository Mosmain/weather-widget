<template>
  <div class="weather-widget">
    <div class="cards-container">
      <SettingsMenu
        v-if="showSettings"
        :cities="cities"
        @add-city="addCity"
        @update-cities="updateCities"
        @close-settings="toggleSettings"
      />
      <WeatherCard
        v-for="city in cities"
        :key="city.id"
        :city="city"
        @open-settings="toggleSettings"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'
  import { useWeatherWidget } from '@/composables/useWeatherWidget'
  import SettingsMenu from '@/components/SettingsMenu.vue'
  import WeatherCard from '@/components/WeatherCard.vue'

  const {
    cities,
    showSettings,
    initializeCities,
    addCity,
    updateCities,
    toggleSettings,
  } = useWeatherWidget()

  onMounted(() => {
    initializeCities()
  })
</script>
