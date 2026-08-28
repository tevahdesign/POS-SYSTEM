import React, { useState } from 'react';
import { Header } from '../components/common/Header';
import { FloorPlan } from '../components/tables/FloorPlan';
import { TableDetailDrawer } from '../components/tables/TableDetailDrawer';
import { usePosStore } from '../store/posStore';
import { TableItem, TableStatus } from '../types/pos';

export const TableManagement: React.FC = () => {
  const { tables } = usePosStore();
  const [selectedFilter, setSelectedFilter] = useState<'All' | TableStatus>('All');
  const [selectedFloor, setSelectedFloor] = useState<string>('Main Floor');
  const [selectedTableId, setSelectedTableId] = useState<string>('t5'); // Default Table 5 matching reference!

  const counts = {
    All: tables.length,
    Available: tables.filter(t => t.status === 'Available').length,
    Occupied: tables.filter(t => t.status === 'Occupied').length,
    Reserved: tables.filter(t => t.status === 'Reserved').length
  };

  const filteredTables = tables.filter(t => {
    if (selectedFilter === 'All') return true;
    return t.status === selectedFilter;
  });

  const activeSelectedTable = tables.find(t => t.id === selectedTableId) || tables[0] || null;

  return (
    <div className="main-content">
      <Header title="Table Management" />

      {/* Top Filter Chips & Legend Bar */}
      <div className="table-controls-bar">
        <div className="table-filter-chips">
          {(['All', 'Available', 'Occupied', 'Reserved'] as const).map((filter) => (
            <button
              key={filter}
              className={`filter-chip ${selectedFilter === filter ? 'active' : ''}`}
              onClick={() => setSelectedFilter(filter)}
            >
              {filter} ({counts[filter]})
            </button>
          ))}
        </div>

        <div className="floor-legend-group">
          <div className="floor-selector">
            <span className="secondary-text">Floor:</span>
            <select
              value={selectedFloor}
              onChange={(e) => setSelectedFloor(e.target.value)}
              className="floor-dropdown"
            >
              <option value="Main Floor">Main Floor</option>
              <option value="Patio Deck">Patio Deck</option>
              <option value="VIP Lounge">VIP Lounge</option>
            </select>
          </div>

          <div className="status-legend">
            <span className="legend-item"><span className="legend-dot green" /> Available</span>
            <span className="legend-item"><span className="legend-dot orange" /> Occupied</span>
            <span className="legend-item"><span className="legend-dot blue" /> Reserved</span>
          </div>
        </div>
      </div>

      {/* Layout Grid: Floor Graphic + Detail Drawer */}
      <div className="table-management-layout">
        <div className="floor-plan-section">
          <FloorPlan
            tables={filteredTables}
            selectedTableId={selectedTableId}
            onSelectTable={(t) => setSelectedTableId(t.id)}
          />
        </div>

        <div className="detail-drawer-section">
          <TableDetailDrawer table={activeSelectedTable} />
        </div>
      </div>

      <style>{`
        .table-controls-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .table-filter-chips {
          display: flex;
          gap: 8px;
        }

        .filter-chip {
          padding: 6px 14px;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-color);
          background: #FFFFFF;
          font-size: 12px;
          font-weight: 500;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .filter-chip.active {
          background: var(--primary-orange);
          color: #FFFFFF;
          border-color: var(--primary-orange);
          font-weight: 600;
        }

        .floor-legend-group {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .floor-selector {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .floor-dropdown {
          padding: 4px 10px;
          font-size: 12px;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          background: #FFFFFF;
          cursor: pointer;
        }

        .status-legend {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 11px;
          color: var(--text-secondary);
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .legend-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        .legend-dot.green { background-color: #22C55E; }
        .legend-dot.orange { background-color: #F97316; }
        .legend-dot.blue { background-color: #3B82F6; }

        .table-management-layout {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 16px;
        }

        @media (max-width: 900px) {
          .table-management-layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
