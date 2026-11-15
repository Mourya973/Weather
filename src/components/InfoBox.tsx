import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import WaterDropOutlinedIcon from "@mui/icons-material/WaterDropOutlined";
import AirOutlinedIcon from "@mui/icons-material/AirOutlined";
import CompressOutlinedIcon from "@mui/icons-material/CompressOutlined";
import DeviceThermostatOutlinedIcon from "@mui/icons-material/DeviceThermostatOutlined";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

import WbSunnyIcon from "@mui/icons-material/WbSunny";
import CloudIcon from "@mui/icons-material/Cloud";
import ThunderstormIcon from "@mui/icons-material/Thunderstorm";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import GrainIcon from "@mui/icons-material/Grain";

import type { WeatherData } from "../types/weather";

interface InfoBoxProps {
  weather: WeatherData;
  unit: "C" | "F";
}

type WeatherCondition =
  | "sunny"
  | "cloudy"
  | "rainy"
  | "stormy"
  | "snowy"
  | "misty";

function convertTemperature(temperature: number, unit: "C" | "F"): number {
  return unit === "F" ? (temperature * 9) / 5 + 32 : temperature;
}

function getWeatherCondition(weather: WeatherData): WeatherCondition {
  const description = weather.description.toLowerCase();
  const iconCode = weather.icon;

  // Snow/frost takes priority at or below 0°C.
  if (weather.temperature <= 0 || iconCode.startsWith("13")) {
    return "snowy";
  }

  if (description.includes("thunderstorm") || iconCode.startsWith("11")) {
    return "stormy";
  }

  if (
    description.includes("rain") ||
    description.includes("drizzle") ||
    iconCode.startsWith("09") ||
    iconCode.startsWith("10")
  ) {
    return "rainy";
  }

  if (
    description.includes("mist") ||
    description.includes("fog") ||
    description.includes("haze") ||
    description.includes("smoke") ||
    description.includes("dust") ||
    description.includes("sand") ||
    description.includes("squall") ||
    description.includes("tornado") ||
    iconCode.startsWith("50")
  ) {
    return "misty";
  }

  if (
    description.includes("cloud") ||
    iconCode.startsWith("02") ||
    iconCode.startsWith("03") ||
    iconCode.startsWith("04")
  ) {
    return "cloudy";
  }

  return "sunny";
}

const conditionStyles: Record<
  WeatherCondition,
  {
    label: string;
    color: string;
    background: string;
    icon: React.ReactNode;
  }
> = {
  sunny: {
    label: "Clear weather",
    color: "#f59e0b",
    background: "#fffbeb",
    icon: <WbSunnyIcon sx={{ fontSize: { xs: 76, sm: 104 } }} />,
  },
  cloudy: {
    label: "Cloudy weather",
    color: "#64748b",
    background: "#f1f5f9",
    icon: <CloudIcon sx={{ fontSize: { xs: 76, sm: 104 } }} />,
  },
  rainy: {
    label: "Rainy weather",
    color: "#0284c7",
    background: "#eff6ff",
    icon: <GrainIcon sx={{ fontSize: { xs: 76, sm: 104 } }} />,
  },
  stormy: {
    label: "Thunderstorm",
    color: "#7c3aed",
    background: "#f5f3ff",
    icon: <ThunderstormIcon sx={{ fontSize: { xs: 76, sm: 104 } }} />,
  },
  snowy: {
    label: "Snow and frost",
    color: "#2563eb",
    background: "#eff6ff",
    icon: <AcUnitIcon sx={{ fontSize: { xs: 76, sm: 104 } }} />,
  },
  misty: {
    label: "Mist and fog",
    color: "#64748b",
    background: "#f1f5f9",
    icon: <CloudIcon sx={{ fontSize: { xs: 76, sm: 104 } }} />,
  },
};

export default function InfoBox({ weather, unit }: InfoBoxProps) {
  const formatTemperature = (temperature: number) =>
    `${Math.round(convertTemperature(temperature, unit))}°${unit}`;

  const condition = getWeatherCondition(weather);
  const style = conditionStyles[condition];

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

          {/* Dynamic Weather Icon */}
          <Box
            role="img"
            aria-label={style.label}
            sx={{
              width: { xs: 100, sm: 140 },
              height: { xs: 100, sm: 140 },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: style.color,
              backgroundColor: style.background,
              borderRadius: "50%",
            }}
          >
            {style.icon}
          </Box>
        </Box>

        {/* Minimum and Maximum Temperature */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
            mt: 3,
            mb: 4,
          }}
        >
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
