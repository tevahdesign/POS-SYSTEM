import React, { useState } from 'react';
import { TableItem, Order } from '../../types/pos';
import { posStore, usePosStore } from '../../store/posStore';
import { useNavigate } from 'react-router-dom';
import { Users, Clock, User, DollarSign, Printer, ShoppingBag, PauseCircle, PlayCircle } from 'lucide-react';
import { BillReceiptModal } from '../print/BillReceiptModal';
import { formatINR } from '../../utils/formatters';

interface TableDetailDrawerProps {
  table: TableItem | null;
}

export const TableDetailDrawer: React.FC<TableDetailDrawerProps> = ({ table }) => {
  const navigate = useNavigate();
  const { orders } = usePosStore();
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);

  if (!table) {
    return (
      <div className="pos-card table-detail-panel empty">
        <p className="secondary-text">Select a table from the floor plan to view details.</p>
      </div>
    );
  }

  // Find linked order if occupied or paused
  const linkedOrder = orders.find(o => o.id === table.currentOrderId || (o.tableId === table.id && !o.isPaid)) || null;

  const handleOpenOrder = () => {
    posStore.setSelectedTable(table.id, `Table ${table.number}`);
    posStore.setOrderType('Dine In');
    navigate('/orders');
  };

  const handleReopenOrder = () => {
    posStore.reopenTableOrder(table.id);
    navigate('/orders');
  };

  const handlePauseOrder = () => {
    posStore.pauseTableOrder(table.id);
  };

  const handleToggleStatus = (newStatus: 'Available' | 'Occupied' | 'Reserved' | 'Paused') => {
    posStore.updateTableStatus(table.id, newStatus);
  };

  const isPaused = table.status === 'Paused' || table.isPaused || linkedOrder?.isPaused;
  const isOccupied = table.status === 'Occupied' || Boolean(linkedOrder);

  return (
    <div className="pos-card table-detail-panel">
      <div className="drawer-title-row">
        <h3 className="section-title">Table {table.number}</h3>
        <span className={`badge ${isPaused ? 'badge-error' : isOccupied ? 'badge-occupied' : 'badge-success'}`}>
          {isPaused ? 'PAUSED' : table.status}
        </span>
      </div>

      <div className="drawer-info-grid">
        <div className="info-item">
          <span className="info-label"><Clock size={12} /> Started</span>
          <span className="info-value">{table.startTime || 'Not started'}</span>
        </div>

        <div className="info-item">
          <span className="info-label"><Users size={12} /> Guests</span>
          <span className="info-value">{table.guestCount || table.seats} Guests</span>
        </div>

        <div className="info-item">
          <span className="info-label"><User size={12} /> Server</span>
          <span className="info-value">{table.serverName || 'Unassigned'}</span>
        </div>

        <div className="info-item">
          <span className="info-label"><DollarSign size={12} /> Order Total</span>
          <span className="info-value text-orange">{formatINR(table.totalAmount || linkedOrder?.total || 0)}</span>
        </div>
      </div>

      {/* Linked Order Items Preview */}
      {linkedOrder && (
        <div className="linked-order-preview">
          <div className="preview-title-row">
            <span className="preview-title">Order {linkedOrder.orderNumber}</span>
            {isPaused && <span className="paused-tag"><PauseCircle size={12} /> Paused Order</span>}
          </div>
          <div className="preview-items-list">
            {linkedOrder.items.map((item, idx) => (
              <div key={idx} className="preview-item">
                <span>{item.quantity}x {item.product.name}</span>
                <span>{formatINR(item.itemTotal)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="drawer-actions">
        {isPaused ? (
          <button className="btn btn-primary w-full pulse-orange-btn" onClick={handleReopenOrder}>
            <PlayCircle size={16} /> Reopen Table Order
          </button>
        ) : isOccupied ? (
          <>
            <button className="btn btn-primary w-full" onClick={handleReopenOrder}>
              <PlayCircle size={16} /> Reopen & Add Items
            </button>
            <button className="btn btn-secondary w-full" onClick={handlePauseOrder}>
              <PauseCircle size={16} /> Pause Order (Hold Table)
            </button>
          </>
        ) : (
          <button className="btn btn-primary w-full" onClick={handleOpenOrder}>
            <ShoppingBag size={16} /> New Order
          </button>
        )}

        {(isOccupied || isPaused) && linkedOrder && (
          <button
            className="btn btn-outline-orange w-full"
            onClick={() => setReceiptModalOpen(true)}
          >
            <Printer size={16} />
            Print Bill / Receipt
          </button>
        )}

        <div className="status-toggle-row">
          <button
            className={`btn btn-secondary btn-sm flex-1 ${table.status === 'Available' ? 'active-status' : ''}`}
            onClick={() => handleToggleStatus('Available')}
          >
            Available
          </button>
          <button
            className={`btn btn-secondary btn-sm flex-1 ${table.status === 'Reserved' ? 'active-status' : ''}`}
            onClick={() => handleToggleStatus('Reserved')}
          >
            Reserve
          </button>
        </div>
      </div>

      <BillReceiptModal
        isOpen={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
        order={linkedOrder}
      />

      <style>{`
        .table-detail-panel {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 20px;
        }

        .table-detail-panel.empty {
          align-items: center;
          justify-content: center;
          text-align: center;
          min-height: 300px;
        }

        .drawer-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--border-color);
        }

        .drawer-info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
          background: #FAF9F6;
          padding: 8px 10px;
          border-radius: var(--radius-sm);
        }

        .info-label {
          font-size: 11px;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .info-value {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .text-orange {
          color: var(--primary-orange);
        }

        .linked-order-preview {
          background: #FFF7ED;
          border: 1px solid #FFEDD5;
          border-radius: var(--radius-sm);
          padding: 10px;
          font-size: 12px;
        }

        .preview-title {
          font-weight: 700;
          color: var(--primary-orange);
          margin-bottom: 6px;
        }

        .preview-items-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .preview-item {
          display: flex;
          justify-content: space-between;
          color: var(--text-primary);
        }

        .drawer-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: auto;
        }

        .w-full { width: 100%; }
        .flex-1 { flex: 1; }

        .status-toggle-row {
          display: flex;
          gap: 8px;
        }

        .active-status {
          border-color: var(--primary-orange);
          color: var(--primary-orange);
          font-weight: 700;
        }
      `}</style>
    </div>
  );
};
