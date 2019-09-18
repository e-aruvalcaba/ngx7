import { BucketDetail } from "./bucket-detail";

export class Bucket {
    bucketId: number;
    bucketTime: string;
    bucketDetail: BucketDetail;
    totalLoadsComm: number;
    totalLoadsOff: number;
    totalQtyComm: number;
    totalQtyOff: number;
} // end class Bucket