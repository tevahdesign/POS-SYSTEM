import React, { useState } from 'react';
import { Plus, Minus, Trash2, ChevronDown, Send, PauseCircle, CreditCard, Lock, Unlock, KeyRound, Check, RefreshCw, ArrowLeft } from 'lucide-react';
import { posStore, usePosStore } from '../../store/posStore';
import { OrderType, Order } from '../../types/pos';
import { BillReceiptModal } from '../print/BillReceiptModal';
import { formatINR } from '../../utils/formatters';

interface CartPanelProps {
  onHoldSuccess?: () => void;
  onSendSuccess?: (order: Order) => void;
  onReturnToCatalog?: () => void;
}

export const CartPanel: React.FC<CartPanelProps> = ({ onHoldSuccess, onSendSuccess, onReturnToCatalog }) => {
  const {
    activeOrderType,
    selectedTableId,
    selectedTableName,
    cart,
    tables,
    orders,
    settings,
    currentUser,
    staff
  } = usePosStore();

  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [createdOrderForReceipt, setCreatedOrderForReceipt] = useState<Order | null>(null);
  
  // Manager PIN Unlock modal state
  const [isOrderUnlocked, setIsOrderUnlocked] = useState(false);
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [managerPin, setManagerPin] = useState('');
  const [pinError, setPinError] = useState('');

  const activeTable = tables.find(t => t.id === selectedTableId);
  const linkedOrder = selectedTableId ? orders.find(o => (o.tableId === selectedTableId || o.id === activeTable?.currentOrderId) && !o.isPaid) : null;

  const subtotal = cart.reduce((sum, item) => sum + item.itemTotal, 0);
  const tax = Number((subtotal * (settings.taxRate / 100)).toFixed(2));
  const discount = 0;
  const total = Number((subtotal + tax - discount).toFixed(2));

  const isManager = currentUser.role === 'Manager' || currentUser.role === 'Owner';

  const handleUnlockRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const matchedManager = staff.find(s => (s.role === 'Manager' || s.role === 'Owner') && s.pin === managerPin);
    if (matchedManager) {
      setIsOrderUnlocked(true);
      setPinModalOpen(false);
      setManagerPin('');
      setPinError('');
    } else {
      setPinError('Invalid Manager PIN. Default PIN is 1234.');
    }
  };

  const handleTypeChange = (type: OrderType) => {
    posStore.setOrderType(type);
  };

  const handleTableChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (!val) {
      posStore.setSelectedTable(undefined, undefined);
    } else {
      const t = tables.find(item => item.id === val);
      posStore.setSelectedTable(val, t ? `Table ${t.number}` : undefined);
    }
  };

  const handleSendToKitchen = () => {
    const order = posStore.sendToKitchen();
    if (order) {
      setCreatedOrderForReceipt(order);
      if (onSendSuccess) onSendSuccess(order);
    }
  };

  const handlePauseOrHoldOrder = () => {
    if (selectedTableId) {
      posStore.pauseTableOrder(selectedTableId);
    } else {
      posStore.holdCurrentOrder();
    }
    if (onHoldSuccess) onHoldSuccess();
  };

  const handlePayDirect = () => {
    const order = posStore.sendToKitchen();
    if (order) {
      posStore.payOrder(order.id, 'UPI');
      setCreatedOrderForReceipt(order);
      setReceiptModalOpen(true);
    }
  };

  return (
    <div className="pos-card cart-panel">
      {/* Mobile Back Button */}
      {onReturnToCatalog && (
        <button className="cart-mobile-back-btn" onClick={onReturnToCatalog}>
          <ArrowLeft size={16} />
          <span>Back to Menu Catalog</span>
        </button>
      )}

      {/* Order Type Tabs */}
      <div className="order-type-tabs">
        {(['Dine In', 'Takeaway', 'Delivery'] as const).map((type) => (
          <button
            key={type}
            className={`type-tab ${activeOrderType === type ? 'active' : ''}`}
            onClick={() => handleTypeChange(type)}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Reopened / Active Table Alert Banner */}
      {selectedTableId && linkedOrder && (
        <div className="active-table-banner">
          <RefreshCw size={13} className="spin-icon text-orange" />
          <span>Active Table Order: <strong>{selectedTableName || `Table ${activeTable?.number}`}</strong></span>
        </div>
      )}

      {/* Table Selector for Dine In */}
      {activeOrderType === 'Dine In' && (
        <div className="table-select-row">
          <label className="secondary-text">Table:</label>
          <div className="select-wrapper">
            <select
              value={selectedTableId || ''}
              onChange={handleTableChange}
              className="table-select"
            >
              <option value="">Select Table...</option>
              {tables.map((table) => (
                <option key={table.id} value={table.id}>
                  Table {table.number} ({table.seats} Seats) — {table.status}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="select-arrow" />
          </div>
        </div>
      )}

      {/* Cart Items List */}
      <div className="cart-items-container">
        {cart.length === 0 ? (
          <div className="cart-empty-state">
            <p className="empty-title">Cart is empty</p>
            <p className="empty-sub">Select items from catalog to start an order.</p>
          </div>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-info">
                <div className="cart-item-header">
                  <span className="cart-item-qty-badge">{item.quantity}x</span>
                  <span className="cart-item-name">{item.product.name}</span>
                  <span className="cart-item-price">{formatINR(item.itemTotal)}</span>
                </div>

                {/* Modifiers & Notes */}
                {item.selectedModifiers.length > 0 && (
                  <div className="cart-item-mods">
                    {item.selectedModifiers.map((m) => (
                      <span key={m.id} className="mod-tag">+ {m.name} ({formatINR(m.price)})</span>
                    ))}
                  </div>
                )}
                {item.notes && <div className="cart-item-note">Note: {item.notes}</div>}
              </div>

              {/* Quantity Controls */}
              <div className="cart-item-controls">
                <button
                  className="cart-qty-btn"
                  onClick={() => posStore.updateCartQuantity(item.id, -1)}
                >
                  <Minus size={12} />
                </button>
                <span className="cart-qty-val">{item.quantity}</span>
                <button
                  className="cart-qty-btn"
                  onClick={() => posStore.updateCartQuantity(item.id, 1)}
                >
                  <Plus size={12} />
                </button>
                <button
                  className="cart-delete-btn"
                  onClick={() => posStore.removeFromCart(item.id)}
                  title="Remove item"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Order Totals Breakdown */}
      <div className="cart-totals-section">
        <div className="summary-row">
          <span>Subtotal</span>
          <span>{formatINR(subtotal)}</span>
        </div>
        <div className="summary-row">
          <span>Tax ({settings.taxRate}%)</span>
          <span>{formatINR(tax)}</span>
        </div>
        {discount > 0 && (
          <div className="summary-row discount">
            <span>Discount</span>
            <span>-{formatINR(discount)}</span>
          </div>
        )}
        <div className="summary-row grand-total-row">
          <span>Total</span>
          <span>{formatINR(total)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="cart-action-buttons">
        <div className="action-row-top">
          <button
            className="btn btn-secondary flex-1"
            onClick={handlePauseOrHoldOrder}
            disabled={cart.length === 0}
            title={selectedTableId ? "Pause order & save table state" : "Hold current order"}
          >
            <PauseCircle size={15} />
            {selectedTableId ? "Pause Table" : "Hold Order"}
          </button>
          <button
            className="btn btn-secondary flex-1"
            onClick={() => posStore.clearCart()}
            disabled={cart.length === 0}
          >
            Clear Cart
          </button>
        </div>

        <button
          className="btn btn-primary btn-lg w-full send-kitchen-btn"
          onClick={handleSendToKitchen}
          disabled={cart.length === 0}
        >
          <Send size={16} />
          {linkedOrder ? "Update & Send to Kitchen" : "Send to Kitchen"}
        </button>

        <button
          className="btn btn-secondary btn-sm w-full"
          onClick={handlePayDirect}
          disabled={cart.length === 0}
          style={{ marginTop: '6px' }}
        >
          <CreditCard size={14} />
          Instant Settle & Print Bill
        </button>
      </div>

      {/* Manager PIN Unlock Modal */}
      {pinModalOpen && (
        <div className="modal-backdrop" onClick={() => setPinModalOpen(false)}>
          <div className="modal-content pin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-title">
                <Lock size={20} className="modal-icon text-orange" />
                <div>
                  <h3>Manager Authorization Required</h3>
                  <p className="secondary-text">Enter Manager PIN to modify sent or locked order</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleUnlockRequest} className="pin-form">
              {pinError && <div className="pin-error-alert">{pinError}</div>}
              
              <div className="pin-input-group">
                <KeyRound size={18} className="input-icon" />
                <input
                  type="password"
                  maxLength={4}
                  className="input-field pin-field"
                  placeholder="• • • •"
                  value={managerPin}
                  onChange={(e) => setManagerPin(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setPinModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  <Unlock size={14} /> Authorize Unlock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Print Bill Receipt Modal */}
      <BillReceiptModal
        isOpen={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
        order={createdOrderForReceipt}
      />

      <style>{`
        .cart-panel {
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 16px;
          gap: 12px;
        }

        .order-type-tabs {
          display: flex;
          background: #F3F4F6;
          padding: 3px;
          border-radius: 8px;
        }

        .active-table-banner {
          background: #FFF7ED;
          border: 1px solid #FFEDD5;
          color: #C2410C;
          padding: 8px 12px;
          border-radius: var(--radius-sm);
          font-size: 11px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .type-tab {
          flex: 1;
          padding: 7px 0;
          font-size: 12px;
          font-weight: 600;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .type-tab.active {
          background: #FFFFFF;
          color: var(--primary-orange);
          box-shadow: 0 1px 3px rgba(0,0,0,0.08);
        }

        .table-select-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .select-wrapper {
          position: relative;
          flex: 1;
        }

        .table-select {
          width: 100%;
          padding: 6px 10px;
          font-size: 12px;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          background: #FFFFFF;
          appearance: none;
          cursor: pointer;
        }

        .select-arrow {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
        }

        .cart-items-container {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 10px;
          min-height: 200px;
          max-height: 380px;
          padding-right: 4px;
        }

        .cart-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: var(--text-muted);
          text-align: center;
          padding: 20px;
        }

        .empty-title {
          font-weight: 600;
          font-size: 14px;
          color: var(--text-secondary);
        }

        .empty-sub {
          font-size: 12px;
        }

        .cart-item {
          display: flex;
          justify-content: space-between;
          padding: 10px;
          background: #FAF9F6;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
        }

        .cart-item-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .cart-item-header {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .cart-item-qty-badge {
          font-weight: 700;
          font-size: 12px;
          color: var(--primary-orange);
        }

        .cart-item-name {
          font-weight: 600;
          font-size: 12px;
          flex: 1;
        }

        .cart-item-price {
          font-weight: 700;
          font-size: 12px;
        }

        .cart-item-mods {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }

        .mod-tag {
          font-size: 10px;
          color: var(--text-secondary);
          background: #E5E7EB;
          padding: 1px 4px;
          border-radius: 3px;
        }

        .cart-item-note {
          font-size: 10px;
          color: #D97706;
          font-style: italic;
        }

        .cart-item-controls {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-left: 8px;
        }

        .cart-qty-btn {
          width: 22px;
          height: 22px;
          border-radius: 4px;
          border: 1px solid var(--border-color);
          background: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .cart-qty-val {
          font-size: 12px;
          font-weight: 600;
          width: 14px;
          text-align: center;
        }

        .cart-delete-btn {
          width: 22px;
          height: 22px;
          border-radius: 4px;
          border: none;
          background: #FEE2E2;
          color: #DC2626;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          margin-left: 4px;
        }

        .cart-totals-section {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding-top: 10px;
          border-top: 1px solid var(--border-color);
          font-size: 12px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          color: var(--text-secondary);
        }

        .grand-total-row {
          font-size: 16px;
          font-weight: 800;
          color: var(--text-primary);
          padding-top: 4px;
          border-top: 1px dashed var(--border-color);
        }

        .cart-action-buttons {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .action-row-top {
          display: flex;
          gap: 8px;
        }

        .flex-1 { flex: 1; }
        .w-full { width: 100%; }

        .send-kitchen-btn {
          height: 44px;
          font-size: 14px;
          font-weight: 700;
          border-radius: 10px;
        }

        .cart-mobile-back-btn {
          display: none;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 8px;
          background: #F3F4F6;
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          margin-bottom: 8px;
        }

        @media (max-width: 900px) {
          .cart-mobile-back-btn {
            display: flex;
          }
        }
      `}</style>
    </div>
  );
};
