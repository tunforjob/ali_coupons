# AliExpress Coupons Optimizer

A web application to optimize the usage of AliExpress coupons and maximize savings on your purchases.

## Usage 

[AliExpress Coupons Optimizer](https://tunforjob.github.io/ali_coupons/index.html)


## Features

- Add and manage coupons with minimum amount and discount
- Add and manage products with prices
- Automatic optimization of coupon usage
- Support for multiple languages (English and Russian)
- Responsive design for all devices

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ali-coupons.git
cd ali-coupons
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open the application in your browser:
- Development: http://localhost:5173
- Production: Open `index.html` in your browser

## Building for Production

To build the application for production:

```bash
npm run build
```

The built files will be in the `dist` directory. You can then open `dist/index.html` in your browser to run the application.

## Usage

1. Add your coupons with minimum amount and discount
2. Add products you want to purchase
3. View the optimization results to see how to best use your coupons
4. The application will show you the total savings and which coupons to use for which products

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Tech Stack

- **Framework**: React 18
- **State Management**: Redux Toolkit
- **Styling**: Bootstrap 5, SCSS
- **Build Tool**: Vite
- **Type Checking**: TypeScript
- **Code Quality**: ESLint, Prettier
- **Testing**: Jest, React Testing Library
- **Internationalization**: i18next

## Project Structure

```
src/
├── assets/          # Static assets (images, fonts)
├── components/      # Reusable UI components
│   ├── common/     # Shared components (buttons, inputs, etc.)
│   ├── coupons/    # Coupon-related components
│   ├── products/   # Product-related components
│   └── results/    # Results-related components
├── constants/       # Application constants
├── data/           # Data files
│   └── sampleData.ts # Commented sample data for debugging
├── features/       # Redux slices and feature-specific logic
├── hooks/          # Custom React hooks
├── i18n/           # Internationalization files
├── services/       # Business logic and API services
├── store/          # Redux store configuration
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
└── App.tsx         # Main application component
```

## Development Guidelines

- Follow SOLID principles
- Use TypeScript for type safety
- Implement responsive design
- Write unit tests for critical functionality
- Use constants for all string values
- Format prices with 2 decimal places
- Validate all user inputs
- Handle edge cases (negative prices, empty inputs, etc.)

## Algorithm

The application uses a greedy algorithm to optimize coupon usage:
1. Sort coupons by discount amount (highest to lowest)
2. For each coupon:
   - Find the best combination of products that maximizes the discount
   - Apply the coupon to the selected products
   - Remove used products from consideration
3. Calculate total savings and display results

## Future Improvements

- Integration with REST API for data persistence
- Additional optimization algorithms
- More sophisticated product grouping
- Advanced filtering and sorting options
- User authentication and personal accounts

