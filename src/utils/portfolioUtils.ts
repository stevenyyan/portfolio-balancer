import { Stock, PortfolioBalance, RebalanceAction, RebalancePlan, Transaction, TradeStatus, PortfolioSettings } from '../types';

// Generate a unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Check if a stock is valid for calculations
export const isValidStock = (stock: Stock): boolean => {
  return stock.ticker !== '' && stock.currentPrice > 0;
};

// Calculate the total value of all stocks in the portfolio
export const calculateTotalValue = (stocks: Stock[]): number => {
  return stocks
    .filter(isValidStock)
    .reduce((total, stock) => total + stock.value, 0);
};

// Calculate QQQ value and other stocks values
export const calculatePortfolioBalance = (
  stocks: Stock[], 
  settings: PortfolioSettings,
  cashPosition: number = 0
): PortfolioBalance => {
  // Filter out stocks with empty tickers or zero prices
  const validStocks = stocks.filter(isValidStock);
  
  const qqqStock = validStocks.find(stock => stock.ticker.toUpperCase() === 'QQQ');
  const qqqValue = qqqStock ? qqqStock.value : 0;
  
  const individualStocksValue = validStocks
    .filter(stock => stock.ticker.toUpperCase() !== 'QQQ')
    .reduce((total, stock) => total + stock.value, 0);
  
  // Current total invested value (sum of all stock values)
  const investedValue = qqqValue + individualStocksValue;
  
  // Total portfolio value is the sum of invested value plus the cash position
  // It's simply the sum of what you own (stocks) plus available cash
  const totalValue = investedValue + cashPosition;
  
  // Target percentages based on settings
  const targetQqqPercentage = settings.targetQqqPercentage || 50;
  const targetCashPercentage = settings.targetCashPercentage || 0;
  const targetIndividualStocksPercentage = 100 - targetQqqPercentage - targetCashPercentage;
  
  // Target values based on percentages of the total portfolio value
  const targetQqqValue = (totalValue * targetQqqPercentage) / 100;
  const targetIndividualStocksValue = (totalValue * targetIndividualStocksPercentage) / 100;
  const targetCashValue = (totalValue * targetCashPercentage) / 100;
  
  // Calculate percentages of current portfolio
  const qqqPercentage = totalValue > 0 ? (qqqValue / totalValue) * 100 : 0;
  const individualStocksPercentage = totalValue > 0 ? (individualStocksValue / totalValue) * 100 : 0;
  const cashPercentage = totalValue > 0 ? (cashPosition / totalValue) * 100 : 0;
  
  // Calculate required share change for QQQ, constrained by available cash
  let qqqShareChange = 0;
  
  if (qqqStock && qqqStock.currentPrice > 0) {
    // Unconstrained share change
    const unconstainedShareChange = Math.round((targetQqqValue - qqqValue) / qqqStock.currentPrice);
    
    // If buying, constrain by available cash
    if (unconstainedShareChange > 0) {
      const maxAffordableShares = Math.floor(cashPosition / qqqStock.currentPrice);
      qqqShareChange = Math.min(unconstainedShareChange, maxAffordableShares);
    } else {
      qqqShareChange = unconstainedShareChange; // For selling, no constraint
    }
  }
  
  return {
    qqq: {
      currentValue: qqqValue,
      targetValue: targetQqqValue,
      percentageOfPortfolio: qqqPercentage,
      shareChange: qqqShareChange
    },
    individualStocks: {
      currentValue: individualStocksValue,
      targetValue: targetIndividualStocksValue,
      percentageOfPortfolio: individualStocksPercentage
    },
    cash: {
      currentValue: cashPosition,
      targetValue: targetCashValue,
      percentageOfPortfolio: cashPercentage
    },
    totalValue,
    cashPosition
  };
};

// Calculate rebalance actions for each stock
export const calculateRebalanceActions = (
  stocks: Stock[],
  portfolioBalance: PortfolioBalance,
  settings: PortfolioSettings
): RebalanceAction[] => {
  const actions: RebalanceAction[] = [];
  
  // Calculate target cash position
  const targetCashPercentage = settings.targetCashPercentage || 0;
  const targetCashValue = (portfolioBalance.totalValue * targetCashPercentage) / 100;
  
  // Determine if we need to adjust cash position (positive means add cash, negative means invest cash)
  const cashDifference = targetCashValue - portfolioBalance.cashPosition;
  
  // If we need to increase cash (reduce investments), we'll track how much cash we've already added
  let cashToAdd = cashDifference > 0 ? cashDifference : 0;
  
  // If we need to decrease cash (increase investments), we'll track how much cash is available to use
  let remainingCash = cashDifference < 0 ? portfolioBalance.cashPosition - targetCashValue : portfolioBalance.cashPosition;
  
  // Filter out invalid stocks
  const validStocks = stocks.filter(isValidStock);
  
  // Handle QQQ first
  const qqqStock = validStocks.find(stock => stock.ticker.toUpperCase() === 'QQQ');
  if (qqqStock) {
    // Calculate share change, limited by available cash
    let shareChange = portfolioBalance.qqq.shareChange;
    
    // Adjust the remaining cash based on QQQ trade
    if (shareChange > 0) { // Buying
      remainingCash -= shareChange * qqqStock.currentPrice;
    } else if (shareChange < 0) { // Selling
      remainingCash += Math.abs(shareChange) * qqqStock.currentPrice;
    }
    
    const targetShares = qqqStock.shares + shareChange;
    const status: TradeStatus = 'pending';
    actions.push({
      ticker: qqqStock.ticker,
      currentShares: qqqStock.shares,
      targetShares,
      sharesToBuyOrSell: Math.abs(shareChange),
      action: shareChange > 0 ? 'buy' : shareChange < 0 ? 'sell' : 'none',
      status,
      id: generateId()
    });
  }
  
  // For individual stocks, use the targetWeight if provided
  const individualStocks = validStocks.filter(stock => stock.ticker.toUpperCase() !== 'QQQ');
  
  // Calculate the total target weight and normalize if needed
  const targetWeightSum = individualStocks.reduce((sum, stock) => sum + (stock.targetWeight || 0), 0);
  
  // First collect all calculated actions without pushing them to the actions array
  const individualStockActions: RebalanceAction[] = [];
  
  individualStocks.forEach(stock => {
    // If target weights are defined, use them; otherwise maintain current proportions
    let stockWeight = 0;
    
    if (targetWeightSum > 0) {
      // Use normalized target weights
      stockWeight = ((stock.targetWeight || 0) / targetWeightSum);
    } else {
      // Fall back to current proportions
      const individualStocksTotal = portfolioBalance.individualStocks.currentValue;
      stockWeight = individualStocksTotal > 0 
        ? stock.value / individualStocksTotal 
        : 0;
    }
    
    // Calculate the target value for this stock
    const targetValue = stockWeight * portfolioBalance.individualStocks.targetValue;
    
    // Calculate how many shares are needed
    const unconstainedTargetShares = stock.currentPrice > 0 
      ? Math.round(targetValue / stock.currentPrice) 
      : stock.shares;
    
    // Determine if we're buying or selling
    const isBuying = unconstainedTargetShares > stock.shares;
    const isSelling = unconstainedTargetShares < stock.shares;
    
    // Calculate target shares considering cash constraints
    let targetShares = stock.shares; // Default to no change
    
    if (isBuying && remainingCash > 0 && stock.currentPrice > 0) {
      // Calculate how many shares we can buy with remaining cash
      const sharesToBuy = unconstainedTargetShares - stock.shares;
      const maxAffordableShares = Math.floor(remainingCash / stock.currentPrice);
      const limitedSharesToBuy = Math.min(sharesToBuy, maxAffordableShares);
      
      targetShares = stock.shares + limitedSharesToBuy;
    } else if (isSelling) {
      // For selling, no cash constraint
      targetShares = unconstainedTargetShares;
    }
    
    const sharesToBuyOrSell = Math.abs(targetShares - stock.shares);
    const action = targetShares > stock.shares 
      ? 'buy' 
      : targetShares < stock.shares 
        ? 'sell' 
        : 'none';
    
    // Update remaining cash based on this trade
    if (action === 'buy') {
      remainingCash -= sharesToBuyOrSell * stock.currentPrice;
    } else if (action === 'sell') {
      remainingCash += sharesToBuyOrSell * stock.currentPrice;
    }
    
    const status: TradeStatus = 'pending';
    individualStockActions.push({
      ticker: stock.ticker,
      currentShares: stock.shares,
      targetShares,
      sharesToBuyOrSell,
      action,
      status,
      id: generateId()
    });
  });
  
  // Now add all individual stock actions to the main actions array
  actions.push(...individualStockActions);
  
  // Also include stocks with empty tickers or incomplete data
  // This is important to ensure new stocks are still visible in the UI
  const incompleteStocks = stocks.filter(stock => !isValidStock(stock));
  incompleteStocks.forEach(stock => {
    const status: TradeStatus = 'pending';
    actions.push({
      ticker: stock.ticker || '(No ticker)',
      currentShares: stock.shares,
      targetShares: stock.shares,
      sharesToBuyOrSell: 0,
      action: 'none',
      status,
      id: generateId()
    });
  });
  
  return actions;
};

// Create a new rebalance plan
export const createRebalancePlan = (actions: RebalanceAction[]): RebalancePlan => {
  const nonEmptyActions = actions.filter(action => action.action !== 'none');
  
  return {
    id: generateId(),
    date: new Date(),
    actions: nonEmptyActions,
    isActive: true,
    completedTrades: 0,
    totalTrades: nonEmptyActions.length
  };
};

// Execute a trade and create a transaction record
export const executeTrade = (
  action: RebalanceAction, 
  stock: Stock,
  rebalancePlanId: string
): { updatedStock: Stock; transaction: Transaction; updatedAction: RebalanceAction; tradeValue: number } => {
  let updatedShares = stock.shares;
  let tradeValue = 0; // The dollar amount of the trade (positive for selling, negative for buying)
  
  if (action.action === 'buy') {
    updatedShares += action.sharesToBuyOrSell;
    tradeValue = -(action.sharesToBuyOrSell * stock.currentPrice); // Negative value for buying (cash outflow)
  } else if (action.action === 'sell') {
    updatedShares -= action.sharesToBuyOrSell;
    tradeValue = action.sharesToBuyOrSell * stock.currentPrice; // Positive value for selling (cash inflow)
  }
  
  const updatedStock: Stock = {
    ...stock,
    shares: updatedShares,
    value: updatedShares * stock.currentPrice
  };
  
  const transaction: Transaction = {
    id: generateId(),
    date: new Date(),
    ticker: stock.ticker,
    action: action.action === 'buy' ? 'buy' : 'sell',
    shares: action.sharesToBuyOrSell,
    price: stock.currentPrice,
    rebalancePlanId
  };
  
  const updatedAction: RebalanceAction = {
    ...action,
    status: 'completed'
  };
  
  return { updatedStock, transaction, updatedAction, tradeValue };
};

// Update rebalance plan with completed trade
export const updateRebalancePlan = (
  plan: RebalancePlan,
  completedActionId: string
): RebalancePlan => {
  const updatedActions = plan.actions.map(action => 
    action.id === completedActionId 
      ? { ...action, status: 'completed' } 
      : action
  );
  
  const completedTrades = updatedActions.filter(
    action => action.status === 'completed'
  ).length;
  
  return {
    ...plan,
    actions: updatedActions,
    completedTrades,
    isActive: completedTrades < plan.totalTrades
  };
}; 