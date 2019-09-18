import { IMaterialType } from './material-type.interface';

export interface IMaterial {
  materialType: IMaterialType;
  materialId?: number;
  materialCode?: string;
  materialDesc?: string;
} // end class Material
