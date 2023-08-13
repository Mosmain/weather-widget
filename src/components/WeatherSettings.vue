<template>
  <div class="information">
    <div class="information-header">
      <p>Settings</p>
      <div class="close-btn" @click="showWeatherBlock">
        <font-awesome-icon icon="fa-solid fa-xmark" />
      </div>
    </div>
    <ul>
      <li
        v-for="(city, index) in cities"
        :key="city"
        :class="{ dragging: activeDragIndex === index }"
        @dragover="handleDragOver(index)"
        @dragend="endDragging"
        class="city-item"
      >
        <div class="city-details">
          <div
            class="burger-icon"
            :draggable="true"
            @dragstart="startDragging(index)"
          >
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
          v-model="newCityInput"
          placeholder="Enter Location"
          name="add-loc"
        />
        <button type="submit">
          <font-awesome-icon icon="fa-solid fa-arrow-turn-up" />
        </button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { FontAwesomeIcon } from "@/utils/fontAwesome";

export default defineComponent({
  name: "WeatherSettings",
  components: {
    FontAwesomeIcon,
  },
  props: {
    cities: {
      type: Array as PropType<string[]>,
      required: true,
    },
    newCity: {
      type: String,
      required: true,
    },
    activeDragIndex: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      newCityInput: this.newCity,
    };
  },
  methods: {
    showWeatherBlock() {
      this.$emit("showWeatherBlock");
    },
    startDragging(index: number) {
      this.$emit("cityDragStart", index);
    },
    handleDragOver(index: number) {
      this.$emit("cityDragOver", index);
    },
    endDragging() {
      this.$emit("cityDragEnd");
    },
    addCity() {
      if (this.newCityInput.trim() !== "") {
        this.$emit("addCity", this.newCityInput);
        this.newCityInput = "";
      }
    },
    showWeather(city: string) {
      this.$emit("cityClick", city);
    },
    removeCity(city: string) {
      this.$emit("removeCity", city);
    },
  },
});
</script>