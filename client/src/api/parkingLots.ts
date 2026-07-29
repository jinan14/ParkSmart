import { apiFetch } from "./client";
import type {
  CreateLotInput,
  ParkingLotDetail,
  ParkingLotWithAvailability,
  ParkingLotWithSpaces,
  ParkingSpace,
  SpaceInput,
} from "../types/parkingLot";

export function listParkingLots(): Promise<ParkingLotWithAvailability[]> {
  return apiFetch<ParkingLotWithAvailability[]>("/parking-lots");
}

export function getParkingLot(id: number): Promise<ParkingLotDetail> {
  return apiFetch<ParkingLotDetail>(`/parking-lots/${id}`);
}

export function listMyLots(token: string): Promise<ParkingLotWithSpaces[]> {
  return apiFetch<ParkingLotWithSpaces[]>("/parking-lots/owned/mine", { method: "GET" }, token);
}

export function createParkingLot(
  input: CreateLotInput,
  token: string,
): Promise<ParkingLotWithSpaces> {
  return apiFetch<ParkingLotWithSpaces>(
    "/parking-lots",
    { method: "POST", body: JSON.stringify(input) },
    token,
  );
}

export function addSpace(
  lotId: number,
  input: SpaceInput,
  token: string,
): Promise<ParkingSpace> {
  return apiFetch<ParkingSpace>(
    `/parking-lots/${lotId}/spaces`,
    { method: "POST", body: JSON.stringify(input) },
    token,
  );
}

export function updateSpace(
  id: number,
  input: SpaceInput,
  token: string,
): Promise<ParkingSpace> {
  return apiFetch<ParkingSpace>(
    `/parking-spaces/${id}`,
    { method: "PUT", body: JSON.stringify(input) },
    token,
  );
}

export function deleteSpace(id: number, token: string): Promise<void> {
  return apiFetch<void>(`/parking-spaces/${id}`, { method: "DELETE" }, token);
}
