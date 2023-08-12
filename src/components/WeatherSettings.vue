<template>
  <div class="information">
    <div class="information-header">
      <p>Settings</p>
      <font-awesome-icon
        class="close-btn"
        icon="fa-solid fa-xmark"
        @click="showWeatherBlock"
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
import { defineComponent, PropType, ref } from "vue";
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
  setup(props, { emit }) {
    const newCityInput = ref(props.newCity);

    const showWeatherBlock = () => {
      emit("showWeatherBlock");
    };

    const startDragging = (index: number) => {
      emit("cityDragStart", index);
    };

    const handleDragOver = (index: number) => {
      emit("cityDragOver", index);
    };

    const endDragging = () => {
      emit("cityDragEnd");
    };

    const addCity = () => {
      if (newCityInput.value.trim() !== "") {
        emit("addCity", newCityInput.value);
        newCityInput.value = "";
      }
    };

    const showWeather = (city: string) => {
      emit("cityClick", city);
    };

    const removeCity = (city: string) => {
      emit("removeCity", city);
    };

    return {
      newCityInput,
      showWeatherBlock,
      startDragging,
      handleDragOver,
      endDragging,
      addCity,
      showWeather,
      removeCity,
    };
  },
});
</script>
