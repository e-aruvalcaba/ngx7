//  Import references
import { Bucket } from "./bucket";
import { IMaterial } from "./material.interface";
import { ICustomer } from "./customer.interface";
/**
 * Represents an capacity item
 */
export class CapacityItem {
    buckets: Bucket[];
    capacityId: number;
    capacityItemDate: string;
    material: IMaterial;
    customer: ICustomer;
} // end class CapacityItem
