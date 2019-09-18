/**
 * Represents an fleet capacity item
 */
export class FleetCapacityItem {
  capacityId: number;
  fleetId: number;
  fleetTypeDesc: string;
  offeredUnits: number;
  committedUnits: number;
  availableUnits: number;
  isDirty: boolean;
  canDelete: boolean;
} // end class CapacityItem
