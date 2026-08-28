import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { posStore, usePosStore } from '../store/posStore';
import { Lock, Mail, KeyRound, UserCheck } from 'lucide-react';
import { StaffMember } from '../types/pos';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { staff } = usePosStore();
  const [loginMode, setLoginMode] = useState<'email' | 'pin'>('pin');
  const [email, setEmail] = useState('manager@nexorapos.com');
  const [password, setPassword] = useState('password123');
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const matched = staff.find(s => s.pin === pin && s.status === 'Active');
    if (matched) {
      posStore.setCurrentUser(matched);
      navigate('/dashboard');
    } else {
      setErrorMsg('Invalid staff PIN. Please try 1234 (Manager), 2345 (Cashier), or 3456 (Cook).');
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      posStore.setCurrentUser(staff[0]); // Default Manager
      navigate('/dashboard');
    } else {
      setErrorMsg('Please enter valid email and password.');
    }
  };

  const handleQuickSelectStaff = (member: StaffMember) => {
    setPin(member.pin);
    posStore.setCurrentUser(member);
    navigate('/dashboard');
  };

  return (
    <div className="login-container">
      <div className="login-card pos-card">
        {/* Brand Header */}
        <div className="login-header">
          <div className="logo-badge-lg">N</div>
          <h2 className="login-brand-name">NEXORA POS</h2>
          <p className="secondary-text">Enterprise Restaurant Management Platform</p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="login-mode-tabs">
          <button
            className={`mode-btn ${loginMode === 'pin' ? 'active' : ''}`}
            onClick={() => { setLoginMode('pin'); setErrorMsg(''); }}
          >
            <Lock size={14} /> Staff PIN Lock
          </button>
          <button
            className={`mode-btn ${loginMode === 'email' ? 'active' : ''}`}
            onClick={() => { setLoginMode('email'); setErrorMsg(''); }}
          >
            <Mail size={14} /> Manager Login
          </button>
        </div>

        {errorMsg && <div className="login-error-alert">{errorMsg}</div>}

        {loginMode === 'pin' ? (
          <form onSubmit={handlePinSubmit} className="login-form">
            <div className="form-group">
              <label className="form-label">Enter 4-Digit Staff PIN</label>
              <div className="pin-input-wrapper">
                <KeyRound size={18} className="pin-icon" />
                <input
                  type="password"
                  maxLength={4}
                  className="input-field pin-input"
                  placeholder="• • • •"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  autoFocus
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg w-full">
              Sign In to POS
            </button>

            {/* Quick Demo Staff Picker Buttons */}
            <div className="quick-staff-picker">
              <span className="picker-title">Quick Demo Login:</span>
              <div className="staff-chips-grid">
                {staff.slice(0, 4).map((member) => (
                  <button
                    key={member.id}
                    type="button"
                    className="staff-quick-chip"
                    onClick={() => handleQuickSelectStaff(member)}
                  >
                    <img src={member.avatar} alt={member.name} className="chip-avatar" />
                    <div className="chip-info">
                      <span className="chip-name">{member.name}</span>
                      <span className="chip-role">{member.role} ({member.pin})</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleEmailSubmit} className="login-form">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg w-full">
              Sign In
            </button>
          </form>
        )}
      </div>

      <style>{`
        .login-container {
          min-height: 100vh;
          width: 100vw;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--bg-main);
          padding: 16px;
        }

        .login-card {
          width: 100%;
          max-width: 440px;
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .login-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .logo-badge-lg {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          background: linear-gradient(135deg, #F97316 0%, #EA580C 100%);
          color: #FFFFFF;
          font-weight: 800;
          font-size: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(249, 115, 22, 0.4);
          margin-bottom: 12px;
        }

        .login-brand-name {
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.01em;
        }

        .login-mode-tabs {
          display: flex;
          background: #F3F4F6;
          padding: 3px;
          border-radius: 8px;
        }

        .mode-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px;
          font-size: 12px;
          font-weight: 600;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          border-radius: 6px;
          cursor: pointer;
        }

        .mode-btn.active {
          background: #FFFFFF;
          color: var(--primary-orange);
          box-shadow: 0 1px 3px rgba(0,0,0,0.08);
        }

        .login-error-alert {
          background: #FEE2E2;
          border: 1px solid #FCA5A5;
          color: #DC2626;
          padding: 10px;
          border-radius: var(--radius-sm);
          font-size: 12px;
          font-weight: 500;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .form-label {
          font-size: 12px;
          font-weight: 600;
        }

        .pin-input-wrapper {
          position: relative;
        }

        .pin-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        .pin-input {
          padding-left: 44px;
          height: 48px;
          font-size: 20px;
          letter-spacing: 0.3em;
          text-align: center;
          font-weight: 700;
        }

        .w-full { width: 100%; }

        .quick-staff-picker {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding-top: 12px;
          border-top: 1px solid var(--border-color);
        }

        .picker-title {
          font-size: 11px;
          color: var(--text-secondary);
          font-weight: 600;
        }

        .staff-chips-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .staff-quick-chip {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px;
          background: #FAF9F6;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          cursor: pointer;
          text-align: left;
          transition: all 0.15s ease;
        }

        .staff-quick-chip:hover {
          border-color: var(--primary-orange);
          background: var(--primary-orange-light);
        }

        .chip-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          object-fit: cover;
        }

        .chip-info {
          display: flex;
          flex-direction: column;
          line-height: 1.1;
        }

        .chip-name {
          font-size: 11px;
          font-weight: 700;
        }

        .chip-role {
          font-size: 10px;
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
};
