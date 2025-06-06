import { Coupon, Product, OptimizationResult } from '../types';

interface KnapsackItem {
  products: Product[];
  totalValue: number;
  savings: number;
}

interface Solution {
  results: OptimizationResult[];
  totalSavings: number;
}

interface TestCase {
  name: string;
  products: Product[];
  coupons: Coupon[];
  expectedTotalSavings: number;
  expectedUsedProducts: number;
  expectedUsedCoupons: number;
}

// Test cases
export const testCases: TestCase[] = [
  {
    name: "Single product with single coupon",
    products: [
      { id: "1", name: "Product 1", price: 100, personalDiscount: 0, isUsed: false }
    ],
    coupons: [
      { id: "1", minAmount: 90, discount: 10, quantity: 1 }
    ],
    expectedTotalSavings: 10,
    expectedUsedProducts: 1,
    expectedUsedCoupons: 1
  },
  {
    name: "Two products split discount",
    products: [
      { id: "1", name: "Product 1", price: 8, personalDiscount: 0, isUsed: false },
      { id: "2", name: "Product 2", price: 6, personalDiscount: 0, isUsed: false }
    ],
    coupons: [
      { id: "1", minAmount: 14, discount: 4, quantity: 1 }
    ],
    expectedTotalSavings: 4,
    expectedUsedProducts: 2,
    expectedUsedCoupons: 1
  },
  {
    name: "Multiple products with multiple coupons",
    products: [
      { id: "1", name: "Product 1", price: 100, personalDiscount: 0, isUsed: false },
      { id: "2", name: "Product 2", price: 50, personalDiscount: 0, isUsed: false },
      { id: "3", name: "Product 3", price: 30, personalDiscount: 0, isUsed: false },
      { id: "4", name: "Product 4", price: 20, personalDiscount: 0, isUsed: false }
    ],
    coupons: [
      { id: "1", minAmount: 90, discount: 20, quantity: 1 },
      { id: "2", minAmount: 40, discount: 10, quantity: 1 }
    ],
    expectedTotalSavings: 30,
    expectedUsedProducts: 3,
    expectedUsedCoupons: 2
  },
  {
    name: "Products below minimum amount",
    products: [
      { id: "1", name: "Product 1", price: 40, personalDiscount: 0, isUsed: false },
      { id: "2", name: "Product 2", price: 30, personalDiscount: 0, isUsed: false }
    ],
    coupons: [
      { id: "1", minAmount: 100, discount: 20, quantity: 1 }
    ],
    expectedTotalSavings: 0,
    expectedUsedProducts: 0,
    expectedUsedCoupons: 0
  },
  {
    name: "Maximize total savings",
    products: [
      { id: "1", name: "Product 1", price: 100, personalDiscount: 0, isUsed: false },
      { id: "2", name: "Product 2", price: 80, personalDiscount: 0, isUsed: false },
      { id: "3", name: "Product 3", price: 60, personalDiscount: 0, isUsed: false }
    ],
    coupons: [
      { id: "1", minAmount: 150, discount: 30, quantity: 1 },  // Could be used for products 1+2 (180)
      { id: "2", minAmount: 90, discount: 25, quantity: 1 }    // Or product 1 alone (100) + products 2+3 (140)
    ],
    expectedTotalSavings: 55,  // 25 + 30 = 55 (better than single 30)
    expectedUsedProducts: 3,
    expectedUsedCoupons: 2
  }
];

// Test runner
export const runTests = () => {
  console.log("Running optimization tests...\n");
  let passedTests = 0;
  
  testCases.forEach(testCase => {
    console.log(`Test: ${testCase.name}`);
    console.log("Input:");
    console.log("- Products:", testCase.products);
    console.log("- Coupons:", testCase.coupons);
    
    const results = optimizeCoupons(testCase.coupons, testCase.products);
    
    const totalSavings = results.reduce((sum, r) => sum + r.savings, 0);
    const usedProducts = new Set(results.map(r => r.productId)).size;
    const usedCoupons = new Set(results.map(r => r.couponId)).size;
    
    const passed = 
      Math.abs(totalSavings - testCase.expectedTotalSavings) < 0.01 &&
      usedProducts === testCase.expectedUsedProducts &&
      usedCoupons === testCase.expectedUsedCoupons;
    
    console.log("\nResults:");
    console.log("- Total savings:", totalSavings);
    console.log("- Used products:", usedProducts);
    console.log("- Used coupons:", usedCoupons);
    console.log("- Detailed results:", results);
    console.log("\nExpected:");
    console.log("- Total savings:", testCase.expectedTotalSavings);
    console.log("- Used products:", testCase.expectedUsedProducts);
    console.log("- Used coupons:", testCase.expectedUsedCoupons);
    console.log("\nTest", passed ? "PASSED" : "FAILED");
    console.log("-".repeat(50), "\n");
    
    if (passed) passedTests++;
  });
  
  console.log(`Tests completed: ${passedTests}/${testCases.length} passed`);
  return passedTests === testCases.length;
};

// Helper function to get adjusted price (price minus personal discount)
const getAdjustedPrice = (product: Product): number => {
  return Math.max(0, product.price - (product.personalDiscount || 0));
};

const findBestCombination = (products: Product[], minAmount: number, discount: number): KnapsackItem | null => {
  // Try all possible combinations
  let bestCombination: Product[] | null = null;
  let bestValue = Infinity;
  let maxSavings = 0;

  const findCombinations = (index: number, currentProducts: Product[], currentSum: number) => {
    // If we found a valid combination
    if (currentSum >= minAmount) {
      // Calculate potential savings for this combination
      const potentialSavings = discount;
      if (potentialSavings > maxSavings || (potentialSavings === maxSavings && currentSum < bestValue)) {
        bestCombination = [...currentProducts];
        bestValue = currentSum;
        maxSavings = potentialSavings;
      }
      return;
    }

    // Try adding more products
    for (let i = index; i < products.length; i++) {
      const adjustedPrice = getAdjustedPrice(products[i]);
      currentProducts.push(products[i]);
      findCombinations(i + 1, currentProducts, currentSum + adjustedPrice);
      currentProducts.pop();
    }
  };

  findCombinations(0, [], 0);

  if (!bestCombination) return null;

  return {
    products: bestCombination,
    totalValue: bestValue,
    savings: discount
  };
};

const findOptimalSolution = (coupons: Coupon[], products: Product[], usedProducts: Set<string> = new Set()): Solution => {
  let bestSolution: Solution = {
    results: [],
    totalSavings: 0
  };

  // Base case: no more coupons or products
  if (coupons.length === 0 || products.length === 0) {
    return bestSolution;
  }

  // Try each coupon as the next one to use
  for (let i = 0; i < coupons.length; i++) {
    const coupon = coupons[i];
    const availableProducts = products.filter(p => !usedProducts.has(p.id));
    
    // Find best combination for this coupon
    const combination = findBestCombination(
      availableProducts,
      coupon.minAmount,
      coupon.discount
    );
    
    if (combination) {
      const currentUsedProducts = new Set(usedProducts);
      const currentResults: OptimizationResult[] = [];
      
      // Calculate proportional discounts
      const { products: selectedProducts, totalValue, savings } = combination;
      
      // Add results for each product
      selectedProducts.forEach(product => {
        const adjustedPrice = getAdjustedPrice(product);
        const proportionalDiscount = (adjustedPrice / totalValue) * savings;
        
        currentResults.push({
          couponId: coupon.id,
          productId: product.id,
          originalPrice: product.price,
          discountedPrice: adjustedPrice - proportionalDiscount,
          savings: proportionalDiscount
        });
        
        currentUsedProducts.add(product.id);
      });
      
      // Recursively find best solution for remaining coupons and products
      const remainingCoupons = [...coupons.slice(0, i), ...coupons.slice(i + 1)];
      const nextSolution = findOptimalSolution(remainingCoupons, products, currentUsedProducts);
      
      const totalSavings = currentResults.reduce((sum, r) => sum + r.savings, 0) + nextSolution.totalSavings;
      
      // Update best solution if current is better
      if (totalSavings > bestSolution.totalSavings) {
        bestSolution = {
          results: [...currentResults, ...nextSolution.results],
          totalSavings
        };
      }
    }
  }

  // Also try skipping all coupons (in case not using some coupons leads to better total savings)
  return bestSolution;
};

export const optimizeCoupons = (coupons: Coupon[], products: Product[]): OptimizationResult[] => {
  const solution = findOptimalSolution(coupons, products);
  return solution.results;
}; 