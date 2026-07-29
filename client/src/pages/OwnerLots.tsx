import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createParkingLot, listMyLots } from "../api/parkingLots";
import type { ParkingLotWithSpaces, SpaceInput, SpaceType } from "../types/parkingLot";
import { ApiError } from "../api/client";

const SPACE_TYPES: SpaceType[] = ["REGULAR", "VIP", "DISABLED"];

function emptySpace(): SpaceInput {
  return { spaceNumber: "", spaceType: "REGULAR" };
}

export function OwnerLots() {
  const { token } = useAuth();
  const [lots, setLots] = useState<ParkingLotWithSpaces[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [lotName, setLotName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [spaces, setSpaces] = useState<SpaceInput[]>([emptySpace(), emptySpace(), emptySpace()]);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function refresh() {
    if (!token) return;
    setIsLoading(true);
    listMyLots(token)
      .then(setLots)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Failed to load lots"))
      .finally(() => setIsLoading(false));
  }

  useEffect(refresh, [token]);

  function updateSpaceRow(index: number, patch: Partial<SpaceInput>) {
    setSpaces((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  }

  function addSpaceRow() {
    setSpaces((prev) => [...prev, emptySpace()]);
  }

  function removeSpaceRow(index: number) {
    setSpaces((prev) => prev.filter((_, i) => i !== index));
  }

  function resetForm() {
    setLotName("");
    setAddress("");
    setCity("");
    setHourlyRate("");
    setDescription("");
    setLatitude("");
    setLongitude("");
    setSpaces([emptySpace(), emptySpace(), emptySpace()]);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    setFormError(null);

    const cleanedSpaces = spaces.filter((s) => s.spaceNumber.trim().length > 0);
    if (cleanedSpaces.length === 0) {
      setFormError("Add at least one space.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createParkingLot(
        {
          lotName,
          address,
          city,
          hourlyRate: Number(hourlyRate),
          description: description || undefined,
          latitude: Number(latitude),
          longitude: Number(longitude),
          spaces: cleanedSpaces,
        },
        token,
      );
      resetForm();
      refresh();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Failed to create lot");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="owner-lots-page">
      <div>
        <h1>My Lots</h1>
        {isLoading ? (
          <p className="loading-state">Loading lots...</p>
        ) : error ? (
          <p className="form-error">{error}</p>
        ) : lots.length === 0 ? (
          <p className="empty-state">No lots yet. Add one below.</p>
        ) : (
          <div className="lot-list-simple">
            {lots.map((lot) => (
              <div key={lot.id} className="owner-lot-row">
                <div>
                  <h3>{lot.lotName}</h3>
                  <p>
                    {lot.address}, {lot.city} · {lot.totalSpaces} spaces · ${lot.hourlyRate}/hr
                  </p>
                </div>
                <Link to={`/owner/lots/${lot.id}/spaces`}>Manage spaces</Link>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2>Add Lot</h2>
        <form className="card-form" onSubmit={handleSubmit}>
          <label>
            Lot name
            <input value={lotName} onChange={(e) => setLotName(e.target.value)} required />
          </label>
          <label>
            Address
            <input value={address} onChange={(e) => setAddress(e.target.value)} required />
          </label>
          <div className="form-row">
            <label>
              City
              <input value={city} onChange={(e) => setCity(e.target.value)} required />
            </label>
            <label>
              Hourly rate
              <input
                type="number"
                step="0.01"
                min="0"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                required
              />
            </label>
          </div>
          <div className="form-row">
            <label>
              Latitude
              <input
                type="number"
                step="any"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                required
              />
            </label>
            <label>
              Longitude
              <input
                type="number"
                step="any"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                required
              />
            </label>
          </div>
          <label>
            Description (optional)
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
          </label>

          <div>
            <label>Initial spaces</label>
            {spaces.map((space, index) => (
              <div key={index} className="space-builder-row">
                <input
                  placeholder="Space number"
                  value={space.spaceNumber}
                  onChange={(e) => updateSpaceRow(index, { spaceNumber: e.target.value })}
                />
                <select
                  value={space.spaceType}
                  onChange={(e) =>
                    updateSpaceRow(index, { spaceType: e.target.value as SpaceType })
                  }
                >
                  {SPACE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="icon-button"
                  onClick={() => removeSpaceRow(index)}
                  disabled={spaces.length <= 1}
                >
                  Remove
                </button>
              </div>
            ))}
            <button type="button" className="secondary-button" onClick={addSpaceRow}>
              Add another space
            </button>
          </div>

          {formError && <p className="form-error">{formError}</p>}
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create lot"}
          </button>
        </form>
      </div>
    </div>
  );
}
