import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Product, ModifierOption } from '../../types/pos';
import { Plus, Minus, Check } from 'lucide-react';
import { formatINR } from '../../utils/formatters';

interface ModifierModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onAddToCart: (product: Product, selectedModifiers: ModifierOption[], quantity: number, notes?: string) => void;
}

export const ModifierModal: React.FC<ModifierModalProps> = ({
  isOpen,
  onClose,
  product,
  onAddToCart
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedModifiers, setSelectedModifiers] = useState<ModifierOption[]>([]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (product) {
      setQuantity(1);
      setNotes('');
      // Default selects first option of required modifier groups
      const defaults: ModifierOption[] = [];
      product.modifierGroups?.forEach(group => {
        if (group.required && group.options.length > 0) {
          defaults.push(group.options[0]);
        }
      });
      setSelectedModifiers(defaults);
    }
  }, [product]);

  if (!product) return null;

  const toggleOption = (groupRequired: boolean, groupOptions: ModifierOption[], option: ModifierOption) => {
    if (groupRequired) {
      // Single selection (Radio behavior)
      const filtered = selectedModifiers.filter(m => !groupOptions.some(opt => opt.id === m.id));
      setSelectedModifiers([...filtered, option]);
    } else {
      // Multiple selection (Checkbox behavior)
      const exists = selectedModifiers.some(m => m.id === option.id);
      if (exists) {
        setSelectedModifiers(selectedModifiers.filter(m => m.id !== option.id));
      } else {
        setSelectedModifiers([...selectedModifiers, option]);
      }
    }
  };

  const extraTotal = selectedModifiers.reduce((sum, m) => sum + m.price, 0);
  const unitPrice = product.price + extraTotal;
  const totalPrice = unitPrice * quantity;

  const handleAdd = () => {
    onAddToCart(product, selectedModifiers, quantity, notes);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={product.name} maxWidth="480px">
      <div className="mod-modal-body">
        {/* Top Product Summary */}
        <div className="mod-product-hero">
          <img src={product.image} alt={product.name} className="mod-hero-img" />
          <div className="mod-hero-info">
            <p className="mod-description">{product.description || 'Delicious freshly prepared item.'}</p>
            <div className="mod-base-price">Base Price: {formatINR(product.price)}</div>
          </div>
        </div>

        {/* Modifier Groups */}
        {product.modifierGroups?.map((group) => (
          <div key={group.id} className="mod-group">
            <div className="mod-group-title">
              {group.name}
              {group.required ? <span className="mod-req-tag">Required</span> : <span className="mod-opt-tag">Optional</span>}
            </div>
            <div className="mod-options-list">
              {group.options.map((opt) => {
                const isSelected = selectedModifiers.some(m => m.id === opt.id);
                return (
                  <div
                    key={opt.id}
                    className={`mod-option-pill ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleOption(group.required, group.options, opt)}
                  >
                    <div className="mod-opt-left">
                      <div className={`mod-checkbox ${isSelected ? 'checked' : ''}`}>
                        {isSelected && <Check size={12} />}
                      </div>
                      <span>{opt.name}</span>
                    </div>
                    {opt.price > 0 && <span className="mod-opt-price">+{formatINR(opt.price)}</span>}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Special Instructions / Notes */}
        <div className="mod-group">
          <div className="mod-group-title">Special Instructions</div>
          <input
            type="text"
            className="input-field"
            placeholder="e.g. Extra crisp, sauce on side..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {/* Quantity & Add Button Footer */}
        <div className="mod-footer">
          <div className="qty-selector">
            <button
              className="qty-btn"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Minus size={14} />
            </button>
            <span className="qty-val">{quantity}</span>
            <button className="qty-btn" onClick={() => setQuantity(quantity + 1)}>
              <Plus size={14} />
            </button>
          </div>

          <button className="btn btn-primary mod-submit-btn" onClick={handleAdd}>
            Add to Order — {formatINR(totalPrice)}
          </button>
        </div>
      </div>

      <style>{`
        .mod-modal-body {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .mod-product-hero {
          display: flex;
          gap: 12px;
          align-items: center;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--border-color);
        }

        .mod-hero-img {
          width: 70px;
          height: 70px;
          border-radius: 8px;
          object-fit: cover;
        }

        .mod-hero-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .mod-description {
          font-size: 12px;
          color: var(--text-secondary);
        }

        .mod-base-price {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .mod-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .mod-group-title {
          font-size: 13px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .mod-req-tag {
          font-size: 10px;
          background: #FEE2E2;
          color: #DC2626;
          padding: 1px 6px;
          border-radius: 4px;
          font-weight: 600;
        }

        .mod-opt-tag {
          font-size: 10px;
          background: #F3F4F6;
          color: var(--text-secondary);
          padding: 1px 6px;
          border-radius: 4px;
        }

        .mod-options-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .mod-option-pill {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .mod-option-pill.selected {
          border-color: var(--primary-orange);
          background: var(--primary-orange-light);
        }

        .mod-opt-left {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
        }

        .mod-checkbox {
          width: 16px;
          height: 16px;
          border-radius: 4px;
          border: 1px solid #D1D5DB;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #FFFFFF;
        }

        .mod-checkbox.checked {
          background: var(--primary-orange);
          border-color: var(--primary-orange);
          color: #FFFFFF;
        }

        .mod-opt-price {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .mod-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding-top: 12px;
          border-top: 1px solid var(--border-color);
        }

        .qty-selector {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #F3F4F6;
          padding: 4px;
          border-radius: var(--radius-sm);
        }

        .qty-btn {
          width: 28px;
          height: 28px;
          border-radius: 4px;
          border: none;
          background: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--text-primary);
        }

        .qty-val {
          font-size: 14px;
          font-weight: 700;
          min-width: 20px;
          text-align: center;
        }

        .mod-submit-btn {
          flex: 1;
        }
      `}</style>
    </Modal>
  );
};
