import React from 'react';

interface StatusBadgeProps {
  status: string;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, variant }) => {
  const getVariant = (): 'success' | 'warning' | 'error' | 'info' | 'neutral' => {
    if (variant) return variant;
    const s = status.toLowerCase();
    if (s === 'completed' || s === 'matched' || s === 'good' || s === 'available' || s === 'ready' || s === 'active') {
      return 'success';
    }
    if (s === 'preparing' || s === 'pending' || s === 'medium' || s === 'occupied' || s === 'in-progress') {
      return 'warning';
    }
    if (s === 'cancelled' || s === 'difference' || s === 'low' || s === 'inactive') {
      return 'error';
    }
    if (s === 'reserved' || s === 'new' || s === 'dine in' || s === 'takeaway' || s === 'delivery') {
      return 'info';
    }
    return 'neutral';
  };

  const v = getVariant();

  return (
    <span className={`badge badge-${v}`}>
      <span className="badge-dot" />
      {status}
      <style>{`
        .badge-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background-color: currentColor;
        }
      `}</style>
    </span>
  );
};
