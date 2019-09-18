/**
 * Represents a daily plant capacity item
 */
export interface IDailyPlantCapacityItem {
  materialType: string;
  offered: number;
  committed: number;
  loadsOffered: number;
  loadsCommitted: number;
} // end interface IDailyPlantCapacityItem
