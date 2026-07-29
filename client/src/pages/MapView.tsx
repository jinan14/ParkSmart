import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";
import { listParkingLots } from "../api/parkingLots";
import type { ParkingLotWithAvailability } from "../types/parkingLot";
import { ApiError } from "../api/client";

const defaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const BEIRUT_CENTER: [number, number] = [33.8938, 35.5018];

export function MapView() {
  const [lots, setLots] = useState<ParkingLotWithAvailability[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listParkingLots()
      .then(setLots)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Failed to load lots"))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <p className="loading-state">Loading parking lots...</p>;
  }
  if (error) {
    return <p className="form-error">{error}</p>;
  }

  return (
    <div className="map-page">
      <MapContainer center={BEIRUT_CENTER} zoom={13} scrollWheelZoom>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {lots.map((lot) => (
          <Marker key={lot.id} position={[lot.latitude, lot.longitude]} icon={defaultIcon}>
            <Popup>
              <strong>{lot.lotName}</strong>
              <br />
              {lot.availableSpaces} / {lot.totalSpaces} spaces available
              <br />
              <Link to={`/lots/${lot.id}`}>View details</Link>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div className="lot-list">
        {lots.length === 0 ? (
          <p className="empty-state">No parking lots yet.</p>
        ) : (
          lots.map((lot) => (
            <Link key={lot.id} to={`/lots/${lot.id}`} className="lot-card">
              <h3>{lot.lotName}</h3>
              <p>
                {lot.address}, {lot.city}
              </p>
              <p>
                {lot.availableSpaces} / {lot.totalSpaces} available · ${lot.hourlyRate}/hr
              </p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
