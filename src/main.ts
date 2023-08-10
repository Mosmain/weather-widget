import { defineCustomElement } from "vue";
import WeatherWidget from "@/App.vue";

const App = defineCustomElement(WeatherWidget);

customElements.define("weather-widget", App);
