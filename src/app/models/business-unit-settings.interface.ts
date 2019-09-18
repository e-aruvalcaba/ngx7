import { ShippingType, ShippingCondition, CompensationTime, ReactionTime, LoadingTime, Calendar, ProductType } from './country-settings.interface';
import { Plant } from './plant';

export class IBusinessUnitSettings {
  plantCode: string;
  commercialManagement: boolean;

  productTypes: ProductType[];
  shippingTypes: ShippingType[];
  shippingConditions: ShippingCondition[];
  compensationTimes: CompensationTime[];
  reactionTimes: ReactionTime[];
  loadingTimes: LoadingTime[];
  calendar: Calendar;

  constructor() {

  }
}

export class ConfiguredPlants {
  plants: Plant[];
}