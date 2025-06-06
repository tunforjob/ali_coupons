export interface Coupon {
  id: string;
  name?: string;
  minAmount: number;
  discount: number;
  quantity: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  personalDiscount: number;
  isUsed: boolean;
}

export interface CouponGroup {
  coupon: Coupon;
  products: Product[];
  totalDiscount: number;
}

export interface OptimizationResult {
  couponId: string;
  productId: string;
  originalPrice: number;
  discountedPrice: number;
  savings: number;
} 