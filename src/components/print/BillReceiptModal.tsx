import React from 'react';
import { Printer, Check } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Order } from '../../types/pos';
import { usePosStore } from '../../store/posStore';
import { formatINR } from '../../utils/formatters';

interface BillReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

export const BillReceiptModal: React.FC<BillReceiptModalProps> = ({
  isOpen,
  onClose,
  order
}) => {
  const { settings } = usePosStore();

  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Customer Bill / Receipt" maxWidth="420px">
      <div className="receipt-paper" id="printable-receipt">
        <div className="receipt-header">
          <h2 className="receipt-brand">{settings.restaurantName}</h2>
          <p className="receipt-address">{settings.address}</p>
          <p className="receipt-phone">Tel: {settings.phone}</p>
        </div>

        <div className="receipt-divider" />

        <div className="receipt-meta">
          <div><strong>Order:</strong> {order.orderNumber} ({order.type})</div>
          <div><strong>Table:</strong> {order.tableName || 'N/A'}</div>
          <div><strong>Date:</strong> {order.createdAt}</div>
          <div><strong>Server:</strong> {order.staffName}</div>
        </div>

        <div className="receipt-divider" />

        <table className="receipt-table">
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>Item</th>
              <th style={{ textAlign: 'center' }}>Qty</th>
              <th style={{ textAlign: 'right' }}>Price</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, idx) => (
              <tr key={idx}>
                <td>
                  <div>{item.product.name}</div>
                  {item.selectedModifiers.map(m => (
                    <div key={m.id} className="receipt-mod">+ {m.name}</div>
                  ))}
                </td>
                <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                <td style={{ textAlign: 'right' }}>{formatINR(item.itemTotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="receipt-divider" />

        <div className="receipt-totals">
          <div className="total-row">
            <span>Subtotal:</span>
            <span>{formatINR(order.subtotal)}</span>
          </div>
          <div className="total-row">
            <span>Tax ({settings.taxRate}%):</span>
            <span>{formatINR(order.tax)}</span>
          </div>
          {order.discount > 0 && (
            <div className="total-row discount">
              <span>Discount:</span>
              <span>-{formatINR(order.discount)}</span>
            </div>
          )}
          <div className="total-row grand-total">
            <span>Total Amount:</span>
            <span>{formatINR(order.total)}</span>
          </div>
        </div>

        <div className="receipt-divider" />

        <div className="receipt-footer">
          <p>{settings.receiptFooterText}</p>
          <div className="receipt-paid-stamp">
            {order.isPaid ? 'PAID — THANK YOU' : 'UNPAID BILL'}
          </div>
        </div>
      </div>

      <div className="modal-actions">
        <button className="btn btn-secondary" onClick={onClose}>
          Close
        </button>
        <button className="btn btn-primary" onClick={handlePrint}>
          <Printer size={16} />
          Print Receipt
        </button>
      </div>

      <style>{`
        .receipt-paper {
          background: #FFFFFF;
          border: 1px dashed #D1D5DB;
          border-radius: 8px;
          padding: 20px;
          font-family: 'Courier New', Courier, monospace;
          font-size: 12px;
          color: #111827;
        }

        .receipt-header {
          text-align: center;
          margin-bottom: 12px;
        }

        .receipt-brand {
          font-size: 18px;
          font-weight: 700;
          font-family: var(--font-family);
          color: var(--primary-orange);
          margin-bottom: 4px;
        }

        .receipt-address, .receipt-phone {
          font-size: 11px;
          color: #6B7280;
        }

        .receipt-divider {
          border-top: 1px dashed #9CA3AF;
          margin: 12px 0;
        }

        .receipt-meta {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
          font-size: 11px;
        }

        .receipt-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 11px;
        }

        .receipt-table th {
          border-bottom: 1px solid #E5E7EB;
          padding-bottom: 4px;
        }

        .receipt-table td {
          padding: 4px 0;
          vertical-align: top;
        }

        .receipt-mod {
          font-size: 10px;
          color: #6B7280;
          padding-left: 6px;
        }

        .receipt-totals {
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: 12px;
        }

        .total-row {
          display: flex;
          justify-content: space-between;
        }

        .grand-total {
          font-weight: 700;
          font-size: 14px;
          margin-top: 4px;
          color: var(--primary-orange);
        }

        .receipt-footer {
          text-align: center;
          font-size: 11px;
          color: #4B5563;
        }

        .receipt-paid-stamp {
          margin-top: 10px;
          display: inline-block;
          border: 2px solid ${order.isPaid ? 'var(--status-success)' : 'var(--status-warning)'};
          color: ${order.isPaid ? 'var(--status-success)' : 'var(--status-warning)'};
          font-weight: 800;
          padding: 4px 12px;
          border-radius: 4px;
          letter-spacing: 0.05em;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 16px;
        }
      `}</style>
    </Modal>
  );
};
