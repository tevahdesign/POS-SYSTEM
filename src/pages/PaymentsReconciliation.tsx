import React, { useState } from 'react';
import { Header } from '../components/common/Header';
import { StatusBadge } from '../components/common/StatusBadge';
import { AuditModal } from '../components/reconciliation/AuditModal';
import { usePosStore } from '../store/posStore';
import { PaymentTransaction } from '../types/pos';
import { Calendar, AlertCircle } from 'lucide-react';
import { formatINR } from '../utils/formatters';

export const PaymentsReconciliation: React.FC = () => {
  const { payments } = usePosStore();
  const [activeTab, setActiveTab] = useState<'Payments' | 'Reconciliation'>('Reconciliation');
  const [selectedTx, setSelectedTx] = useState<PaymentTransaction | null>(null);
  const [auditModalOpen, setAuditModalOpen] = useState(false);

  const posSalesTotal = payments.reduce((sum, p) => sum + p.posAmount, 0);
  const bankDepositsTotal = payments.reduce((sum, p) => sum + p.bankAmount, 0);
  const totalDifference = bankDepositsTotal - posSalesTotal;

  const handleTxClick = (tx: PaymentTransaction) => {
    setSelectedTx(tx);
    setAuditModalOpen(true);
  };

  return (
    <div className="main-content">
      <Header title="Payments & Reconciliation" />

      {/* Primary Navigation Tabs */}
      <div className="nav-tabs">
        {(['Payments', 'Reconciliation'] as const).map((tab) => (
          <button
            key={tab}
            className={`tab-item ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Date Bar */}
      <div className="reconcile-date-bar">
        <div className="date-badge">
          <Calendar size={14} className="icon-orange" />
          <span>15 Jun 2026</span>
        </div>
      </div>

      {/* Reconciliation Summary Cards */}
      <div className="reconcile-summary-grid">
        <div className="pos-card recon-card">
          <span className="recon-card-title">POS Sales</span>
          <span className="recon-card-value">{formatINR(posSalesTotal)}</span>
        </div>

        <div className="pos-card recon-card">
          <span className="recon-card-title">Bank Deposits</span>
          <span className="recon-card-value">{formatINR(bankDepositsTotal)}</span>
        </div>

        <div className="pos-card recon-card diff-card">
          <span className="recon-card-title">Difference</span>
          <span className={`recon-card-value ${totalDifference < 0 ? 'text-red' : 'text-green'}`}>
            {formatINR(Math.abs(totalDifference))}
          </span>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="pos-card p-0">
        <div className="table-header-title">
          <h3 className="section-title">Transactions Log</h3>
        </div>

        <div className="pos-table-container">
          <table className="pos-table">
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Method</th>
                <th>POS Amount</th>
                <th>Bank Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((tx) => (
                <tr key={tx.id} className="clickable-row" onClick={() => handleTxClick(tx)}>
                  <td className="font-semibold">{tx.paymentId}</td>
                  <td>
                    <span className="method-pill">{tx.method}</span>
                  </td>
                  <td className="font-semibold">{formatINR(tx.posAmount)}</td>
                  <td className="font-semibold">{formatINR(tx.bankAmount)}</td>
                  <td>
                    <StatusBadge status={tx.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AuditModal
        isOpen={auditModalOpen}
        onClose={() => setAuditModalOpen(false)}
        transaction={selectedTx}
      />

      <style>{`
        .reconcile-date-bar {
          display: flex;
          align-items: center;
          margin-bottom: 16px;
        }

        .date-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          padding: 6px 12px;
          border-radius: var(--radius-sm);
          font-size: 12px;
          font-weight: 600;
        }

        .icon-orange {
          color: var(--primary-orange);
        }

        .reconcile-summary-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 20px;
        }

        .recon-card {
          display: flex;
          flex-direction: column;
          gap: 6px;
          text-align: center;
          padding: 20px;
        }

        .recon-card-title {
          font-size: 12px;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .recon-card-value {
          font-size: 22px;
          font-weight: 800;
          color: var(--text-primary);
        }

        .text-red {
          color: #DC2626;
        }

        .text-green {
          color: var(--status-success);
        }

        .table-header-title {
          padding: 14px 16px;
          border-bottom: 1px solid var(--border-color);
        }

        .method-pill {
          background: #F3F4F6;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
        }

        .clickable-row {
          cursor: pointer;
        }

        .p-0 { padding: 0 !important; }

        @media (max-width: 768px) {
          .reconcile-summary-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
