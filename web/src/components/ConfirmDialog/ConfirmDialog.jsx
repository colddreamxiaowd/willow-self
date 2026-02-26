import React, { useEffect, useRef } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import './ConfirmDialog.css';

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = '确定',
  cancelText = '取消',
  type = 'warning',
  onConfirm,
  onCancel
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onCancel();
    }
    if (e.key === 'Enter') {
      onConfirm();
    }
  };

  return (
    <div className="confirm-overlay" onClick={onCancel}>
      <div
        ref={dialogRef}
        className={`confirm-dialog ${type}`}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
      >
        <button className="confirm-close" onClick={onCancel} aria-label="关闭">
          <X size={18} />
        </button>

        <div className="confirm-header">
          {type === 'warning' && (
            <div className="confirm-icon warning">
              <AlertTriangle size={24} />
            </div>
          )}
          <h3 id="confirm-title">{title}</h3>
        </div>

        <div className="confirm-body">
          <p>{message}</p>
        </div>

        <div className="confirm-actions">
          <button className="btn-cancel" onClick={onCancel}>
            {cancelText}
          </button>
          <button className={`btn-confirm ${type}`} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
