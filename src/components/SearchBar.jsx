import { useEffect, useRef, useState } from 'react';
import { searchCities } from '../utils/geocode';

const DEBOUNCE_MS = 300;

export default function SearchBar({ onSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setError('');
      return;
    }

    timeoutRef.current = setTimeout(async () => {
      setIsLoading(true);
      setError('');

      try {
        const matches = await searchCities(query);
        setResults(matches);
        setShowDropdown(true);
      } catch {
        setError('Could not load places. Try again.');
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(timeoutRef.current);
  }, [query]);

  const handleSelect = (place) => {
    setQuery(place.displayName);
    setShowDropdown(false);
    onSelect(place);
  };

  return (
    <div className="absolute left-1/2 top-4 z-[1000] w-[min(92vw,480px)] -translate-x-1/2">
      <div className="rounded-xl bg-white/95 p-2 shadow-lg ring-1 ring-black/5 backdrop-blur">
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setShowDropdown(true);
          }}
          placeholder="Search city..."
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
        />

        {showDropdown && (query || isLoading || error || results.length > 0) && (
          <div className="mt-2 max-h-64 overflow-auto rounded-lg border border-slate-200 bg-white">
            {isLoading && <p className="px-3 py-2 text-sm text-slate-500">Searching...</p>}
            {!isLoading && error && <p className="px-3 py-2 text-sm text-red-500">{error}</p>}
            {!isLoading && !error && results.length === 0 && (
              <p className="px-3 py-2 text-sm text-slate-500">No results</p>
            )}
            {!isLoading &&
              !error &&
              results.map((place) => (
                <button
                  key={place.id}
                  type="button"
                  onClick={() => handleSelect(place)}
                  className="block w-full border-b border-slate-100 px-3 py-2 text-left text-sm last:border-b-0 hover:bg-slate-50"
                >
                  {place.name}
                  <span className="ml-1 text-slate-500">• {place.country}</span>
                </button>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
