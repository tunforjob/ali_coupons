import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Coupon } from '../../types';
import { sampleCoupons } from '../../data/sampleData';

interface CouponsState {
  items: Coupon[];
}

const initialState: CouponsState = {
  items: sampleCoupons,
};

const couponsSlice = createSlice({
  name: 'coupons',
  initialState,
  reducers: {
    addCoupon: (state, action: PayloadAction<Coupon>) => {
      state.items.push(action.payload);
    },
    removeCoupon: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(coupon => coupon.id !== action.payload);
    },
    updateCoupon: (state, action: PayloadAction<Coupon>) => {
      const index = state.items.findIndex(coupon => coupon.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
  },
});

export const { addCoupon, removeCoupon, updateCoupon } = couponsSlice.actions;
export default couponsSlice.reducer; 