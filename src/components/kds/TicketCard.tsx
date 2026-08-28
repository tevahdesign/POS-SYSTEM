import React, { useState, useEffect } from 'react';
import { KitchenTicket, KitchenStatus } from '../../types/pos';
import { Clock, Play, CheckCircle2, Check, AlertCircle } from 'lucide-react';
import { posStore } from '../../store/posStore';

interface TicketCardProps {
  ticket: KitchenTicket;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket }) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(
    Math.floor((Date.now() - ticket.timestamp) / 1000)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - ticket.timestamp) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [ticket.timestamp]);

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isUrgent = elapsedSeconds > 900; // >15 mins turns urgent red

  const handleStatusAdvance = () => {
    if (ticket.status === 'New') {
      posStore.updateTicketStatus(ticket.id, 'In-Progress');
    } else if (ticket.status === 'In-Progress') {
      posStore.updateTicketStatus(ticket.id, 'Ready');
    } else if (ticket.status === 'Ready') {
      // Remove or complete
      posStore.updateTicketStatus(ticket.id, 'Ready');
    }
  };

  return (
    <div className={`pos-card kds-ticket-card ${ticket.status.toLowerCase()} ${isUrgent ? 'urgent' : ''}`}>
      {/* Ticket Header */}
      <div className="ticket-header">
        <div className="ticket-title-group">
          <span className="ticket-order-num">{ticket.orderNumber}</span>
          <span className="ticket-type-badge">{ticket.type}</span>
          <span className="ticket-table-name">{ticket.tableName}</span>
        </div>

        {/* Live Prep Timer */}
        <div className={`ticket-timer ${isUrgent ? 'timer-urgent pulse-badge' : ''}`}>
          <Clock size={13} />
          <span>{formatTimer(elapsedSeconds)}</span>
        </div>
      </div>

      {/* Ticket Items List */}
      <div className="ticket-items-list">
        {ticket.items.map((item, idx) => (
          <div key={idx} className="ticket-item">
            <div className="ticket-item-main">
              <span className="ticket-qty">{item.quantity}</span>
              <span className="ticket-item-name">{item.name}</span>
            </div>
            {item.modifiers && item.modifiers.length > 0 && (
              <div className="ticket-item-mods">
                {item.modifiers.map((mod, mIdx) => (
                  <div key={mIdx} className="ticket-mod-line">+ {mod}</div>
                ))}
              </div>
            )}
            {item.notes && <div className="ticket-item-note">Note: {item.notes}</div>}
          </div>
        ))}
      </div>

      {/* Footer Action Button */}
      <div className="ticket-footer">
        {ticket.status === 'New' && (
          <button className="btn btn-outline-orange btn-sm w-full" onClick={handleStatusAdvance}>
            <Play size={14} /> Start Cooking
          </button>
        )}
        {ticket.status === 'In-Progress' && (
          <button className="btn btn-primary btn-sm w-full" onClick={handleStatusAdvance}>
            <CheckCircle2 size={14} /> Mark Ready
          </button>
        )}
        {ticket.status === 'Ready' && (
          <button className="btn btn-secondary btn-sm w-full status-ready-btn">
            <Check size={14} /> Ready for Pickup
          </button>
        )}
      </div>

      <style>{`
        .kds-ticket-card {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 14px;
          border-left: 4px solid var(--border-color);
        }

        .kds-ticket-card.new {
          border-left-color: var(--status-info);
        }

        .kds-ticket-card.in-progress {
          border-left-color: var(--primary-orange);
        }

        .kds-ticket-card.ready {
          border-left-color: var(--status-success);
        }

        .kds-ticket-card.urgent {
          border-left-color: var(--status-error);
          background-color: #FEF2F2;
        }

        .ticket-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 8px;
          border-bottom: 1px solid var(--border-color);
        }

        .ticket-title-group {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .ticket-order-num {
          font-weight: 800;
          font-size: 15px;
          color: var(--text-primary);
        }

        .ticket-type-badge {
          font-size: 10px;
          font-weight: 600;
          background: #F3F4F6;
          color: var(--text-secondary);
          padding: 1px 6px;
          border-radius: 4px;
        }

        .ticket-table-name {
          font-size: 11px;
          color: var(--text-muted);
        }

        .ticket-timer {
          display: flex;
          align-items: center;
          gap: 4px;
          font-weight: 700;
          font-size: 13px;
          color: var(--primary-orange);
          background: var(--primary-orange-light);
          padding: 3px 8px;
          border-radius: 6px;
        }

        .timer-urgent {
          color: #DC2626;
          background: #FEE2E2;
        }

        .ticket-items-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
          min-height: 100px;
        }

        .ticket-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .ticket-item-main {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          font-size: 13px;
        }

        .ticket-qty {
          width: 20px;
          height: 20px;
          border-radius: 4px;
          background: var(--primary-orange-light);
          color: var(--primary-orange);
          font-weight: 800;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ticket-mod-line {
          font-size: 11px;
          color: var(--text-secondary);
          padding-left: 28px;
        }

        .ticket-item-note {
          font-size: 11px;
          color: #D97706;
          padding-left: 28px;
          font-style: italic;
        }

        .ticket-footer {
          margin-top: auto;
        }

        .w-full { width: 100%; }

        .status-ready-btn {
          background-color: var(--status-success-bg);
          color: var(--status-success);
          border-color: #86EFAC;
          font-weight: 700;
        }
      `}</style>
    </div>
  );
};
