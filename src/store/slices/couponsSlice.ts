import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Coupon } from '../../types';
import { sampleCoupons } from '../../data/sampleData';

interface CouponsState {
  items: Coupon[];
}

// Load coupons from localStorage if available
const loadCouponsFromStorage = (): Coupon[] => {
  try {
    const savedCoupons = localStorage.getItem('coupons');
    if (savedCoupons) {
      return JSON.parse(savedCoupons);
    }
  } catch (error) {
    console.error('Failed to load coupons from localStorage:', error);
  }
  return sampleCoupons;
};

const initialState: CouponsState = {
  items: loadCouponsFromStorage(),
};

const couponsSlice = createSlice({
  name: 'coupons',
  initialState,
  reducers: {
    addCoupon: (state, action: PayloadAction<Coupon>) => {
      state.items.push(action.payload);
      // Save to localStorage
      localStorage.setItem('coupons', JSON.stringify(state.items));
    },
    removeCoupon: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(coupon => coupon.id !== action.payload);
      // Save to localStorage
      localStorage.setItem('coupons', JSON.stringify(state.items));
    },
    updateCoupon: (state, action: PayloadAction<Coupon>) => {
      const index = state.items.findIndex(coupon => coupon.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
        // Save to localStorage
        localStorage.setItem('coupons', JSON.stringify(state.items));
      }
    },
  },
});

export const { addCoupon, removeCoupon, updateCoupon } = couponsSlice.actions;
export default couponsSlice.reducer; 