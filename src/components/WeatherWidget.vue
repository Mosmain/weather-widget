<template>
  <div>
    <weather-card
      v-if="isWeatherDisplayed"
      :weather-data="weatherData"
      @settingsClick="showCitiesBlock"
    />
    <weather-settings
      v-else
      :cities="cities"
      :newCity="newCity"
      :activeDragIndex="activeDragIndex"
      @showWeatherBlock="showWeatherBlock"
      @cityDragStart="startDragging"
      @cityDragOver="handleDragOver"
      @cityDragEnd="endDragging"
      @addCity="addCity"
      @cityClick="showWeather"
      @removeCity="removeCity"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import WeatherCard from "@/components/WeatherCard.vue";
import WeatherSettings from "@/components/WeatherSettings.vue";
import { WeatherData } from "@/api/weatherInterfaces";
import weatherService from "@/api/weatherApi";

export default defineComponent({
  name: "WeatherWidget",
  components: {
    WeatherCard,
    WeatherSettings,
  },
  data() {
    return {
      weatherData: null as WeatherData | null,
      newCity: "",
      cities: [] as string[],
      activeDragIndex: -1,
      isWeatherDisplayed: true,
    };
  },
  methods: {
    fetchWeather() {
      if (this.newCity.trim() !== "") {
        weatherService
          .getWeatherByCity(this.newCity)
          .then((data) => {
            this.cities.push(this.newCity);
            this.weatherData = data;
            this.newCity = "";
            this.showWeatherBlock();
            this.saveCitiesLocally();
          })
          .catch((error) => {
            console.error(error);
          });
      }
    },
    async fetchCityByCoordinates() {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          const city = await weatherService.getCityByCoordinates(
            latitude,
            longitude
          );

          if (city) {
            this.showWeatherBlock();
            if (!this.cities.includes(city)) {
              this.cities.push(city);
              this.saveCitiesLocally();
            }
            this.showWeather(city);
          }
        });
      }
    },
    showWeatherBlock() {
      this.isWeatherDisplayed = true;
    },
    showCitiesBlock() {
      this.isWeatherDisplayed = false;
    },
    addCity() {
      this.fetchWeather();
    },
    showWeather(city: string) {
      this.showWeatherBlock();
      weatherService
        .getWeatherByCity(city)
        .then((data) => {
          this.weatherData = data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    removeCity(city: string) {
      const cityIndex = this.cities.indexOf(city);
      if (cityIndex !== -1) {
        this.cities.splice(cityIndex, 1);
        this.saveCitiesLocally();
      }
    },
    saveCitiesLocally() {
      localStorage.setItem("userCities", JSON.stringify(this.cities));
    },
    restoreCitiesLocally() {
      const savedCities = localStorage.getItem("userCities");
      if (savedCities) {
        this.cities = JSON.parse(savedCities);
      }
    },
    startDragging(index: number) {
      this.activeDragIndex = index;
    },
    handleDragOver(index: number) {
      if (this.activeDragIndex === -1) return;

      const draggedCity = this.cities[this.activeDragIndex];
      this.cities.splice(this.activeDragIndex, 1);
      this.cities.splice(index, 0, draggedCity);

      this.activeDragIndex = index;
      this.saveCitiesLocally();
    },
    endDragging() {
      this.activeDragIndex = -1;
    },
  },
  mounted() {
    this.restoreCitiesLocally();
    this.fetchCityByCoordinates();
  },
});
</script>
