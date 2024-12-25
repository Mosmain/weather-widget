import { ref } from 'vue'
import {
  fetchWeatherByCityName,
  fetchWeatherByCoords,
} from '@/services/WeatherService'
import { getGeolocation } from '@/services/GeolocationService'
import { saveCities, loadCities } from '@/services/StorageService'
import { WeatherCardModel } from '@/types/OpenWeather'

export function useWeatherWidget() {
  const cities = ref<Array<WeatherCardModel>>([])
  const showSettings = ref(false)

  async function initializeCities() {
    const savedCities = loadCities()

    if (savedCities.length > 0) {
      const updatedCities = await Promise.all(
        savedCities.map(async (city: WeatherCardModel) => {
          try {
            const weatherData = await fetchWeatherByCityName(city.name)
            return {
              id: city.id,
              name: weatherData.name,
              icon: weatherData.weather[0].icon,
              description: weatherData.weather[0].description,
              temperature: weatherData.main.temp,
              feels_like: weatherData.main.feels_like,
              temp_min: weatherData.main.temp_min,
              temp_max: weatherData.main.temp_max,
              pressure: weatherData.main.pressure,
              humidity: weatherData.main.humidity,
            }
          } catch (error) {
            console.error(`Failed to update ${city.name}`, error)
            return city
          }
        }),
      )
      cities.value = updatedCities
      saveCities(cities.value)
    } else {
      const position = await getGeolocation()
      const weatherData = await fetchWeatherByCoords(
        position.latitude,
        position.longitude,
      )
      cities.value = [
        {
          id: Date.now(),
          name: weatherData.name,
          icon: weatherData.weather[0].icon,
          description: weatherData.weather[0].description,
          temperature: weatherData.main.temp,
          feels_like: weatherData.main.feels_like,
          temp_min: weatherData.main.temp_min,
          temp_max: weatherData.main.temp_max,
          pressure: weatherData.main.pressure,
          humidity: weatherData.main.humidity,
        },
      ]
      saveCities(cities.value)
    }
  }

  async function addCity(cityName: string) {
    try {
      const weatherData = await fetchWeatherByCityName(cityName)
      const newCity = {
        id: Date.now(),
        name: weatherData.name,
        icon: weatherData.weather[0].icon,
        description: weatherData.weather[0].description,
        temperature: weatherData.main.temp,
        feels_like: weatherData.main.feels_like,
        temp_min: weatherData.main.temp_min,
        temp_max: weatherData.main.temp_max,
        pressure: weatherData.main.pressure,
        humidity: weatherData.main.humidity,
      }
      cities.value.push(newCity)
      saveCities(cities.value)
    } catch (error) {
      console.error('City not found or API error:', error)
    }
  }

  function updateCities(updatedCities: Array<WeatherCardModel>) {
    cities.value = updatedCities
    saveCities(cities.value)
  }

  function toggleSettings() {
    showSettings.value = !showSettings.value
  }

  return {
    cities,
    showSettings,
    initializeCities,
    addCity,
    updateCities,
    toggleSettings,
  }
}
