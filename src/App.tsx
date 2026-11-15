import { useCallback, useEffect, useRef, useState } from "react";

import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import ThermostatOutlinedIcon from "@mui/icons-material/ThermostatOutlined";

import SearchBox from "./components/SearchBox";
import InfoBox from "./components/InfoBox";

import { getWeatherInfo } from "./services/weatherService";
import type { WeatherData } from "./types/weather";

type TemperatureUnit = "C" | "F";

const WEATHER_STORAGE_KEY = "weather_dashboard_data";
const UPDATED_STORAGE_KEY = "weather_last_updated";
const DEFAULT_CITY = "Kolkata";

// Restore saved weather data.
function getSavedWeather(): WeatherData | null {
  try {
    const savedWeather = localStorage.getItem(WEATHER_STORAGE_KEY);

    if (!savedWeather) return null;

    const parsed: unknown = JSON.parse(savedWeather);

    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !("city" in parsed) ||
      typeof parsed.city !== "string" ||
      !("temperature" in parsed) ||
      typeof parsed.temperature !== "number" ||
      !("feelsLike" in parsed) ||
      typeof parsed.feelsLike !== "number" ||
      !("minTemperature" in parsed) ||
      typeof parsed.minTemperature !== "number" ||
      !("maxTemperature" in parsed) ||
      typeof parsed.maxTemperature !== "number" ||
      !("humidity" in parsed) ||
      typeof parsed.humidity !== "number" ||
      !("pressure" in parsed) ||
      typeof parsed.pressure !== "number" ||
      !("windSpeed" in parsed) ||
      typeof parsed.windSpeed !== "number" ||
      !("country" in parsed) ||
      typeof parsed.country !== "string" ||
      !("description" in parsed) ||
      typeof parsed.description !== "string" ||
      !("icon" in parsed) ||
      typeof parsed.icon !== "string"
    ) {
      return null;
    }

    return parsed as WeatherData;
  } catch (error) {
    console.error("Unable to restore saved weather:", error);
    return null;
  }
}

// Restore the last updated timestamp.
function getSavedTimestamp(): number | null {
  try {
    const savedTimestamp = localStorage.getItem(UPDATED_STORAGE_KEY);

    if (!savedTimestamp) return null;

    const timestamp = Number(savedTimestamp);

    return Number.isFinite(timestamp) && timestamp > 0 ? timestamp : null;
  } catch {
    return null;
  }
}

// Save weather data and timestamp.
function saveWeather(weather: WeatherData, timestamp: number) {
  try {
    localStorage.setItem(WEATHER_STORAGE_KEY, JSON.stringify(weather));
    localStorage.setItem(UPDATED_STORAGE_KEY, String(timestamp));
  } catch (error) {
    console.error("Unable to save weather data:", error);
  }
}

// Clear saved weather data.
function clearSavedWeather() {
  try {
    localStorage.removeItem(WEATHER_STORAGE_KEY);
    localStorage.removeItem(UPDATED_STORAGE_KEY);
  } catch (error) {
    console.error("Unable to clear saved weather:", error);
  }
}

// Get dashboard background based on weather.
function getDashboardBackground(weather: WeatherData | null): string {
  if (!weather) return "bg-[#eaf3fb]";

  const description = weather.description.toLowerCase();
  const icon = weather.icon;

  // Snow and frost.
  if (weather.temperature <= 0 || icon.startsWith("13")) {
    return "bg-gradient-to-br from-slate-100 via-blue-100 to-cyan-100";
  }

  // Thunderstorm.
  if (icon.startsWith("11") || description.includes("thunderstorm")) {
    return "bg-gradient-to-br from-slate-300 via-indigo-100 to-slate-200";
  }

  // Rain and drizzle.
  if (
    icon.startsWith("09") ||
    icon.startsWith("10") ||
    description.includes("rain") ||
    description.includes("drizzle")
  ) {
    return "bg-gradient-to-br from-slate-200 via-blue-100 to-sky-100";
  }

  // Mist and fog.
  if (
    icon.startsWith("50") ||
    description.includes("mist") ||
    description.includes("fog") ||
    description.includes("haze")
  ) {
    return "bg-gradient-to-br from-slate-200 via-slate-100 to-blue-100";
  }

  // Clear sky.
  if (icon.startsWith("01") || description.includes("clear")) {
    return "bg-gradient-to-br from-amber-50 via-sky-100 to-blue-100";
  }

  // Cloudy conditions.
  return "bg-gradient-to-br from-slate-100 via-sky-100 to-blue-100";
}

// Convert API errors into user-friendly messages.
function getWeatherErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : "";
  const normalized = message.toLowerCase();

  if (
    normalized.includes("404") ||
    normalized.includes("city not found") ||
    normalized.includes("not found")
  ) {
    return "City not found. Check the spelling or try another city.";
  }

  if (
    normalized.includes("401") ||
    normalized.includes("invalid api key") ||
    normalized.includes("unauthorized")
  ) {
    return "Weather API authentication failed. Check your OpenWeatherMap API key.";
  }

  if (
    normalized.includes("failed to fetch") ||
    normalized.includes("network")
  ) {
    return "Network error. Check your internet connection and try again.";
  }

  return message || "Unable to fetch weather information. Please try again.";
}

function App() {
  // Restore weather once during initialization.
  const [initialWeather] = useState<WeatherData | null>(getSavedWeather);

  const [weather, setWeather] = useState<WeatherData | null>(initialWeather);

  const [selectedCity, setSelectedCity] = useState(
    () => initialWeather?.city ?? "",
  );

  const [lastUpdated, setLastUpdated] = useState<number | null>(
    getSavedTimestamp,
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [unit, setUnit] = useState<TemperatureUnit>("C");

  // Prevent duplicate initial requests in React Strict Mode.
  const hasInitialized = useRef(false);

  // Search and update weather information.
  const handleSearch = useCallback(async (city: string): Promise<boolean> => {
    if (!city.trim()) {
      setSelectedCity("");
      setWeather(null);
      setLastUpdated(null);
      setError("");
      clearSavedWeather();
      return false;
    }

    setLoading(true);
    setError("");

    try {
      const weatherData = await getWeatherInfo(city);
      const updatedAt = Date.now();

      setWeather(weatherData);
      setSelectedCity(weatherData.city);
      setLastUpdated(updatedAt);

      saveWeather(weatherData, updatedAt);

      return true;
    } catch (err) {
      setWeather(null);
      setSelectedCity("");
      setLastUpdated(null);

      clearSavedWeather();

      setError(getWeatherErrorMessage(err));

      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load default city if no saved weather exists.
  useEffect(() => {
    if (hasInitialized.current) return;

    hasInitialized.current = true;

    if (!initialWeather) {
      void handleSearch(DEFAULT_CITY);
    }
  }, [handleSearch, initialWeather]);

  // Change temperature unit.
  const handleUnitChange = (
    _event: React.MouseEvent<HTMLElement>,
    newUnit: TemperatureUnit | null,
  ) => {
    if (newUnit) {
      setUnit(newUnit);
    }
  };

  return (
    <main
      className={`relative min-h-screen overflow-hidden px-4 py-8 transition-colors duration-700 sm:px-8 sm:py-12 ${getDashboardBackground(weather)}`}
    >
      {/* Atmospheric Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-sky-300/30 blur-3xl" />
        <div className="absolute -right-32 top-40 h-96 w-96 rounded-full bg-blue-300/30 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-cyan-200/40 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl">
        {/* Dashboard Header */}
        <header className="mb-8">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
              <ThermostatOutlinedIcon />
            </div>

            <span className="text-sm font-bold tracking-[0.18em] text-blue-700">
              WEATHER STUDIO
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Weather Dashboard
          </h1>

          <p className="mt-2 text-slate-600">
            Explore current weather conditions around the world.
          </p>
        </header>

        {/* Search */}
        <SearchBox
          onSearch={handleSearch}
          selectedCity={selectedCity}
          loading={loading}
        />

        {/* Loading */}
        {loading && (
          <Paper
            elevation={0}
            className="mt-6 flex items-center justify-center gap-3 rounded-2xl border border-white/80 bg-white/80 p-8 backdrop-blur-xl"
          >
            <CircularProgress size={24} />

            <Typography color="text.secondary">
              Fetching weather information...
            </Typography>
          </Paper>
        )}

        {/* Error */}
        {error && !loading && (
          <Alert severity="error" className="mt-6 rounded-xl">
            {error}
          </Alert>
        )}

        {/* Weather Dashboard */}
        {weather && !loading && (
          <section className="mt-7">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">
                  Live weather
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  Current conditions
                </h2>
              </div>

              {/* Temperature Unit Switch */}
              <ToggleButtonGroup
                value={unit}
                exclusive
                onChange={handleUnitChange}
                size="small"
                aria-label="Temperature unit"
                sx={{
                  bgcolor: "white",
                  borderRadius: "10px",
                  "& .MuiToggleButton-root": {
                    px: 2,
                    fontWeight: 700,
                    border: "1px solid #bfdbfe",
                    color: "#2563eb",
                  },
                  "& .Mui-selected": {
                    bgcolor: "#2563eb !important",
                    color: "#ffffff !important",
                  },
                }}
              >
                <ToggleButton value="C">°C</ToggleButton>
                <ToggleButton value="F">°F</ToggleButton>
              </ToggleButtonGroup>
            </div>

            <InfoBox weather={weather} unit={unit} />

            {/* Last Updated */}
            {lastUpdated && (
              <p className="mt-4 text-right text-xs text-slate-500">
                Last updated:{" "}
                {new Date(lastUpdated).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            )}
          </section>
        )}

        {/* Initial Empty State */}
        {!weather && !loading && !error && (
          <div className="mt-7 rounded-3xl border border-dashed border-blue-200 bg-white/50 px-6 py-12 text-center backdrop-blur-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
              <ThermostatOutlinedIcon sx={{ fontSize: 34 }} />
            </div>

            <h2 className="mt-5 text-lg font-bold text-slate-800">
              Your weather overview starts here
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Search for a city above to view its temperature, feels-like
              temperature, humidity, pressure, and wind speed.
            </p>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-10 pb-4 text-center text-xs text-slate-500">
          Weather data provided by OpenWeatherMap
        </footer>
      </div>
    </main>
  );
}

export default App;
