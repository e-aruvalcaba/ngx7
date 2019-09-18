import { MaterialType } from './material-type';

export class Material {
  materialType: MaterialType;
  materialId: number;
  materialCode: string;
  materialDesc: string;

  /**
   *
   */
  constructor() {
    this.materialType = new MaterialType();
    this.materialCode = '';
    this.materialDesc = '';
    this.materialId = 0;
  }
} // end class Material
