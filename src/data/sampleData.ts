import { Coupon, Product } from '../types';

export const sampleCoupons: Coupon[] = [
  {
    id: '1',
    name: 'Купон 100/10',
    minAmount: 100,
    discount: 10,
    quantity: 2,
  },
  {
    id: '2',
    name: 'Купон 200/20',
    minAmount: 200,
    discount: 20,
    quantity: 1,
  },
  {
    id: '3',
    name: 'Купон 500/50',
    minAmount: 500,
    discount: 50,
    quantity: 1,
  },
];

export const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Товар 1',
    price: 150,
    personalDiscount: 0,
    isUsed: false,
  },
  {
    id: '2',
    name: 'Товар 2',
    price: 250,
    personalDiscount: 5.50,
    isUsed: false,
  },
  {
    id: '3',
    name: 'Товар 3',
    price: 350,
    personalDiscount: 0,
    isUsed: false,
  },
  {
    id: '4',
    name: 'Товар 4',
    price: 450,
    personalDiscount: 10,
    isUsed: false,
  },
]; 