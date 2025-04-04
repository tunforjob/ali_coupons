import { configureStore } from '@reduxjs/toolkit';
import couponsReducer from './slices/couponsSlice';
import productsReducer from './slices/productsSlice';
import resultsReducer from './slices/resultsSlice';
import { Coupon, Product, OptimizationResult } from '../types';

export interface RootState {
  coupons: {
    items: Coupon[];
  };
  products: {
    items: Product[];
  };
  results: {
    items: OptimizationResult[];
  };
}

export const store = configureStore({
  reducer: {
    coupons: couponsReducer,
    products: productsReducer,
    results: resultsReducer,
  },
});

export type AppDispatch = typeof store.dispatch; 