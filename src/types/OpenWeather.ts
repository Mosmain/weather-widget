export interface OpenWeatherResponse {
  coord: Coord
  weather: Weather[]
  base: string
  main: Main
  wind: Wind
  snow: Snow
  clouds: Clouds
  dt: number
  sys: Sys
  timezone: number
  visibility: number
  id: number
  name: string
  cod: number
}

export interface Coord {
  lon: number
  lat: number
}

export interface Weather {
  id: number
  main: string
  description: string
  icon: string
}

export interface Main {
  temp: number
  feels_like: number
  temp_min: number
  temp_max: number
  pressure: number
  humidity: number
  sea_level: number
  grnd_level: number
}

export interface Wind {
  speed: number
  deg: number
  gust: number
}

export interface Snow {
  '1h': number
}

export interface Clouds {
  all: number
}

export interface Sys {
  type: number
  id: number
  country: string
  sunrise: number
  sunset: number
}

export interface WeatherCardModel {
  id: number
  name: string
  country: string
  icon: string
  temperature: number
  description: string
  main: string
  feels_like: number
  temp_min: number
  temp_max: number
  pressure: number
  humidity: number
  humidity_description: string
  wind_speed: string
  wind_deg: number
  wind_direction: string
  visibility_description: string
  visibility: number
  sunrise: number
  sunset: number
  timezone: number
  dt: number
}
