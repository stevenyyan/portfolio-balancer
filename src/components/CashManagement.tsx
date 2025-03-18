import React, { useState } from 'react';
import { FaArrowUp, FaArrowDown, FaMoneyBillWave } from 'react-icons/fa';

interface CashManagementProps {
  cashPosition: number;
  onDeposit: (amount: number) => void;
  onWithdraw: (amount: number) => void;
}

const CashManagement: React.FC<CashManagementProps> = ({ 
  cashPosition, 
  onDeposit, 
  onWithdraw 
}) => {
  const [amount, setAmount] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');
  
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setAmount(isNaN(value) ? 0 : value);
  };
  
  const handleAction = () => {
    if (activeTab === 'deposit') {
      onDeposit(amount);
    } else {
      onWithdraw(amount);
    }
    setAmount(0); // Reset the amount after action
  };
  
  return (
    <div className="cash-management">
      <h3>Cash Management</h3>
      
      <div className="cash-intro">
        <p>
          Manage the cash in your portfolio by making deposits or withdrawals. 
          Depositing adds funds that can be used for new investments, while 
          withdrawing removes available cash from your portfolio.
        </p>
      </div>
      
      <div className="cash-position">
        <span className="cash-label">Current Cash Position:</span>
        <span className="cash-value">{formatCurrency(cashPosition)}</span>
      </div>
      
      <div className="cash-tabs">
        <button 
          className={`tab-btn ${activeTab === 'deposit' ? 'active' : ''}`}
          onClick={() => setActiveTab('deposit')}
        >
          <FaArrowUp /> Deposit
        </button>
        <button 
          className={`tab-btn ${activeTab === 'withdraw' ? 'active' : ''}`}
          onClick={() => setActiveTab('withdraw')}
        >
          <FaArrowDown /> Withdraw
        </button>
      </div>
      
      <div className="cash-form">
        <div className="amount-field">
          <label htmlFor="amount">Amount:</label>
          <div className="input-wrapper">
            <input
              id="amount"
              type="number"
              value={amount || ''}
              onChange={handleAmountChange}
              min="0"
              step="100"
              placeholder="Enter amount"
            />
          </div>
        </div>
        
        <div className="quick-amounts">
          <button onClick={() => setAmount(100)}>$100</button>
          <button onClick={() => setAmount(500)}>$500</button>
          <button onClick={() => setAmount(1000)}>$1,000</button>
          <button onClick={() => setAmount(5000)}>$5,000</button>
        </div>
        
        <button 
          className={`action-btn ${activeTab === 'deposit' ? 'deposit-btn' : 'withdraw-btn'}`}
          onClick={handleAction}
          disabled={amount <= 0 || (activeTab === 'withdraw' && amount > cashPosition)}
        >
          <FaMoneyBillWave /> {activeTab === 'deposit' ? 'Deposit' : 'Withdraw'} Funds
        </button>
        
        {activeTab === 'withdraw' && amount > cashPosition && (
          <div className="error-message">
            Insufficient funds. You can withdraw a maximum of {formatCurrency(cashPosition)}.
          </div>
        )}
      </div>
    </div>
  );
};

export default CashManagement; 