import React, { useState } from 'react';
import { Header } from '../components/common/Header';
import { TicketCard } from '../components/kds/TicketCard';
import { posStore, usePosStore } from '../store/posStore';
import { KitchenStatus } from '../types/pos';
import { Maximize2, Filter, AlertTriangle, Package, Plus, Minus, Send, X, Check } from 'lucide-react';

export const KitchenDisplay: React.FC = () => {
  const { kitchenTickets, ingredients } = usePosStore();
  const [activeFilter, setActiveFilter] = useState<'All' | KitchenStatus>('All');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [sentAlertId, setSentAlertId] = useState<string | null>(null);

  const counts = {
    All: kitchenTickets.length,
    New: kitchenTickets.filter(t => t.status === 'New').length,
    'In-Progress': kitchenTickets.filter(t => t.status === 'In-Progress').length,
    Ready: kitchenTickets.filter(t => t.status === 'Ready').length
  };

  const filteredTickets = kitchenTickets.filter(t => {
    if (activeFilter === 'All') return true;
    return t.status === activeFilter;
  });

  const handleStockChange = (ingredientId: string, delta: number, currentStock: number) => {
    const nextVal = Math.max(0, Number((currentStock + delta).toFixed(1)));
    posStore.updateIngredientStock(ingredientId, nextVal);
  };

  const handleSendAlert = (ingredientId: string, ingredientName: string) => {
    posStore.sendLowStockAlert(ingredientId, `Kitchen staff flagged low stock for ${ingredientName}. Immediate restock requested.`);
    setSentAlertId(ingredientId);
    setTimeout(() => setSentAlertId(null), 2500);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error('Error enabling fullscreen mode:', err);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  return (
    <div className={`main-content ${isFullscreen ? 'fullscreen-kds' : ''}`}>
      <Header title="KDS - Kitchen Display" />

      {/* Filter Chips & Action Controls */}
      <div className="kds-controls-bar">
        <div className="kds-filter-chips">
          {(['All', 'New', 'In-Progress', 'Ready'] as const).map((filter) => (
            <button
              key={filter}
              className={`filter-chip ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter} ({counts[filter]})
            </button>
          ))}
        </div>

        <div className="kds-actions-right">
          <button className="btn btn-warning btn-sm" onClick={() => setShowStockModal(true)}>
            <AlertTriangle size={14} /> Quick Stock & Low Alert
          </button>
          <button className="btn btn-secondary btn-sm" onClick={toggleFullscreen}>
            <Maximize2 size={14} /> {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </button>
        </div>
      </div>

      {/* Tickets Grid */}
      <div className="kds-grid">
        {filteredTickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))}
      </div>

      {/* Kitchen Stock & Low Alert Modal */}
      {showStockModal && (
        <div className="modal-backdrop" onClick={() => setShowStockModal(false)}>
          <div className="modal-content stock-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-title">
                <Package size={20} className="modal-icon" />
                <div>
                  <h3>Kitchen Stock & Low Stock Alerting</h3>
                  <p className="secondary-text">Update stock quantities and notify Manager of low inventory</p>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setShowStockModal(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="kitchen-stock-list">
              {ingredients.map((ing) => (
                <div key={ing.id} className={`stock-item-row status-${ing.status.toLowerCase()}`}>
                  <div className="stock-item-info">
                    <span className="stock-item-name">{ing.name}</span>
                    <span className="stock-item-category">{ing.category}</span>
                  </div>

                  <div className="stock-quantity-stepper">
                    <button
                      className="stepper-btn"
                      onClick={() => handleStockChange(ing.id, -0.5, ing.currentStock)}
                    >
                      <Minus size={12} />
                    </button>
                    <span className="stock-val">
                      {ing.currentStock} {ing.unit}
                    </span>
                    <button
                      className="stepper-btn"
                      onClick={() => handleStockChange(ing.id, 0.5, ing.currentStock)}
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  <div className="stock-alert-action">
                    <button
                      className={`btn btn-xs ${sentAlertId === ing.id ? 'btn-success' : 'btn-danger'}`}
                      onClick={() => handleSendAlert(ing.id, ing.name)}
                    >
                      {sentAlertId === ing.id ? (
                        <>
                          <Check size={12} /> Alert Sent!
                        </>
                      ) : (
                        <>
                          <Send size={12} /> Send Low Alert
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary btn-sm" onClick={() => setShowStockModal(false)}>
                Close Panel
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .kds-controls-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .btn-warning {
          background-color: #FEF3C7;
          color: #D97706;
          border: 1px solid #FCD34D;
        }
        .btn-warning:hover {
          background-color: #FDE68A;
        }

        .btn-success {
          background-color: #DEF7EC;
          color: #0E9F6E;
          border: 1px solid #31C48D;
        }

        .kds-filter-chips {
          display: flex;
          gap: 8px;
        }

        .kds-actions-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .kds-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
        }

        .fullscreen-kds {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 2000;
          background: var(--bg-main);
          padding: 24px;
          overflow-y: auto;
        }

        /* Stock Modal Styles */
        .stock-modal {
          max-width: 600px;
          width: 100%;
        }

        .modal-header-title {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .modal-header-title h3 {
          font-size: 16px;
          font-weight: 700;
          margin: 0;
        }

        .kitchen-stock-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-height: 400px;
          overflow-y: auto;
          margin: 16px 0;
          padding-right: 4px;
        }

        .stock-item-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          border-radius: var(--radius-sm);
          background: var(--bg-main);
          border: 1px solid var(--border-color);
        }

        .stock-item-row.status-low {
          border-left: 4px solid #EF4444;
          background: #FEF2F2;
        }

        .stock-item-info {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .stock-item-name {
          font-weight: 700;
          font-size: 13px;
        }

        .stock-item-category {
          font-size: 11px;
          color: var(--text-secondary);
        }

        .stock-quantity-stepper {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          border-radius: 6px;
          padding: 4px 8px;
          margin: 0 16px;
        }

        .stepper-btn {
          width: 22px;
          height: 22px;
          border-radius: 4px;
          border: 1px solid var(--border-color);
          background: #F3F4F6;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .stepper-btn:hover {
          background: #E5E7EB;
        }

        .stock-val {
          font-size: 12px;
          font-weight: 700;
          min-width: 60px;
          text-align: center;
        }

        .btn-xs {
          padding: 6px 10px;
          font-size: 11px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 4px;
          border-radius: 6px;
        }
      `}</style>
    </div>
  );
};

