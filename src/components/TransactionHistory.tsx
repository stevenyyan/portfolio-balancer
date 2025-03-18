import React from 'react';
import { Transaction } from '../types';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

interface TransactionHistoryProps {
  transactions: Transaction[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
  if (transactions.length === 0) {
    return (
      <div className="transaction-history empty">
        <h2>Transaction History</h2>
        <p className="empty-message">No transactions yet. Execute trades to build your history.</p>
      </div>
    );
  }

  // Sort transactions by date (newest first)
  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  // Format date
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  return (
    <div className="transaction-history">
      <h2>Transaction History</h2>
      
      <div className="transactions-table-container">
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Ticker</th>
              <th>Action</th>
              <th>Shares</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {sortedTransactions.map(transaction => {
              const total = transaction.shares * transaction.price;
              
              return (
                <tr key={transaction.id} className={`transaction-row ${transaction.action}`}>
                  <td>{formatDate(transaction.date)}</td>
                  <td className="ticker">{transaction.ticker}</td>
                  <td className={`action ${transaction.action}`}>
                    {transaction.action === 'buy' ? (
                      <span className="buy-action">
                        <FaArrowUp /> Buy
                      </span>
                    ) : (
                      <span className="sell-action">
                        <FaArrowDown /> Sell
                      </span>
                    )}
                  </td>
                  <td>{transaction.shares}</td>
                  <td>{formatCurrency(transaction.price)}</td>
                  <td className="total">{formatCurrency(total)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionHistory; 