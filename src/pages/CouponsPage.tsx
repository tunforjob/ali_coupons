import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, Modal, Badge } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { RootState } from '../store';
import { addCoupon, removeCoupon, updateCoupon } from '../store/slices/couponsSlice';
import { Coupon } from '../types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

const CouponsPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const coupons = useSelector((state: RootState) => state.coupons.items) || [];
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [formData, setFormData] = useState({
    minAmount: '',
    discount: '',
  });

  const handleShowModal = (coupon?: Coupon) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        minAmount: coupon.minAmount.toString(),
        discount: coupon.discount.toString(),
      });
    } else {
      setEditingCoupon(null);
      setFormData({
        minAmount: '',
        discount: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCoupon(null);
    setFormData({
      minAmount: '',
      discount: '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCoupon: Coupon = {
      id: editingCoupon?.id || crypto.randomUUID(),
      minAmount: Number(formData.minAmount),
      discount: Number(formData.discount),
      quantity: 1,
    };

    if (editingCoupon) {
      dispatch(updateCoupon(newCoupon));
    } else {
      dispatch(addCoupon(newCoupon));
    }

    handleCloseModal();
  };

  return (
    <div className="coupons-page">
      <div className="coupons-container">
        <Button
          variant="primary"
          onClick={() => handleShowModal()}
 
        >
          {t('coupons.add')}
        </Button>
        <TransitionGroup component={null}>
          {coupons.map((coupon) => (
            <CSSTransition
              key={coupon.id}
              timeout={300}
              classNames="table-row"
            >
              <Badge
                bg="light"
                className="coupon-badge"
                onClick={() => handleShowModal(coupon)}
              >
                {coupon.minAmount}/{coupon.discount}
                <button
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(removeCoupon(coupon.id));
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                  </svg>
                </button>
              </Badge>
            </CSSTransition>
          ))}
        </TransitionGroup>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingCoupon ? t('coupons.edit') : t('coupons.add')}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>{t('coupons.minAmount')}</Form.Label>
              <Form.Control
                type="number"
                value={formData.minAmount}
                onChange={(e) => setFormData({ ...formData, minAmount: e.target.value })}
                required
                min="0"
                step="1"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>{t('coupons.discount')}</Form.Label>
              <Form.Control
                type="number"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                required
                min="0"
                step="1"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              {t('common.cancel')}
            </Button>
            <Button variant="primary" type="submit">
              {t('common.save')}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default CouponsPage; 