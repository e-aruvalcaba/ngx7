// import { ProductType } from './product-type';

export class ICountrySettings {
  countryCode: string;
  counterOfferNumber: number;
  counterOfferHorizon: number;
  commercialManagement: boolean;
  multiOfferQuantity: number;
  multiOfferHorizon: number;
  enableFleet: false;
  fleet: Fleet;

  productTypes: ProductType[];
  shippingTypes: ShippingType[];
  shippingConditions: ShippingCondition[];
  reservationTimes: ReservationTime[];
  compensationTimes: CompensationTime[];
  reactionTimes: ReactionTime[];
  loadingTimes: LoadingTime[];
  deliveryTimeCommitments: DeliveryTimeCommitment[];
  appointmentTimeCommitments: AppointmentTimeCommitment[];
  calendar: Calendar;

  constructor() {

  }
}

export class Fleet {
  enableCoverage: boolean;
}

export class ShippingType {
  shippingTypeId: number;
  shippingTypeCode: string;
  shippingTypeDesc: string;
  selected: boolean = true;
}

export class ShippingCondition {
  shippingConditionId: number;
  shippingConditionCode: string;
  shippingConditionDesc: string;
  selected: boolean = true;
}

export class ReservationTime {
  applicationClient: ApplicationClient;
  reservationTime: number;
}

export class CompensationTime {
  shippingTypeId: number;
  geolocationService: GeolocationService;
  calculationTypeId: number;
  compensationTime: number;
}

export class ReactionTime {
  shippingConditionId: number;
  productTypeId: number;
  reactionTime: number;
}

export class LoadingTime {
  shippingTypeId: number;
  productTypeId: number;
  loadingTime: number;
}

export class DeliveryTimeCommitment {
  shippingConditionId: number;
  productTypeId: number;
  deliveryTimeCommitmentType: DeliveryTimeCommitmentType;
  windows: IWindow[];
  dynamicWindowHorizon: number;
}

export class DeliveryTimeCommitmentType {
  deliveryTimeCommitmentTypeId: number;
  deliveryTimeCommitmentTypeCode: string;
}

export class IWindow {
  windowNumber: number;
  startAt: string;
  endAt: string;
  duration: number;
}

export class AppointmentTimeCommitment {
  shippingConditionId: number;
  productTypeId: number;
  deliveryTimeCommitmentType: DeliveryTimeCommitmentType;
}

export class Calendar {
  workingDays: number;
  nonWorkingDays: string[];
}

// ---------- Catalogs  -------------------------------

export interface IApplicationClients {
  applicationClients: ApplicationClient[]
}

export class ApplicationClient {
  applicationClientId: number;
  applicationClientCode: string;
  applicationClientDesc: string;
  reservationTime: number;
}

export interface IDeliveryWindows {
  deliveryWindows: DeliveryWindow[]
}

export class DeliveryWindow {
  deliveryWindowId: number;
  deliveryWindowCode: string;
  deliveryWindowDesc: string;
}

export interface IGeolocationServices {
  geolocationServices: GeolocationService[]
}

export class GeolocationService {
  geolocationServiceId: number;
  geolocationServiceCode: string;
  geolocationServiceDesc: string;
  calculationTypeId: number;
  compensationTime: number;
}

export interface IDigitalConfirmationProcesses {
  digitalConfirmationProcesses: DigitalConfirmationProcess[];
}

export class DigitalConfirmationProcess {
  digitalConfirmationProcessId: string;
  digitalConfirmationProcessCode: string;
  digitalConfirmationProcessDesc: string;
}

export interface IProductTypes {
  productTypes: ProductType[];
}

export interface IShippingTypes {
  shippingTypes: ShippingType[];
}

export interface IShippingConditions {
  shippingConditions: ShippingCondition[];
}

export interface IMaterialTypes {
  materialTypes: MaterialType[];
}

export class MaterialType {
  materialTypeId: number;
  materialTypeCode: string;
  materialTypeDesc: string;
  selected: boolean = false;
}

export class ProductType {
  productTypeId: number;
  productTypeCode: string;
  productTypeDesc: string;
  selected: boolean = true;
} // end class ProductType
