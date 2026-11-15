import { useEffect, useState, type FormEvent } from "react";

import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import SearchIcon from "@mui/icons-material/Search";
import HistoryIcon from "@mui/icons-material/History";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CloseIcon from "@mui/icons-material/Close";

import AppButton from "./AppButton";

interface SearchBoxProps {
  onSearch: (city: string) => Promise<boolean>;
  selectedCity: string;
  loading: boolean;
}

const STORAGE_KEY = "weather_recent_cities";
const MAX_RECENT_SEARCHES = 5;

function getRecentSearches(): string[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return [];

    const parsed: unknown = JSON.parse(saved);

    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter(
        (city): city is string =>
          typeof city === "string" && city.trim().length > 0,
      )
      .slice(0, MAX_RECENT_SEARCHES);
  } catch {
    return [];
  }
}

export default function SearchBox({
  onSearch,
  selectedCity,
  loading,
}: SearchBoxProps) {
  const [city, setCity] = useState("");
  const [recentCities, setRecentCities] = useState<string[]>(getRecentSearches);
  const [error, setError] = useState("");

  // Save recent searches to localStorage.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recentCities));
    } catch (error) {
      console.error("Unable to save search history:", error);
    }
  }, [recentCities]);

  // Submit city search.
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedCity = city.trim();

    if (!trimmedCity) {
      setError("Please enter a city name.");
      return;
    }

    if (trimmedCity.length < 2) {
      setError("City name must contain at least 2 characters.");
      return;
    }

    setError("");

    const success = await onSearch(trimmedCity);

    if (success) {
      setRecentCities((previous) =>
        [
          trimmedCity,
          ...previous.filter(
            (item) => item.toLowerCase() !== trimmedCity.toLowerCase(),
          ),
        ].slice(0, MAX_RECENT_SEARCHES),
      );

      setCity("");
    }
  };

  // Search a previously searched city.
  const handleRecentSearch = async (selectedCityName: string) => {
    setError("");
    setCity("");

    await onSearch(selectedCityName);
  };

  // Remove one city from history and clear selection if necessary.
  const handleRemoveCity = (cityToRemove: string) => {
    setRecentCities((previous) =>
      previous.filter(
        (item) => item.toLowerCase() !== cityToRemove.toLowerCase(),
      ),
    );

    if (selectedCity.toLowerCase() === cityToRemove.toLowerCase()) {
      void onSearch("");
    }
  };

  // Clear all recent searches.
  const handleClearHistory = () => {
    setRecentCities([]);

    if (
      recentCities.some(
        (item) => item.toLowerCase() === selectedCity.toLowerCase(),
      )
    ) {
      void onSearch("");
    }
  };

  return (
    <Paper
      elevation={0}
      className="w-full rounded-2xl border border-gray-200 p-5 sm:p-7"
    >
      {/* Header */}
      <Box className="mb-7 flex items-center justify-between">
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#111827" }}>
            Find your weather
          </Typography>

          <Typography variant="body1" sx={{ color: "text.secondary", mt: 0.5 }}>
            Search for a city to explore its weather conditions.
          </Typography>
        </Box>

        <LocationOnOutlinedIcon sx={{ fontSize: 38, color: "#2196f3" }} />
      </Box>

      {/* Search Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <TextField
          fullWidth
          disabled={loading}
          label="City name"
          placeholder="e.g. Mumbai, Kolkata, Delhi"
          value={city}
          onChange={(event) => {
            setCity(event.target.value);

            if (error) {
              setError("");
            }
          }}
          error={Boolean(error)}
          helperText={error || " "}
          autoComplete="off"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            },
          }}
        />

        <AppButton
          type="submit"
          variant="contained"
          size="large"
          disabled={loading}
          startIcon={<SearchIcon />}
          sx={{
            minWidth: { sm: 145 },
            height: 56,
            fontWeight: 600,
          }}
        >
          {loading ? "Searching..." : "Search"}
        </AppButton>
      </form>

      {/* Recent Searches */}
      {recentCities.length > 0 && (
        <Box className="mt-5 border-t border-gray-200 pt-5">
          <Box className="mb-4 flex items-center justify-between gap-3">
            <Box className="flex items-center gap-2">
              <HistoryIcon color="action" />

              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Recent searches
              </Typography>
            </Box>

            <button
              type="button"
              onClick={handleClearHistory}
              disabled={loading}
              className="flex items-center gap-1 text-sm text-red-500 transition-colors hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <DeleteOutlined fontSize="small" />
              Clear all
            </button>
          </Box>

          <Box className="flex flex-wrap gap-2">
            {recentCities.map((recentCity) => (
              <Chip
                key={recentCity.toLowerCase()}
                icon={<LocationOnOutlinedIcon />}
                label={recentCity}
                variant="outlined"
                disabled={loading}
                onClick={() => handleRecentSearch(recentCity)}
                onDelete={() => handleRemoveCity(recentCity)}
                deleteIcon={<CloseIcon />}
                sx={{
                  borderRadius: "20px",
                  height: 40,
                  cursor: "pointer",
                  "& .MuiChip-label": {
                    px: 1,
                  },
                }}
              />
            ))}
          </Box>
        </Box>
      )}
    </Paper>
  );
}
