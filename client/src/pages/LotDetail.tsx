import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getParkingLot } from "../api/parkingLots";
import type { ParkingLotDetail } from "../types/parkingLot";
import { ApiError } from "../api/client";

export function LotDetail() {
  const { id } = useParams<{ id: string }>();
  const [lot, setLot] = useState<ParkingLotDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    getParkingLot(Number(id))
      .then(setLot)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Failed to load lot"))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return <p className="loading-state">Loading lot...</p>;
  }
  if (error) {
    return <p className="form-error">{error}</p>;
  }
  if (!lot) {
    return <p className="empty-state">Lot not found.</p>;
  }

  return (
    <div>
      <div className="lot-detail-header">
        <h1>{lot.lotName}</h1>
        <p>
          {lot.address}, {lot.city}
        </p>
        <p>${lot.hourlyRate}/hr</p>
        {lot.description && <p>{lot.description}</p>}
      </div>

      <h2>Spaces</h2>
      {lot.spaces.length === 0 ? (
        <p className="empty-state">No spaces yet.</p>
      ) : (
        <div className="space-grid">
          {lot.spaces.map((space) => (
            <div key={space.id} className="space-card">
              <strong>{space.spaceNumber}</strong>
              <span>{space.spaceType}</span>
              <span className={`badge ${space.available ? "badge-available" : "badge-unavailable"}`}>
                {space.available ? "Available" : "Unavailable"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
