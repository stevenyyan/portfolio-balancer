# Portfolio Balancer

A modern React TypeScript application for managing and rebalancing investment portfolios with support for QQQ ETF, individual stocks, and cash position tracking.

## Features

- **Portfolio Tracking**: Monitor your investments across QQQ ETF, individual stocks, and cash
- **Custom Allocations**: Set and manage target allocation percentages for your portfolio
- **Stock Weighting**: Assign custom weight percentages to individual stocks
- **Rebalancing Tools**: Generate actionable rebalance plans with specific buy/sell actions
- **Transaction History**: Keep a record of all executed trades
- **Cash Management**: Track deposits, withdrawals, and cash position
- **Data Persistence**: All data saved locally in your browser

## Screenshots

*[Screenshots will be added soon]*

## How It Works

### Portfolio Management
- Track QQQ ETF shares and current market price
- Add multiple individual stocks with their respective shares and prices
- Monitor cash position separately from invested assets
- View current vs. target allocations with visual percentage bars

### Rebalancing
- Generate rebalance plans based on your target allocations
- See exactly how many shares to buy or sell for each holding
- Execute trades and track their completion
- Maintain transaction history for all trades

### Cash Operations
- Track deposits and withdrawals to your portfolio
- Automatically adjust cash position when executing trades
- Set a target cash percentage to maintain as uninvested funds

## Technical Details

### Built With
- React 19
- TypeScript
- Vite for fast development and optimized builds
- React Icons for UI elements
- Local Storage for data persistence

### Project Structure
- `src/components`: UI components for different views
- `src/types`: TypeScript interfaces and types
- `src/utils`: Portfolio calculation and management utilities

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

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

- Integration with stock market APIs for real-time price updates
- Portfolio performance analytics and visualizations
- Data export/import functionality
- Support for additional asset classes (bonds, crypto, etc.)
- Dark mode and additional UI themes

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/yulongyan99/portfolio-balancer/issues).

## License

This project is licensed under the MIT License - see the LICENSE file for details. 