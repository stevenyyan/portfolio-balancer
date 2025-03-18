import React from 'react';
import { RebalanceAction } from '../types';
import { FaArrowUp, FaArrowDown, FaMinus, FaExclamationTriangle } from 'react-icons/fa';

interface RebalanceActionsProps {
  actions: RebalanceAction[];
}

const RebalanceActions: React.FC<RebalanceActionsProps> = ({ actions }) => {
  // Split actions into valid (buy/sell) and invalid/incomplete
  const validActions = actions.filter(action => action.action !== 'none');
  const incompleteActions = actions.filter(action => 
    action.action === 'none' && (action.ticker === '' || action.ticker === '(No ticker)')
  );
  
  // If no actions at all, show balanced message
  if (actions.length === 0) {
    return <div className="no-actions">No rebalance actions needed. Your portfolio is balanced!</div>;
  }

  return (
    <div className="rebalance-actions">
      {validActions.length > 0 ? (
        <>
          <div className="actions-flex-table">
            <div className="actions-header">
              <div className="col ticker">Ticker</div>
              <div className="col shares">Current Shares</div>
              <div className="col shares">Target Shares</div>
              <div className="col action">Action</div>
              <div className="col shares">Shares to Buy/Sell</div>
            </div>
            
            {validActions.map((action, index) => (
              <div key={action.id} className={`actions-row ${action.action}`}>
                <div className="col ticker">{action.ticker}</div>
                <div className="col shares">{action.currentShares}</div>
                <div className="col shares">{action.targetShares}</div>
                <div className="col action">
                  {action.action === 'buy' && (
                    <span className="buy">
                      <FaArrowUp /> Buy
                    </span>
                  )}
                  {action.action === 'sell' && (
                    <span className="sell">
                      <FaArrowDown /> Sell
                    </span>
                  )}
                  {action.action === 'none' && (
                    <span className="none">
                      <FaMinus /> No Change
                    </span>
                  )}
                </div>
                <div className="col shares">{action.sharesToBuyOrSell}</div>
              </div>
            ))}
          </div>
          
          <div className="rebalance-note">
            <p>
              These are the suggested trades to achieve a 50/50 balance between QQQ and individual stocks. 
              Create a rebalance plan to execute these trades.
            </p>
          </div>
        </>
      ) : (
        <div className="no-actions">No rebalance actions needed yet.</div>
      )}
      
      {incompleteActions.length > 0 && (
        <div className="incomplete-actions">
          <div className="incomplete-header">
            <FaExclamationTriangle /> Incomplete Stocks
          </div>
          <p>
            Some stocks need more information before they can be included in rebalancing:
          </p>
          <ul>
            {incompleteActions.map(action => (
              <li key={action.id}>
                {action.ticker === '' || action.ticker === '(No ticker)' 
                  ? 'Stock missing ticker symbol' 
                  : `${action.ticker}: Missing price or shares information`}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RebalanceActions; 