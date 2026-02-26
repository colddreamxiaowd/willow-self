import React, { memo } from 'react';
import './ConfirmActivateModal.css';

const ConfirmActivateModal = memo(function ConfirmActivateModal({
  isOpen,
  onClose,
  onConfirm,
  policyName,
  parentName = null
}) {
  if (!isOpen) return null;

  const hasParent = !!parentName;

  return (
    <div className="activate-overlay" onClick={onClose}>
      <div className="activate-card" onClick={e => e.stopPropagation()}>
        {/* 图标 */}
        <div className="activate-icon-wrap">✨</div>
        
        {/* 标题 */}
        <h3 className="activate-title">确认激活国策</h3>
        
        {/* 国策名称 */}
        <div className="activate-policy">「{policyName}」</div>
        
        {/* 父国策信息（如果有） */}
        {hasParent && (
          <div className="activate-info">
            <span className="activate-info-icon">🔗</span>
            <p className="activate-info-text">
              继承自 <strong>「{parentName}」</strong>
            </p>
          </div>
        )}
        
        {/* 提示 */}
        <p className="activate-hint">
          <span>💡</span>
          <span>激活后即可开始执行该国策</span>
        </p>
        
        {/* 按钮 */}
        <div className="activate-actions">
          <button className="activate-btn activate-btn-cancel" onClick={onClose}>
            取消
          </button>
          <button className="activate-btn activate-btn-confirm" onClick={onConfirm}>
            确认激活
          </button>
        </div>
      </div>
    </div>
  );
});

export default ConfirmActivateModal;
