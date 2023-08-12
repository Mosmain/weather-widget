<template>
  <div class="weather-card">
    <div v-if="!weatherData">
      <div class="weather-header">
        <p class="city-info"></p>
        <font-awesome-icon
          class="close-btn"
          icon="fa-solid fa-gear"
          @click="settingsClick"
        />
      </div>
      <div>
        <p>Oops.. Locations list is empty!</p>
      </div>
    </div>
    <div v-else>
      <div class="weather-header">
        <p class="city-info">
          {{ weatherData.name }}, {{ weatherData.sys.country }}
        </p>
        <font-awesome-icon
          class="close-btn"
          icon="fa-solid fa-gear"
          @click="settingsClick"
        />
      </div>
      <div class="weather-image">
        <img
          :src="getWeatherIconUrl(weatherData.weather[0].icon)"
          alt="Weather Icon"
          class="weather-icon"
        />
        <p class="temperature">
          {{ roundToInteger(weatherData.main.temp) }}&#176;C
        </p>
      </div>
      <div class="additional-info">
        <p>
          Feels like {{ roundToInteger(weatherData.main.feels_like) }}&#176;C,
          {{ weatherData.weather[0].description }},
          {{ getWindDescription(weatherData.wind.speed) }}
        </p>
        <p>
          <font-awesome-icon icon="fa-solid fa-location-arrow" />
          {{ roundToOneDecimal(weatherData.wind.speed) }}m/s,
          {{ getWindDirection(weatherData.wind.deg) }}
        </p>
        <p>
          <font-awesome-icon icon="fa-solid fa-arrows-to-dot" />
          {{ weatherData.main.pressure }}hPa
        </p>
        <p>Humidity: {{ weatherData.main.humidity }}%</p>
        <p>
          Dew point: {{ roundToInteger(weatherData.main.temp_min) }}&#176;C
        </p>
        <p>Visibility: {{ weatherData.visibility / 1000 }}km</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { WeatherData } from "@/api/weatherInterfaces";
import {
  roundToInteger,
  roundToOneDecimal,
  getWeatherIconUrl,
  getWindDescription,
  getWindDirection,
} from "@/utils/utils";
import { FontAwesomeIcon } from "@/utils/fontAwesome";

export default defineComponent({
  name: "WeatherCard",
  props: {
    weatherData: {
      type: Object as PropType<WeatherData | null>,
      required: true,
    },
  },
  components: {
    FontAwesomeIcon,
  },
  setup(props, { emit }) {
    const settingsClick = () => {
      emit("settingsClick");
    };

    return {
      roundToInteger,
      roundToOneDecimal,
      getWeatherIconUrl,
      getWindDescription,
      getWindDirection,
      settingsClick,
    };
  },
});
</script>
