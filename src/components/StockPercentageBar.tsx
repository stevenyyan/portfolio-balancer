import React from 'react';

interface StockPercentageBarProps {
  percentage: number;
  label?: string;
  threshold?: number;
  className?: string;
}

const StockPercentageBar: React.FC<StockPercentageBarProps> = ({ 
  percentage, 
  label,
  threshold = 10, // Default threshold of 10% to highlight
  className = ''
}) => {
  // Determine color based on percentage
  const getBarColor = () => {
    if (percentage > 40) return 'var(--danger-color)';
    if (percentage > 25) return 'var(--warning-color)';
    if (percentage > 10) return 'var(--success-color)';
    return 'var(--secondary-color)';
  };
  
  // Format percentage for display
  const formattedPercentage = percentage.toFixed(2) + '%';
  
  return (
    <div className={`percentage-bar-container ${className}`}>
      <div className="percentage-bar-outer">
        <div 
          className="percentage-bar-inner" 
          style={{ 
            width: `${Math.min(percentage, 100)}%`,
            backgroundColor: getBarColor()
          }}
        />
      </div>
      <div className="percentage-value">{formattedPercentage}</div>
    </div>
  );
};

export default StockPercentageBar; 