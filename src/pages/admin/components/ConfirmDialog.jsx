import { AlertTriangle } from 'lucide-react';
import AdminModal from './AdminModal';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', variant = 'danger', loading = false }) {
  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={title || 'Confirm Action'}
      size="sm"
      footer={
        <>
          <button className="admin-btn admin-btn-secondary" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button
            className={`admin-btn admin-btn-${variant}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Processing...' : confirmText}
          </button>
        </>
      }
    >
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        <div style={{
          width: 44, height: 44, borderRadius: '50%',
          background: variant === 'danger' ? 'var(--admin-danger-bg)' : 'var(--admin-warning-bg)',
          color: variant === 'danger' ? 'var(--admin-danger)' : 'var(--admin-warning)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <AlertTriangle size={22} />
        </div>
        <p style={{ color: 'var(--admin-text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
          {message || 'Are you sure you want to perform this action? This cannot be undone.'}
        </p>
      </div>
    </AdminModal>
  );
}
