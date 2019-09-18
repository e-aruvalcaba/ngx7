/**
 * Represents a capacity check unit
 */
export class CapacityCheckItem {
  bucketId: number;
  date: Date;
  hour: number;
  ampm: string;
  time: string;
  plantId: number;
  materialTypeId: number;
  customerType: string;
  tonsOffered: number;
  loadsOffered: number;
  tonsCommitted: number;
  loadsCommitted: number;
  isEditable: boolean;
  canDelete: boolean;
  isDirty = false;
} // end class CapacityCheckItem
