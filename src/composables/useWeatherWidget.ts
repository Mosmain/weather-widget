import { ref } from 'vue'
import {
  fetchWeatherByCityName,
  fetchWeatherByCoords,
} from '@/services/WeatherService'
import { getGeolocation } from '@/services/GeolocationService'
import { saveCities, loadCities } from '@/services/StorageService'
import { WeatherCardModel } from '@/types/OpenWeather'

function capitalizeFirstWord(text: string): string {
  if (!text) return ''
  return text.charAt(0).toUpperCase() + text.slice(1)
}

function getWindDirection(degrees: number): {
  direction: string
  angle: number
} {
  if (degrees < 0 || degrees > 360) {
    throw new Error('Введите число от 0 до 360.')
  }

  const directions = ['С', 'СВ', 'В', 'ЮВ', 'Ю', 'ЮЗ', 'З', 'СЗ']

  const index = Math.round(degrees / 45) % 8 // Разделение на сектора по 45°
  const direction = directions[index]
  const angle = index * 45

  return { direction, angle }
}

function hPaToMmHg(hPa: number): number {
  if (hPa < 0) {
    throw new Error(
      'Введите корректное число (гектопаскали не могут быть отрицательными).',
    )
  }
  const mmHg = hPa * 0.750062 // Коэффициент преобразования hPa в мм рт. ст.
  return Math.round(mmHg)
}

function getVisibilityDescription(visibility: number): string {
  const ranges = [
    { max: 500, description: 'Плохая видимость' },
    { max: 2000, description: 'Умеренно плохая видимость' },
    { max: 5000, description: 'Средняя видимость' },
    { max: 8000, description: 'Хорошая видимость' },
    { max: 10000, description: 'Отличная видимость' },
  ]

  for (const range of ranges) {
    if (visibility <= range.max) {
      return range.description
    }
  }

  return 'Превосходная видимость'
}

function getHumidityDescription(humidity: number): string {
  const ranges = [
    { max: 30, description: 'Низкая влажность' },
    { max: 60, description: 'Умеренная влажность' },
    { max: 80, description: 'Высокая влажность' },
    { max: 100, description: 'Очень высокая влажность' },
  ]

  for (const range of ranges) {
    if (humidity <= range.max) {
      return range.description
    }
  }

  return 'Экстремальная влажность'
}

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
            const wind = getWindDirection(weatherData.wind.deg)
            return {
              id: city.id,
              name: weatherData.name,
              country: weatherData.sys.country,
              icon: weatherData.weather[0].icon,
              description: capitalizeFirstWord(
                weatherData.weather[0].description,
              ),
              main: weatherData.weather[0].main,
              temperature: Math.round(weatherData.main.temp),
              feels_like: Math.round(weatherData.main.feels_like),
              temp_min: Math.round(weatherData.main.temp_min),
              temp_max: Math.round(weatherData.main.temp_max),
              pressure: hPaToMmHg(weatherData.main.pressure),
              humidity: weatherData.main.humidity,
              humidity_description: getHumidityDescription(
                weatherData.main.humidity,
              ),
              wind_speed: weatherData.wind.speed.toFixed(1),
              wind_deg: wind.angle,
              wind_direction: wind.direction,
              visibility_description: getVisibilityDescription(
                weatherData.visibility,
              ),
              visibility: weatherData.visibility,
              sunrise: weatherData.sys.sunrise,
              sunset: weatherData.sys.sunset,
              timezone: weatherData.timezone,
              dt: weatherData.dt,
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
      const wind = getWindDirection(weatherData.wind.deg)
      cities.value = [
        {
          id: Date.now(),
          name: weatherData.name,
          country: weatherData.sys.country,
          icon: weatherData.weather[0].icon,
          description: capitalizeFirstWord(weatherData.weather[0].description),
          main: weatherData.weather[0].main,
          temperature: Math.round(weatherData.main.temp),
          feels_like: Math.round(weatherData.main.feels_like),
          temp_min: Math.round(weatherData.main.temp_min),
          temp_max: Math.round(weatherData.main.temp_max),
          pressure: hPaToMmHg(weatherData.main.pressure),
          humidity: weatherData.main.humidity,
          humidity_description: getHumidityDescription(
            weatherData.main.humidity,
          ),
          wind_speed: Number(weatherData.wind.speed.toFixed(1)),
          wind_deg: wind.angle,
          wind_direction: wind.direction,
          visibility_description: getVisibilityDescription(
            weatherData.visibility,
          ),
          visibility: weatherData.visibility,
          sunrise: weatherData.sys.sunrise,
          sunset: weatherData.sys.sunset,
          timezone: weatherData.timezone,
          dt: weatherData.dt,
        },
      ]
      saveCities(cities.value)
    }
  }

  async function addCity(cityName: string) {
    try {
      const weatherData = await fetchWeatherByCityName(cityName)
      const wind = getWindDirection(weatherData.wind.deg)
      const newCity = {
        id: Date.now(),
        name: weatherData.name,
        country: weatherData.sys.country,
        icon: weatherData.weather[0].icon,
        description: capitalizeFirstWord(weatherData.weather[0].description),
        main: weatherData.weather[0].main,
        temperature: Math.round(weatherData.main.temp),
        feels_like: Math.round(weatherData.main.feels_like),
        temp_min: Math.round(weatherData.main.temp_min),
        temp_max: Math.round(weatherData.main.temp_max),
        pressure: hPaToMmHg(weatherData.main.pressure),
        humidity: weatherData.main.humidity,
        humidity_description: getHumidityDescription(weatherData.main.humidity),
        wind_speed: Number(weatherData.wind.speed.toFixed(1)),
        wind_deg: wind.angle,
        wind_direction: wind.direction,
        visibility_description: getVisibilityDescription(
          weatherData.visibility,
        ),
        visibility: weatherData.visibility,
        sunrise: weatherData.sys.sunrise,
        sunset: weatherData.sys.sunset,
        timezone: weatherData.timezone,
        dt: weatherData.dt,
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
