# Portfolio Balancer

A React TypeScript application for managing and rebalancing your investment portfolio between QQQ ETF, individual stocks, and cash.

## Features

- Track your investment portfolio with QQQ, individual stocks, and cash
- Configure custom target allocation percentages
- Automatically calculate the current allocation percentages across your portfolio
- Create and execute rebalance plans to achieve your target allocation
- Track transaction history for all trades
- Manage deposits and withdrawals with cash tracking
- Persistent storage using browser's local storage
- Modern, responsive user interface with tab-based navigation

## Purpose

This application helps investors maintain a balanced portfolio according to their specified allocation targets. By default, it helps maintain:
- 50% of the portfolio value in QQQ (Invesco QQQ Trust, tracking the Nasdaq-100 Index)
- 50% of the portfolio value in individual stocks
- Optional cash allocation for greater flexibility

As stock prices change over time, portfolio balance will drift away from the target allocations. This tool helps calculate exactly how many shares of each holding need to be bought or sold to restore the target balance.

## How It Works

1. **Enter and manage your holdings:**
   - QQQ shares and current price
   - Individual stocks with ticker, shares, and current price
   - Cash position

2. **View your portfolio summary:**
   - Current total portfolio value
   - Current value and percentage allocation across QQQ, individual stocks, and cash
   - Target values for achieving balanced allocations
   - Visual representation of current vs. target allocations

3. **Create and execute rebalance plans:**
   - Generate a rebalance plan that suggests specific buy/sell actions
   - Execute trades individually and track their completion
   - Transaction history for all completed trades

4. **Manage cash and settings:**
   - Track deposits and withdrawals
   - Adjust target allocation percentages
   - Set custom weights for individual stocks

## Installation and Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Running Locally

1. Clone the repository:
   ```
   git clone https://github.com/yulongyan99/portfolio-balancer.git
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

- React 19
- TypeScript
- Vite
- React Icons
- Local Storage for data persistence

## License

MIT
