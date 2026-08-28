import React from 'react';
import { Plus, Info } from 'lucide-react';
import { Product } from '../../types/pos';
import { formatINR } from '../../utils/formatters';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onAddDirect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onAddDirect
}) => {
  return (
    <div className="pos-card product-card pos-card-hover" onClick={() => onSelect(product)}>
      <div className="product-image-container">
        <img src={product.image} alt={product.name} className="product-image" />
        <button
          className="product-info-btn"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(product);
          }}
          title="View product details & modifiers"
        >
          <Info size={14} />
        </button>
      </div>

      <div className="product-details">
        <h4 className="product-title">{product.name}</h4>
        <div className="product-bottom">
          <span className="product-price">{formatINR(product.price)}</span>
          <button
            className="product-add-btn"
            onClick={(e) => {
              e.stopPropagation();
              onAddDirect(product);
            }}
            title="Quick add to order"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <style>{`
        .product-card {
          display: flex;
          flex-direction: column;
          padding: 10px;
          cursor: pointer;
          border-radius: var(--radius-md);
        }

        .product-image-container {
          position: relative;
          width: 100%;
          height: 110px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          background-color: #F3F4F6;
          margin-bottom: 8px;
        }

        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.2s ease;
        }

        .product-card:hover .product-image {
          transform: scale(1.04);
        }

        .product-info-btn {
          position: absolute;
          top: 6px;
          right: 6px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.85);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          cursor: pointer;
          backdrop-filter: blur(4px);
        }

        .product-details {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          flex: 1;
        }

        .product-title {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
          line-height: 1.2;
          margin-bottom: 6px;
        }

        .product-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .product-price {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .product-add-btn {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          background: var(--primary-orange-light);
          color: var(--primary-orange);
          border: 1px solid var(--primary-orange-border);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .product-add-btn:hover {
          background: var(--primary-orange);
          color: #FFFFFF;
        }
      `}</style>
    </div>
  );
};
