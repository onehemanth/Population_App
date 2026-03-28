import { useMemo, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import SearchBar from './components/SearchBar';

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function MapFocus({ selectedPlace }) {
  const map = useMap();

  if (selectedPlace) {
    map.flyTo([selectedPlace.lat, selectedPlace.lon], 8, { duration: 1.2 });
  }

  return null;
}

export default function App() {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const markerPosition = useMemo(() => {
    if (!selectedPlace) return null;
    return [selectedPlace.lat, selectedPlace.lon];
  }, [selectedPlace]);

  return (
    <main className="relative h-screen w-screen">
      <SearchBar onSelect={setSelectedPlace} />

      <MapContainer center={[20, 0]} zoom={2} minZoom={2} className="h-full w-full" worldCopyJump>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapFocus selectedPlace={selectedPlace} />

        {markerPosition && (
          <Marker position={markerPosition} icon={defaultIcon}>
            <Popup>
              <p className="font-medium">{selectedPlace.name}</p>
              <p className="text-sm text-slate-600">{selectedPlace.country}</p>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </main>
  );
}
