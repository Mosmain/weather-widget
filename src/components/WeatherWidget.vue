<template>
  <div>
    <div v-if="isWeatherDisplayed" class="weather-card">
      <div v-if="!weatherData">
        <div class="weather-header">
          <p class="city-info"></p>
          <font-awesome-icon
            class="close-btn"
            icon="fa-solid fa-gear"
            @click="showCitiesBlock"
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
            @click="showCitiesBlock"
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
    <div v-if="!isWeatherDisplayed" class="information">
      <div class="information-header">
        <p>Settings</p>
        <font-awesome-icon
          class="close-btn"
          icon="fa-solid fa-xmark"
          @click="showWeatherBlock()"
        />
      </div>
      <ul>
        <li
          v-for="(city, index) in cities"
          :key="city"
          :draggable="true"
          :class="{ dragging: activeDragIndex === index }"
          @dragstart="startDragging(index)"
          @dragover="handleDragOver(index)"
          @dragend="endDragging"
          class="city-item"
        >
          <div class="city-details">
            <div class="burger-icon">
              <font-awesome-icon icon="fa-solid fa-bars" />
            </div>
            <div @click="showWeather(city)" class="city-name">
              <p>{{ city }}</p>
            </div>
            <button class="remove-button">
              <font-awesome-icon
                icon="fa-solid fa-trash-can"
                @click="removeCity(city)"
              />
            </button>
          </div>
        </li>
      </ul>
      <div class="information-bottom">
        <label for="add-loc">Add Location</label>
        <form class="input-field" @submit.prevent="addCity">
          <input
            v-model="newCity"
            placeholder="Enter Location"
            name="add-loc"
          />
          <button type="submit">
            <font-awesome-icon icon="fa-solid fa-arrow-turn-up" />
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import weatherService from "@/api/weatherApi";
import { WeatherData } from "@/api/weatherInterfaces";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faBars,
  faLocationArrow,
  faArrowsToDot,
  faGear,
  faXmark,
  faTrashCan,
  faArrowTurnUp,
} from "@fortawesome/free-solid-svg-icons";

library.add(
  faBars,
  faLocationArrow,
  faArrowsToDot,
  faGear,
  faTrashCan,
  faXmark,
  faArrowTurnUp
);

export default defineComponent({
  name: "WeatherWidget",
  components: {
    FontAwesomeIcon,
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
    roundToInteger(number: number) {
      return Math.round(number);
    },
    roundToOneDecimal(number: number) {
      return Math.round(number * 10) / 10;
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

  computed: {
    getWeatherIconUrl() {
      return (iconCode: string) =>
        `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
    },
    getWindDescription() {
      return (speed: number): string => {
        const windDescriptions: { [key: number]: string } = {
          1: "Calm",
          3: "Light breeze",
          5: "Gentle breeze",
          8: "Moderate breeze",
          11: "Fresh breeze",
        };

        const maxSpeed: number =
          Object.keys(windDescriptions)
            .map(Number)
            .find((key) => speed < key) || 11;
        return windDescriptions[maxSpeed];
      };
    },
    getWindDirection() {
      return (deg: number): string => {
        const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
        const index = Math.floor((deg % 360) / 45);
        return directions[(index + 8) % 8];
      };
    },
  },
  mounted() {
    this.restoreCitiesLocally();
    this.fetchCityByCoordinates();
  },
});
</script>
