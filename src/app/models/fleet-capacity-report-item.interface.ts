/**
 * Represents an fleet capacity item
 */
export class IFleetCapacityReportItem {
    capacityId: number;
    fleetId: number;
    fleetTypeDesc: string;
    businessUnitDesc: string;
    offeredUnits: number;
    committedUnits: number;
    availableUnits: number;
  } // end class CapacityItem
  