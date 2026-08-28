import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { PaymentTransaction } from '../../types/pos';
import { posStore } from '../../store/posStore';
import { formatINR } from '../../utils/formatters';

interface AuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: PaymentTransaction | null;
}

export const AuditModal: React.FC<AuditModalProps> = ({
  isOpen,
  onClose,
  transaction
}) => {
  const [bankAmount, setBankAmount] = useState('');
  const [auditNote, setAuditNote] = useState('');

  if (!transaction) return null;

  const handleResolve = () => {
    const updatedBank = parseFloat(bankAmount) || transaction.posAmount;
    const diff = Number((updatedBank - transaction.posAmount).toFixed(2));
    const newStatus = diff === 0 ? 'Matched' : 'Difference';

    // Update in store
    const state = posStore.getState();
    const updatedPayments = state.payments.map(p => {
      if (p.id === transaction.id) {
        return {
          ...p,
          bankAmount: updatedBank,
          difference: diff,
          status: newStatus as any
        };
      }
      return p;
    });

    state.payments = updatedPayments;
    posStore.setCurrentUser(state.currentUser); // triggers saveState
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Reconcile Transaction: ${transaction.paymentId}`}
      maxWidth="480px"
    >
      <div className="audit-body">
        <div className="audit-summary-box">
          <div className="summary-line">
            <span>Payment ID:</span> <strong>{transaction.paymentId}</strong>
          </div>
          <div className="summary-line">
            <span>Method:</span> <strong>{transaction.method}</strong>
          </div>
          <div className="summary-line">
            <span>POS Sales Amount:</span> <strong>{formatINR(transaction.posAmount)}</strong>
          </div>
          <div className="summary-line">
            <span>Current Bank Amount:</span> <strong>{formatINR(transaction.bankAmount)}</strong>
          </div>
          <div className="summary-line diff">
            <span>Discrepancy:</span> <strong className="text-red">{formatINR(transaction.difference)}</strong>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Corrected Bank Deposit Amount (₹)</label>
          <input
            type="number"
            step="0.01"
            className="input-field"
            defaultValue={transaction.posAmount}
            onChange={(e) => setBankAmount(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Audit Reason / Note</label>
          <input
            type="text"
            className="input-field"
            placeholder="e.g. Card terminal batch fee adjustment"
            value={auditNote}
            onChange={(e) => setAuditNote(e.target.value)}
          />
        </div>

        <div className="form-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleResolve}>
            Resolve Discrepancy
          </button>
        </div>
      </div>

      <style>{`
        .audit-body {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .audit-summary-box {
          background: #FAF9F6;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 12px;
        }

        .summary-line {
          display: flex;
          justify-content: space-between;
        }

        .text-red {
          color: #DC2626;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .form-label {
          font-size: 12px;
          font-weight: 600;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          padding-top: 10px;
          border-top: 1px solid var(--border-color);
        }
      `}</style>
    </Modal>
  );
};
