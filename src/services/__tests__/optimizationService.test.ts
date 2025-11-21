import { optimizeCoupons, testCases } from '../optimizationService';
import { Coupon, Product } from '../../types';

describe('Optimization Service', () => {
    // Run the embedded test cases
    testCases.forEach(testCase => {
        it(testCase.name, () => {
            const results = optimizeCoupons(testCase.coupons, testCase.products);

            const totalSavings = results.reduce((sum, r) => sum + r.savings, 0);
            const usedProducts = new Set(results.map(r => r.productId)).size;
            const usedCoupons = new Set(results.map(r => r.couponId)).size;

            expect(totalSavings).toBeCloseTo(testCase.expectedTotalSavings, 2);
            expect(usedProducts).toBe(testCase.expectedUsedProducts);
            expect(usedCoupons).toBe(testCase.expectedUsedCoupons);
        });
    });

    // Additional edge cases
    it('should handle empty inputs', () => {
        const results = optimizeCoupons([], []);
        expect(results).toEqual([]);
    });

    it('should handle no coupons', () => {
        const products: Product[] = [{ id: '1', name: 'P1', price: 100, personalDiscount: 0, isUsed: false }];
        const results = optimizeCoupons([], products);
        expect(results).toEqual([]);
    });

    it('should handle no products', () => {
        const coupons: Coupon[] = [{ id: '1', minAmount: 10, discount: 1, quantity: 1 }];
        const results = optimizeCoupons(coupons, []);
        expect(results).toEqual([]);
    });
});
