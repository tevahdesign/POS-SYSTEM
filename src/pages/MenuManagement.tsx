import React, { useState } from 'react';
import { Header } from '../components/common/Header';
import { AddEditItemModal } from '../components/menu/AddEditItemModal';
import { usePosStore, posStore } from '../store/posStore';
import { Product } from '../types/pos';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { formatINR } from '../utils/formatters';

export const MenuManagement: React.FC = () => {
  const { products } = usePosStore();
  const [activeTab, setActiveTab] = useState<'Items' | 'Modifiers' | 'Categories' | 'Combo Meals'>('Items');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = (productId: string) => {
    if (confirm('Are you sure you want to delete this menu item?')) {
      posStore.deleteProduct(productId);
    }
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  return (
    <div className="main-content">
      <Header title="Menu Management" />

      {/* Primary Sub-Navigation Tabs matching reference */}
      <div className="nav-tabs">
        {(['Items', 'Modifiers', 'Categories', 'Combo Meals'] as const).map((tab) => (
          <button
            key={tab}
            className={`tab-item ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Top Search Bar & Add Button */}
      <div className="menu-action-bar">
        <div className="search-bar-wrapper flex-1">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="input-field search-input"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <button className="btn btn-primary" onClick={handleAddNew}>
          <Plus size={16} /> + Add Item
        </button>
      </div>

      {/* Catalog Table */}
      <div className="pos-card p-0">
        <div className="pos-table-container">
          <table className="pos-table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="menu-item-cell">
                      <img src={product.image} alt={product.name} className="menu-thumb" />
                      <div className="menu-item-info">
                        <span className="font-semibold">{product.name}</span>
                        {product.description && (
                          <span className="muted-text text-truncate">{product.description}</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="category-badge-chip">{product.category}</span>
                  </td>
                  <td className="font-semibold">{formatINR(product.price)}</td>
                  <td>
                    <span className={`badge ${product.isAvailable ? 'badge-success' : 'badge-error'}`}>
                      {product.isAvailable ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons-group">
                      <button
                        className="table-action-btn"
                        onClick={() => handleEdit(product)}
                        title="Edit item"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        className="table-action-btn delete"
                        onClick={() => handleDelete(product.id)}
                        title="Delete item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <AddEditItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productToEdit={editingProduct}
      />

      <style>{`
        .menu-action-bar {
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

        .menu-item-cell {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .menu-thumb {
          width: 36px;
          height: 36px;
          border-radius: 6px;
          object-fit: cover;
        }

        .menu-item-info {
          display: flex;
          flex-direction: column;
        }

        .text-truncate {
          max-width: 240px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .category-badge-chip {
          background: #F3F4F6;
          color: var(--text-primary);
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 500;
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

        .table-action-btn.delete:hover {
          border-color: #EF4444;
          color: #EF4444;
          background: #FEE2E2;
        }

        .p-0 { padding: 0 !important; }
      `}</style>
    </div>
  );
};
