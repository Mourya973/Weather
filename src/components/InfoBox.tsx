import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import WaterDropOutlinedIcon from "@mui/icons-material/WaterDropOutlined";
import AirOutlinedIcon from "@mui/icons-material/AirOutlined";
import CompressOutlinedIcon from "@mui/icons-material/CompressOutlined";
import DeviceThermostatOutlinedIcon from "@mui/icons-material/DeviceThermostatOutlined";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

import type { WeatherData } from "../types/weather";

interface InfoBoxProps {
  weather: WeatherData;
  unit: "C" | "F";
}

function convertTemperature(temperature: number, unit: "C" | "F"): number {
  return unit === "F" ? (temperature * 9) / 5 + 32 : temperature;
}

export default function InfoBox({ weather, unit }: InfoBoxProps) {
  const formatTemperature = (temperature: number) =>
    `${Math.round(convertTemperature(temperature, unit))}°${unit}`;

  // Color is based on the original Celsius temperature.
  const temperatureColor =
    weather.temperature > 30
      ? "#dc2626"
      : weather.temperature < 10
        ? "#2563eb"
        : "#0f172a";

  const metrics = [
    {
      label: "Feels like",
      value: formatTemperature(weather.feelsLike),
      icon: <DeviceThermostatOutlinedIcon />,
      color: "#ea580c",
      background: "#fff7ed",
    },
    {
      label: "Humidity",
      value: `${weather.humidity}%`,
      icon: <WaterDropOutlinedIcon />,
      color: "#2563eb",
      background: "#eff6ff",
    },
    {
      label: "Wind speed",
      value: `${weather.windSpeed} m/s`,
      icon: <AirOutlinedIcon />,
      color: "#0891b2",
      background: "#ecfeff",
    },
    {
      label: "Pressure",
      value: `${weather.pressure} hPa`,
      icon: <CompressOutlinedIcon />,
      color: "#7c3aed",
      background: "#f5f3ff",
    },
  ];

  return (
    <Card
      elevation={0}
      sx={{
        width: "100%",
        overflow: "hidden",
        borderRadius: 4,
        border: "1px solid #e2e8f0",
        backgroundColor: "#ffffff",
      }}
    >
      <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
        {/* Location */}
        <Typography variant="h5" sx={{ fontWeight: 750, color: "#0f172a" }}>
          {weather.city}, {weather.country}
        </Typography>

        {/* Main Weather */}
        <Box
          sx={{
            mt: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "4rem", sm: "5.5rem" },
                lineHeight: 1,
                fontWeight: 750,
                letterSpacing: "-0.06em",
                color: temperatureColor,
              }}
            >
              {formatTemperature(weather.temperature)}
            </Typography>

            <Typography
              variant="h6"
              sx={{
                mt: 2,
                textTransform: "capitalize",
                color: "#475569",
                fontWeight: 500,
              }}
            >
              {weather.description}
            </Typography>
          </Box>

          <CardMedia
            component="img"
            image={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`}
            alt={weather.description}
            sx={{
              width: { xs: 100, sm: 140 },
              height: { xs: 100, sm: 140 },
              objectFit: "contain",
            }}
          />
        </Box>

        {/* Minimum and Maximum Temperature */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mt: 3, mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <ArrowDownwardIcon fontSize="small" color="primary" />
            <Typography variant="body2" color="text.secondary">
              Min: {formatTemperature(weather.minTemperature)}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <ArrowUpwardIcon fontSize="small" color="error" />
            <Typography variant="body2" color="text.secondary">
              Max: {formatTemperature(weather.maxTemperature)}
            </Typography>
          </Box>
        </Box>

        {/* Weather Metrics */}
        <Box
          sx={{
            borderTop: "1px solid #e2e8f0",
            pt: 3,
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, minmax(0, 1fr))",
              md: "repeat(4, minmax(0, 1fr))",
            },
            gap: 2,
          }}
        >
          {metrics.map((metric) => (
            <Box
              key={metric.label}
              sx={{
                p: 2,
                borderRadius: 3,
                backgroundColor: metric.background,
                minWidth: 0,
              }}
            >
              <Box sx={{ color: metric.color, display: "flex" }}>
                {metric.icon}
              </Box>

              <Typography variant="body2" sx={{ mt: 2, color: "#64748b" }}>
                {metric.label}
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  mt: 0.5,
                  fontWeight: 700,
                  color: "#0f172a",
                  overflowWrap: "anywhere",
                }}
              >
                {metric.value}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
