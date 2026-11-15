import type { WeatherData } from "../types/weather";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

interface OpenWeatherResponse {
  name: string;
  sys: {
    country: string;
  };
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
    pressure: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
  };
}

export async function getWeatherInfo(city: string): Promise<WeatherData> {
  if (!API_KEY) {
    throw new Error("OpenWeatherMap API key is missing. Check your .env file.");
  }

  const trimmedCity = city.trim();

  if (!trimmedCity) {
    throw new Error("Please enter a city name.");
  }

  const url = new URL(BASE_URL);

  url.searchParams.set("q", trimmedCity);
  url.searchParams.set("appid", API_KEY);
  url.searchParams.set("units", "metric");

  try {
    const response = await fetch(url.toString());

    if (response.status === 404) {
      throw new Error(`No results found for "${trimmedCity}".`);
    }

    if (response.status === 401) {
      throw new Error("Invalid API key. Check your OpenWeatherMap API key.");
    }

    if (!response.ok) {
      throw new Error(
        `Weather API request failed (${response.status}). Please try again.`,
      );
    }

    const data: OpenWeatherResponse = await response.json();

    if (!data.weather?.length) {
      throw new Error("Weather information is unavailable for this city.");
    }

    const weatherData: WeatherData = {
      city: data.name,
      country: data.sys.country,
      temperature: data.main.temp,
      feelsLike: data.main.feels_like,
      minTemperature: data.main.temp_min,
      maxTemperature: data.main.temp_max,
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      description: data.weather[0].description,
      windSpeed: data.wind.speed,
      icon: data.weather[0].icon,
    };

    return weatherData;
  } catch (error) {
    console.error("Weather fetch failed:", error);

    if (error instanceof TypeError) {
      throw new Error(
        "Unable to connect to the weather service. Check your internet connection.",
      );
    }

    throw error;
  }
}
