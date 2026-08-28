import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string;
  change: string;
  isPositive?: boolean;
  subtitle?: string;
  icon?: React.ReactNode;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  subtitle = 'vs yesterday',
  icon
}) => {
  return (
    <div className="pos-card kpi-card">
      <div className="kpi-header">
        <span className="kpi-title">{title}</span>
        {icon && <div className="kpi-icon-bg">{icon}</div>}
      </div>

      <div className="kpi-value">{value}</div>

      <div className="kpi-footer">
        <span className={`kpi-change-pill ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {change}
        </span>
        <span className="kpi-subtitle">{subtitle}</span>
      </div>

      <style>{`
        .kpi-card {
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
          min-width: 160px;
        }

        .kpi-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .kpi-title {
          font-size: 12px;
          font-weight: 500;
          color: var(--text-secondary);
        }

        .kpi-icon-bg {
          color: var(--text-muted);
        }

        .kpi-value {
          font-size: 24px;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.02em;
        }

        .kpi-footer {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
        }

        .kpi-change-pill {
          display: flex;
          align-items: center;
          gap: 2px;
          font-weight: 600;
          padding: 1px 6px;
          border-radius: 4px;
        }

        .kpi-change-pill.positive {
          color: var(--status-success);
          background-color: var(--status-success-bg);
        }

        .kpi-change-pill.negative {
          color: var(--status-error);
          background-color: var(--status-error-bg);
        }

        .kpi-subtitle {
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
};
