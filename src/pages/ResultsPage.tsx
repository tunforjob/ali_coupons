import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Table, Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { RootState } from '../store';
import { OptimizationResult } from '../types';
import { optimizeCoupons } from '../services/optimizationService';
import { setResults } from '../store/slices/resultsSlice';

const ResultsPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const results = useSelector((state: RootState) => state.results.items) || [];
  const coupons = useSelector((state: RootState) => state.coupons.items) || [];
  const products = useSelector((state: RootState) => state.products.items) || [];
  const [isFlashing, setIsFlashing] = useState(false);
  
  useEffect(() => {
    const optimizedResults = optimizeCoupons(coupons, products);
    dispatch(setResults(optimizedResults));
    setIsFlashing(true);
    const timer = setTimeout(() => setIsFlashing(false), 500);
    return () => clearTimeout(timer);
  }, [coupons, products, dispatch]);

  // Group results by coupon
  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.couponId]) {
      acc[result.couponId] = [];
    }
    acc[result.couponId].push(result);
    return acc;
  }, {} as Record<string, OptimizationResult[]>);

  // Get unused products
  const usedProductIds = new Set(results.map(r => r.productId));
  const unusedProducts = products.filter(p => !usedProductIds.has(p.id));

  const getCouponInfo = (couponId: string) => {
    const coupon = coupons.find(c => c.id === couponId);
    return coupon ? `${coupon.minAmount}/${coupon.discount}` : couponId;
  };

  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : productId;
  };
  
  // Helper function to get the product by ID
  const getProductById = (productId: string) => {
    return products.find(p => p.id === productId);
  };

  const calculateGroupTotal = (groupResults: OptimizationResult[]) => {
    return groupResults.reduce((sum, result) => sum + result.originalPrice, 0);
  };
  
  // Calculate the total personal discount for a group of results
  const calculateGroupPersonalDiscount = (groupResults: OptimizationResult[]) => {
    return groupResults.reduce((sum, result) => {
      const product = getProductById(result.productId);
      return sum + (product?.personalDiscount || 0);
    }, 0);
  };

  const calculateGroupSavings = (groupResults: OptimizationResult[]) => {
    return groupResults.reduce((sum, result) => sum + result.savings, 0);
  };

  // Helper function to get adjusted price (price minus personal discount)
  const getAdjustedPrice = (product: any): number => {
    return Math.max(0, product.price - (product.personalDiscount || 0));
  };

  // Calculate total statistics
  const totalOriginalPrice = results.reduce((sum, result) => sum + result.originalPrice, 0) +
                           unusedProducts.reduce((sum, product) => sum + product.price, 0);
  
  // For discounted price, we need to account for both coupon discounts and personal discounts
  const totalDiscountedPrice = results.reduce((sum, result) => sum + result.discountedPrice, 0) +
                              unusedProducts.reduce((sum, product) => sum + getAdjustedPrice(product), 0);
  
  // Total savings includes both coupon savings and personal discounts
  const couponSavings = results.reduce((sum, result) => sum + result.savings, 0);
  const personalDiscountSavings = unusedProducts.reduce((sum, product) => sum + (product.personalDiscount || 0), 0);
  const totalSavings = couponSavings + personalDiscountSavings;

  return (
    <div className="results-page">
      <h2 className="mb-4">{t('results.title')}</h2>

      {/* Total Statistics Card */}
      <Card className={`mb-4 ${isFlashing ? 'results-flash' : ''}`}>
        <Card.Header>
          <h4 className="mb-0">{t('results.totalStats')}</h4>
        </Card.Header>
        <Card.Body>
          <div className="row">
            <div className="col-md-4">
              <p><strong>{t('results.originalTotal')}:</strong> ${totalOriginalPrice.toFixed(2)}</p>
            </div>
            <div className="col-md-4">
              <p><strong>{t('results.discountedTotal')}:</strong> ${totalDiscountedPrice.toFixed(2)}</p>
            </div>
            <div className="col-md-4">
              <p><strong>{t('results.totalSavings')}:</strong> ${totalSavings.toFixed(2)}</p>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Coupon Groups */}
      {Object.entries(groupedResults).map(([couponId, groupResults]) => (
        <Card key={couponId} className={`mb-4 ${isFlashing ? 'results-flash' : ''}`}>
          <Card.Header>
            <h4 className="mb-0">{t('results.coupon')}: {getCouponInfo(couponId)}</h4>
          </Card.Header>
          <Card.Body>
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>{t('results.product')}</th>
                    <th>{t('results.originalPrice')}</th>
                    <th>{t('results.discountedPrice')}</th>
                  </tr>
                </thead>
                <tbody>
                  {groupResults.map((result) => (
                    <tr key={`${result.couponId}-${result.productId}`}>
                      <td>{getProductName(result.productId)}</td>
                      <td>
                        ${result.originalPrice.toFixed(2)}
                        {(getProductById(result.productId)?.personalDiscount || 0) > 0 && (
                          <span className="ms-2" style={{ color: 'green' }}>
                            (-${(getProductById(result.productId)?.personalDiscount || 0).toFixed(2)})
                          </span>
                        )}
                      </td>
                      <td>${result.discountedPrice.toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr className="table-info">
                    <td><strong>{t('results.summary')}</strong></td>
                    <td>
                      <strong>${calculateGroupTotal(groupResults).toFixed(2)}</strong>
                      {calculateGroupPersonalDiscount(groupResults) > 0 && (
                        <span className="ms-2" style={{ color: 'green' }}>
                          <strong>(-${calculateGroupPersonalDiscount(groupResults).toFixed(2)})</strong>
                        </span>
                      )}
                    </td>
                    <td>
                      <strong>
                        ${(calculateGroupTotal(groupResults) - calculateGroupSavings(groupResults) - calculateGroupPersonalDiscount(groupResults)).toFixed(2)}
                      </strong>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      ))}

      {/* Unused Products */}
      {unusedProducts.length > 0 && (
        <Card className={`mb-4 ${isFlashing ? 'results-flash' : ''}`}>
          <Card.Header>
            <h4 className="mb-0">{t('results.unusedProducts')}</h4>
          </Card.Header>
          <Card.Body>
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>{t('results.product')}</th>
                    <th>{t('results.originalPrice')}</th>
                  </tr>
                </thead>
                <tbody>
                  {unusedProducts.map((product) => (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td>
                        ${product.price.toFixed(2)}
                        {product.personalDiscount > 0 && (
                          <span className="ms-2" style={{ color: 'green' }}>
                            (-${product.personalDiscount.toFixed(2)})
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                  <tr className="table-info">
                    <td><strong>{t('results.summary')}</strong></td>
                    <td>
                      <strong>${unusedProducts.reduce((sum, p) => sum + p.price, 0).toFixed(2)}</strong>
                      {personalDiscountSavings > 0 && (
                        <span className="ms-2" style={{ color: 'green' }}>
                          <strong>(-${personalDiscountSavings.toFixed(2)})</strong>
                        </span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default ResultsPage; 