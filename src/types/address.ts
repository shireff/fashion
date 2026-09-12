export interface Address {
  _id: string;
  user: string;
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
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}
