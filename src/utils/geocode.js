const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

export async function searchCities(query) {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const url = `${NOMINATIM_URL}?q=${encodeURIComponent(trimmed)}&format=json&addressdetails=1&limit=5`;
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch locations');
  }

  const data = await response.json();

  return data.slice(0, 5).map((item) => {
    const city = item.address?.city || item.address?.town || item.address?.village || item.address?.municipality || item.name || item.display_name?.split(',')[0] || 'Unknown';
    const country = item.address?.country || 'Unknown country';

    return {
      id: item.place_id,
      name: city,
      country,
      lat: Number(item.lat),
      lon: Number(item.lon),
      displayName: `${city}, ${country}`,
    };
  });
}
