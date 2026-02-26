// web/src/components/ViolationReminder/ViolationReminder.js

import React from 'react';
import './ViolationReminder.css';

function ViolationReminder({ violations, onAction, onDismiss }) {
  if (!violations || violations.length === 0) return null;

  return (
    <div className="violation-reminder-container">
      {violations.map(violation => {
        const { seat, severity, message } = violation;
        
        return (
          <div key={seat.id} className={`violation-reminder ${severity}`}>
            <div className="reminder-header">
              <span className="reminder-icon">
                {severity === 'high' ? '⚠️' : '⏰'}
              </span>
              <span className="reminder-title">
                {severity === 'high' ? '神圣座位违约警告' : '神圣座位提醒'}
              </span>
              <button 
                className="dismiss-btn"
                onClick={() => onDismiss(seat.id)}
                aria-label="关闭提醒"
              >
                ✕
              </button>
            </div>
            
            <div className="reminder-content">
              <p className="reminder-message">{message}</p>
              
              <div className="seat-info">
                <div className="info-row">
                  <span className="info-label">触发条件</span>
                  <span className="info-value">{seat.triggerLabel}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">承诺内容</span>
                  <span className="info-value">{seat.commitment}</span>
                </div>
              </div>
            </div>

            <div className="reminder-actions">
              <button 
                className="action-btn primary"
                onClick={() => onAction(seat.id, 'execute')}
              >
                已执行
              </button>
              <button 
                className="action-btn warning"
                onClick={() => onAction(seat.id, 'record')}
              >
                记录违约
              </button>
              <button 
                className="action-btn secondary"
                onClick={() => onAction(seat.id, 'snooze')}
              >
                稍后提醒
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ViolationReminder;

// 最后更新时间: 2026-02-23 15:00
// 编辑人: Trae AI
