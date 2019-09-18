export interface ICapacityReport {
  businessUnitCode: string;
  businessUnitDesc: string;
  businessUnitId: number;
  countryCode: string;
  customerType: string;
  loadDate: string;
  loadTime: string;
  loadsCommitted: number;
  loadsOffered: number;
  materialTypeCode: string;
  materialTypeDesc: string;
  materialTypeID: number;
  tonsOffered: number;
  tonsCommitted: number;
}
