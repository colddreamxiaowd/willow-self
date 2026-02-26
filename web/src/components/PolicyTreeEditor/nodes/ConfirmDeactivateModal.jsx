import React, { memo } from 'react';
import './ConfirmDeactivateModal.css';

const ConfirmDeactivateModal = memo(function ConfirmDeactivateModal({
  isOpen,
  onClose,
  onConfirm,
  policyName,
  childCount = 0
}) {
  if (!isOpen) return null;

  const hasChildren = childCount > 0;

  return (
    <div className="deactivate-overlay" onClick={onClose}>
      <div className="deactivate-card" onClick={e => e.stopPropagation()}>
        {/* 图标 */}
        <div className="deactivate-icon-wrap">🔥</div>
        
        {/* 标题 */}
        <h3 className="deactivate-title">确认熄灭国策</h3>
        
        {/* 国策名称 */}
        <div className="deactivate-policy">「{policyName}」</div>
        
        {/* 警告信息（如果有子国策） */}
        {hasChildren && (
          <div className="deactivate-alert">
            <span className="deactivate-alert-icon">⚠️</span>
            <p className="deactivate-alert-text">
              此国策有 <strong>{childCount}</strong> 个子国策，熄灭后它们也将自动熄灭
            </p>
          </div>
        )}
        
        {/* 提示 */}
        <p className="deactivate-hint">
          <span>💡</span>
          <span>熄灭后可以随时重新激活</span>
        </p>
        
        {/* 按钮 */}
        <div className="deactivate-actions">
          <button className="deactivate-btn deactivate-btn-cancel" onClick={onClose}>
            取消
          </button>
          <button className="deactivate-btn deactivate-btn-confirm" onClick={onConfirm}>
            确认熄灭
          </button>
        </div>
      </div>
    </div>
  );
});

export default ConfirmDeactivateModal;
