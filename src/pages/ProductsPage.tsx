import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, Table, Modal } from 'react-bootstrap';
import { addProduct, removeProduct, updateProduct } from '../store/slices/productsSlice';
import { RootState } from '../store';
import { Product } from '../types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

const ProductsPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const products = useSelector((state: RootState) => state.products.items) || [];
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    price: '',
  });

  const handleShowModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        price: product.price.toString(),
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        price: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      price: '',
    });
    setErrors({
      name: '',
      price: '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrors({ ...errors, name: t('validation.required') });
      return;
    }

    const newProduct: Product = {
      id: editingProduct?.id || crypto.randomUUID(),
      name: formData.name.trim(),
      price: Number(formData.price),
      isUsed: false,
    };

    if (editingProduct) {
      dispatch(updateProduct(newProduct));
    } else {
      dispatch(addProduct(newProduct));
    }

    handleCloseModal();
  };

  return (
    <div className="products-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{t('products.title')}</h2>
        <Button variant="primary" onClick={() => handleShowModal()}>
          {t('products.add')}
        </Button>
      </div>

      <div className="table-responsive">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>{t('products.name')}</th>
              <th>{t('products.price')}</th>
              <th className="delete-column"></th>
            </tr>
          </thead>
          <tbody>
            <TransitionGroup component={null}>
              {products.map((product) => (
                <CSSTransition
                  key={product.id}
                  timeout={300}
                  classNames="table-row"
                >
                  <tr>
                    <td 
                      className="editable-cell"
                      onClick={() => handleShowModal(product)}
                    >
                      {product.name}
                    </td>
                    <td>${product.price.toFixed(2)}</td>
                    <td className="delete-column">
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(removeProduct(product.id));
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                          <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                </CSSTransition>
              ))}
            </TransitionGroup>
          </tbody>
        </Table>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingProduct ? t('products.edit') : t('products.add')}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>{t('products.name')}</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  setErrors({ ...errors, name: '' });
                }}
                isInvalid={!!errors.name}
              />
              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{t('products.price')}</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => {
                  setFormData({ ...formData, price: e.target.value });
                  setErrors({ ...errors, price: '' });
                }}
                isInvalid={!!errors.price}
              />
              <Form.Control.Feedback type="invalid">
                {errors.price}
              </Form.Control.Feedback>
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

export default ProductsPage; 