export interface Stock {
  ticker: string;
  shares: number;
  currentPrice: number;
  value: number;
  targetWeight?: number; // Target weight as a percentage within individual stocks portion
}

export interface PortfolioSettings {
  targetQqqPercentage: number; // Default 50%
  targetCashPercentage: number; // Target percentage to keep in cash
}

export interface PortfolioBalance {
  qqq: {
    currentValue: number;
    targetValue: number;
    percentageOfPortfolio: number;
    shareChange: number;
  };
  individualStocks: {
    currentValue: number;
    targetValue: number;
    percentageOfPortfolio: number;
  };
  cash: {
    currentValue: number;
    targetValue: number;
    percentageOfPortfolio: number;
  };
  totalValue: number;
  cashPosition: number; // Explicit cash position to track cash from sales and uninvested funds
}

export type TradeStatus = 'pending' | 'completed';

export interface RebalanceAction {
  ticker: string;
  currentShares: number;
  targetShares: number;
  sharesToBuyOrSell: number;
  action: 'buy' | 'sell' | 'none';
  status: TradeStatus;
  id: string; // unique identifier for the trade
}

export interface RebalancePlan {
  id: string;
  date: Date;
  actions: RebalanceAction[];
  isActive: boolean;
  completedTrades: number;
  totalTrades: number;
}

export interface Transaction {
  id: string;
  date: Date;
  ticker: string;
  action: 'buy' | 'sell';
  shares: number;
  price: number;
  rebalancePlanId: string;
} 