import React, { useState, memo } from 'react';
import './CheckIn.css';

const BulkheadModal = memo(function BulkheadModal({ 
  isOpen, 
  onClose, 
  onConfirm,
  activePolicies 
}) {
  const [reason, setReason] = useState('');
  const [days, setDays] = useState(1);
  const [selectedPolicies, setSelectedPolicies] = useState('all');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!reason.trim()) {
      alert('请填写触发原因');
      return;
    }
    onConfirm(reason.trim(), days, selectedPolicies);
    setReason('');
    setDays(1);
    setSelectedPolicies('all');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content bulkhead-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>🚨 触发水密隔舱</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <p className="modal-description">
            水密隔舱可以在遇到不可抗力时，暂停国策结算，保护你的国策树免受连锁崩溃。
          </p>
          
          <div className="form-group">
            <label className="form-label">请描述触发原因（必填）：</label>
            <textarea
              className="form-textarea"
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="例如：发烧生病、紧急出差、家庭突发事件..."
              rows={3}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">预计影响天数：</label>
            <div className="days-selector">
              {[1, 2, 3, 5, 7].map(d => (
                <button
                  key={d}
                  className={`day-btn ${days === d ? 'active' : ''}`}
                  onClick={() => setDays(d)}
                >
                  {d}天
                </button>
              ))}
              <input
                type="number"
                className="day-input"
                value={days}
                onChange={e => setDays(parseInt(e.target.value) || 1)}
                min={1}
                max={30}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">选择受影响的国策：</label>
            <div className="policy-selector">
              <label className="policy-option">
                <input
                  type="radio"
                  name="affectedPolicies"
                  value="all"
                  checked={selectedPolicies === 'all'}
                  onChange={() => setSelectedPolicies('all')}
                />
                <span>全部国策</span>
              </label>
              {activePolicies.map(policy => (
                <label key={policy.id} className="policy-option">
                  <input
                    type="radio"
                    name="affectedPolicies"
                    value={policy.id}
                    checked={selectedPolicies === policy.id}
                    onChange={() => setSelectedPolicies(policy.id)}
                  />
                  <span>{policy.data.name}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="warning-box">
            <p>⚠️ 提示：解冻日期到期后，需一次性满足所有被冻结国策</p>
            <p>满足的国策解冻，未满足的国策将熄灭</p>
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>
            取消
          </button>
          <button 
            className="confirm-btn danger"
            onClick={handleSubmit}
            disabled={!reason.trim()}
          >
            确认触发
          </button>
        </div>
      </div>
    </div>
  );
});

export default BulkheadModal;

// 最后更新时间: 2026-02-23 00:15
// 编辑人: Trae AI
