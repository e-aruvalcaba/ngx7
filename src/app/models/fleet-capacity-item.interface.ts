/**
 * Represents an fleet capacity item
 */
export class IFleetCapacityItem {
  capacityId: number;
  fleetId: number;
  fleetTypeDesc: string;
  offeredUnits: number;
  committedUnits: number;
  availableUnits: number;
} // end class CapacityItem
