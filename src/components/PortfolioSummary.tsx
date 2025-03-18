import React from 'react';
import { PortfolioBalance, PortfolioSettings, Stock } from '../types';
import StockPercentageBar from './StockPercentageBar';

interface PortfolioSummaryProps {
  portfolioBalance: PortfolioBalance;
  settings: PortfolioSettings;
  stocks: Stock[];
}

const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({ portfolioBalance, settings, stocks }) => {
  const {
    qqq,
    individualStocks,
    totalValue,
    cashPosition
  } = portfolioBalance;

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(1)}%`;
  };

  // Determine classes for QQQ and individual stocks percentages
  const targetQqqPercentage = settings.targetQqqPercentage;
  const targetCashPercentage = settings.targetCashPercentage;
  const targetIndividualPercentage = 100 - targetQqqPercentage - targetCashPercentage;
  
  const qqqClass = qqq.percentageOfPortfolio < (targetQqqPercentage - 0.5) ? 'below-target' :
                  qqq.percentageOfPortfolio > (targetQqqPercentage + 0.5) ? 'above-target' : 'balanced';
  
  const individualStocksClass = individualStocks.percentageOfPortfolio < (targetIndividualPercentage - 0.5) ? 'below-target' :
                               individualStocks.percentageOfPortfolio > (targetIndividualPercentage + 0.5) ? 'above-target' : 'balanced';
                               
  const cashClass = portfolioBalance.cash.percentageOfPortfolio < (targetCashPercentage - 0.5) ? 'below-target' :
                   portfolioBalance.cash.percentageOfPortfolio > (targetCashPercentage + 0.5) ? 'above-target' : 'balanced';

  // Calculate how much is cash vs. invested (for display only)
  const investedValue = totalValue - cashPosition;

  // Filter individual stocks (non-QQQ)
  const individualStocksFiltered = stocks.filter(stock => stock.ticker.toUpperCase() !== 'QQQ');
  
  // Calculate total target weight
  const totalTargetWeight = individualStocksFiltered.reduce((sum, stock) => sum + (stock.targetWeight || 0), 0);

  return (
    <div className="portfolio-summary">
      <h2>Portfolio Summary</h2>
      
      <div className="summary-total">
        <span className="label">Total Portfolio Value:</span>
        <span className="value">{formatCurrency(totalValue)}</span>
      </div>
      
      <div className="summary-budget">
        <div className="summary-row">
          <span className="label">Invested Value:</span>
          <span className="value">{formatCurrency(investedValue)}</span>
          <small className="percent">({(investedValue / totalValue * 100).toFixed(1)}%)</small>
        </div>
        <div className="summary-row">
          <span className="label">Cash Position:</span>
          <span className="value">{formatCurrency(cashPosition)}</span>
          <small className="percent">({(cashPosition / totalValue * 100).toFixed(1)}%)</small>
        </div>
      </div>
      
      <div className="allocation-distribution">
        <h3>Portfolio Allocation</h3>
        <div className="allocation-grid">
          <div className="allocation-item">
            <div className="allocation-header">
              <span>QQQ ({settings.targetQqqPercentage}% Target)</span>
              <span className={qqqClass}>{formatPercentage(qqq.percentageOfPortfolio)}</span>
            </div>
            <StockPercentageBar 
              percentage={qqq.percentageOfPortfolio} 
              threshold={targetQqqPercentage}
            />
          </div>
          
          <div className="allocation-item">
            <div className="allocation-header">
              <span>Individual Stocks ({targetIndividualPercentage}% Target)</span>
              <span className={individualStocksClass}>{formatPercentage(individualStocks.percentageOfPortfolio)}</span>
            </div>
            <StockPercentageBar 
              percentage={individualStocks.percentageOfPortfolio} 
              threshold={targetIndividualPercentage}
            />
          </div>
          
          <div className="allocation-item">
            <div className="allocation-header">
              <span>Cash ({settings.targetCashPercentage}% Target)</span>
              <span className={cashClass}>{formatPercentage(portfolioBalance.cash.percentageOfPortfolio)}</span>
            </div>
            <StockPercentageBar 
              percentage={portfolioBalance.cash.percentageOfPortfolio} 
              threshold={targetCashPercentage}
            />
          </div>
        </div>
      </div>
      
      <div className="summary-section">
        <h3>QQQ ({settings.targetQqqPercentage}% Target)</h3>
        <div className="summary-row">
          <span className="label">Current Value:</span>
          <span className="value">{formatCurrency(qqq.currentValue)}</span>
        </div>
        <div className="summary-row">
          <span className="label">Target Value:</span>
          <span className="value">{formatCurrency(qqq.targetValue)}</span>
        </div>
        <div className="summary-row">
          <span className="label">Current Percentage:</span>
          <span className={`value ${qqqClass}`}>{formatPercentage(qqq.percentageOfPortfolio)}</span>
        </div>
        <div className="summary-row">
          <span className="label">Shares to {qqq.shareChange > 0 ? 'Buy' : 'Sell'}:</span>
          <span className="value">{Math.abs(qqq.shareChange)}</span>
        </div>
      </div>

      <div className="summary-section">
        <h3>Individual Stocks ({targetIndividualPercentage}% Target)</h3>
        <div className="summary-row">
          <span className="label">Current Value:</span>
          <span className="value">{formatCurrency(individualStocks.currentValue)}</span>
        </div>
        <div className="summary-row">
          <span className="label">Target Value:</span>
          <span className="value">{formatCurrency(individualStocks.targetValue)}</span>
        </div>
        <div className="summary-row">
          <span className="label">Current Percentage:</span>
          <span className={`value ${individualStocksClass}`}>{formatPercentage(individualStocks.percentageOfPortfolio)}</span>
        </div>
      </div>

      <div className="summary-section">
        <h3>Cash ({targetCashPercentage}% Target)</h3>
        <div className="summary-row">
          <span className="label">Current Value:</span>
          <span className="value">{formatCurrency(portfolioBalance.cash.currentValue)}</span>
        </div>
        <div className="summary-row">
          <span className="label">Target Value:</span>
          <span className="value">{formatCurrency(portfolioBalance.cash.targetValue)}</span>
        </div>
        <div className="summary-row">
          <span className="label">Current Percentage:</span>
          <span className={`value ${cashClass}`}>{formatPercentage(portfolioBalance.cash.percentageOfPortfolio)}</span>
        </div>
        {portfolioBalance.cash.currentValue < portfolioBalance.cash.targetValue && (
          <div className="summary-row">
            <span className="label">Cash Needed:</span>
            <span className="value">{formatCurrency(portfolioBalance.cash.targetValue - portfolioBalance.cash.currentValue)}</span>
            <button 
              className="deposit-suggestion"
              onClick={() => {
                // Navigate to cash tab
                window.dispatchEvent(new CustomEvent('navigate-to-cash'));
              }}
            >
              Deposit Funds
            </button>
          </div>
        )}
      </div>

      <div className="summary-section">
        <h3>Individual Stocks Target Allocation</h3>
        {individualStocksFiltered.map((stock, index) => (
          <div className="summary-stat" key={index}>
            <span>{stock.ticker}: </span>
            <span className="value">
              {stock.targetWeight || 0}% 
              {totalTargetWeight > 0 && totalTargetWeight !== 100 && (
                <span className="normalized">
                  (Normalized: {(((stock.targetWeight || 0) / totalTargetWeight) * 100).toFixed(2)}%)
                </span>
              )}
            </span>
          </div>
        ))}
        {totalTargetWeight !== 100 && totalTargetWeight > 0 && (
          <div className="warning">
            Note: Target weights don't sum to 100%. They will be normalized automatically.
          </div>
        )}
        {totalTargetWeight === 0 && (
          <div className="warning">
            Please set target weights for your individual stocks.
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioSummary;