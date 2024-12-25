import { defineCustomElement } from 'vue'
import WeatherWidget from '@/WeatherWidget.ce.vue'

const weatherWidgetElement = defineCustomElement(WeatherWidget)
customElements.define('weather-widget', weatherWidgetElement)
