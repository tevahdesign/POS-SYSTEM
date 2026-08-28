import React, { useState } from 'react';
import { Header } from '../components/common/Header';
import { KpiCard } from '../components/common/KpiCard';
import { LineChart } from '../components/common/LineChart';
import { StatusBadge } from '../components/common/StatusBadge';
import { usePosStore, posStore } from '../store/posStore';
import { DollarSign, ShoppingBag, CreditCard, HeartHandshake, AlertTriangle, ChevronRight, Store, Power } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatINR } from '../utils/formatters';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { orders, alerts, settings, currentUser } = usePosStore();
  const [chartPeriod, setChartPeriod] = useState<'Day' | 'Week' | 'Month'>('Week');

  const isManager = currentUser.role === 'Manager' || currentUser.role === 'Owner';
  const isShopOpen = settings.isShopOpen !== false;

  const toggleShop = () => {
    posStore.toggleShopStatus(!isShopOpen);
  };

  // Dynamic Chart Data based on selected period
  const chartDataByPeriod = {
    Day: [
      { label: '8 AM', value: 2400 },
      { label: '10 AM', value: 5800 },
      { label: '12 PM', value: 12500 },
      { label: '2 PM', value: 9200 },
      { label: '4 PM', value: 6400 },
      { label: '6 PM', value: 14500 },
      { label: '8 PM', value: 18200 }
    ],
    Week: [
      { label: '07 Jun', value: 31000 },
      { label: '08 Jun', value: 42000 },
      { label: '09 Jun', value: 38000 },
      { label: '10 Jun', value: 51000 },
      { label: '11 Jun', value: 44820 },
      { label: '12 Jun', value: 49000 },
      { label: '13 Jun', value: 53000 }
    ],
    Month: [
      { label: 'Week 1', value: 245000 },
      { label: 'Week 2', value: 289000 },
      { label: 'Week 3', value: 312000 },
      { label: 'Week 4', value: 298000 }
    ]
  };

  const topItems = [
    { name: 'Margherita Pizza', amount: formatINR(15705), qty: '45 sold' },
    { name: 'Alfredo Pasta', amount: formatINR(10528), qty: '32 sold' },
    { name: 'Caesar Salad', amount: formatINR(9160), qty: '40 sold' },
    { name: 'BBQ Burger', amount: formatINR(6975), qty: '25 sold' },
    { name: 'Choco Lava Cake', amount: formatINR(6265), qty: '35 sold' }
  ];

  return (
    <div className="main-content">
      <Header title="Dashboard Overview" />

      {/* Store Control Banner for Manager */}
      {isManager && (
        <div className={`store-status-banner ${isShopOpen ? 'is-open' : 'is-closed'}`}>
          <div className="banner-info">
            <Store size={22} className="banner-icon" />
            <div>
              <div className="banner-title">
                Restaurant Status: <strong>{isShopOpen ? 'OPEN FOR BUSINESS' : 'CLOSED'}</strong>
              </div>
              <div className="banner-sub">
                {isShopOpen
                  ? 'All Waiter and Kitchen features are active and accessible.'
                  : 'Waiters and Kitchen staff are locked out from accessing POS order screens until you open the shop.'}
              </div>
            </div>
          </div>
          <button
            className={`btn ${isShopOpen ? 'btn-danger' : 'btn-primary'} store-toggle-action`}
            onClick={toggleShop}
          >
            <Power size={16} />
            {isShopOpen ? 'Close Shop Now' : 'Open Shop Now'}
          </button>
        </div>
      )}

      {/* 4 KPI Cards Grid */}
      <div className="kpi-grid">
        <KpiCard
          title="Today's Sales"
          value={formatINR(44825)}
          change="+12.5%"
          isPositive={true}
          icon={<DollarSign size={18} />}
        />
        <KpiCard
          title="Orders"
          value="128"
          change="+8.0%"
          isPositive={true}
          icon={<ShoppingBag size={18} />}
        />
        <KpiCard
          title="Average Order"
          value={formatINR(350.20)}
          change="+2.2%"
          isPositive={true}
          icon={<CreditCard size={18} />}
        />
        <KpiCard
          title="Tips"
          value={formatINR(6207)}
          change="+15.4%"
          isPositive={true}
          icon={<HeartHandshake size={18} />}
        />
      </div>

      {/* Middle Row: Sales Overview & Top Items */}
      <div className="dashboard-middle-row">
        <div className="pos-card sales-overview-card">
          <LineChart
            data={chartDataByPeriod[chartPeriod]}
            period={chartPeriod}
            onPeriodChange={setChartPeriod}
            height={220}
          />
        </div>

        <div className="pos-card top-items-card">
          <div className="top-items-header">
            <h3 className="section-title">Top Selling Items</h3>
            <button className="link-btn" onClick={() => navigate('/menu')}>
              View all
            </button>
          </div>
          <div className="top-items-list">
            {topItems.map((item, idx) => (
              <div key={idx} className="top-item-row">
                <span className="top-item-index">{idx + 1}</span>
                <div className="top-item-info">
                  <span className="top-item-name">{item.name}</span>
                  <span className="top-item-qty">{item.qty}</span>
                </div>
                <span className="top-item-amount">{item.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Orders Table & Alerts */}
      <div className="dashboard-bottom-row">
        <div className="pos-card recent-orders-card">
          <div className="card-title-bar">
            <h3 className="section-title">Recent Orders</h3>
            <button className="link-btn" onClick={() => navigate('/orders')}>
              View all orders
            </button>
          </div>

          <div className="pos-table-container">
            <table className="pos-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Order Type</th>
                  <th>Table / Customer</th>
                  <th>Time</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="clickable-row" onClick={() => navigate('/orders')}>
                    <td className="font-semibold">{order.orderNumber}</td>
                    <td>{order.type}</td>
                    <td>{order.tableName || order.customerName}</td>
                    <td className="secondary-text">{order.createdAt}</td>
                    <td className="font-semibold">{formatINR(order.total)}</td>
                    <td>
                      <StatusBadge status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="pos-card alerts-card">
          <div className="card-title-bar">
            <h3 className="section-title">Alerts</h3>
            <button className="link-btn" onClick={() => navigate('/inventory')}>
              View all alerts
            </button>
          </div>

          <div className="alerts-list">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="alert-box-item"
                onClick={() => navigate(alert.type === 'stock' ? '/inventory' : '/tables')}
              >
                <div className="alert-badge-icon">
                  <AlertTriangle size={16} />
                </div>
                <div className="alert-box-content">
                  <div className="alert-box-title">{alert.title}</div>
                  <div className="alert-box-sub">{alert.subtitle}</div>
                </div>
                <ChevronRight size={14} className="alert-box-arrow" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 20px;
        }

        .dashboard-middle-row {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 16px;
          margin-bottom: 20px;
        }

        .sales-overview-card {
          display: flex;
          flex-direction: column;
        }

        .top-items-card {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .top-items-header, .card-title-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 8px;
          border-bottom: 1px solid var(--border-color);
        }

        .link-btn {
          background: transparent;
          border: none;
          color: var(--primary-orange);
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }
        .link-btn:hover {
          text-decoration: underline;
        }

        .top-items-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .top-item-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 0;
          border-bottom: 1px solid var(--border-light);
        }

        .top-item-row:last-child {
          border-bottom: none;
        }

        .top-item-index {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #F3F4F6;
          color: var(--text-secondary);
          font-size: 11px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .top-item-info {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .top-item-name {
          font-weight: 600;
          font-size: 12px;
        }

        .top-item-qty {
          font-size: 11px;
          color: var(--text-muted);
        }

        .top-item-amount {
          font-weight: 700;
          font-size: 12px;
          color: var(--text-primary);
        }

        .dashboard-bottom-row {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 16px;
        }

        .recent-orders-card {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .clickable-row {
          cursor: pointer;
        }

        .alerts-card {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .alerts-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .alert-box-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          border-radius: var(--radius-sm);
          background: #FFFBEB;
          border: 1px solid #FDE68A;
          cursor: pointer;
          transition: border-color 0.15s ease;
        }

        .alert-box-item:hover {
          border-color: var(--primary-orange);
        }

        .alert-badge-icon {
          color: #D97706;
        }

        .alert-box-content {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .alert-box-title {
          font-weight: 600;
          font-size: 12px;
          color: var(--text-primary);
        }

        .alert-box-sub {
          font-size: 11px;
          color: var(--text-secondary);
        }

        .alert-box-arrow {
          color: var(--text-muted);
        }

        .store-status-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-radius: var(--radius-md);
          margin-bottom: 20px;
          transition: all 0.2s ease;
        }

        .store-status-banner.is-open {
          background: #ECFDF5;
          border: 1px solid #A7F3D0;
          color: #065F46;
        }

        .store-status-banner.is-closed {
          background: #FEF2F2;
          border: 1px solid #FCA5A5;
          color: #991B1B;
        }

        .banner-info {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .banner-title {
          font-size: 14px;
          font-weight: 600;
        }

        .banner-sub {
          font-size: 12px;
          opacity: 0.85;
          margin-top: 2px;
        }

        .store-toggle-action {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          flex-shrink: 0;
        }

        .btn-danger {
          background-color: #EF4444;
          color: #FFFFFF;
          border: none;
        }
        .btn-danger:hover {
          background-color: #DC2626;
        }

        @media (max-width: 1024px) {
          .kpi-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .dashboard-middle-row, .dashboard-bottom-row {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .kpi-grid {
            grid-template-columns: 1fr;
            display: flex;
            overflow-x: auto;
            padding-bottom: 4px;
          }
        }
      `}</style>
    </div>
  );
};
