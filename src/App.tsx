import { useState } from "react";
import SearchBox from "./components/SearchBox";

function App() {
  const [selectedCity, setSelectedCity] = useState("");

  const handleSearch = (city: string) => {
    setSelectedCity(city);

    if (city) {
      console.log("Selected city:", city);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Weather Dashboard
          </h1>

          <p className="mt-2 text-slate-500">
            Check weather conditions for any city.
          </p>
        </div>

        <SearchBox onSearch={handleSearch} selectedCity={selectedCity} />

        {selectedCity && (
          <p className="mt-5 text-sm text-slate-600">
            Selected city: <strong>{selectedCity}</strong>
          </p>
        )}
      </div>
    </main>
  );
}

export default App;
