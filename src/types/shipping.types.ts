export interface ShippingZone {
  _id: string;
  governorate: string;
  cities: Array<{
    name: string;
    areas: string[];
    shippingFee: number;
  }>;
  isActive: boolean;
}

export interface ShippingCalculationRequest {
  governorate: string;
  city: string;
  cartTotal: number;
}

export interface ShippingCalculationResponse {
  success: boolean;
  data: {
    shippingFee: number;
    estimatedDays: number;
    total: number;
  };
}

export interface ShippingZonesResponse {
  success: boolean;
  data: ShippingZone[];
}
