import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Ingredient } from '../../types/pos';
import { posStore } from '../../store/posStore';

interface StockAdjustModalProps {
  isOpen: boolean;
  onClose: () => void;
  ingredient: Ingredient | null;
}

export const StockAdjustModal: React.FC<StockAdjustModalProps> = ({
  isOpen,
  onClose,
  ingredient
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Meat');
  const [stock, setStock] = useState('');
  const [unit, setUnit] = useState('kg');
  const [minLevel, setMinLevel] = useState('3.0');

  useEffect(() => {
    if (ingredient) {
      setName(ingredient.name);
      setCategory(ingredient.category);
      setStock(ingredient.currentStock.toString());
      setUnit(ingredient.unit);
      setMinLevel(ingredient.minLevel.toString());
    } else {
      setName('');
      setCategory('Vegetable');
      setStock('');
      setUnit('kg');
      setMinLevel('2.0');
    }
  }, [ingredient, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !stock) return;

    const numStock = parseFloat(stock);
    const numMin = parseFloat(minLevel) || 1.0;

    if (ingredient) {
      posStore.updateIngredientStock(ingredient.id, numStock);
    } else {
      const newStatus = numStock <= numMin ? 'Low' : numStock <= numMin * 1.5 ? 'Medium' : 'Good';
      const newIng: Ingredient = {
        id: 'ing-' + Date.now(),
        name,
        category,
        currentStock: numStock,
        unit,
        minLevel: numMin,
        costPerUnit: 5.0,
        status: newStatus
      };
      posStore.addIngredient(newIng);
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={ingredient ? `Adjust Stock: ${ingredient.name}` : 'Add New Ingredient'}
      maxWidth="480px"
    >
      <form onSubmit={handleSubmit} className="stock-form">
        <div className="form-group">
          <label className="form-label">Ingredient Name *</label>
          <input
            type="text"
            className="input-field"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Chicken Breast"
          />
        </div>

        <div className="form-row">
          <div className="form-group flex-1">
            <label className="form-label">Category *</label>
            <select
              className="input-field"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Meat">Meat</option>
              <option value="Cheese">Cheese</option>
              <option value="Vegetable">Vegetable</option>
              <option value="Dry Goods">Dry Goods</option>
              <option value="Oils">Oils</option>
              <option value="Spices">Spices</option>
            </select>
          </div>

          <div className="form-group flex-1">
            <label className="form-label">Unit *</label>
            <select
              className="input-field"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
            >
              <option value="kg">kg</option>
              <option value="L">L</option>
              <option value="packs">packs</option>
              <option value="units">units</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group flex-1">
            <label className="form-label">Current Stock *</label>
            <input
              type="number"
              step="0.1"
              className="input-field"
              required
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="5.0"
            />
          </div>

          <div className="form-group flex-1">
            <label className="form-label">Minimum Reorder Level *</label>
            <input
              type="number"
              step="0.1"
              className="input-field"
              required
              value={minLevel}
              onChange={(e) => setMinLevel(e.target.value)}
              placeholder="2.0"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Save Stock
          </button>
        </div>
      </form>

      <style>{`
        .stock-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .form-label {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .form-row {
          display: flex;
          gap: 12px;
        }

        .flex-1 { flex: 1; }

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
