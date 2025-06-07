import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LanguageState {
  current: string;
}

// Load language from localStorage if available
const loadLanguageFromStorage = (): string => {
  try {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      return savedLanguage;
    }
  } catch (error) {
    console.error('Failed to load language from localStorage:', error);
  }
  return 'ru'; // Default language
};

const initialState: LanguageState = {
  current: loadLanguageFromStorage(),
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<string>) => {
      state.current = action.payload;
      // Save to localStorage
      localStorage.setItem('language', action.payload);
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
