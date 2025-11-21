import { formatPrice, parsePrice, validatePrice, roundToTwoDecimals } from '../helpers';

describe('Helper Functions', () => {
    describe('formatPrice', () => {
        it('should format number to 2 decimal places', () => {
            expect(formatPrice(10)).toBe('10.00');
            expect(formatPrice(10.5)).toBe('10.50');
            expect(formatPrice(10.123)).toBe('10.12');
        });
    });

    describe('parsePrice', () => {
        it('should parse valid string to number', () => {
            expect(parsePrice('10.50')).toBe(10.5);
        });

        it('should return 0 for invalid string', () => {
            expect(parsePrice('abc')).toBe(0);
        });

        it('should return 0 for negative numbers', () => {
            expect(parsePrice('-10')).toBe(0);
        });
    });

    describe('validatePrice', () => {
        it('should return true for valid positive numbers', () => {
            expect(validatePrice(10)).toBe(true);
            expect(validatePrice(0)).toBe(true);
        });

        it('should return false for negative numbers', () => {
            expect(validatePrice(-1)).toBe(false);
        });

        it('should return false for infinite numbers', () => {
            expect(validatePrice(Infinity)).toBe(false);
        });
    });

    describe('roundToTwoDecimals', () => {
        it('should round to 2 decimal places', () => {
            expect(roundToTwoDecimals(10.123)).toBe(10.12);
            expect(roundToTwoDecimals(10.126)).toBe(10.13);
        });
    });
});
