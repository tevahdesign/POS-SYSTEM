import React from 'react';
import { TableItem } from '../../types/pos';
import { User, PauseCircle } from 'lucide-react';
import { formatINR } from '../../utils/formatters';

interface FloorPlanProps {
  tables: TableItem[];
  selectedTableId?: string;
  onSelectTable: (table: TableItem) => void;
}

export const FloorPlan: React.FC<FloorPlanProps> = ({
  tables,
  selectedTableId,
  onSelectTable
}) => {
  return (
    <div className="floor-plan-container">
      {/* Decorative Indoor Plants at Floor Corners */}
      <div className="floor-plant plant-tl">🌿</div>
      <div className="floor-plant plant-bl">🌿</div>
      <div className="floor-plant plant-tr">🪴</div>
      <div className="floor-plant plant-br">🪴</div>

      <div className="floor-tables-grid">
        {tables.map((table) => {
          const isSelected = selectedTableId === table.id;
          const isPaused = table.status === 'Paused' || table.isPaused;
          const statusClass = isPaused ? 'paused' : table.status.toLowerCase();

          return (
            <div
              key={table.id}
              className={`table-card ${statusClass} ${isSelected ? 'selected' : ''} shape-${table.shape}`}
              onClick={() => onSelectTable(table)}
            >
              {isPaused && (
                <div className="paused-badge-corner" title="Order Paused">
                  <PauseCircle size={12} /> Paused
                </div>
              )}

              {/* Seating Dots / Visual Furniture */}
              <div className="table-seats-indicator">
                <User size={11} />
                <span>{table.seats} Seats</span>
              </div>

              {/* Table Number */}
              <div className="table-number">{table.number}</div>

              {/* Status pill if occupied or reserved or paused */}
              {table.totalAmount !== undefined && (
                <div className="table-amount-badge">{formatINR(table.totalAmount)}</div>
              )}
            </div>
          );
        })}
      </div>

      <style>{`
        .floor-plan-container {
          position: relative;
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 30px;
          min-height: 420px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--card-shadow);
        }

        .floor-plant {
          position: absolute;
          font-size: 22px;
          user-select: none;
          opacity: 0.8;
        }
        .plant-tl { top: 12px; left: 12px; }
        .plant-bl { bottom: 12px; left: 12px; }
        .plant-tr { top: 12px; right: 12px; }
        .plant-br { bottom: 12px; right: 12px; }

        .floor-tables-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px 32px;
          max-width: 720px;
          width: 100%;
        }

        .table-card {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 14px;
          border-radius: 10px;
          border: 2px solid var(--border-color);
          background: #FFFFFF;
          cursor: pointer;
          transition: all 0.2s ease;
          min-height: 84px;
        }

        /* Status Styling matching reference colors: Available=green border, Occupied=orange/red, Reserved=blue */
        .table-card.available {
          border-color: #A7F3D0;
          background-color: #ECFDF5;
        }

        .table-card.occupied {
          border-color: #FDBA74;
          background-color: #FFF7ED;
        }

        .table-card.paused {
          border-color: #FCA5A5;
          background-color: #FEF2F2;
          animation: pulseBorder 2s infinite;
        }

        .paused-badge-corner {
          position: absolute;
          top: -8px;
          right: -6px;
          background: #EF4444;
          color: white;
          font-size: 9px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 2px;
        }

        @keyframes pulseBorder {
          0%, 100% { border-color: #FCA5A5; }
          50% { border-color: #EF4444; }
        }

        .table-card.reserved {
          border-color: #BFDBFE;
          background-color: #EFF6FF;
        }

        .table-card.selected {
          border-color: var(--primary-orange);
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.25);
          transform: translateY(-2px);
        }

        .table-seats-indicator {
          display: flex;
          align-items: center;
          gap: 3px;
          font-size: 10px;
          color: var(--text-secondary);
          margin-bottom: 4px;
        }

        .table-number {
          font-size: 18px;
          font-weight: 800;
          color: var(--text-primary);
        }

        .table-amount-badge {
          margin-top: 4px;
          font-size: 11px;
          font-weight: 700;
          color: var(--primary-orange);
        }

        .shape-sofa {
          border-radius: 14px;
          border-style: double;
        }

        .shape-rect {
          grid-column: span 1;
        }

        @media (max-width: 768px) {
          .floor-tables-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 14px;
          }
          .floor-plan-container {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
};
