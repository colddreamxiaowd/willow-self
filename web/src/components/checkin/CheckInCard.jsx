import React, { useState, memo } from 'react';
import './CheckIn.css';
import SteadyStateDashboard from '../SteadyStateDashboard';
import { useSteadyState } from '../../hooks/useSteadyState';

const FAILURE_REASONS = [
  { id: 'too_hard', label: '难度太高，需要调整' },
  { id: 'interrupted', label: '意外情况打断' },
  { id: 'forgot', label: '忘记了' },
  { id: 'other', label: '其他原因' }
];

const CheckInCard = memo(function CheckInCard({ 
  policy, 
  todayCheckIn,
  stats,
  suggestion,
  onCheckIn,
  onViewTree,
  mode = 'training'
}) {
  const [showFailureReason, setShowFailureReason] = useState(false);
  const [selectedReason, setSelectedReason] = useState(null);
  const [showDashboard, setShowDashboard] = useState(false);

  const { steadyState, suggestions, getMetrics } = useSteadyState(policy.id);

  const isRsipLocked = mode === 'rsip' && todayCheckIn !== null;

  const handleStatusClick = (status) => {
    if (isRsipLocked) return;
    if (status === 'failed') {
      setShowFailureReason(true);
    } else {
      onCheckIn(policy.id, status);
    }
  };

  const handleFailureConfirm = () => {
    if (selectedReason) {
      onCheckIn(policy.id, 'failed', selectedReason);
      setShowFailureReason(false);
      setSelectedReason(null);
    }
  };

  const getStatusButtonClass = (status) => {
    if (todayCheckIn?.status === status) {
      return `status-btn ${status} active`;
    }
    return `status-btn ${status}`;
  };

  return (
    <div className="checkin-card">
      <div className="card-header">
        <h4 className="policy-name">{policy.data.name}</h4>
        <span className="enhancement-badge">储备 +{stats.enhancement}</span>
      </div>
      
      <p className="policy-description">{policy.data.description}</p>
      
      {!showFailureReason ? (
        <div className="status-buttons">
          <span className="status-label">今天执行了吗？</span>
          <div className="btn-group">
            <button 
              className={getStatusButtonClass('completed')}
              onClick={() => handleStatusClick('completed')}
              disabled={isRsipLocked}
            >
              ✓ 完成
            </button>
            <button 
              className={getStatusButtonClass('partial')}
              onClick={() => handleStatusClick('partial')}
              disabled={isRsipLocked}
            >
              部分
            </button>
            <button 
              className={getStatusButtonClass('failed')}
              onClick={() => handleStatusClick('failed')}
              disabled={isRsipLocked}
            >
              失败
            </button>
          </div>
        </div>
      ) : (
        <div className="failure-reason-section">
          <span className="status-label">失败原因：</span>
          <div className="reason-options">
            {FAILURE_REASONS.map(reason => (
              <label key={reason.id} className="reason-option">
                <input
                  type="radio"
                  name="failureReason"
                  value={reason.id}
                  checked={selectedReason === reason.id}
                  onChange={() => setSelectedReason(reason.id)}
                />
                <span>{reason.label}</span>
              </label>
            ))}
          </div>
          <div className="failure-actions">
            <button 
              className="confirm-btn"
              onClick={handleFailureConfirm}
              disabled={!selectedReason}
            >
              确认
            </button>
            <button 
              className="cancel-btn"
              onClick={() => {
                setShowFailureReason(false);
                setSelectedReason(null);
              }}
            >
              取消
            </button>
          </div>
        </div>
      )}
      
      {suggestion && (
        <div className={`suggestion ${suggestion.type}`}>
          <span className="suggestion-icon">
            {suggestion.type === 'success' ? '💡' : 
             suggestion.type === 'warning' ? '⚠️' : 'ℹ️'}
          </span>
          <span className="suggestion-text">{suggestion.message}</span>
          {suggestion.action === 'suggest_next' && (
            <button className="suggestion-action" onClick={onViewTree}>
              查看国策树
            </button>
          )}
        </div>
      )}
      
      {todayCheckIn && todayCheckIn.status === 'completed' && (
        <div className="success-message">
          ✓ 今日已完成，储备等级 +1
        </div>
      )}

      <button
        className="steady-state-toggle"
        onClick={() => setShowDashboard(!showDashboard)}
      >
        📊 稳态分析
      </button>

      {showDashboard && (
        <SteadyStateDashboard
          steadyState={steadyState}
          suggestions={suggestions}
          getMetrics={getMetrics}
        />
      )}
    </div>
  );
});

export default CheckInCard;

// 最后更新时间: 2026-02-23 14:00
// 编辑人: Trae AI
