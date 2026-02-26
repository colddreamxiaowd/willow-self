// web/src/components/SacredSeatManager/SacredSeatCard.js

import React, { useState, useCallback } from 'react';
import './SacredSeatManager.css';

const TRIGGER_TYPE_ICONS = {
  time: '🕐',
  location: '📍',
  activity: '🎯'
};

const VIOLATION_REASONS = [
  { value: 'forgot', label: '忘记了', icon: '🤔' },
  { value: 'distracted', label: '被干扰了', icon: '📱' },
  { value: 'lazy', label: '懒惰了', icon: '😴' },
  { value: 'emergency', label: '紧急情况', icon: '🚨' },
  { value: 'other', label: '其他原因', icon: '📝' }
];

function SacredSeatCard({ 
  seat, 
  policyName, 
  isSelected, 
  onSelect, 
  onDelete, 
  onRecordViolation 
}) {
  const [showViolationForm, setShowViolationForm] = useState(false);
  const [violationReason, setViolationReason] = useState('');
  const [violationNote, setViolationNote] = useState('');

  const handleRecordViolation = useCallback(() => {
    if (violationReason) {
      onRecordViolation(seat.id, violationReason, violationNote);
      setShowViolationForm(false);
      setViolationReason('');
      setViolationNote('');
    }
  }, [seat.id, violationReason, violationNote, onRecordViolation]);

  const violationCount = seat.violations?.length || 0;
  const recentViolations = seat.violations?.filter(v => {
    const violationDate = new Date(v.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return violationDate >= weekAgo;
  }).length || 0;

  return (
    <div 
      className={`sacred-seat-card ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
    >
      <div className="card-header">
        <span className="trigger-icon">
          {TRIGGER_TYPE_ICONS[seat.triggerType]}
        </span>
        <span className="policy-name">{policyName}</span>
      </div>

      <div className="card-condition">
        <span className="condition-label">触发条件</span>
        <span className="condition-value">{seat.triggerLabel}</span>
      </div>

      <div className="card-commitment">
        <span className="commitment-label">承诺</span>
        <p className="commitment-text">{seat.commitment}</p>
      </div>

      <div className="card-stats">
        <div className="stat-item">
          <span className="stat-value">{violationCount}</span>
          <span className="stat-label">总违约</span>
        </div>
        <div className="stat-item">
          <span className="stat-value warning">{recentViolations}</span>
          <span className="stat-label">本周违约</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">
            {new Date(seat.createdAt).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
          </span>
          <span className="stat-label">创建日期</span>
        </div>
      </div>

      {isSelected && (
        <div className="card-actions" onClick={e => e.stopPropagation()}>
          <button 
            className="action-btn violation"
            onClick={() => setShowViolationForm(!showViolationForm)}
          >
            记录违约
          </button>
          <button 
            className="action-btn delete"
            onClick={onDelete}
          >
            删除座位
          </button>
        </div>
      )}

      {showViolationForm && (
        <div className="violation-form" onClick={e => e.stopPropagation()}>
          <h5>记录违约</h5>
          <div className="reason-options">
            {VIOLATION_REASONS.map(reason => (
              <button
                key={reason.value}
                className={`reason-btn ${violationReason === reason.value ? 'selected' : ''}`}
                onClick={() => setViolationReason(reason.value)}
              >
                <span>{reason.icon}</span>
                <span>{reason.label}</span>
              </button>
            ))}
          </div>
          <textarea
            value={violationNote}
            onChange={e => setViolationNote(e.target.value)}
            placeholder="添加备注（可选）"
            className="violation-note-input"
            rows={2}
          />
          <div className="violation-form-actions">
            <button 
              className="cancel-btn"
              onClick={() => setShowViolationForm(false)}
            >
              取消
            </button>
            <button 
              className="confirm-btn"
              onClick={handleRecordViolation}
              disabled={!violationReason}
            >
              确认记录
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SacredSeatCard;

// 最后更新时间: 2026-02-23 14:00
// 编辑人: Trae AI
