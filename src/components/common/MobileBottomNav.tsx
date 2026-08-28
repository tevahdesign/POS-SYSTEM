import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  ShoppingBag,
  Grid,
  UtensilsCrossed,
  Menu as MenuIcon,
  X,
  BookOpen,
  Package,
  BarChart3,
  Users,
  CreditCard,
  Settings,
  LogOut
} from 'lucide-react';
import { usePosStore } from '../../store/posStore';

export const MobileBottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = usePosStore();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const activePath = location.pathname;

  const handleNav = (path: string) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const secondaryNavItems = [
    { label: 'Menu Management', path: '/menu', icon: BookOpen },
    { label: 'Inventory Stock', path: '/inventory', icon: Package },
    { label: 'Analytics Reports', path: '/reports', icon: BarChart3 },
    { label: 'Staff Management', path: '/staff', icon: Users },
    { label: 'Payments & Reconciliation', path: '/payments', icon: CreditCard },
    { label: 'POS Settings', path: '/settings', icon: Settings }
  ];

  return (
    <>
      {/* Secondary Drawer Overlay */}
      {drawerOpen && (
        <div className="mobile-drawer-backdrop" onClick={() => setDrawerOpen(false)}>
          <div className="mobile-drawer-content" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <div className="drawer-user-info">
                <img src={currentUser.avatar} alt={currentUser.name} className="drawer-avatar" />
                <div>
                  <div className="drawer-user-name">{currentUser.name}</div>
                  <div className="drawer-user-role">{currentUser.role}</div>
                </div>
              </div>
              <button className="drawer-close-btn" onClick={() => setDrawerOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="drawer-grid">
              {secondaryNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activePath === item.path;
                return (
                  <div
                    key={item.path}
                    className={`drawer-card ${isActive ? 'active' : ''}`}
                    onClick={() => handleNav(item.path)}
                  >
                    <Icon size={22} className="drawer-card-icon" />
                    <span className="drawer-card-label">{item.label}</span>
                  </div>
                );
              })}
            </div>

            <button
              className="drawer-logout-btn"
              onClick={() => {
                setDrawerOpen(false);
                navigate('/login');
              }}
            >
              <LogOut size={18} />
              <span>Lock POS / Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Bottom Navigation Bar */}
      <nav className="mobile-bottom-nav">
        <button
          className={`nav-tab ${activePath === '/dashboard' ? 'active' : ''}`}
          onClick={() => handleNav('/dashboard')}
        >
          <Home size={20} />
          <span>Home</span>
        </button>

        <button
          className={`nav-tab ${activePath === '/orders' ? 'active' : ''}`}
          onClick={() => handleNav('/orders')}
        >
          <ShoppingBag size={20} />
          <span>Orders</span>
        </button>

        <button
          className={`nav-tab ${activePath === '/tables' ? 'active' : ''}`}
          onClick={() => handleNav('/tables')}
        >
          <Grid size={20} />
          <span>Tables</span>
        </button>

        <button
          className={`nav-tab ${activePath === '/kitchen' ? 'active' : ''}`}
          onClick={() => handleNav('/kitchen')}
        >
          <UtensilsCrossed size={20} />
          <span>Kitchen</span>
        </button>

        <button
          className={`nav-tab ${drawerOpen || secondaryNavItems.some(i => i.path === activePath) ? 'active' : ''}`}
          onClick={() => setDrawerOpen(!drawerOpen)}
        >
          <MenuIcon size={20} />
          <span>More</span>
        </button>
      </nav>

      <style>{`
        .mobile-bottom-nav {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: var(--mobile-nav-height);
          background: #FFFFFF;
          border-top: 1px solid var(--border-color);
          z-index: 990;
          padding: 0 8px;
          box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
        }

        .nav-tab {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3px;
          background: transparent;
          border: none;
          color: #9CA3AF;
          font-size: 11px;
          font-weight: 500;
          cursor: pointer;
          min-height: 44px;
        }

        .nav-tab.active {
          color: var(--primary-orange);
          font-weight: 600;
        }

        .mobile-drawer-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1000;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          animation: fadeIn 0.15s ease-out;
        }

        .mobile-drawer-content {
          background: #FFFFFF;
          border-top-left-radius: 16px;
          border-top-right-radius: 16px;
          padding: 20px;
          max-height: 80vh;
          overflow-y: auto;
          animation: slideUp 0.2s ease-out;
        }

        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }

        .drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 16px;
        }

        .drawer-user-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .drawer-avatar {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          object-fit: cover;
        }

        .drawer-user-name {
          font-weight: 600;
          font-size: 15px;
        }

        .drawer-user-role {
          font-size: 12px;
          color: var(--text-secondary);
        }

        .drawer-close-btn {
          background: #F3F4F6;
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .drawer-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 20px;
        }

        .drawer-card {
          background: var(--bg-main);
          border: 1px solid var(--border-color);
          border-radius: 10px;
          padding: 14px;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }

        .drawer-card.active {
          border-color: var(--primary-orange);
          background: var(--primary-orange-light);
        }

        .drawer-card-icon {
          color: var(--primary-orange);
        }

        .drawer-card-label {
          font-size: 13px;
          font-weight: 600;
        }

        .drawer-logout-btn {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          border: 1px solid #FEE2E2;
          background: #FEF2F2;
          color: #DC2626;
          font-weight: 600;
          font-size: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .mobile-bottom-nav {
            display: flex;
          }
        }
      `}</style>
    </>
  );
};
