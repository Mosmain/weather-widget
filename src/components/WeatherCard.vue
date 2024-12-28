<template>
  <div class="weather-card">
    <CardHeader
      :is-open="props.showSettings"
      @settings-switcher="$emit('open-settings')"
    >
      {{ city.name }}, {{ city.country }}
    </CardHeader>
    <div class="weather-card__body">
      <div class="country-info">
        <span>Сейчас: {{ getTimeWithTimezone(city.timezone) }}</span>
        <img
          :src="getCountryFlag"
          :alt="city.country + '_flag'"
          :title="city.country"
        />
      </div>
      <div class="weather-info">
        <div class="weather-info__header">
          <div class="weather-info__header__temp">
            <div>
              <p>
                <b>{{ city.temperature }}°</b>
              </p>
              <div class="weather-info__header__temp__min-max">
                <svg
                  class="min"
                  xmlns="http://www.w3.org/2000/svg"
                  xml:space="preserve"
                  viewBox="0 0 492 492"
                >
                  <path
                    d="M443 185 265 8a27 27 0 0 0-38 0L49 185a27 27 0 0 0 0 38l16 17c6 5 12 7 19 7 8 0 15-2 20-7l104-104v329c0 15 11 27 26 27h23c15 0 27-12 27-27V135l105 105c5 5 11 7 19 7s14-2 19-7l16-17c10-10 10-27 0-38z"
                  />
                </svg>
                {{ city.temp_min }}/
                <svg
                  class="max"
                  xmlns="http://www.w3.org/2000/svg"
                  xml:space="preserve"
                  viewBox="0 0 492 492"
                >
                  <path
                    d="M443 185 265 8a27 27 0 0 0-38 0L49 185a27 27 0 0 0 0 38l16 17c6 5 12 7 19 7 8 0 15-2 20-7l104-104v329c0 15 11 27 26 27h23c15 0 27-12 27-27V135l105 105c5 5 11 7 19 7s14-2 19-7l16-17c10-10 10-27 0-38z"
                  />
                </svg>
                {{ city.temp_max }}°
              </div>
            </div>
            <img
              :src="getWeatherIconUrl"
              :alt="city.main"
              class="weather-icon"
            />
          </div>
          <div class="weather-info__header__extended-temp">
            <p>{{ city.description }}</p>
            <p>
              Ощущается как
              <b>{{ city.feels_like }}°</b>
            </p>
          </div>
        </div>
        <div class="weather-info__body">
          <div class="weather-info__body__pressure-wind">
            <div class="current-pressure">
              <i>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <g>
                    <path
                      d="M14.13 2.23a.75.75 0 0 1-.32 1.46 8.5 8.5 0 1 0 6.5 6.57.75.75 0 0 1 1.48-.3 10 10 0 1 1-7.66-7.73Z"
                    />
                    <path
                      d="M13.35 10.65c.3.3.77.3 1.06 0l3.62-3.62a.75.75 0 1 0-1.06-1.06l-3.62 3.62c-.3.3-.3.77 0 1.06Zm-5.13 5.13c.3.3.77.3 1.06 0l1.25-1.25a.75.75 0 1 0-1.06-1.06l-1.25 1.25c-.3.3-.3.77 0 1.06Z"
                    />
                    <path
                      d="M14.75 5.75c0-.41.34-.75.75-.75h2.75a.75.75 0 0 1 0 1.5H15.5a.75.75 0 0 1-.75-.75Z"
                    />
                    <path
                      d="M17.5 5.75a.75.75 0 0 1 1.5 0V8.5a.75.75 0 0 1-1.5 0V5.75ZM9 12a3 3 0 1 0 6 0 3 3 0 0 0-6 0Zm4.5 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
                    />
                  </g>
                </svg>
              </i>
              {{ city.pressure }} мм рт. ст
            </div>
            <div class="current-wind">
              <i>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M6 11.5h5.69a3.75 3.75 0 1 0-1.95-6.95.75.75 0 0 0 .78 1.28A2.25 2.25 0 1 1 11.69 10H6a.75.75 0 1 0 0 1.5zM2 15h9.97a1.5 1.5 0 1 1-.78 2.78.75.75 0 0 0-.78 1.28 3 3 0 1 0 1.56-5.56H2A.75.75 0 1 0 2 15zm14.67-2h2.25a3 3 0 1 0-1.56-5.56.75.75 0 0 0 .78 1.28 1.5 1.5 0 1 1 .78 2.78h-2.25a.75.75 0 1 0 0 1.5z"
                  />
                </svg>
              </i>
              {{ city.wind_speed }} м/с,
              {{ city.wind_direction }}
              <i>
                <svg
                  :style="{ rotate: city.wind_deg + 'deg' }"
                  class="wind-direction"
                  xmlns="http://www.w3.org/2000/svg"
                  xml:space="preserve"
                  viewBox="0 0 490 490"
                >
                  <path d="M480 490 245 339 10 490 245 0l235 490z" />
                </svg>
              </i>
            </div>
          </div>
          <div class="weather-info__body__humidity-visibility">
            <div class="current-humidity">
              {{ city.humidity }}%
              <i>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M9 14a1 1 0 1 0-2 0c0 1.36.27 2.74 1.08 3.8.85 1.1 2.18 1.7 3.92 1.7a1 1 0 1 0 0-2c-1.26 0-1.93-.4-2.33-.92A4.22 4.22 0 0 1 9 14Z"
                  />
                  <path
                    d="M13.42 1.54a1.94 1.94 0 0 0-2.84 0 44.94 44.94 0 0 0-4.2 5.24c-1.51 2.24-2.91 4.8-2.89 7.57a10.66 10.66 0 0 0 .84 4.05 7.42 7.42 0 0 0 2.55 3.17A8.75 8.75 0 0 0 12 23c2.17 0 3.85-.55 5.12-1.43a7.42 7.42 0 0 0 2.55-3.17 10.36 10.36 0 0 0 .84-4.05c.02-2.77-1.38-5.33-2.89-7.57a44.95 44.95 0 0 0-4.2-5.24ZM8.04 7.9C9.44 5.8 11.08 3.94 12 2.95c.92 1 2.55 2.85 3.96 4.94 1.28 1.9 2.57 4.09 2.55 6.44a8.66 8.66 0 0 1-.68 3.27c-.38.87-.96 1.7-1.85 2.33A6.77 6.77 0 0 1 12 21a6.77 6.77 0 0 1-3.98-1.07 5.42 5.42 0 0 1-1.85-2.33 8.37 8.37 0 0 1-.68-3.27C5.47 11.98 6.76 9.8 8.04 7.9Z"
                  />
                </svg>
              </i>
              {{ city.humidity_description }}
            </div>
            <div class="current-visibility">
              {{ city.visibility }}м
              <i>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xml:space="preserve"
                  viewBox="0 0 488.9 488.9"
                >
                  <path
                    d="M244.4 98.7c-93.4 0-178 51.1-240.6 134.1a19.4 19.4 0 0 0 0 23.1C66.3 339 151 390.1 244.4 390.1s178.1-51 240.6-134a19.4 19.4 0 0 0 0-23.2C422.5 150 337.8 98.7 244.4 98.7zm6.7 248.3A102.9 102.9 0 1 1 238 141.7 102.9 102.9 0 0 1 251 347zm-3-47.4a55.3 55.3 0 1 1-7.2-110.5 55.3 55.3 0 1 1 7.1 110.5z"
                  />
                </svg>
                <!-- <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xml:space="preserve"
                  viewBox="0 0 442 442"
                >
                  <path
                    d="M221 341.3c-49.7 0-103.2-19.4-154.7-56.2a391.6 391.6 0 0 1-63.2-55.9c-4.1-4.7-4.1-11.7 0-16.4 1-1.1 24.7-28.4 63.2-55.8 51.5-36.8 105-56.3 154.7-56.3 49.7 0 103.2 19.5 154.7 56.3a391.7 391.7 0 0 1 63.3 55.8c4 4.7 4 11.7 0 16.4-1 1.1-24.8 28.4-63.3 55.9-51.5 36.8-105 56.2-154.7 56.2zM29.6 221c9.6 9.8 27.8 27 51.7 44 32.9 23.5 83.7 51.3 139.7 51.3s106.9-27.8 139.7-51.2c24-17 42-34.3 51.7-44-9.6-9.9-27.7-27.1-51.7-44.2C328 153.6 277 125.7 221 125.7S114.2 153.6 81.3 177c-24 17-42 34.3-51.7 44.1z"
                  />
                  <path
                    d="M221 298.5a77.6 77.6 0 1 1 51-135.8 12.5 12.5 0 1 1-16.4 18.8 52.4 52.4 0 1 0 18 39.5 12.5 12.5 0 0 1 25 0 77.6 77.6 0 0 1-77.6 77.5z"
                  />
                  <path d="M221 246a25 25 0 1 1 0-50 25 25 0 0 1 0 50z" />
                </svg> -->
              </i>
              {{ city.visibility_description }}
            </div>
          </div>
          <div class="weather-info__body__sunrise-sunset">
            <div class="current-sunrise">
              {{ timestampToUTCDate(city.sunrise, city.timezone) }}
              <i>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M7 15a5 5 0 0 1 10 0 1 1 0 0 1-2 0 3 3 0 0 0-6 0 1 1 0 0 1-2 0Zm11-4.6.7-.7a1 1 0 0 0-1.4-1.4l-.7.7a1 1 0 1 0 1.4 1.4Zm2 5.6h1a1 1 0 0 0 0-2h-1a1 1 0 0 0 0 2ZM4 14H3a1 1 0 0 0 0 2h1a1 1 0 0 0 0-2Zm1.3-4.3.7.7A1 1 0 1 0 7.4 9l-.7-.7a1 1 0 0 0-1.4 1.4ZM4 18a1 1 0 0 0 1 1h14a1 1 0 0 0 0-2H5a1 1 0 0 0-1 1Zm4 3a1 1 0 0 0 0 2h8a1 1 0 0 0 0-2Zm4-12a1 1 0 0 0 1-1V4.4l1.3 1.3a1 1 0 0 0 1.4-1.4l-3-3a1 1 0 0 0-1.4 0l-3 3a1 1 0 0 0 1.4 1.4L11 4.4V8a1 1 0 0 0 1 1Z"
                  />
                </svg>
              </i>
              Восход
            </div>
            <div class="current-sunset">
              {{ timestampToUTCDate(city.sunset, city.timezone) }}
              <i>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M7 15a5 5 0 0 1 10 0 1 1 0 0 1-2 0 3 3 0 0 0-6 0 1 1 0 0 1-2 0Zm10.3-6.7-.7.7a1 1 0 1 0 1.4 1.4l.7-.7a1 1 0 0 0-1.4-1.4ZM22 15a1 1 0 0 0-1-1h-1a1 1 0 0 0 0 2h1a1 1 0 0 0 1-1ZM4 14H3a1 1 0 0 0 0 2h1a1 1 0 0 0 0-2Zm2.7-5.7a1 1 0 0 0-1.4 1.4l.7.7A1 1 0 1 0 7.4 9ZM4 18a1 1 0 0 0 1 1h14a1 1 0 0 0 0-2H5a1 1 0 0 0-1 1Zm13 4a1 1 0 0 0-1-1H8a1 1 0 0 0 0 2h8a1 1 0 0 0 1-1ZM12 1a1 1 0 0 0-1 1v3.6L9.7 4.3a1 1 0 0 0-1.4 1.4l3 3a1 1 0 0 0 1.4 0l3-3a1 1 0 1 0-1.4-1.4L13 5.6V2a1 1 0 0 0-1-1Z"
                  />
                </svg>
              </i>
              Закат
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { WeatherCardModel } from '@/types/OpenWeather'
  import CardHeader from '@/components/CardHeader.vue'

  const props = defineProps<{
    city: WeatherCardModel
    showSettings: boolean
  }>()

  const getWeatherIconUrl = computed(() => {
    return `http://openweathermap.org/img/wn/${props.city.icon}@2x.png`
  })

  const getCountryFlag = computed(() => {
    return `https://flagsapi.com/${props.city.country}/flat/16.png`
  })

  const timestampToUTCDate = (time: number, timezone: number) => {
    const date = new Date((time + timezone) * 1000)

    const hours = date.getUTCHours().toString().padStart(2, '0')
    const minutes = date.getUTCMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
  }

  const getTimeWithTimezone = (timezoneOffsetInSeconds: number) => {
    const now = new Date().getTime()

    const nowUTC = now - new Date().getTimezoneOffset() * 60

    const adjustedTime = new Date(nowUTC + timezoneOffsetInSeconds * 1000)

    const hours = adjustedTime.getUTCHours().toString().padStart(2, '0')
    const minutes = adjustedTime.getUTCMinutes().toString().padStart(2, '0')

    return `${hours}:${minutes}`
  }
</script>
