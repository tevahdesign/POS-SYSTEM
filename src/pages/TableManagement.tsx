import React, { useState } from 'react';
import { Header } from '../components/common/Header';
import { FloorPlan } from '../components/tables/FloorPlan';
import { TableDetailDrawer } from '../components/tables/TableDetailDrawer';
import { usePosStore } from '../store/posStore';
import { TableItem, TableStatus } from '../types/pos';
import { X } from 'lucide-react';

export const TableManagement: React.FC = () => {
  const { tables } = usePosStore();
  const [selectedFilter, setSelectedFilter] = useState<'All' | TableStatus>('All');
  const [selectedFloor, setSelectedFloor] = useState<string>('Main Floor');
  const [selectedTableId, setSelectedTableId] = useState<string>('t5');
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);

  const counts = {
    All: tables.length,
    Available: tables.filter(t => t.status === 'Available').length,
    Occupied: tables.filter(t => t.status === 'Occupied' && !t.isPaused).length,
    Paused: tables.filter(t => t.status === 'Paused' || t.isPaused).length,
    Reserved: tables.filter(t => t.status === 'Reserved').length
  };

  const filteredTables = tables.filter(t => {
    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Paused') return t.status === 'Paused' || t.isPaused;
    return t.status === selectedFilter;
  });

  const activeSelectedTable = tables.find(t => t.id === selectedTableId) || tables[0] || null;

  const handleSelectTable = (table: TableItem) => {
    setSelectedTableId(table.id);
    setMobileDrawerOpen(true);
  };

  return (
    <div className="main-content">
      <Header title="Table Management" />

      {/* Top Filter Chips & Legend Bar */}
      <div className="table-controls-bar">
        <div className="table-filter-chips">
          {(['All', 'Available', 'Occupied', 'Paused', 'Reserved'] as const).map((filter) => (
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
            <span className="legend-item"><span className="legend-dot red" /> Paused</span>
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
            onSelectTable={handleSelectTable}
          />
        </div>

        {/* Desktop Detail Drawer */}
        <div className="detail-drawer-section desktop-only">
          <TableDetailDrawer table={activeSelectedTable} />
        </div>

        {/* Mobile Bottom Sheet Overlay for Table Details */}
        {mobileDrawerOpen && (
          <div className="mobile-sheet-backdrop" onClick={() => setMobileDrawerOpen(false)}>
            <div className="mobile-sheet-content" onClick={(e) => e.stopPropagation()}>
              <div className="sheet-handle" />
              <button className="sheet-close-btn" onClick={() => setMobileDrawerOpen(false)}>
                <X size={18} />
              </button>
              <TableDetailDrawer table={activeSelectedTable} />
            </div>
          </div>
        )}
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
          overflow-x: auto;
          padding-bottom: 4px;
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
          white-space: nowrap;
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
          flex-wrap: wrap;
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
        .legend-dot.red { background-color: #EF4444; }
        .legend-dot.blue { background-color: #3B82F6; }

        .table-management-layout {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 16px;
        }

        .mobile-sheet-backdrop {
          display: none;
        }

        @media (max-width: 900px) {
          .table-management-layout {
            grid-template-columns: 1fr;
          }

          .desktop-only {
            display: none;
          }

          .mobile-sheet-backdrop {
            display: flex;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 1000;
            flex-direction: column;
            justify-content: flex-end;
            animation: fadeIn 0.15s ease-out;
          }

          .mobile-sheet-content {
            position: relative;
            background: #FFFFFF;
            border-top-left-radius: 16px;
            border-top-right-radius: 16px;
            padding: 16px 16px calc(var(--mobile-nav-height) + 16px) 16px;
            max-height: 85vh;
            overflow-y: auto;
            animation: slideUp 0.2s ease-out;
          }

          .sheet-handle {
            width: 36px;
            height: 4px;
            background: #D1D5DB;
            border-radius: 2px;
            margin: 0 auto 12px auto;
          }

          .sheet-close-btn {
            position: absolute;
            top: 14px;
            right: 14px;
            background: #F3F4F6;
            border: none;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          }
        }
      `}</style>
    </div>
  );
};
