import productsReducer, { addProduct, removeProduct, updateProduct, markProductAsUsed } from '../productsSlice';
import { Product } from '../../../types';

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

describe('productsSlice', () => {
    const initialState = {
        items: [],
    };

    beforeEach(() => {
        window.localStorage.clear();
    });

    it('should handle initial state', () => {
        expect(productsReducer(undefined, { type: 'unknown' })).toEqual({
            items: expect.any(Array),
        });
    });

    it('should handle addProduct', () => {
        const newProduct: Product = {
            id: '1',
            name: 'Product 1',
            price: 100,
            personalDiscount: 0,
            isUsed: false,
        };
        const actual = productsReducer(initialState, addProduct(newProduct));
        expect(actual.items).toEqual([newProduct]);
    });

    it('should handle removeProduct', () => {
        const product: Product = {
            id: '1',
            name: 'Product 1',
            price: 100,
            personalDiscount: 0,
            isUsed: false,
        };
        const state = { items: [product] };
        const actual = productsReducer(state, removeProduct('1'));
        expect(actual.items).toEqual([]);
    });

    it('should handle updateProduct', () => {
        const product: Product = {
            id: '1',
            name: 'Product 1',
            price: 100,
            personalDiscount: 0,
            isUsed: false,
        };
        const state = { items: [product] };
        const updatedProduct = { ...product, price: 200 };
        const actual = productsReducer(state, updateProduct(updatedProduct));
        expect(actual.items[0].price).toEqual(200);
    });

    it('should handle markProductAsUsed', () => {
        const product: Product = {
            id: '1',
            name: 'Product 1',
            price: 100,
            personalDiscount: 0,
            isUsed: false,
        };
        const state = { items: [product] };
        const actual = productsReducer(state, markProductAsUsed('1'));
        expect(actual.items[0].isUsed).toBe(true);
    });
});
