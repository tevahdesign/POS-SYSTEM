import React, { useState } from 'react';
import { Header } from '../components/common/Header';
import { StockAdjustModal } from '../components/inventory/StockAdjustModal';
import { usePosStore } from '../store/posStore';
import { Ingredient } from '../types/pos';
import { Plus, Search, Edit2 } from 'lucide-react';

export const Inventory: React.FC = () => {
  const { ingredients } = usePosStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);

  const filteredIngredients = ingredients.filter(ing =>
    ing.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ing.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditStock = (ing: Ingredient) => {
    setSelectedIngredient(ing);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedIngredient(null);
    setIsModalOpen(true);
  };

  return (
    <div className="main-content">
      <Header title="Inventory" />

      {/* Top Search Bar & Add Button */}
      <div className="inventory-action-bar">
        <div className="search-bar-wrapper flex-1">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="input-field search-input"
            placeholder="Search ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <button className="btn btn-primary" onClick={handleAddNew}>
          <Plus size={16} /> + Add Ingredient
        </button>
      </div>

      {/* Ingredients Data Table matching reference exactly */}
      <div className="pos-card p-0">
        <div className="pos-table-container">
          <table className="pos-table">
            <thead>
              <tr>
                <th>Ingredient</th>
                <th>Category</th>
                <th>Current Stock</th>
                <th>Unit</th>
                <th>Min Level</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredIngredients.map((ing) => (
                <tr key={ing.id}>
                  <td className="font-semibold">{ing.name}</td>
                  <td className="secondary-text">{ing.category}</td>
                  <td className="font-semibold">{ing.currentStock} {ing.unit}</td>
                  <td className="secondary-text">{ing.unit}</td>
                  <td className="secondary-text">{ing.minLevel} {ing.unit}</td>
                  <td>
                    <span className={`badge badge-${ing.status.toLowerCase()}`}>
                      {ing.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons-group">
                      <button
                        className="table-action-btn"
                        onClick={() => handleEditStock(ing)}
                        title="Adjust stock level"
                      >
                        <Edit2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <StockAdjustModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        ingredient={selectedIngredient}
      />

      <style>{`
        .inventory-action-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 16px;
        }

        .flex-1 { flex: 1; }

        .search-bar-wrapper {
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        .search-input {
          padding-left: 36px;
        }

        .action-buttons-group {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 6px;
        }

        .table-action-btn {
          width: 28px;
          height: 28px;
          border-radius: 4px;
          border: 1px solid var(--border-color);
          background: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .table-action-btn:hover {
          border-color: var(--primary-orange);
          color: var(--primary-orange);
        }

        .p-0 { padding: 0 !important; }
      `}</style>
    </div>
  );
};
