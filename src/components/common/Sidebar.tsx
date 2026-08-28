import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Grid,
  UtensilsCrossed,
  BookOpen,
  Package,
  BarChart3,
  Users,
  CreditCard,
  Settings,
  LogOut
} from 'lucide-react';
import { posStore, usePosStore } from '../../store/posStore';
import { Store, Power } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: React.ElementType;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { id: 'orders', label: 'Order Entry', path: '/orders', icon: ShoppingBag },
  { id: 'tables', label: 'Table Management', path: '/tables', icon: Grid },
  { id: 'kitchen', label: 'KDS - Kitchen Display', path: '/kitchen', icon: UtensilsCrossed },
  { id: 'menu', label: 'Menu Management', path: '/menu', icon: BookOpen },
  { id: 'inventory', label: 'Inventory', path: '/inventory', icon: Package },
  { id: 'reports', label: 'Reports', path: '/reports', icon: BarChart3 },
  { id: 'staff', label: 'Staff Management', path: '/staff', icon: Users },
  { id: 'payments', label: 'Payments & Reconciliation', path: '/payments', icon: CreditCard },
  { id: 'settings', label: 'Settings', path: '/settings', icon: Settings }
];

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, settings } = usePosStore();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const activePath = location.pathname;
  const isManager = currentUser.role === 'Manager' || currentUser.role === 'Owner';
  const isShopOpen = settings.isShopOpen !== false;

  // Filter items according to staff permissions & explicit Waiter/Kitchen access rights
  const filteredNavItems = NAV_ITEMS.filter(item => {
    if (isManager) return true;
    if (item.id === 'orders' || item.id === 'tables') {
      if (currentUser.permissions?.waiterAccess !== undefined) {
        return Boolean(currentUser.permissions.waiterAccess);
      }
    }
    if (item.id === 'kitchen') {
      if (currentUser.permissions?.kitchenAccess !== undefined) {
        return Boolean(currentUser.permissions.kitchenAccess);
      }
    }
    const permKey = item.id as keyof typeof currentUser.permissions;
    return Boolean(currentUser.permissions?.[permKey]);
  });

  const toggleShop = () => {
    const nextState = !isShopOpen;
    posStore.toggleShopStatus(nextState);
  };

  return (
    <aside className="pos-sidebar">
      {/* Brand Logo */}
      <div className="sidebar-logo" onClick={() => navigate(filteredNavItems[0]?.path || '/login')}>
        <div className="logo-badge">N</div>
      </div>

      {/* Nav List */}
      <nav className="sidebar-nav">
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePath === item.path || (item.path !== '/' && activePath.startsWith(item.path));

          return (
            <div
              key={item.id}
              className={`nav-icon-wrapper ${isActive ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <Icon size={20} />
              
              {/* Tooltip */}
              {hoveredId === item.id && (
                <div className="sidebar-tooltip">
                  {item.label}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer Profile & Shop Toggle */}
      <div className="sidebar-footer">
        {/* Manager Shop Toggle Button */}
        {isManager && (
          <button
            className={`shop-toggle-btn ${isShopOpen ? 'open' : 'closed'}`}
            onClick={toggleShop}
            title={isShopOpen ? 'Click to Close Shop (Lock POS for Waiter/Kitchen)' : 'Click to Open Shop'}
          >
            <Power size={18} />
          </button>
        )}

        <div
          className="user-avatar-btn"
          title={`${currentUser.name} (${currentUser.role})`}
          onClick={() => isManager ? navigate('/settings') : undefined}
        >
          <img src={currentUser.avatar} alt={currentUser.name} />
        </div>
        <button
          className="logout-btn"
          title="Sign Out / Lock POS"
          onClick={() => navigate('/login')}
        >
          <LogOut size={16} />
        </button>
      </div>

      <style>{`
        .pos-sidebar {
          width: var(--sidebar-width);
          height: 100vh;
          background-color: var(--bg-surface);
          border-right: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 16px 0;
          z-index: 100;
          user-select: none;
          flex-shrink: 0;
        }

        .sidebar-logo {
          margin-bottom: 24px;
          cursor: pointer;
        }

        .logo-badge {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: linear-gradient(135deg, #F97316 0%, #EA580C 100%);
          color: #FFFFFF;
          font-weight: 800;
          font-size: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(249, 115, 22, 0.35);
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 12px;
          flex: 1;
          width: 100%;
          align-items: center;
        }

        .nav-icon-wrapper {
          position: relative;
          width: 42px;
          height: 42px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6B7280;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .nav-icon-wrapper:hover {
          background-color: #F3F4F6;
          color: var(--text-primary);
        }

        .nav-icon-wrapper.active {
          background-color: var(--primary-orange-light);
          color: var(--primary-orange);
          font-weight: 600;
        }

        .sidebar-tooltip {
          position: absolute;
          left: 54px;
          top: 50%;
          transform: translateY(-50%);
          background-color: #1F2937;
          color: #FFFFFF;
          font-size: 11px;
          font-weight: 500;
          padding: 5px 10px;
          border-radius: 6px;
          white-space: nowrap;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          pointer-events: none;
          z-index: 1000;
        }

        .sidebar-tooltip::before {
          content: '';
          position: absolute;
          right: 100%;
          top: 50%;
          transform: translateY(-50%);
          border-width: 4px;
          border-style: solid;
          border-color: transparent #1F2937 transparent transparent;
        }

        .sidebar-footer {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          margin-top: auto;
        }

        .shop-toggle-btn {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .shop-toggle-btn.open {
          background-color: #DEF7EC;
          color: #0E9F6E;
        }

        .shop-toggle-btn.open:hover {
          background-color: #BCF0DA;
          transform: scale(1.05);
        }

        .shop-toggle-btn.closed {
          background-color: #FDE8E8;
          color: #E02424;
          animation: pulseClosed 2s infinite;
        }

        .shop-toggle-btn.closed:hover {
          background-color: #FBD5D5;
          transform: scale(1.05);
        }

        @keyframes pulseClosed {
          0%, 100% { box-shadow: 0 0 0 0 rgba(224, 36, 36, 0.4); }
          50% { box-shadow: 0 0 0 6px rgba(224, 36, 36, 0); }
        }

        .user-avatar-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          overflow: hidden;
          cursor: pointer;
          border: 2px solid var(--border-color);
          transition: border-color 0.15s ease;
        }

        .user-avatar-btn:hover {
          border-color: var(--primary-orange);
        }

        .user-avatar-btn img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .logout-btn {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: none;
          background: transparent;
          color: #9CA3AF;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .logout-btn:hover {
          background-color: #FEE2E2;
          color: #DC2626;
        }

        @media (max-width: 768px) {
          .pos-sidebar {
            display: none;
          }
        }
      `}</style>
    </aside>
  );
};
