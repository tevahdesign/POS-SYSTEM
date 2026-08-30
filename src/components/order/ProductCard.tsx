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
    <div className="yoko-card product-card yoko-card-hover" onClick={() => onSelect(product)}>
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
          padding: 12px;
          cursor: pointer;
          border-radius: var(--radius-lg);
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .product-card:hover {
          border-color: rgba(99, 102, 241, 0.4);
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.08);
          transform: translateY(-2px);
        }

        .product-image-container {
          position: relative;
          width: 100%;
          height: 110px;
          border-radius: var(--radius-md);
          overflow: hidden;
          background-color: #F1F5F9;
          margin-bottom: 10px;
        }

        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .product-card:hover .product-image {
          transform: scale(1.06);
        }

        .product-info-btn {
          position: absolute;
          top: 6px;
          right: 6px;
          width: 26px;
          height: 26px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.85);
          border: 1px solid #E2E8F0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748B;
          cursor: pointer;
          backdrop-filter: blur(8px);
          transition: all 0.2s ease;
        }

        .product-info-btn:hover {
          background: #FFFFFF;
          color: #0F172A;
        }

        .product-details {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          flex: 1;
        }

        .product-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13.5px;
          font-weight: 700;
          color: #0F172A;
          line-height: 1.3;
          margin-bottom: 8px;
        }

        .product-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .product-price {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px;
          font-weight: 800;
          color: #0F172A;
        }

        .product-add-btn {
          width: 30px;
          height: 30px;
          border-radius: 9999px;
          background: var(--yoko-primary-gradient);
          color: #FFFFFF;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
          transition: all 0.2s ease;
        }

        .product-add-btn:hover {
          box-shadow: 0 4px 14px rgba(99, 102, 241, 0.45);
          transform: scale(1.08);
        }
      `}</style>
    </div>
  );
};
