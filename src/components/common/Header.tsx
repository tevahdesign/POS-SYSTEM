import React, { useState } from 'react';
import { Calendar, Bell, ChevronDown, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { usePosStore } from '../../store/posStore';

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  const { currentUser, alerts } = usePosStore();
  const [showNotifications, setShowNotifications] = useState(false);

  const todayFormatted = 'Today, 15 Jun 2026';

  return (
    <header className="pos-header">
      <div className="header-left">
        <h1 className="page-title">{title}</h1>
      </div>

      <div className="header-right">
        {/* Date Selector Badge */}
        <div className="header-date-badge">
          <Calendar size={14} className="icon-orange" />
          <span>{todayFormatted}</span>
          <ChevronDown size={14} className="icon-gray" />
        </div>

        {/* Notifications Icon & Popover */}
        <div className="notification-wrapper">
          <button
            className="header-icon-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            title="Alerts & Notifications"
          >
            <Bell size={18} />
            {alerts.length > 0 && <span className="notification-badge-dot" />}
          </button>

          {showNotifications && (
            <div className="notification-popover">
              <div className="popover-header">
                <span className="popover-title">Notifications ({alerts.length})</span>
                <button
                  className="popover-clear"
                  onClick={() => setShowNotifications(false)}
                >
                  Close
                </button>
              </div>
              <div className="popover-list">
                {alerts.map((alert) => (
                  <div key={alert.id} className="popover-item">
                    <AlertTriangle size={16} className="alert-icon-warning" />
                    <div className="alert-content">
                      <div className="alert-title">{alert.title}</div>
                      <div className="alert-sub">{alert.subtitle} • {alert.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Badge */}
        <div className="header-user-badge">
          <img src={currentUser.avatar} alt={currentUser.name} className="header-avatar" />
          <div className="header-user-info">
            <span className="user-name">{currentUser.name}</span>
            <span className="user-role-tag">{currentUser.role}</span>
          </div>
        </div>
      </div>

      <style>{`
        .pos-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          padding-bottom: 4px;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .header-date-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          padding: 6px 12px;
          font-size: 12px;
          font-weight: 500;
          color: var(--text-primary);
          cursor: pointer;
        }

        .icon-orange {
          color: var(--primary-orange);
        }

        .icon-gray {
          color: var(--text-muted);
        }

        .notification-wrapper {
          position: relative;
        }

        .header-icon-btn {
          position: relative;
          width: 36px;
          height: 36px;
          border-radius: var(--radius-sm);
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-primary);
          cursor: pointer;
          transition: border-color 0.15s ease;
        }

        .header-icon-btn:hover {
          border-color: var(--primary-orange);
        }

        .notification-badge-dot {
          position: absolute;
          top: 7px;
          right: 7px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--primary-orange);
          border: 2px solid #FFFFFF;
        }

        .notification-popover {
          position: absolute;
          right: 0;
          top: 44px;
          width: 280px;
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          box-shadow: var(--modal-shadow);
          z-index: 1000;
          padding: 12px;
        }

        .popover-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 8px;
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 8px;
        }

        .popover-title {
          font-weight: 600;
          font-size: 13px;
        }

        .popover-clear {
          background: transparent;
          border: none;
          color: var(--primary-orange);
          font-size: 12px;
          cursor: pointer;
        }

        .popover-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .popover-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          padding: 6px;
          border-radius: 6px;
          background: #FAF9F6;
        }

        .alert-icon-warning {
          color: #D97706;
          margin-top: 2px;
        }

        .alert-content {
          font-size: 12px;
        }

        .alert-title {
          font-weight: 600;
          color: var(--text-primary);
        }

        .alert-sub {
          font-size: 11px;
          color: var(--text-secondary);
        }

        .header-user-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 8px;
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
        }

        .header-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          object-fit: cover;
        }

        .header-user-info {
          display: flex;
          flex-direction: column;
          line-height: 1.1;
        }

        .user-name {
          font-weight: 600;
          font-size: 12px;
        }

        .user-role-tag {
          font-size: 10px;
          color: var(--text-secondary);
        }

        @media (max-width: 768px) {
          .header-user-info, .header-date-badge {
            display: none;
          }
          .page-title {
            font-size: 18px;
          }
        }
      `}</style>
    </header>
  );
};
