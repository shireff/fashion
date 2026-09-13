import type { Address } from "./address";
import { AddressLabel } from "@/lib/api/endpoints";

export interface CreateAddressRequest {
  label: AddressLabel;
  recipientName: string;
  recipientPhone: string;
  governorate: string;
  city: string;
  area: string;
  streetAddress: string;
  buildingNumber?: string;
  floorNumber?: string;
  apartmentNumber?: string;
  landmark?: string;
  isDefault?: boolean;
}

export interface UpdateAddressRequest {
  label?: AddressLabel;
  recipientName?: string;
  recipientPhone?: string;
  governorate?: string;
  city?: string;
  area?: string;
  streetAddress?: string;
  buildingNumber?: string;
  floorNumber?: string;
  apartmentNumber?: string;
  landmark?: string;
  isDefault?: boolean;
}

export interface AddressesResponse {
  success: boolean;
  data: {
    addresses: Address[];
  } | Address[];
}

export interface AddressResponse {
  success: boolean;
  data: Address;
}
