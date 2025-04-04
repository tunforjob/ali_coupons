import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar bg="primary" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand as={Link} to="/">
            AliExpress Coupons
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link
                as={Link}
                to="/"
                active={location.pathname === '/'}
              >
                {t('coupons.title')}
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/products"
                active={location.pathname === '/products'}
              >
                {t('products.title')}
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/results"
                active={location.pathname === '/results'}
              >
                {t('results.title')}
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="flex-grow-1">
        {children}
      </Container>
      <footer className="bg-light py-3 mt-auto">
        <Container className="text-center">
          <p className="mb-0">© 2024 AliExpress Coupons Optimizer</p>
        </Container>
      </footer>
    </div>
  );
};

export default Layout; 