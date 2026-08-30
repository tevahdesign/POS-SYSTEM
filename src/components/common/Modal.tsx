import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = '560px'
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 className="section-title" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>{title}</h3>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">{children}</div>
      </div>

      <style>{`
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 16px;
          border-bottom: 1px solid #E2E8F0;
          margin-bottom: 20px;
        }

        .modal-close-btn {
          background: #F1F5F9;
          border: 1px solid #E2E8F0;
          width: 32px;
          height: 32px;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748B;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .modal-close-btn:hover {
          background: #FEE2E2;
          border-color: #FECACA;
          color: #DC2626;
        }

        .modal-body {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
      `}</style>
    </div>
  );
};
