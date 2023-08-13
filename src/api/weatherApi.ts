import axios from "axios";
import { WeatherData } from "./weatherInterfaces";

const API_KEY = "3671171dabbb6227d5916ff1f165b28b";
const API_BASE_URL = "https://api.openweathermap.org/data/2.5";

const weatherService = {
  async getWeatherByCity(city: string): Promise<WeatherData> {
    try {
      const response = await axios.get(`${API_BASE_URL}/weather`, {
        params: {
          q: city,
          units: "metric",
          appid: API_KEY,
        },
      });
      return response.data as WeatherData;
    } catch (error) {
      throw new Error("Failed to fetch weather data");
    }
  },
  async getCityByCoordinates(
    latitude: number,
    longitude: number
  ): Promise<string | null> {
    try {
      const response = await axios.get(`${API_BASE_URL}/weather`, {
        params: {
          lat: latitude,
          lon: longitude,
          units: "metric",
          appid: API_KEY,
        },
      });

      const city = `${response.data.name}, ${response.data.sys.country}`;
      return city || null;
    } catch (error) {
      console.error("Failed to fetch city by coordinates", error);
      return null;
    }
  },
};

export default weatherService;
