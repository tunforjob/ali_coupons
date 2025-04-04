import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../types';
import { sampleProducts } from '../../data/sampleData';

interface ProductsState {
  items: Product[];
}

const initialState: ProductsState = {
  items: sampleProducts,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addProduct: (state, action: PayloadAction<Product>) => {
      state.items.push(action.payload);
    },
    removeProduct: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(product => product.id !== action.payload);
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.items.findIndex(product => product.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    markProductAsUsed: (state, action: PayloadAction<string>) => {
      const product = state.items.find(p => p.id === action.payload);
      if (product) {
        product.isUsed = true;
      }
    },
  },
});

export const { addProduct, removeProduct, updateProduct, markProductAsUsed } = productsSlice.actions;
export default productsSlice.reducer; 