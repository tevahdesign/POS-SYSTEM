import React, { useState } from 'react';
import { Header } from '../components/common/Header';
import { StaffModal } from '../components/staff/StaffModal';
import { usePosStore, posStore } from '../store/posStore';
import { StaffMember } from '../types/pos';
import { Plus, Edit2, Lock, Power, Trash2, Utensils, Grid } from 'lucide-react';

export const StaffManagement: React.FC = () => {
  const { staff } = usePosStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

  const handleEdit = (member: StaffMember) => {
    setSelectedStaff(member);
    setIsModalOpen(true);
  };

  const handleResetPin = (member: StaffMember) => {
    const newPin = prompt(`Enter new 4-digit PIN for ${member.name}:`, '1234');
    if (newPin && newPin.length === 4) {
      posStore.resetStaffPin(member.id, newPin);
      alert(`PIN for ${member.name} updated to ${newPin}`);
    }
  };

  const handleToggleStatus = (staffId: string) => {
    posStore.toggleStaffStatus(staffId);
  };

  const handleDeleteStaff = (member: StaffMember) => {
    if (window.confirm(`Are you sure you want to PERMANENTLY REMOVE worker credentials for "${member.name}"?`)) {
      posStore.deleteStaff(member.id);
    }
  };

  const handleAddNew = () => {
    setSelectedStaff(null);
    setIsModalOpen(true);
  };

  return (
    <div className="main-content">
      <Header title="Staff & Worker Credentials Management" />

      {/* Top Controls Bar */}
      <div className="staff-controls-bar">
        <div className="section-title">Team Directory & Operational Access ({staff.length})</div>
        <button className="btn btn-primary" onClick={handleAddNew}>
          <Plus size={16} /> + Add Worker Credentials
        </button>
      </div>

      {/* Staff Table */}
      <div className="pos-card p-0">
        <div className="pos-table-container">
          <table className="pos-table">
            <thead>
              <tr>
                <th>Worker Name</th>
                <th>Username</th>
                <th>Role</th>
                <th>Access Rights</th>
                <th>PIN</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((member) => {
                const hasWaiter = member.permissions.waiterAccess ?? (member.permissions.orders && member.permissions.tables);
                const hasKitchen = member.permissions.kitchenAccess ?? member.permissions.kitchen;

                return (
                  <tr key={member.id}>
                    <td>
                      <div className="staff-user-cell">
                        <img src={member.avatar} alt={member.name} className="staff-avatar" />
                        <span className="font-semibold">{member.name}</span>
                      </div>
                    </td>
                    <td className="secondary-text font-mono">
                      {member.username || member.name.toLowerCase().replace(/\s+/g, '.')}
                    </td>
                    <td>
                      <span className="role-tag-badge">{member.role}</span>
                    </td>
                    <td>
                      <div className="access-badges-row">
                        {hasWaiter && (
                          <span className="access-pill orange" title="Waiter Access Enabled">
                            <Grid size={11} /> Waiter
                          </span>
                        )}
                        {hasKitchen && (
                          <span className="access-pill green" title="Kitchen Access Enabled">
                            <Utensils size={11} /> Kitchen
                          </span>
                        )}
                        {!hasWaiter && !hasKitchen && (
                          <span className="access-pill gray">No Module Access</span>
                        )}
                      </div>
                    </td>
                    <td className="secondary-text font-mono">•••• ({member.pin})</td>
                    <td>
                      <span className={`badge ${member.status === 'Active' ? 'badge-success' : 'badge-error'}`}>
                        {member.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons-group">
                        <button
                          className="table-action-btn"
                          onClick={() => handleEdit(member)}
                          title="Edit credentials & access rights"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          className="table-action-btn"
                          onClick={() => handleResetPin(member)}
                          title="Reset POS PIN"
                        >
                          <Lock size={14} />
                        </button>
                        <button
                          className={`table-action-btn ${member.status === 'Active' ? '' : 'inactive-btn'}`}
                          onClick={() => handleToggleStatus(member.id)}
                          title="Toggle active status"
                        >
                          <Power size={14} />
                        </button>
                        <button
                          className="table-action-btn delete"
                          onClick={() => handleDeleteStaff(member)}
                          title="Remove Worker Credentials"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <StaffModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        staffToEdit={selectedStaff}
      />

      <style>{`
        .staff-controls-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .staff-user-cell {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .staff-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
        }

        .role-tag-badge {
          background: #F3F4F6;
          color: var(--text-primary);
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
        }

        .access-badges-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .access-pill {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
        }
        .access-pill.orange { background: #FFEDD5; color: #C2410C; }
        .access-pill.green { background: #DCFCE7; color: #15803D; }
        .access-pill.gray { background: #F3F4F6; color: #6B7280; }

        .font-mono {
          font-family: monospace;
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
          background-color: #FEE2E2;
          color: #EF4444;
        }

        .p-0 { padding: 0 !important; }
      `}</style>
    </div>
  );
};
