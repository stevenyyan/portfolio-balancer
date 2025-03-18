import React from 'react';
import { RebalancePlan, RebalanceAction, Stock } from '../types';
import { FaCheckCircle, FaPlayCircle } from 'react-icons/fa';

interface RebalancePlanViewProps {
  plan: RebalancePlan | null;
  stocks: Stock[];
  onExecuteTrade: (action: RebalanceAction, stock: Stock) => void;
}

const RebalancePlanView: React.FC<RebalancePlanViewProps> = ({ 
  plan, 
  stocks, 
  onExecuteTrade 
}) => {
  if (!plan) {
    return (
      <div className="rebalance-plan empty-plan">
        <h2>No Active Rebalance Plan</h2>
        <p>Create a rebalance plan to start tracking your trades.</p>
      </div>
    );
  }

  // Filter out 'none' actions
  const actionsToShow = plan.actions.filter(action => action.action !== 'none');

  // Format date
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(plan.date));

  // Calculate progress percentage
  const progressPercentage = plan.totalTrades > 0 
    ? Math.round((plan.completedTrades / plan.totalTrades) * 100) 
    : 0;

  return (
    <div className="rebalance-plan">
      <div className="plan-header">
        <h2>Rebalance Plan</h2>
        <div className="plan-meta">
          <span className="plan-date">Created: {formattedDate}</span>
          <div className="plan-progress">
            <div className="progress-bar">
              <div 
                className="progress-filled" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <span className="progress-text">
              {plan.completedTrades} of {plan.totalTrades} trades completed ({progressPercentage}%)
            </span>
          </div>
        </div>
      </div>

      <div className="plan-actions">
        <table className="actions-table">
          <thead>
            <tr>
              <th>Ticker</th>
              <th>Current Shares</th>
              <th>Target Shares</th>
              <th>Action</th>
              <th>Shares</th>
              <th>Status</th>
              <th>Execute</th>
            </tr>
          </thead>
          <tbody>
            {actionsToShow.map(action => {
              const stock = stocks.find(s => s.ticker === action.ticker);
              const isCompleted = action.status === 'completed';
              
              return (
                <tr key={action.id} className={`action-row ${action.action} ${isCompleted ? 'completed' : ''}`}>
                  <td className="ticker">{action.ticker}</td>
                  <td>{action.currentShares}</td>
                  <td>{action.targetShares}</td>
                  <td className={`action ${action.action}`}>
                    {action.action === 'buy' ? 'Buy' : 'Sell'}
                  </td>
                  <td>{action.sharesToBuyOrSell}</td>
                  <td className="status">
                    {isCompleted ? (
                      <span className="completed-status">
                        <FaCheckCircle /> Completed
                      </span>
                    ) : (
                      <span className="pending-status">Pending</span>
                    )}
                  </td>
                  <td>
                    {!isCompleted && stock && (
                      <button 
                        className="execute-btn"
                        onClick={() => onExecuteTrade(action, stock)}
                        disabled={isCompleted}
                      >
                        <FaPlayCircle /> Execute
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {plan.isActive && plan.completedTrades < plan.totalTrades && (
        <div className="plan-footer">
          <p className="plan-note">
            Complete all trades to rebalance your portfolio. Your stock data will be updated
            as you execute each trade.
          </p>
        </div>
      )}

      {!plan.isActive && (
        <div className="plan-footer completed">
          <h3>Rebalance Plan Completed!</h3>
          <p>All trades have been executed. Your portfolio is now rebalanced.</p>
        </div>
      )}
    </div>
  );
};

export default RebalancePlanView; 