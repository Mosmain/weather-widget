import { OpenWeatherResponse } from '@/types/OpenWeather'

const API_KEY = '3671171dabbb6227d5916ff1f165b28b'
const BASE_URL = `https://api.openweathermap.org/data/2.5/weather?appid=${API_KEY}`

export async function fetchWeatherByCoords(
  lat: any,
  lon: any,
): Promise<OpenWeatherResponse> {
  const response = await fetch(
    `${BASE_URL}&lat=${lat}&lon=${lon}&units=metric&lang=ru`,
  )
  return response.json()
}

export async function fetchWeatherByCityName(
  cityName: string,
): Promise<OpenWeatherResponse> {
  const response = await fetch(`${BASE_URL}&q=${cityName}&units=metric&lang=ru`)

  if (!response.ok) {
    throw new Error('City not found')
  }

  return response.json()
}
