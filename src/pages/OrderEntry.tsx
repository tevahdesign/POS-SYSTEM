import React, { useState } from 'react';
import { Header } from '../components/common/Header';
import { ProductCard } from '../components/order/ProductCard';
import { ModifierModal } from '../components/order/ModifierModal';
import { CartPanel } from '../components/order/CartPanel';
import { usePosStore, posStore } from '../store/posStore';
import { Product, Order } from '../types/pos';
import { Search, ShoppingBag, ArrowRight } from 'lucide-react';
import { formatINR } from '../utils/formatters';

export const OrderEntry: React.FC = () => {
  const { products, cart } = usePosStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProductForMod, setSelectedProductForMod] = useState<Product | null>(null);
  const [modModalOpen, setModModalOpen] = useState<boolean>(false);
  const [activeTabMobile, setActiveTabMobile] = useState<'catalog' | 'cart'>('catalog');

  const categories = ['All', 'Starters', 'Main Course', 'Beverages', 'Desserts'];

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.itemTotal, 0);

  const filteredProducts = products.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelectProduct = (product: Product) => {
    if (product.modifierGroups && product.modifierGroups.length > 0) {
      setSelectedProductForMod(product);
      setModModalOpen(true);
    } else {
      posStore.addToCart(product);
    }
  };

  const handleAddDirect = (product: Product) => {
    posStore.addToCart(product);
  };

  return (
    <div className="main-content">
      <Header title="Order Entry" />

      {/* Mobile Switch Tabs (Catalog vs Cart) */}
      <div className="mobile-view-tabs">
        <button
          className={`mobile-tab-btn ${activeTabMobile === 'catalog' ? 'active' : ''}`}
          onClick={() => setActiveTabMobile('catalog')}
        >
          Catalog
        </button>
        <button
          className={`mobile-tab-btn ${activeTabMobile === 'cart' ? 'active' : ''}`}
          onClick={() => setActiveTabMobile('cart')}
        >
          <ShoppingBag size={14} />
          Current Cart ({cartItemCount})
        </button>
      </div>

      <div className="order-entry-layout">
        {/* Left / Main Section: Catalog & Search */}
        <div className={`catalog-section ${activeTabMobile === 'cart' ? 'mobile-hidden' : ''}`}>
          {/* Search Field */}
          <div className="search-bar-wrapper">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              className="input-field search-input"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category Chips */}
          <div className="category-chips">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={handleSelectProduct}
                onAddDirect={handleAddDirect}
              />
            ))}
          </div>
        </div>

        {/* Right Section: Order Cart Panel */}
        <div className={`cart-section ${activeTabMobile === 'catalog' ? 'mobile-hidden' : ''}`}>
          <CartPanel onReturnToCatalog={() => setActiveTabMobile('catalog')} />
        </div>
      </div>

      {/* Mobile Floating Sticky Cart Bar */}
      {cartItemCount > 0 && activeTabMobile === 'catalog' && (
        <div className="mobile-floating-cart-bar" onClick={() => setActiveTabMobile('cart')}>
          <div className="floating-cart-info">
            <span className="cart-badge-count">{cartItemCount} {cartItemCount === 1 ? 'Item' : 'Items'}</span>
            <span className="cart-total-amount">{formatINR(cartSubtotal)}</span>
          </div>
          <button className="floating-cart-btn">
            View Order Cart <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* Item Modifier / Detail Modal */}
      <ModifierModal
        isOpen={modModalOpen}
        onClose={() => setModModalOpen(false)}
        product={selectedProductForMod}
        onAddToCart={(prod, mods, qty, notes) => posStore.addToCart(prod, mods, qty, notes)}
      />

      <style>{`
        .mobile-view-tabs {
          display: none;
          gap: 8px;
          margin-bottom: 12px;
        }

        .mobile-tab-btn {
          flex: 1;
          padding: 8px;
          border-radius: 8px;
          border: 1px solid var(--border-color);
          background: #FFFFFF;
          font-weight: 600;
          font-size: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .mobile-tab-btn.active {
          background: var(--primary-orange);
          color: #FFFFFF;
          border-color: var(--primary-orange);
        }

        .order-entry-layout {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 16px;
          height: calc(100vh - 120px);
        }

        .catalog-section {
          display: flex;
          flex-direction: column;
          gap: 14px;
          overflow-y: auto;
          padding-right: 4px;
        }

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
          height: 40px;
          border-radius: var(--radius-sm);
        }

        .category-chips {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 4px;
        }

        .category-chip {
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

        .category-chip.active {
          background: var(--primary-orange);
          color: #FFFFFF;
          border-color: var(--primary-orange);
          font-weight: 600;
        }

        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 14px;
        }

        .cart-section {
          height: 100%;
        }

        @media (max-width: 900px) {
          .order-entry-layout {
            grid-template-columns: 1fr;
            height: auto;
          }
          .mobile-view-tabs {
            display: flex;
          }
          .mobile-hidden {
            display: none !important;
          }
          .product-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
        }

        .mobile-floating-cart-bar {
          display: none;
          position: fixed;
          bottom: calc(var(--mobile-nav-height) + 10px);
          left: 12px;
          right: 12px;
          height: 52px;
          background: #1F2937;
          color: #FFFFFF;
          border-radius: 12px;
          padding: 0 16px;
          align-items: center;
          justify-content: space-between;
          z-index: 980;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
          cursor: pointer;
          animation: slideUp 0.2s ease-out;
        }

        .floating-cart-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .cart-badge-count {
          background: var(--primary-orange);
          color: #FFFFFF;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 6px;
        }

        .cart-total-amount {
          font-size: 15px;
          font-weight: 700;
        }

        .floating-cart-btn {
          background: transparent;
          border: none;
          color: var(--primary-orange);
          font-size: 13px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .mobile-floating-cart-bar {
            display: flex;
          }
        }
      `}</style>
    </div>
  );
};
