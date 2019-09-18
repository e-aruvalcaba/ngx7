import { ICommercialManagement } from './commercial-management.interface';

export interface ICustomer {
  customerId?: number;
  customerCode?: string;
  customerDesc?: string;
  commercialManagement?: ICommercialManagement;
}
