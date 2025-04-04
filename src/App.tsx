import { Container, Row, Col, Navbar, Accordion } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import CouponsPage from './pages/CouponsPage';
import ProductsPage from './pages/ProductsPage';
import ResultsPage from './pages/ResultsPage';
import './App.scss';

function App() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="app">
      <Navbar bg="primary" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand href="#home">AliExpress Coupons</Navbar.Brand>
          <div className="language-buttons">
            <button
              className={`btn btn-outline-light ${i18n.language === 'ru' ? 'active' : ''}`}
              onClick={() => changeLanguage('ru')}
            >
              RU
            </button>
            <button
              className={`btn btn-outline-light ${i18n.language === 'uk' ? 'active' : ''}`}
              onClick={() => changeLanguage('uk')}
            >
              UK
            </button>
            <button
              className={`btn btn-outline-light ${i18n.language === 'en' ? 'active' : ''}`}
              onClick={() => changeLanguage('en')}
            >
              EN
            </button>
          </div>
        </Container>
      </Navbar>

      <Container>
        <Row>
          <Col xs={12}>
            <Accordion defaultActiveKey="0" className="mb-4">
              <Accordion.Item eventKey="0">
                <Accordion.Header>{t('app.description.title')}</Accordion.Header>
                <Accordion.Body>
                  {t('app.description.text')}
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Col>
          <Col xs={12}>
            <div className="section-container mb-4">
              <CouponsPage />
            </div>
          </Col>
          <Col xs={12}>
            <div className="section-container mb-4">
              <ProductsPage />
            </div>
          </Col>
          <Col xs={12}>
            <div className="section-container mb-4">
              <ResultsPage />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App; 