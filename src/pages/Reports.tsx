import React, { useState } from 'react';
import { Header } from '../components/common/Header';
import { KpiCard } from '../components/common/KpiCard';
import { LineChart } from '../components/common/LineChart';
import { Calendar, Download, DollarSign, ShoppingBag, CreditCard, HeartHandshake } from 'lucide-react';
import { formatINR } from '../utils/formatters';

export const Reports: React.FC = () => {
  const [activeReportTab, setActiveReportTab] = useState<string>('Sales Summary');
  const [chartPeriod, setChartPeriod] = useState<'Day' | 'Week' | 'Month'>('Week');

  const reportTabs = [
    'Sales Summary',
    'Item Sales',
    'Category Sales',
    'Payment Summary',
    'Labor Report',
    'Inventory Report'
  ];

  const salesTrendData = [
    { label: '07 Jun', value: 34000 },
    { label: '08 Jun', value: 41000 },
    { label: '09 Jun', value: 38500 },
    { label: '10 Jun', value: 52000 },
    { label: '11 Jun', value: 44820 },
    { label: '12 Jun', value: 49000 },
    { label: '13 Jun', value: 53000 }
  ];

  const handleExportCSV = () => {
    const csvContent = 'data:text/csv;charset=utf-8,Date,Sales,Orders,AvgOrder\n07 Jun,34000,110,309.00\n08 Jun,41000,125,328.00\n09 Jun,38500,118,326.20\n10 Jun,52000,145,358.60\n11 Jun,44820,128,350.20\n12 Jun,49000,140,350.00\n13 Jun,53000,150,353.30';
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `nexora_sales_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="main-content">
      <Header title="Reports & Analytics" />

      {/* Top Controls Bar */}
      <div className="reports-top-bar">
        <div className="reports-date-picker">
          <Calendar size={14} className="icon-orange" />
          <span>07 Jun 2026 - 13 Jun 2026</span>
        </div>

        <button className="btn btn-secondary" onClick={handleExportCSV}>
          <Download size={14} /> Export CSV / PDF
        </button>
      </div>

      <div className="reports-grid-layout">
        {/* Left Vertical Sub-Navigation Tabs */}
        <div className="pos-card reports-sidebar-tabs">
          {reportTabs.map((tab) => (
            <button
              key={tab}
              className={`report-tab-btn ${activeReportTab === tab ? 'active' : ''}`}
              onClick={() => setActiveReportTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Right Content Body */}
        <div className="reports-body">
          {/* Summary KPI Cards Grid */}
          <div className="reports-kpi-grid">
            <KpiCard
              title="Total Sales"
              value={formatINR(284507)}
              change="+12.5%"
              isPositive={true}
              icon={<DollarSign size={16} />}
            />
            <KpiCard
              title="Total Orders"
              value="856"
              change="+10.2%"
              isPositive={true}
              icon={<ShoppingBag size={16} />}
            />
            <KpiCard
              title="Average Order"
              value={formatINR(332.40)}
              change="+4.8%"
              isPositive={true}
              icon={<CreditCard size={16} />}
            />
            <KpiCard
              title="Total Tips"
              value={formatINR(41255)}
              change="+11.2%"
              isPositive={true}
              icon={<HeartHandshake size={16} />}
            />
          </div>

          {/* Sales Trend Chart Card */}
          <div className="pos-card sales-trend-card">
            <div className="card-title-bar">
              <h3 className="section-title">Sales Trend</h3>
            </div>
            <LineChart
              data={salesTrendData}
              period={chartPeriod}
              onPeriodChange={setChartPeriod}
              height={240}
            />
          </div>
        </div>
      </div>

      <style>{`
        .reports-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .reports-date-picker {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          padding: 6px 14px;
          border-radius: var(--radius-sm);
          font-size: 12px;
          font-weight: 600;
        }

        .icon-orange {
          color: var(--primary-orange);
        }

        .reports-grid-layout {
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: 16px;
        }

        .reports-sidebar-tabs {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 8px;
          height: fit-content;
        }

        .report-tab-btn {
          text-align: left;
          padding: 10px 14px;
          font-size: 13px;
          font-weight: 500;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .report-tab-btn:hover {
          background: #F3F4F6;
          color: var(--text-primary);
        }

        .report-tab-btn.active {
          background: var(--primary-orange-light);
          color: var(--primary-orange);
          font-weight: 700;
        }

        .reports-body {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .reports-kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }

        .sales-trend-card {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        @media (max-width: 1024px) {
          .reports-grid-layout {
            grid-template-columns: 1fr;
          }
          .reports-sidebar-tabs {
            flex-direction: row;
            overflow-x: auto;
          }
          .reports-kpi-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
};
