import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { StaffMember, StaffRole } from '../../types/pos';
import { posStore } from '../../store/posStore';
import { ShieldCheck, Utensils, Grid } from 'lucide-react';

interface StaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffToEdit: StaffMember | null;
}

export const StaffModal: React.FC<StaffModalProps> = ({
  isOpen,
  onClose,
  staffToEdit
}) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<StaffRole>('Server');
  const [pin, setPin] = useState('');
  const [avatar, setAvatar] = useState('');
  const [permissions, setPermissions] = useState({
    dashboard: true,
    orders: true,
    tables: true,
    kitchen: false,
    menu: false,
    inventory: false,
    reports: false,
    staff: false,
    payments: false,
    settings: false,
    waiterAccess: true,
    kitchenAccess: false
  });

  useEffect(() => {
    if (staffToEdit) {
      setName(staffToEdit.name);
      setUsername(staffToEdit.username || staffToEdit.name.toLowerCase().replace(/\s+/g, '.'));
      setRole(staffToEdit.role);
      setPin(staffToEdit.pin);
      setAvatar(staffToEdit.avatar);
      setPermissions({
        waiterAccess: staffToEdit.permissions.waiterAccess ?? (staffToEdit.permissions.orders && staffToEdit.permissions.tables),
        kitchenAccess: staffToEdit.permissions.kitchenAccess ?? staffToEdit.permissions.kitchen,
        ...staffToEdit.permissions
      });
    } else {
      setName('');
      setUsername('');
      setRole('Server');
      setPin('1234');
      setAvatar('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80');
      setPermissions({
        dashboard: false,
        orders: true,
        tables: true,
        kitchen: false,
        menu: false,
        inventory: false,
        reports: false,
        staff: false,
        payments: false,
        settings: false,
        waiterAccess: true,
        kitchenAccess: false
      });
    }
  }, [staffToEdit, isOpen]);

  const handleRoleChange = (selectedRole: StaffRole) => {
    setRole(selectedRole);
    if (selectedRole === 'Manager' || selectedRole === 'Owner') {
      setPermissions({
        dashboard: true, orders: true, tables: true, kitchen: true, menu: true,
        inventory: true, reports: true, staff: true, payments: true, settings: true,
        waiterAccess: true, kitchenAccess: true
      });
    } else if (selectedRole === 'Server') {
      setPermissions({
        dashboard: false, orders: true, tables: true, kitchen: false, menu: false,
        inventory: false, reports: false, staff: false, payments: false, settings: false,
        waiterAccess: true, kitchenAccess: false
      });
    } else if (selectedRole === 'Cook') {
      setPermissions({
        dashboard: false, orders: false, tables: false, kitchen: true, menu: true,
        inventory: true, reports: false, staff: false, payments: false, settings: false,
        waiterAccess: false, kitchenAccess: true
      });
    } else if (selectedRole === 'Cashier') {
      setPermissions({
        dashboard: true, orders: true, tables: true, kitchen: false, menu: false,
        inventory: false, reports: false, staff: false, payments: true, settings: false,
        waiterAccess: true, kitchenAccess: false
      });
    }
  };

  const handleToggleWaiterAccess = (val: boolean) => {
    setPermissions(prev => ({
      ...prev,
      waiterAccess: val,
      orders: val,
      tables: val
    }));
  };

  const handleToggleKitchenAccess = (val: boolean) => {
    setPermissions(prev => ({
      ...prev,
      kitchenAccess: val,
      kitchen: val,
      inventory: val ? prev.inventory : prev.inventory
    }));
  };

  const handleTogglePerm = (key: keyof typeof permissions) => {
    setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !pin) return;

    const finalPermissions = {
      ...permissions,
      orders: permissions.waiterAccess || permissions.orders,
      tables: permissions.waiterAccess || permissions.tables,
      kitchen: permissions.kitchenAccess || permissions.kitchen
    };

    if (staffToEdit) {
      posStore.updateStaff({
        ...staffToEdit,
        name,
        username: username || name.toLowerCase().replace(/\s+/g, '.'),
        role,
        pin,
        avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        permissions: finalPermissions
      });
    } else {
      const newStaff: StaffMember = {
        id: 's-' + Date.now(),
        name,
        username: username || name.toLowerCase().replace(/\s+/g, '.'),
        role,
        pin,
        avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        status: 'Active',
        permissions: finalPermissions
      };
      posStore.addStaff(newStaff);
    }

    onClose();
  };

  const permKeys: (keyof typeof permissions)[] = [
    'dashboard', 'orders', 'tables', 'kitchen', 'menu',
    'inventory', 'reports', 'staff', 'payments', 'settings'
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={staffToEdit ? `Edit Credentials: ${staffToEdit.name}` : 'Add New Worker Credentials'}
      maxWidth="560px"
    >
      <form onSubmit={handleSubmit} className="staff-form">
        <div className="form-row">
          <div className="form-group flex-1">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              className="input-field"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rahul Sharma"
            />
          </div>
          <div className="form-group flex-1">
            <label className="form-label">Username / Login ID</label>
            <input
              type="text"
              className="input-field"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="rahul.waiter"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group flex-1">
            <label className="form-label">Role *</label>
            <select
              className="input-field"
              value={role}
              onChange={(e) => handleRoleChange(e.target.value as StaffRole)}
            >
              <option value="Owner">Owner</option>
              <option value="Manager">Manager</option>
              <option value="Cashier">Cashier</option>
              <option value="Server">Server (Waiter)</option>
              <option value="Cook">Cook (Kitchen)</option>
              <option value="Dishwasher">Dishwasher</option>
            </select>
          </div>

          <div className="form-group flex-1">
            <label className="form-label">4-Digit POS PIN *</label>
            <input
              type="password"
              maxLength={4}
              className="input-field"
              required
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="1234"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Avatar Image URL</label>
          <input
            type="text"
            className="input-field"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            placeholder="https://..."
          />
        </div>

        {/* Primary Access Control Toggles: Waiter vs Kitchen */}
        <div className="primary-access-section">
          <label className="form-label font-bold flex align-center gap-1">
            <ShieldCheck size={14} className="text-orange" /> Primary Operational Access Controls
          </label>
          <div className="access-toggles-grid">
            <div className={`access-card ${permissions.waiterAccess ? 'active' : ''}`}>
              <div className="access-card-header">
                <div className="icon-badge orange"><Grid size={16} /></div>
                <div>
                  <div className="access-title">Waiter Access</div>
                  <div className="access-desc">Table floor plan & Order Entry</div>
                </div>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={Boolean(permissions.waiterAccess)}
                  onChange={(e) => handleToggleWaiterAccess(e.target.checked)}
                />
                <span className="slider round"></span>
              </label>
            </div>

            <div className={`access-card ${permissions.kitchenAccess ? 'active' : ''}`}>
              <div className="access-card-header">
                <div className="icon-badge green"><Utensils size={16} /></div>
                <div>
                  <div className="access-title">Kitchen Access</div>
                  <div className="access-desc">KDS Tickets & Cooking Prep</div>
                </div>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={Boolean(permissions.kitchenAccess)}
                  onChange={(e) => handleToggleKitchenAccess(e.target.checked)}
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        </div>

        {/* Modular Permission Checkboxes Matrix */}
        <div className="perm-section">
          <label className="form-label">Detailed Module Access Permissions</label>
          <div className="perm-matrix-grid">
            {permKeys.map((pKey) => (
              <label key={pKey} className="perm-checkbox-item">
                <input
                  type="checkbox"
                  checked={permissions[pKey]}
                  onChange={() => handleTogglePerm(pKey)}
                />
                <span className="capitalize">{pKey}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Save Worker Credentials
          </button>
        </div>
      </form>

      <style>{`
        .staff-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
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

        .primary-access-section {
          background: #FFF7ED;
          border: 1px solid #FFEDD5;
          padding: 12px;
          border-radius: var(--radius-sm);
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .access-toggles-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .access-card {
          background: #FFFFFF;
          border: 1px solid #FED7AA;
          padding: 10px 12px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: all 0.15s ease;
        }

        .access-card.active {
          border-color: var(--primary-orange);
          box-shadow: 0 2px 8px rgba(249, 115, 22, 0.12);
        }

        .access-card-header {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .icon-badge {
          width: 30px;
          height: 30px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .icon-badge.orange { background: #FFEDD5; color: #EA580C; }
        .icon-badge.green { background: #DCFCE7; color: #166534; }

        .access-title {
          font-size: 12px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .access-desc {
          font-size: 10px;
          color: var(--text-secondary);
        }

        /* Toggle Switch Styling */
        .switch {
          position: relative;
          display: inline-block;
          width: 36px;
          height: 20px;
        }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: #D1D5DB;
          transition: .2s;
        }
        .slider:before {
          position: absolute;
          content: "";
          height: 14px;
          width: 14px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: .2s;
        }
        input:checked + .slider { background-color: var(--primary-orange); }
        input:checked + .slider:before { transform: translateX(16px); }
        .slider.round { border-radius: 20px; }
        .slider.round:before { border-radius: 50%; }

        .perm-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding-top: 8px;
          border-top: 1px solid var(--border-color);
        }

        .perm-matrix-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
          background: #FAF9F6;
          padding: 10px;
          border-radius: var(--radius-sm);
        }

        .perm-checkbox-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          cursor: pointer;
        }

        .capitalize {
          text-transform: capitalize;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          padding-top: 10px;
          border-top: 1px solid var(--border-color);
        }
      `}</style>
    </Modal>
  );
};
