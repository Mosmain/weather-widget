<template>
  <div class="weather-card">
    <CardHeader @settings-switcher="$emit('open-settings')">
      {{ city.name }}
    </CardHeader>
    <img :src="getWeatherIconUrl" alt="Weather Icon" class="weather-icon" />
    <p>{{ city.temperature }}°C</p>
    <p>feels_like {{ city.feels_like }}°C</p>
    <p>temp_min {{ city.temp_min }}°C</p>
    <p>temp_max {{ city.temp_max }}°C</p>
    <p>описание {{ city.description }}</p>
    <p>давление {{ city.pressure }}</p>
    <p>влажность {{ city.humidity }}</p>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { WeatherCardModel } from '@/types/OpenWeather'
  import CardHeader from '@/components/CardHeader.vue'

  const props = defineProps<{
    city: WeatherCardModel
  }>()

  const getWeatherIconUrl = computed(() => {
    return `http://openweathermap.org/img/wn/${props.city.icon}@2x.png`
  })
</script>
