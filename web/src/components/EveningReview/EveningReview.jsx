// web/src/components/EveningReview/EveningReview.js

import React, { useState, useEffect } from 'react';
import { getContextLabel } from '../../utils/contextInference';
import './EveningReview.css';

const CONTEXT_OPTIONS = [
  { key: 'morning_waking', label: '早上刚起床' },
  { key: 'morning_working', label: '上午工作/学习' },
  { key: 'lunch', label: '午休时间' },
  { key: 'afternoon_working', label: '下午工作/学习' },
  { key: 'dinner', label: '晚饭时间' },
  { key: 'evening_resting', label: '晚间休息' },
  { key: 'night_sleeping', label: '深夜' }
];

function EveningReview({ records, onConfirmContext, onClose, onSkip, isOpen }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedContext, setSelectedContext] = useState(null);

  const unconfirmedRecords = records.filter(r => !r.confirmedContext);
  const currentRecord = unconfirmedRecords[currentIndex];

  useEffect(() => {
    if (currentRecord) {
      setSelectedContext(currentRecord.inferredContext?.activityType || null);
    }
  }, [currentRecord]);

  // 如果未打开，不渲染
  if (!isOpen) {
    return null;
  }

  if (!currentRecord) {
    return (
      <div className="evening-review-overlay">
        <div className="evening-review-modal">
          <div className="review-complete">
            <span className="complete-icon">✨</span>
            <h3>今日回顾完成！</h3>
            <p>感谢你的记录，明天见！</p>
            <button className="review-btn primary" onClick={onClose}>
              关闭
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleConfirm = () => {
    const context = CONTEXT_OPTIONS.find(c => c.key === selectedContext);
    onConfirmContext(currentRecord.id, {
      activityType: selectedContext,
      label: context?.label || selectedContext
    });
    
    if (currentIndex < unconfirmedRecords.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSkip = () => {
    if (currentIndex < unconfirmedRecords.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onSkip?.();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="evening-review-overlay">
      <div className="evening-review-modal">
        <div className="review-header">
          <h3>📝 今日国策执行回顾</h3>
          <span className="review-progress">
            {currentIndex + 1} / {unconfirmedRecords.length}
          </span>
        </div>

        <div className="review-content">
          <div className="review-record">
            <div className="record-status">
              {currentRecord.executed ? '✅' : '❌'}
            </div>
            <div className="record-info">
              <div className="record-time">{formatTime(currentRecord.timestamp)}</div>
              <div className="record-inferred">
                系统推断：{getContextLabel(currentRecord.inferredContext?.activityType)}
              </div>
            </div>
          </div>

          <div className="context-selection">
            <label>确认或修改情境：</label>
            <div className="context-options">
              {CONTEXT_OPTIONS.map(option => (
                <button
                  key={option.key}
                  className={`context-option ${selectedContext === option.key ? 'selected' : ''}`}
                  onClick={() => setSelectedContext(option.key)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="review-actions">
          <button className="review-btn" onClick={handleSkip}>
            跳过
          </button>
          <button className="review-btn primary" onClick={handleConfirm}>
            确认
          </button>
        </div>
      </div>
    </div>
  );
}

export default EveningReview;

// 最后更新时间: 2026-02-23 12:30
// 编辑人: Trae AI
