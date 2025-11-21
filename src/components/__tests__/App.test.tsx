import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import App from '../../App';
import couponsReducer from '../../store/slices/couponsSlice';
import productsReducer from '../../store/slices/productsSlice';
import languageReducer from '../../store/slices/languageSlice';
import resultsReducer from '../../store/slices/resultsSlice';
import '@testing-library/jest-dom';

// Mock react-i18next
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: {
            changeLanguage: jest.fn(),
            language: 'en',
        },
    }),
}));

// Mock react-bootstrap
jest.mock('react-bootstrap', () => {
    const NavbarMock = ({ children }: any) => <div>{children}</div>;
    NavbarMock.Brand = ({ children }: any) => <div>{children}</div>;
    NavbarMock.Toggle = ({ children }: any) => <div>{children}</div>;
    NavbarMock.Collapse = ({ children }: any) => <div>{children}</div>;

    const AccordionMock = ({ children }: any) => <div>{children}</div>;
    AccordionMock.Item = ({ children }: any) => <div>{children}</div>;
    AccordionMock.Header = ({ children }: any) => <div>{children}</div>;
    AccordionMock.Body = ({ children }: any) => <div>{children}</div>;

    return {
        __esModule: true,
        Container: ({ children }: any) => <div>{children}</div>,
        Row: ({ children }: any) => <div>{children}</div>,
        Col: ({ children }: any) => <div>{children}</div>,
        Navbar: NavbarMock,
        Accordion: AccordionMock,
    };
});
jest.mock('../../pages/CouponsPage', () => () => <div data-testid="coupons-page">Coupons Page</div>);
jest.mock('../../pages/ProductsPage', () => () => <div data-testid="products-page">Products Page</div>);
jest.mock('../../pages/ResultsPage', () => () => <div data-testid="results-page">Results Page</div>);

describe('App', () => {
    const store = configureStore({
        reducer: {
            coupons: couponsReducer,
            products: productsReducer,
            language: languageReducer,
            results: resultsReducer,
        },
    });

    it('should render main layout and pages', () => {
        render(
            <Provider store={store}>
                <App />
            </Provider>
        );

        expect(screen.getByText('AliExpress Coupons')).toBeInTheDocument();
        expect(screen.getByTestId('coupons-page')).toBeInTheDocument();
        expect(screen.getByTestId('products-page')).toBeInTheDocument();
        expect(screen.getByTestId('results-page')).toBeInTheDocument();
    });
});
