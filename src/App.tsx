import { useState, useEffect } from 'react';
import { 
  Stock, 
  PortfolioBalance, 
  RebalanceAction, 
  RebalancePlan,
  Transaction,
  PortfolioSettings
} from './types';
import { 
  calculatePortfolioBalance, 
  calculateRebalanceActions,
  createRebalancePlan,
  executeTrade,
  updateRebalancePlan,
  generateId
} from './utils/portfolioUtils';
import StockItem from './components/StockItem';
import PortfolioSummary from './components/PortfolioSummary';
import RebalanceActions from './components/RebalanceActions';
import RebalancePlanView from './components/RebalancePlanView';
import TransactionHistory from './components/TransactionHistory';
import PortfolioSettingsView from './components/PortfolioSettingsView';
import { FaPlus, FaSync, FaClipboardList, FaCog, FaMoneyBillWave } from 'react-icons/fa';
import CashManagement from './components/CashManagement';
import './App.css';

// Modified Stock interface with an id for tracking
interface StockWithId extends Stock {
  id: string;
}

function App() {
  // Update stocks to include a unique ID for tracking
  const [stocks, setStocks] = useState<StockWithId[]>(() => {
    const savedStocks = localStorage.getItem('portfolioStocks');
    if (savedStocks) {
      try {
        const parsedStocks = JSON.parse(savedStocks);
        // Ensure all stocks have IDs
        return parsedStocks.map((stock: any) => ({
          ...stock,
          id: stock.id || generateId(),
        }));
      } catch (e) {
        console.error("Error parsing saved stocks:", e);
        return getDefaultStocks();
      }
    }
    return getDefaultStocks();
  });

  // Portfolio settings with budget
  const [settings, setSettings] = useState<PortfolioSettings>(() => {
    const savedSettings = localStorage.getItem('portfolioSettings');
    if (savedSettings) {
      try {
        return JSON.parse(savedSettings);
      } catch (e) {
        console.error("Error parsing saved settings:", e);
        return getDefaultSettings();
      }
    }
    return getDefaultSettings();
  });

  // Helper function to get default settings
  function getDefaultSettings(): PortfolioSettings {
    return {
      targetQqqPercentage: 50, // Default 50% allocation to QQQ
      targetCashPercentage: 0  // Default 0% target for cash (fully invested)
    };
  }

  // Helper function to get default stocks with IDs
  function getDefaultStocks(): StockWithId[] {
    return [
      {
        id: generateId(),
        ticker: 'QQQ',
        shares: 0,
        currentPrice: 400,
        value: 0
      },
      {
        id: generateId(),
        ticker: 'NVDA',
        shares: 0,
        currentPrice: 700,
        value: 0,
        targetWeight: 50 // Default target weight for NVDA
      },
      {
        id: generateId(),
        ticker: 'TSLA',
        shares: 0,
        currentPrice: 250,
        value: 0,
        targetWeight: 50 // Default target weight for TSLA
      }
    ];
  }

  // Rest of the state variables
  const [portfolioBalance, setPortfolioBalance] = useState<PortfolioBalance>({
    qqq: { currentValue: 0, targetValue: 0, percentageOfPortfolio: 0, shareChange: 0 },
    individualStocks: { currentValue: 0, targetValue: 0, percentageOfPortfolio: 0 },
    cash: { currentValue: 0, targetValue: 0, percentageOfPortfolio: 0 },
    totalValue: 0,
    cashPosition: 0
  });

  // Add a state to track cash position
  const [cashPosition, setCashPosition] = useState<number>(() => {
    const savedCash = localStorage.getItem('cashPosition');
    if (savedCash) {
      return parseFloat(savedCash);
    }

    // If no saved cash position, start with 0
    return 0;
  });

  const [rebalanceActions, setRebalanceActions] = useState<RebalanceAction[]>([]);
  
  const [activePlan, setActivePlan] = useState<RebalancePlan | null>(() => {
    const savedPlan = localStorage.getItem('activePlan');
    if (savedPlan) {
      try {
        return JSON.parse(savedPlan);
      } catch (e) {
        console.error("Error parsing saved plan:", e);
        return null;
      }
    }
    return null;
  });
  
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const savedTransactions = localStorage.getItem('transactions');
    if (savedTransactions) {
      return JSON.parse(savedTransactions);
    }
    return [];
  });
  
  const [activeTab, setActiveTab] = useState<'holdings' | 'cash' | 'plan' | 'history' | 'settings'>('holdings');
  
  const [showSettings, setShowSettings] = useState(false);

  // Recalculate portfolio balance whenever stocks, settings or cash position change
  useEffect(() => {
    // Convert StockWithId to Stock for calculations
    const stocksForCalculation: Stock[] = stocks.map(({ id, ...stock }) => stock);
    
    const balance = calculatePortfolioBalance(stocksForCalculation, settings, cashPosition);
    setPortfolioBalance(balance);
    
    const actions = calculateRebalanceActions(stocksForCalculation, balance, settings);
    setRebalanceActions(actions);
    
    // Save stocks to localStorage
    localStorage.setItem('portfolioStocks', JSON.stringify(stocks));
  }, [stocks, settings, cashPosition]);
  
  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('portfolioSettings', JSON.stringify(settings));
  }, [settings]);
  
  // Save cash position to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('cashPosition', cashPosition.toString());
  }, [cashPosition]);
  
  // Save active plan and transactions to localStorage when they change
  useEffect(() => {
    if (activePlan) {
      localStorage.setItem('activePlan', JSON.stringify(activePlan));
    } else {
      localStorage.removeItem('activePlan');
    }
  }, [activePlan]);
  
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Load saved transactions from localStorage
  useEffect(() => {
    const savedTransactions = localStorage.getItem('transactions');
    if (savedTransactions) {
      try {
        setTransactions(JSON.parse(savedTransactions));
      } catch (e) {
        console.error("Error parsing saved transactions:", e);
      }
    }
  }, []);
  
  // Listen for navigation events
  useEffect(() => {
    const handleNavigateToCash = () => {
      setActiveTab('cash');
    };
    
    window.addEventListener('navigate-to-cash', handleNavigateToCash);
    
    return () => {
      window.removeEventListener('navigate-to-cash', handleNavigateToCash);
    };
  }, []);
  
  // Format currency for display
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const handleAddStock = () => {
    const newStock: StockWithId = {
      id: generateId(),
      ticker: '',
      shares: 0,
      currentPrice: 0,
      value: 0,
      targetWeight: 0 // Default target weight for new stocks
    };
    
    setStocks([...stocks, newStock]);
  };

  const handleUpdateStock = (updatedStock: Stock, stockId: string) => {
    // Find the original stock to calculate share changes
    const originalStock = stocks.find(s => s.id === stockId);
    
    if (originalStock) {
      // If shares changed, adjust cash position
      if (originalStock.shares !== updatedStock.shares) {
        const shareChange = updatedStock.shares - originalStock.shares;
        // Negative cash impact when buying shares (increasing), positive when selling (decreasing)
        const cashImpact = -shareChange * updatedStock.currentPrice;
        
        // Only update cash if we have enough for purchase, or if we're selling
        if (cashImpact > 0 || cashPosition >= Math.abs(cashImpact)) {
          console.log("Manual share update:", {
            ticker: updatedStock.ticker,
            oldShares: originalStock.shares,
            newShares: updatedStock.shares,
            shareChange: shareChange,
            cashImpact: cashImpact,
            currentCash: cashPosition,
            newCash: cashPosition + cashImpact
          });
          
          setCashPosition(prev => Math.max(0, prev + cashImpact));
        } else {
          // Not enough cash, revert to original shares
          alert(`Not enough cash to purchase ${shareChange} shares of ${updatedStock.ticker}. You need ${formatCurrency(Math.abs(cashImpact))} but only have ${formatCurrency(cashPosition)}.`);
          
          // Return early with original stock quantity but updated price
          const revertedStock = {
            ...updatedStock,
            shares: originalStock.shares,
            value: originalStock.shares * updatedStock.currentPrice
          };
          
          const updatedStocks = stocks.map(stock => 
            stock.id === stockId ? { ...revertedStock, id: stockId } : stock
          );
          setStocks(updatedStocks);
          return;
        }
      }
    }
    
    // Update the stock in state
    const updatedStocks = stocks.map(stock => 
      stock.id === stockId ? { ...updatedStock, id: stockId } : stock
    );
    setStocks(updatedStocks);
  };

  const handleDeleteStock = (stockId: string) => {
    const stockToDelete = stocks.find(stock => stock.id === stockId);
    
    if (stockToDelete && stockToDelete.ticker.toUpperCase() === 'QQQ') {
      alert('You cannot delete QQQ as it is required for the 50/50 portfolio balance!');
      return;
    }
    
    const updatedStocks = stocks.filter(stock => stock.id !== stockId);
    setStocks(updatedStocks);
  };

  const refreshPrices = () => {
    alert('In a real application, this would fetch the latest stock prices from an API.');
    
    // For demonstration purposes, we'll simulate a price change
    const updatedStocks = stocks.map(stock => {
      // Simulate a random price change between -5% and +5%
      const priceFactor = 1 + (Math.random() * 0.1 - 0.05);
      const newPrice = Math.max(0.01, stock.currentPrice * priceFactor);
      
      return {
        ...stock,
        currentPrice: parseFloat(newPrice.toFixed(2)),
        value: parseFloat((stock.shares * newPrice).toFixed(2))
      };
    });
    
    setStocks(updatedStocks);
  };
  
  const handleUpdateSettings = (updatedSettings: PortfolioSettings) => {
    console.log("Settings updated:", {
      oldSettings: settings,
      newSettings: updatedSettings
    });
    
    // Update the settings
    setSettings(updatedSettings);
  };
  
  // Add cash to the portfolio (deposit)
  const handleDeposit = (amount: number) => {
    if (amount <= 0) {
      alert('Please enter a positive amount to deposit.');
      return;
    }
    
    console.log(`Depositing ${formatCurrency(amount)} to portfolio`);
    setCashPosition(prev => prev + amount);
  };
  
  // Remove cash from the portfolio (withdraw)
  const handleWithdraw = (amount: number) => {
    if (amount <= 0) {
      alert('Please enter a positive amount to withdraw.');
      return;
    }
    
    if (amount > cashPosition) {
      alert(`Cannot withdraw ${formatCurrency(amount)}. You only have ${formatCurrency(cashPosition)} available.`);
      return;
    }
    
    console.log(`Withdrawing ${formatCurrency(amount)} from portfolio`);
    setCashPosition(prev => prev - amount);
  };
  
  const handleCreateRebalancePlan = () => {
    if (activePlan && activePlan.isActive) {
      if (!window.confirm('You already have an active rebalance plan. Do you want to create a new one?')) {
        return;
      }
    }
    
    // Create a new plan
    const newPlan = createRebalancePlan(rebalanceActions);
    setActivePlan(newPlan);
    
    // Switch to the plan tab
    setActiveTab('plan');
  };
  
  const handleExecuteTrade = (action: RebalanceAction, stockToUpdate: Stock) => {
    if (!activePlan) return;
    
    // Find the stock with ID
    const stockWithId = stocks.find(s => s.ticker === stockToUpdate.ticker);
    if (!stockWithId) return;
    
    // Execute the trade
    const { updatedStock, transaction, updatedAction, tradeValue } = executeTrade(
      action, 
      stockToUpdate, 
      activePlan.id
    );
    
    // Update the stock
    const updatedStocks = stocks.map(s => 
      s.id === stockWithId.id ? { ...updatedStock, id: stockWithId.id } : s
    );
    
    // Update the cash position based on the trade value
    // tradeValue is positive for sells (cash increases) and negative for buys (cash decreases)
    const newCashPosition = Math.max(0, cashPosition + tradeValue);
    console.log("Trade executed:", {
      action: transaction.action,
      ticker: transaction.ticker,
      shares: transaction.shares,
      price: transaction.price,
      tradeValue: tradeValue,
      oldCash: cashPosition,
      newCash: newCashPosition
    });
    setCashPosition(newCashPosition);
    
    // Update the plan
    const updatedPlan = updateRebalancePlan(activePlan, action.id);
    
    // Add transaction to history
    const updatedTransactions = [...transactions, transaction];
    
    // Update states
    setStocks(updatedStocks);
    setActivePlan(updatedPlan);
    setTransactions(updatedTransactions);
  };
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'holdings':
        return (
          <>
            <div className="portfolio-container">
              <div className="portfolio-section">
                <div className="section-header">
                  <h2>Current Holdings</h2>
                  <div className="section-actions">
                    <button className="refresh-btn" onClick={refreshPrices}>
                      <FaSync /> Refresh Prices
                    </button>
                    <button className="add-btn" onClick={handleAddStock}>
                      <FaPlus /> Add Stock
                    </button>
                  </div>
                </div>
                
                <div className="stocks-container">
                  {stocks.map((stock) => (
                    <StockItem
                      key={stock.id}
                      stock={stock}
                      totalPortfolioValue={portfolioBalance.totalValue}
                      isQqq={stock.ticker.toUpperCase() === 'QQQ'}
                      onUpdate={(updatedStock) => handleUpdateStock(updatedStock, stock.id)}
                      onDelete={() => handleDeleteStock(stock.id)}
                    />
                  ))}
                </div>
              </div>

              <div className="portfolio-section">
                <PortfolioSummary 
                  portfolioBalance={portfolioBalance} 
                  settings={settings}
                  stocks={stocks}
                />
              </div>
            </div>

            <div className="portfolio-section rebalance-section">
              <div className="section-header">
                <h2>Rebalance Actions</h2>
                <button 
                  className="create-plan-btn"
                  onClick={handleCreateRebalancePlan}
                  disabled={rebalanceActions.filter(a => a.action !== 'none').length === 0}
                >
                  <FaClipboardList /> Create Rebalance Plan
                </button>
              </div>
              <RebalanceActions actions={rebalanceActions} />
            </div>
          </>
        );
      
      case 'plan':
        return (
          <div className="portfolio-section full-width">
            <RebalancePlanView 
              plan={activePlan} 
              stocks={stocks}
              onExecuteTrade={handleExecuteTrade} 
            />
          </div>
        );
      
      case 'history':
        return (
          <div className="portfolio-section full-width">
            <TransactionHistory transactions={transactions} />
          </div>
        );
        
      case 'settings':
        return (
          <div className="portfolio-section full-width">
            <PortfolioSettingsView 
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              portfolioBalance={portfolioBalance}
            />
          </div>
        );
      
      case 'cash':
        return (
          <div className="portfolio-section full-width">
            <div className="cash-management-container">
              <CashManagement
                cashPosition={cashPosition}
                onDeposit={handleDeposit}
                onWithdraw={handleWithdraw}
              />
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Portfolio Balancer</h1>
      </header>

      <div className="app-tabs">
        <button 
          className={`tab-btn ${activeTab === 'holdings' ? 'active' : ''}`}
          onClick={() => setActiveTab('holdings')}
        >
          Holdings & Rebalance
        </button>
        <button 
          className={`tab-btn ${activeTab === 'cash' ? 'active' : ''}`}
          onClick={() => setActiveTab('cash')}
        >
          <FaMoneyBillWave /> Cash Management
        </button>
        <button 
          className={`tab-btn ${activeTab === 'plan' ? 'active' : ''}`}
          onClick={() => setActiveTab('plan')}
        >
          {activePlan && activePlan.isActive && (
            <span className="tab-badge">
              {activePlan.completedTrades}/{activePlan.totalTrades}
            </span>
          )}
          Active Plan
        </button>
        <button 
          className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Transaction History
        </button>
        <button 
          className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <FaCog /> Settings
        </button>
      </div>

      <main className="app-content">
        {renderTabContent()}
      </main>
    </div>
  );
}

export default App;
