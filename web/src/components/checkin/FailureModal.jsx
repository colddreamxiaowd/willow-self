import React, { memo } from 'react';
import './CheckIn.css';

const FailureModal = memo(function FailureModal({ 
  isOpen, 
  onClose, 
  policyName,
  enhancement,
  onAction,
  mode = 'training',
  lossPreview = null
}) {
  if (!isOpen) return null;

  const isRsip = mode === 'rsip';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content failure-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>⚠️ "{policyName}" 执行失败</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          {isRsip && lossPreview && (
            <div className="loss-preview">
              <p className="loss-warning">
                ⚠️ 将熄灭 {lossPreview.nodes} 个节点
              </p>
            </div>
          )}
          
          <p className="modal-description">
            {isRsip ? 'RSIP模式：只能选择熄灭国策' : '请选择处理方式：'}
          </p>
          
          <div className="action-options">
            <button 
              className="action-btn extinguish"
              onClick={() => onAction('extinguish')}
            >
              <span className="action-icon">🔥</span>
              <span className="action-title">熄灭国策</span>
              <span className="action-desc">国策熄灭，子国策也会熄灭</span>
            </button>
            
            {!isRsip && (
              <button 
                className="action-btn release"
                onClick={() => onAction('release')}
              >
                <span className="action-icon">📉</span>
                <span className="action-title">释放储备</span>
                <span className="action-desc">
                  强化等级退回+0，国策保留
                  <br />
                  <small>（当前储备：+{enhancement}）</small>
                </span>
              </button>
            )}
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>
            我再想想
          </button>
        </div>
      </div>
    </div>
  );
});

export default FailureModal;

// 最后更新时间: 2026-02-23 13:00
// 编辑人: Trae AI
