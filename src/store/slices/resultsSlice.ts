import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OptimizationResult } from '../../types';

interface ResultsState {
  items: OptimizationResult[];
}

const initialState: ResultsState = {
  items: [],
};

const resultsSlice = createSlice({
  name: 'results',
  initialState,
  reducers: {
    setResults: (state, action: PayloadAction<OptimizationResult[]>) => {
      state.items = action.payload;
    },
    clearResults: (state) => {
      state.items = [];
    },
  },
});

export const { setResults, clearResults } = resultsSlice.actions;
export default resultsSlice.reducer; 