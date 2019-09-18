export interface IBucket {
  bucketId: number;
  plantId: number;
  productTypeId: number;
  commercialManagementCode:	string;
  bucketDateTime:	Date;
  totalQuantityOffer: number;
  totalLoadOffer: number;
  totalQuantityCommitted: number;
  totalLoadCommitted: number;
  bucketDetail: IBucketDetail[];
}

export interface IBucketDetail {
  bucketDetailId: number;
  shippingConditionId: number;
  quantityOffer: number;
  loadsOffer: number;
  quantityCommitted: number;
  loadCommitted: number;
} // end interface IBucketDetail

export interface IUpdateBucket{
  bucketId: number;
  productTypeId: number;
  commercialManagementCode: string;
  bucketDateTime: string;
  totalQuantityOffer: number;
  totalLoadOffer: number;
}

export interface IUpdateBucketDetail {
  bucketId: number;
  bucketDetailId: number;
  shippingConditionId: number;
  quantityOffer: number;
  loadOffer: number;
}

export interface IClone{
  dateTimeFrom: string;
  dateTimeTo: string;
  materialTypeId:	number;
  customerId: number;
  commercialManagementCode: string;
}
