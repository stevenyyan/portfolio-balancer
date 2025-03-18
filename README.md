# Portfolio Balancer

A React application for managing a 50/50 investment portfolio between QQQ ETF and individual stocks.

## Features

- Track your investment portfolio with QQQ and individual stocks
- Automatically calculate the current allocation percentages
- Determine how many shares to buy or sell to achieve a 50/50 balance
- Save your portfolio data in your browser's local storage
- Modern, responsive user interface

## Purpose

This application helps investors maintain a balanced portfolio where:
- 50% of the portfolio value is in QQQ (Invesco QQQ Trust, tracking the Nasdaq-100 Index)
- 50% of the portfolio value is in individual stocks (e.g., NVDA, TSLA, AAPL, etc.)

Over time, as stock prices change, the portfolio balance will drift away from the 50/50 target. This tool helps calculate exactly how many shares of each stock need to be bought or sold to restore the target balance.

## How It Works

1. **Enter your current holdings:**
   - QQQ shares and current price
   - Individual stocks, including ticker, shares, and current price

2. **View your portfolio summary:**
   - Current total portfolio value
   - Current value and percentage allocation for QQQ and individual stocks
   - Target values for achieving 50/50 balance

3. **Get rebalancing actions:**
   - See exactly how many shares of each stock to buy or sell
   - Maintains the relative proportions of your individual stocks

## Installation and Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Running Locally

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/portfolio-balancer.git
   cd portfolio-balancer
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Building for Production

```
npm run build
```

This will create a production-ready build in the `dist` directory.

## Future Enhancements

- Integration with stock market APIs to fetch real-time prices
- Option to export/import portfolio data
- Historical tracking of portfolio performance
- Support for additional portfolio balancing strategies
- Mobile app version

## Technologies Used

- React
- TypeScript
- Vite
- React Icons

## License

MIT
