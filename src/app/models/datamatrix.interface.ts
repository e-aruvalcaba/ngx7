export interface IMatrixValue {
  title: string;
  value: any;
  indicatorLevel: any;
}

export interface IMatrixColumn {
  title: string;
  text: string;
  values: IMatrixValue[];
}

export interface IMatrixRow {
  title: string;
  text: string;
  alternate: boolean;
  columns: IMatrixColumn[];
}
