import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Product } from '../../types/pos';
import { posStore } from '../../store/posStore';

interface AddEditItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
}

export const AddEditItemModal: React.FC<AddEditItemModalProps> = ({
  isOpen,
  onClose,
  productToEdit
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Main Course');
  const [price, setPrice] = useState('');
  const [cost, setCost] = useState('');
  const [prepTime, setPrepTime] = useState('10');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setCategory(productToEdit.category);
      setPrice(productToEdit.price.toString());
      setCost(productToEdit.cost.toString());
      setPrepTime(productToEdit.preparationTime.toString());
      setDescription(productToEdit.description || '');
      setImage(productToEdit.image);
      setIsAvailable(productToEdit.isAvailable);
    } else {
      setName('');
      setCategory('Main Course');
      setPrice('');
      setCost('');
      setPrepTime('10');
      setDescription('');
      setImage('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80');
      setIsAvailable(true);
    }
  }, [productToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;

    const numPrice = parseFloat(price);
    const numCost = parseFloat(cost) || 0;
    const numPrep = parseInt(prepTime) || 10;

    if (productToEdit) {
      posStore.updateProduct({
        ...productToEdit,
        name,
        category,
        price: numPrice,
        cost: numCost,
        preparationTime: numPrep,
        description,
        image: image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
        isAvailable
      });
    } else {
      const newProduct: Product = {
        id: 'p-' + Date.now(),
        name,
        category,
        price: numPrice,
        cost: numCost,
        taxRate: 8.5,
        preparationTime: numPrep,
        description,
        image: image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
        isAvailable
      };
      posStore.addProduct(newProduct);
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={productToEdit ? 'Edit Menu Item' : 'Add New Menu Item'}
      maxWidth="500px"
    >
      <form onSubmit={handleSubmit} className="menu-form">
        <div className="form-group">
          <label className="form-label">Item Name *</label>
          <input
            type="text"
            className="input-field"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Hawaiian Pizza"
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
              <option value="Starters">Starters</option>
              <option value="Main Course">Main Course</option>
              <option value="Beverages">Beverages</option>
              <option value="Desserts">Desserts</option>
            </select>
          </div>

          <div className="form-group flex-1">
            <label className="form-label">Price (₹) *</label>
            <input
              type="number"
              step="1"
              className="input-field"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="299"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group flex-1">
            <label className="form-label">Cost Price (₹)</label>
            <input
              type="number"
              step="1"
              className="input-field"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              placeholder="100"
            />
          </div>

          <div className="form-group flex-1">
            <label className="form-label">Prep Time (mins)</label>
            <input
              type="number"
              className="input-field"
              value={prepTime}
              onChange={(e) => setPrepTime(e.target.value)}
              placeholder="12"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Image URL</label>
          <input
            type="text"
            className="input-field"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://..."
          />
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            className="input-field"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief item description..."
          />
        </div>

        <div className="form-group checkbox-row">
          <input
            type="checkbox"
            id="avail-check"
            checked={isAvailable}
            onChange={(e) => setIsAvailable(e.target.checked)}
          />
          <label htmlFor="avail-check" className="form-label">Active / Available in POS</label>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {productToEdit ? 'Save Changes' : 'Add Item'}
          </button>
        </div>
      </form>

      <style>{`
        .menu-form {
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

        .checkbox-row {
          flex-direction: row;
          align-items: center;
          gap: 8px;
        }

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
