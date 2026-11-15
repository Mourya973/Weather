import { useState } from "react";

import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import WaterDropOutlinedIcon from "@mui/icons-material/WaterDropOutlined";
import AirOutlinedIcon from "@mui/icons-material/AirOutlined";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ThermostatOutlinedIcon from "@mui/icons-material/ThermostatOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CompressOutlinedIcon from "@mui/icons-material/CompressOutlined";
import DeviceThermostatOutlinedIcon from "@mui/icons-material/DeviceThermostatOutlined";

import SearchBox from "./components/SearchBox";
import { getWeatherInfo } from "./services/weatherService";
import type { WeatherData } from "./types/weather";

type TemperatureUnit = "C" | "F";

function convertTemperature(
  temperature: number,
  unit: TemperatureUnit,
): number {
  if (unit === "F") {
    return (temperature * 9) / 5 + 32;
  }

  return temperature;
}

function App() {
  const [selectedCity, setSelectedCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [unit, setUnit] = useState<TemperatureUnit>("C");

  const handleSearch = async (city: string): Promise<boolean> => {
    if (!city.trim()) {
      setSelectedCity("");
      setWeather(null);
      setError("");
      return false;
    }

    setLoading(true);
    setError("");

    try {
      const weatherData = await getWeatherInfo(city);

      setWeather(weatherData);
      setSelectedCity(weatherData.city);

      return true;
    } catch (err) {
      setWeather(null);
      setSelectedCity("");

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );

      return false;
    } finally {
      setLoading(false);
    }
  };

  const formatTemperature = (temperature: number) =>
    `${Math.round(convertTemperature(temperature, unit))}°${unit}`;

  const handleUnitChange = (
    _event: React.MouseEvent<HTMLElement>,
    newUnit: TemperatureUnit | null,
  ) => {
    if (newUnit) {
      setUnit(newUnit);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#eaf3fb] px-4 py-8 sm:px-8 sm:py-12">
      {/* Atmospheric background */}
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

        {/* Current Weather */}
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

              <div className="flex items-center gap-3">
                <span className="rounded-full border border-blue-200 bg-white/70 px-3 py-1.5 text-xs font-semibold text-blue-700">
                  OpenWeatherMap
                </span>

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
            </div>

            {/* Main Weather Card */}
            <Paper
              elevation={0}
              className="overflow-hidden rounded-3xl border border-white/80 bg-white/85 shadow-xl shadow-blue-900/5 backdrop-blur-xl"
            >
              <div className="relative overflow-hidden bg-gradient-to-br from-[#0879d9] via-[#168ee7] to-[#48b8e9] p-6 text-white sm:p-9">
                {/* Decorative circles */}
                <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full border border-white/10" />
                <div className="pointer-events-none absolute -right-4 -top-12 h-48 w-48 rounded-full border border-white/10" />
                <div className="pointer-events-none absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-white/10 blur-2xl" />

                <div className="relative flex flex-col justify-between gap-8 sm:flex-row sm:items-center">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-blue-100">
                      <LocationOnOutlinedIcon fontSize="small" />

                      <span>
                        {weather.city}, {weather.country}
                      </span>
                    </div>

                    <p className="mt-8 text-sm font-medium text-blue-100">
                      Current temperature
                    </p>

                    <div className="mt-1 flex items-start">
                      <span className="text-7xl font-bold tracking-tighter sm:text-8xl">
                        {Math.round(
                          convertTemperature(weather.temperature, unit),
                        )}
                      </span>

                      <span className="mt-2 text-4xl font-light">°{unit}</span>
                    </div>

                    <p className="mt-3 text-lg font-medium capitalize text-white">
                      {weather.description}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-4 text-sm text-blue-50">
                      <span className="flex items-center gap-1.5">
                        <ArrowDownwardIcon fontSize="small" />
                        {formatTemperature(weather.minTemperature)}
                      </span>

                      <span className="flex items-center gap-1.5">
                        <ArrowUpwardIcon fontSize="small" />
                        {formatTemperature(weather.maxTemperature)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center sm:pr-8">
                    <div className="rounded-full border border-white/20 bg-white/10 p-3 shadow-2xl backdrop-blur-md">
                      <img
                        src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`}
                        alt={weather.description}
                        className="h-36 w-36 object-contain sm:h-48 sm:w-48"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Weather Metrics */}
              <div className="p-5 sm:p-8">
                <div className="mb-5">
                  <h3 className="text-lg font-bold text-slate-900">
                    Weather details
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Atmospheric conditions for {weather.city}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {/* Feels Like */}
                  <div className="rounded-2xl border border-orange-100 bg-orange-50/70 p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                      <DeviceThermostatOutlinedIcon />
                    </div>

                    <p className="mt-4 text-sm font-medium text-slate-500">
                      Feels like
                    </p>

                    <p className="mt-1 text-2xl font-bold text-slate-900">
                      {formatTemperature(weather.feelsLike)}
                    </p>
                  </div>

                  {/* Humidity */}
                  <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                      <WaterDropOutlinedIcon />
                    </div>

                    <p className="mt-4 text-sm font-medium text-slate-500">
                      Humidity
                    </p>

                    <p className="mt-1 text-2xl font-bold text-slate-900">
                      {weather.humidity}%
                    </p>
                  </div>

                  {/* Wind Speed */}
                  <div className="rounded-2xl border border-cyan-100 bg-cyan-50/70 p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700">
                      <AirOutlinedIcon />
                    </div>

                    <p className="mt-4 text-sm font-medium text-slate-500">
                      Wind speed
                    </p>

                    <p className="mt-1 text-2xl font-bold text-slate-900">
                      {weather.windSpeed} m/s
                    </p>
                  </div>

                  {/* Pressure */}
                  <div className="rounded-2xl border border-violet-100 bg-violet-50/70 p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                      <CompressOutlinedIcon />
                    </div>

                    <p className="mt-4 text-sm font-medium text-slate-500">
                      Pressure
                    </p>

                    <p className="mt-1 text-2xl font-bold text-slate-900">
                      {weather.pressure} hPa
                    </p>
                  </div>

                  {/* Minimum Temperature */}
                  <div className="rounded-2xl border border-sky-100 bg-sky-50/70 p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
                      <ArrowDownwardIcon />
                    </div>

                    <p className="mt-4 text-sm font-medium text-slate-500">
                      Minimum temperature
                    </p>

                    <p className="mt-1 text-2xl font-bold text-slate-900">
                      {formatTemperature(weather.minTemperature)}
                    </p>
                  </div>

                  {/* Maximum Temperature */}
                  <div className="rounded-2xl border border-rose-100 bg-rose-50/70 p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
                      <ArrowUpwardIcon />
                    </div>

                    <p className="mt-4 text-sm font-medium text-slate-500">
                      Maximum temperature
                    </p>

                    <p className="mt-1 text-2xl font-bold text-slate-900">
                      {formatTemperature(weather.maxTemperature)}
                    </p>
                  </div>
                </div>
              </div>
            </Paper>
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
