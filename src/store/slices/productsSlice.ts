import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../types';
import { sampleProducts } from '../../data/sampleData';

interface ProductsState {
  items: Product[];
}

// Load products from localStorage if available
const loadProductsFromStorage = (): Product[] => {
  try {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      return JSON.parse(savedProducts);
    }
  } catch (error) {
    console.error('Failed to load products from localStorage:', error);
  }
  return sampleProducts;
};

const initialState: ProductsState = {
  items: loadProductsFromStorage(),
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addProduct: (state, action: PayloadAction<Product>) => {
      state.items.push(action.payload);
      // Save to localStorage
      localStorage.setItem('products', JSON.stringify(state.items));
    },
    removeProduct: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(product => product.id !== action.payload);
      // Save to localStorage
      localStorage.setItem('products', JSON.stringify(state.items));
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.items.findIndex(product => product.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
        // Save to localStorage
        localStorage.setItem('products', JSON.stringify(state.items));
      }
    },
    markProductAsUsed: (state, action: PayloadAction<string>) => {
      const product = state.items.find(p => p.id === action.payload);
      if (product) {
        product.isUsed = true;
        // Save to localStorage
        localStorage.setItem('products', JSON.stringify(state.items));
      }
    },
  },
});

export const { addProduct, removeProduct, updateProduct, markProductAsUsed } = productsSlice.actions;
export default productsSlice.reducer; 