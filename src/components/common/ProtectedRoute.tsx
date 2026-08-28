import React from 'react';
import { Navigate } from 'react-router-dom';
import { usePosStore, posStore } from '../../store/posStore';
import { StaffRole, StaffMember } from '../../types/pos';
import { Store, Lock, LogOut, ShieldAlert } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: StaffRole[];
  requiredPermission?: keyof StaffMember['permissions'];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  requiredPermission
}) => {
  const { currentUser, settings } = usePosStore();

  const isManager = currentUser.role === 'Manager' || currentUser.role === 'Owner';
  const isShopOpen = settings.isShopOpen !== false; // Default true if undefined

  // 1. Store Closure Guard: Non-manager staff see Store Closed overlay when shop is closed
  if (!isShopOpen && !isManager) {
    return (
      <div className="shop-closed-container">
        <div className="shop-closed-card pos-card">
          <div className="closed-icon-wrapper">
            <Store size={48} className="closed-icon" />
            <span className="closed-badge">CLOSED</span>
          </div>

          <h2 className="closed-title">Restaurant POS is Closed</h2>
          <p className="closed-description">
            The store manager has closed the shop for active operations. Waiter and Kitchen order entry features are temporarily disabled.
          </p>

          <div className="closed-user-banner">
            <img src={currentUser.avatar} alt={currentUser.name} className="user-avatar-sm" />
            <div className="user-info-text">
              <span className="user-name">{currentUser.name}</span>
              <span className="user-role-badge">{currentUser.role}</span>
            </div>
          </div>

          <div className="closed-actions">
            <button
              className="btn btn-outline w-full"
              onClick={() => {
                // Navigate to login
                window.location.href = '/login';
              }}
            >
              <LogOut size={16} /> Sign Out / Manager Login
            </button>
          </div>
        </div>

        <style>{`
          .shop-closed-container {
            min-height: 100vh;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #111827 0%, #1F2937 100%);
            padding: 24px;
            color: #FFFFFF;
          }

          .shop-closed-card {
            max-width: 460px;
            width: 100%;
            padding: 36px 32px;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
            background: #FFFFFF;
            color: var(--text-primary);
            border-radius: var(--radius-lg);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
          }

          .closed-icon-wrapper {
            position: relative;
            width: 80px;
            height: 80px;
            border-radius: 20px;
            background: #FEE2E2;
            color: #EF4444;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .closed-badge {
            position: absolute;
            bottom: -8px;
            background: #EF4444;
            color: #FFFFFF;
            font-size: 10px;
            font-weight: 800;
            padding: 2px 8px;
            border-radius: 10px;
            letter-spacing: 0.05em;
          }

          .closed-title {
            font-size: 22px;
            font-weight: 800;
            color: #111827;
            margin: 0;
          }

          .closed-description {
            font-size: 13px;
            color: #6B7280;
            line-height: 1.5;
            margin: 0;
          }

          .closed-user-banner {
            display: flex;
            align-items: center;
            gap: 12px;
            background: #F9FAFB;
            padding: 10px 16px;
            border-radius: 12px;
            width: 100%;
            border: 1px solid #E5E7EB;
          }

          .user-avatar-sm {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            object-fit: cover;
          }

          .user-info-text {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            line-height: 1.2;
          }

          .user-name {
            font-weight: 700;
            font-size: 13px;
          }

          .user-role-badge {
            font-size: 11px;
            color: var(--primary-orange);
            font-weight: 600;
          }

          .closed-actions {
            width: 100%;
          }

          .w-full {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
          }
        `}</style>
      </div>
    );
  }

  // 2. Role & Permission Guard
  if (isManager) {
    return <>{children}</>;
  }

  // Check role requirement
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to={getDefaultUserRoute(currentUser)} replace />;
  }

  // Check granular permission requirement
  if (requiredPermission && !currentUser.permissions[requiredPermission]) {
    return <Navigate to={getDefaultUserRoute(currentUser)} replace />;
  }

  return <>{children}</>;
};

function getDefaultUserRoute(user: StaffMember): string {
  if (user.role === 'Cook') return '/kitchen';
  if (user.role === 'Server' || user.role === 'Cashier') return '/orders';
  return '/login';
}
