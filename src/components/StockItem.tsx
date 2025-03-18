import React from 'react';
import { Stock } from '../types';
import { FaTrash } from 'react-icons/fa';
import StockPercentageBar from './StockPercentageBar';

interface StockItemProps {
  stock: Stock;
  totalPortfolioValue: number;
  isQqq: boolean;
  onUpdate: (updatedStock: Stock) => void;
  onDelete: () => void;
}

const StockItem: React.FC<StockItemProps> = ({ 
  stock, 
  totalPortfolioValue,
  isQqq,
  onUpdate, 
  onDelete 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value) || 0;
    
    let updatedStock: Stock = { ...stock };
    
    if (name === 'ticker') {
      updatedStock = { ...stock, ticker: value };
    } else if (name === 'shares') {
      updatedStock = { 
        ...stock, 
        shares: numValue,
        value: numValue * stock.currentPrice
      };
    } else if (name === 'currentPrice') {
      updatedStock = { 
        ...stock, 
        currentPrice: numValue,
        value: stock.shares * numValue
      };
    } else if (name === 'targetWeight') {
      updatedStock = {
        ...stock,
        targetWeight: numValue
      };
    }
    
    onUpdate(updatedStock);
  };

  // Calculate percentage of total portfolio
  const percentage = totalPortfolioValue > 0 
    ? (stock.value / totalPortfolioValue) * 100 
    : 0;

  return (
    <div className="stock-item">
      <div className="stock-field ticker-field">
        <label>Ticker:</label>
        <input
          type="text"
          name="ticker"
          value={stock.ticker}
          onChange={handleChange}
          placeholder="e.g., AAPL"
        />
      </div>
      
      <div className="stock-field shares-field">
        <label>Shares:</label>
        <input
          type="number"
          name="shares"
          value={stock.shares || ''}
          onChange={handleChange}
          min="0"
          step="1"
        />
      </div>
      
      <div className="stock-field price-field">
        <label>Price ($):</label>
        <input
          type="number"
          name="currentPrice"
          value={stock.currentPrice || ''}
          onChange={handleChange}
          min="0"
          step="0.01"
        />
      </div>
      
      <div className="stock-field value-field">
        <label>Value ($):</label>
        <span>{stock.value.toFixed(2)}</span>
      </div>
      
      <div className="stock-field percent-field">
        <label>% of Portfolio:</label>
        <StockPercentageBar percentage={percentage} />
      </div>
      
      <div className="stock-field target-field">
        {!isQqq ? (
          <>
            <label>Target Weight (%):</label>
            <input
              type="number"
              name="targetWeight"
              value={stock.targetWeight || ''}
              onChange={handleChange}
              min="0"
              max="100"
              step="1"
              placeholder="e.g., 50"
            />
          </>
        ) : <div></div>}
      </div>
      
      <div className="delete-field">
        <button className="delete-btn" onClick={onDelete}>
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default StockItem; 