import couponsReducer, { addCoupon, removeCoupon, updateCoupon } from '../couponsSlice';
import { Coupon } from '../../../types';

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
            store[key] = value.toString();
        },
        clear: () => {
            store = {};
        },
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
});

describe('couponsSlice', () => {
    const initialState = {
        items: [],
    };

    beforeEach(() => {
        window.localStorage.clear();
    });

    it('should handle initial state', () => {
        expect(couponsReducer(undefined, { type: 'unknown' })).toEqual({
            items: expect.any(Array), // It loads from sampleData if localStorage is empty
        });
    });

    it('should handle addCoupon', () => {
        const newCoupon: Coupon = {
            id: '1',
            minAmount: 100,
            discount: 10,
            quantity: 1,
        };
        const actual = couponsReducer(initialState, addCoupon(newCoupon));
        expect(actual.items).toEqual([newCoupon]);
    });

    it('should handle removeCoupon', () => {
        const coupon: Coupon = {
            id: '1',
            minAmount: 100,
            discount: 10,
            quantity: 1,
        };
        const state = { items: [coupon] };
        const actual = couponsReducer(state, removeCoupon('1'));
        expect(actual.items).toEqual([]);
    });

    it('should handle updateCoupon', () => {
        const coupon: Coupon = {
            id: '1',
            minAmount: 100,
            discount: 10,
            quantity: 1,
        };
        const state = { items: [coupon] };
        const updatedCoupon = { ...coupon, discount: 20 };
        const actual = couponsReducer(state, updateCoupon(updatedCoupon));
        expect(actual.items[0].discount).toEqual(20);
    });
});
