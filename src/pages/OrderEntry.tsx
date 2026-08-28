import React, { useState } from 'react';
import { Header } from '../components/common/Header';
import { ProductCard } from '../components/order/ProductCard';
import { ModifierModal } from '../components/order/ModifierModal';
import { CartPanel } from '../components/order/CartPanel';
import { usePosStore, posStore } from '../store/posStore';
import { Product, Order } from '../types/pos';
import { Search, ShoppingBag } from 'lucide-react';

export const OrderEntry: React.FC = () => {
  const { products, cart } = usePosStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProductForMod, setSelectedProductForMod] = useState<Product | null>(null);
  const [modModalOpen, setModModalOpen] = useState<boolean>(false);
  const [activeTabMobile, setActiveTabMobile] = useState<'catalog' | 'cart'>('catalog');

  const categories = ['All', 'Starters', 'Main Course', 'Beverages', 'Desserts'];

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
          Current Cart ({cart.length})
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
          <CartPanel />
        </div>
      </div>

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
        }
      `}</style>
    </div>
  );
};
