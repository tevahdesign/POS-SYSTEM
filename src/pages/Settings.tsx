import React, { useState } from 'react';
import { Header } from '../components/common/Header';
import { usePosStore, posStore } from '../store/posStore';
import { Save, Check, RotateCcw } from 'lucide-react';

export const Settings: React.FC = () => {
  const { settings } = usePosStore();
  const [activeCategory, setActiveCategory] = useState<string>('General');
  const [formData, setFormData] = useState({ ...settings });
  const [isSaved, setIsSaved] = useState(false);

  const categories = [
    'General',
    'Restaurant Info',
    'Tax Settings',
    'Payment Methods',
    'Printers',
    'Users & Permissions',
    'Notifications',
    'Backup & Restore',
    'Integrations'
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    posStore.updateSettings(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all POS data back to factory seed defaults?')) {
      posStore.resetAllState();
      alert('POS system reset to initial demo state!');
      window.location.reload();
    }
  };

  return (
    <div className="main-content">
      <Header title="Settings" />

      <div className="settings-layout">
        {/* Left Sub-Navigation Sidebar */}
        <div className="pos-card settings-sidebar-card">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`settings-cat-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Right Form Card matching reference exactly */}
        <div className="pos-card settings-form-card">
          <div className="card-title-bar">
            <h3 className="section-title">{activeCategory} Settings</h3>
            {isSaved && (
              <span className="save-success-tag">
                <Check size={14} /> Changes saved successfully!
              </span>
            )}
          </div>

          <form onSubmit={handleSave} className="settings-form-body">
            <div className="form-group">
              <label className="form-label">Restaurant Name</label>
              <input
                type="text"
                className="input-field"
                value={formData.restaurantName}
                onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
              />
            </div>

            <div className="form-row">
              <div className="form-group flex-1">
                <label className="form-label">Currency</label>
                <select
                  className="input-field"
                  value={formData.currency}
                  onChange={(e) => {
                    const val = e.target.value;
                    const sym = val.includes('INR') ? '₹' : val.includes('EUR') ? '€' : val.includes('GBP') ? '£' : '$';
                    setFormData({ ...formData, currency: val, currencySymbol: sym });
                  }}
                >
                  <option value="INR (₹)">INR (₹)</option>
                  <option value="USD ($)">USD ($)</option>
                  <option value="EUR (€)">EUR (€)</option>
                  <option value="GBP (£)">GBP (£)</option>
                </select>
              </div>

              <div className="form-group flex-1">
                <label className="form-label">Time Zone</label>
                <select
                  className="input-field"
                  value={formData.timezone}
                  onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                >
                  <option value="(UTC-05:00) Eastern Time">(UTC-05:00) Eastern Time</option>
                  <option value="(UTC-08:00) Pacific Time">(UTC-08:00) Pacific Time</option>
                  <option value="(UTC+00:00) London">(UTC+00:00) London</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group flex-1">
                <label className="form-label">Date Format</label>
                <select
                  className="input-field"
                  value={formData.datePattern}
                  onChange={(e) => setFormData({ ...formData, datePattern: e.target.value })}
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>

              <div className="form-group flex-1">
                <label className="form-label">Time Format</label>
                <select
                  className="input-field"
                  value={formData.timeFormat}
                  onChange={(e) => setFormData({ ...formData, timeFormat: e.target.value as any })}
                >
                  <option value="12 Hour">12 Hour</option>
                  <option value="24 Hour">24 Hour</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Language</label>
              <select
                className="input-field"
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Default Tax Rate (%)</label>
              <input
                type="number"
                step="0.1"
                className="input-field"
                value={formData.taxRate}
                onChange={(e) => setFormData({ ...formData, taxRate: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div className="form-actions-bar">
              <button
                type="button"
                className="btn btn-secondary text-danger"
                onClick={handleResetData}
              >
                <RotateCcw size={14} /> Factory Reset Demo State
              </button>

              <button type="submit" className="btn btn-primary">
                <Save size={16} /> Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        .settings-layout {
          display: grid;
          grid-template-columns: 220px 1fr;
          gap: 16px;
        }

        .settings-sidebar-card {
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding: 8px;
          height: fit-content;
        }

        .settings-cat-btn {
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

        .settings-cat-btn:hover {
          background: #F3F4F6;
          color: var(--text-primary);
        }

        .settings-cat-btn.active {
          background: var(--primary-orange-light);
          color: var(--primary-orange);
          font-weight: 700;
        }

        .settings-form-card {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .card-title-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--border-color);
        }

        .save-success-tag {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: var(--status-success);
          font-weight: 600;
        }

        .settings-form-body {
          display: flex;
          flex-direction: column;
          gap: 14px;
          max-width: 540px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .form-label {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .form-row {
          display: flex;
          gap: 12px;
        }

        .flex-1 { flex: 1; }

        .form-actions-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 14px;
          border-top: 1px solid var(--border-color);
          margin-top: 10px;
        }

        .text-danger {
          color: #DC2626;
        }

        @media (max-width: 900px) {
          .settings-layout {
            grid-template-columns: 1fr;
          }
          .settings-sidebar-card {
            flex-direction: row;
            overflow-x: auto;
          }
        }
      `}</style>
    </div>
  );
};
