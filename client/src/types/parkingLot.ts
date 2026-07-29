export type SpaceType = "REGULAR" | "VIP" | "DISABLED";
export type LotStatus = "ACTIVE" | "INACTIVE";

export interface ParkingSpace {
  id: number;
  lotId: number;
  spaceNumber: string;
  spaceType: SpaceType;
}

export interface ParkingSpaceWithAvailability extends ParkingSpace {
  available: boolean;
}

export interface ParkingLot {
  id: number;
  ownerId: number;
  lotName: string;
  address: string;
  city: string;
  hourlyRate: number;
  totalSpaces: number;
  description: string | null;
  status: LotStatus;
  latitude: number;
  longitude: number;
}

export interface ParkingLotWithAvailability extends ParkingLot {
  availableSpaces: number;
}

export interface ParkingLotDetail extends ParkingLot {
  spaces: ParkingSpaceWithAvailability[];
}

export interface ParkingLotWithSpaces extends ParkingLot {
  spaces: ParkingSpace[];
}

export interface SpaceInput {
  spaceNumber: string;
  spaceType?: SpaceType;
}

export interface CreateLotInput {
  lotName: string;
  address: string;
  city: string;
  hourlyRate: number;
  description?: string;
  latitude: number;
  longitude: number;
  spaces: SpaceInput[];
}
