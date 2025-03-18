import React, { useState } from 'react';
import { PortfolioSettings, PortfolioBalance } from '../types';
import StockPercentageBar from './StockPercentageBar';
import { FaPercent, FaSave, FaMoneyBillWave } from 'react-icons/fa';

interface PortfolioSettingsViewProps {
  settings: PortfolioSettings;
  portfolioBalance: PortfolioBalance;
  onUpdateSettings: (settings: PortfolioSettings) => void;
}

const PortfolioSettingsView: React.FC<PortfolioSettingsViewProps> = ({
  settings,
  portfolioBalance,
  onUpdateSettings
}) => {
  const [targetQqqPercentage, setTargetQqqPercentage] = useState(settings.targetQqqPercentage);
  const [targetCashPercentage, setTargetCashPercentage] = useState(settings.targetCashPercentage);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Calculate the percentage for individual stocks (100 - QQQ - cash)
  const targetIndividualStocksPercentage = 100 - targetQqqPercentage - targetCashPercentage;
  
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  const handleQqqPercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
    
    // Ensure cash + QQQ doesn't exceed 100%
    if (value + targetCashPercentage > 100) {
      setTargetCashPercentage(100 - value);
    }
    
    setTargetQqqPercentage(value);
    setHasChanges(true);
  };
  
  const handleCashPercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
    
    // Ensure cash + QQQ doesn't exceed 100%
    if (value + targetQqqPercentage > 100) {
      setTargetQqqPercentage(100 - value);
    }
    
    setTargetCashPercentage(value);
    setHasChanges(true);
  };
  
  const handleSaveSettings = () => {
    onUpdateSettings({
      targetQqqPercentage: targetQqqPercentage,
      targetCashPercentage: targetCashPercentage
    });
    setHasChanges(false);
  };
  
  // Calculate the actual cash percentage from the portfolio balance
  const actualCashPercentage = portfolioBalance.cashPosition / portfolioBalance.totalValue * 100;
  
  return (
    <div className="portfolio-settings">
      <h2>Portfolio Settings</h2>
      
      <div className="settings-grid">
        <div className="settings-section">
          <h3>Portfolio Allocation</h3>
          
          <div className="setting-row">
            <div className="setting-label">
              <FaPercent /> QQQ Allocation Target
            </div>
            <div className="setting-input">
              <input
                type="number"
                value={targetQqqPercentage}
                onChange={handleQqqPercentageChange}
                min="0"
                max="100"
                step="5"
              />
              <span className="input-suffix">%</span>
            </div>
          </div>
          
          <div className="setting-row">
            <div className="setting-label">
              <FaMoneyBillWave /> Cash Allocation Target
            </div>
            <div className="setting-input">
              <input
                type="number"
                value={targetCashPercentage}
                onChange={handleCashPercentageChange}
                min="0"
                max="100"
                step="5"
              />
              <span className="input-suffix">%</span>
            </div>
          </div>
          
          <div className="settings-explanation">
            <ul>
              <li>Set your target allocation percentages for QQQ and cash.</li>
              <li>The remaining percentage ({targetIndividualStocksPercentage}%) will be allocated to individual stocks.</li>
              <li>Maintaining a cash position can help manage risk during market volatility.</li>
            </ul>
          </div>
          
          <div className="setting-actions">
            <button 
              className={`save-btn ${hasChanges ? 'active' : ''}`}
              onClick={handleSaveSettings}
              disabled={!hasChanges}
            >
              <FaSave /> Save Settings
            </button>
          </div>
        </div>
        
        <div className="settings-info">
          <h3>Current Allocation</h3>
          
          <div className="allocation-summary">
            <h4>Target Allocation</h4>
            <div className="allocation-item">
              <div className="allocation-header">
                <span>QQQ:</span>
                <span>{targetQqqPercentage}%</span>
              </div>
            </div>
            <div className="allocation-item">
              <div className="allocation-header">
                <span>Individual Stocks:</span>
                <span>{targetIndividualStocksPercentage}%</span>
              </div>
            </div>
            <div className="allocation-item">
              <div className="allocation-header">
                <span>Cash:</span>
                <span>{targetCashPercentage}%</span>
              </div>
            </div>
          </div>
          
          <div className="allocation-summary">
            <h4>Actual Allocation</h4>
            <div className="allocation-item">
              <div className="allocation-header">
                <span>QQQ:</span>
                <span>{portfolioBalance.qqq.percentageOfPortfolio.toFixed(1)}%</span>
              </div>
              <StockPercentageBar 
                percentage={portfolioBalance.qqq.percentageOfPortfolio} 
                threshold={targetQqqPercentage}
              />
            </div>
            <div className="allocation-item">
              <div className="allocation-header">
                <span>Individual Stocks:</span>
                <span>{portfolioBalance.individualStocks.percentageOfPortfolio.toFixed(1)}%</span>
              </div>
              <StockPercentageBar 
                percentage={portfolioBalance.individualStocks.percentageOfPortfolio} 
                threshold={targetIndividualStocksPercentage}
              />
            </div>
            <div className="allocation-item">
              <div className="allocation-header">
                <span>Cash:</span>
                <span>{actualCashPercentage.toFixed(1)}%</span>
              </div>
              <StockPercentageBar 
                percentage={actualCashPercentage} 
                threshold={targetCashPercentage}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="settings-note">
        <p>
          The application will suggest rebalancing trades to maintain your target allocation.
          Increase your cash target during uncertain market conditions to reduce risk.
        </p>
      </div>
    </div>
  );
};

export default PortfolioSettingsView; 