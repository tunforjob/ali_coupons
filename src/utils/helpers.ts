import { v4 as uuidv4 } from 'uuid';

export const generateId = (): string => uuidv4();

export const formatPrice = (price: number): string => {
  return price.toFixed(2);
};

export const parsePrice = (price: string): number => {
  const parsed = parseFloat(price);
  return isNaN(parsed) ? 0 : Math.max(0, parsed);
};

export const validatePrice = (price: number): boolean => {
  return price >= 0 && Number.isFinite(price);
};

export const roundToTwoDecimals = (price: number): number => {
  return Math.round(price * 100) / 100;
}; 