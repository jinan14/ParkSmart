import { useEffect, useState, type FormEvent } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { addSpace, deleteSpace, getParkingLot, updateSpace } from "../api/parkingLots";
import type { ParkingLotDetail, SpaceType } from "../types/parkingLot";
import { ApiError } from "../api/client";

const SPACE_TYPES: SpaceType[] = ["REGULAR", "VIP", "DISABLED"];

export function OwnerLotSpaces() {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const lotId = Number(id);

  const [lot, setLot] = useState<ParkingLotDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newSpaceNumber, setNewSpaceNumber] = useState("");
  const [newSpaceType, setNewSpaceType] = useState<SpaceType>("REGULAR");
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editNumber, setEditNumber] = useState("");
  const [editType, setEditType] = useState<SpaceType>("REGULAR");

  function refresh() {
    if (!lotId) return;
    setIsLoading(true);
    getParkingLot(lotId)
      .then(setLot)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Failed to load lot"))
      .finally(() => setIsLoading(false));
  }

  useEffect(refresh, [lotId]);

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    setFormError(null);
    if (!newSpaceNumber.trim()) {
      setFormError("Space number is required.");
      return;
    }
    setIsSubmitting(true);
    try {
      await addSpace(lotId, { spaceNumber: newSpaceNumber, spaceType: newSpaceType }, token);
      setNewSpaceNumber("");
      setNewSpaceType("REGULAR");
      refresh();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Failed to add space");
    } finally {
      setIsSubmitting(false);
    }
  }

  function startEdit(spaceId: number, spaceNumber: string, spaceType: SpaceType) {
    setEditingId(spaceId);
    setEditNumber(spaceNumber);
    setEditType(spaceType);
  }

  async function saveEdit(spaceId: number) {
    if (!token) return;
    try {
      await updateSpace(spaceId, { spaceNumber: editNumber, spaceType: editType }, token);
      setEditingId(null);
      refresh();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Failed to update space");
    }
  }

  async function handleDelete(spaceId: number) {
    if (!token) return;
    try {
      await deleteSpace(spaceId, token);
      refresh();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Failed to delete space");
    }
  }

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
    <div className="owner-lot-spaces-page">
      <div>
        <Link to="/owner/lots">&larr; Back to My Lots</Link>
        <h1>{lot.lotName} — Spaces</h1>
      </div>

      {lot.spaces.length === 0 ? (
        <p className="empty-state">No spaces yet.</p>
      ) : (
        <div className="space-manage-list">
          {lot.spaces.map((space) =>
            editingId === space.id ? (
              <div key={space.id} className="space-manage-row">
                <input value={editNumber} onChange={(e) => setEditNumber(e.target.value)} />
                <select value={editType} onChange={(e) => setEditType(e.target.value as SpaceType)}>
                  {SPACE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <button type="button" onClick={() => saveEdit(space.id)}>
                  Save
                </button>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setEditingId(null)}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div key={space.id} className="space-manage-row">
                <div className="space-info">
                  <strong>{space.spaceNumber}</strong> — {space.spaceType}
                </div>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => startEdit(space.id, space.spaceNumber, space.spaceType)}
                >
                  Edit
                </button>
                <button type="button" className="icon-button" onClick={() => handleDelete(space.id)}>
                  Delete
                </button>
              </div>
            ),
          )}
        </div>
      )}

      <div>
        <h2>Add Space</h2>
        <form className="card-form" onSubmit={handleAdd}>
          <label>
            Space number
            <input value={newSpaceNumber} onChange={(e) => setNewSpaceNumber(e.target.value)} />
          </label>
          <label>
            Space type
            <select
              value={newSpaceType}
              onChange={(e) => setNewSpaceType(e.target.value as SpaceType)}
            >
              {SPACE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>
          {formError && <p className="form-error">{formError}</p>}
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add space"}
          </button>
        </form>
      </div>
    </div>
  );
}
