import { IDailyPlantCapacityItem } from './daily-plant-capacity-item.interface';
import { IHourlySeriesItem } from './hourly-series-item.interface';

/**
 * Represents an capacity inquiry item
 */
export interface ICapacityInquiryItem {
  customerType: string;
  dailyData: IDailyPlantCapacityItem[];
  hourlyData: IHourlySeriesItem[];
  tonsOffered: number;
  loadsOffered: number;
  tonsCommitted: number;
  loadsCommitted: number;
} // end interface ICapacityInquiryItem
