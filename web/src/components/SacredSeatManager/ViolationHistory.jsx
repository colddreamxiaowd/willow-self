// web/src/components/SacredSeatManager/ViolationHistory.js

import React from 'react';
import './SacredSeatManager.css';

const VIOLATION_REASON_LABELS = {
  forgot: '忘记了',
  distracted: '被干扰了',
  lazy: '懒惰了',
  emergency: '紧急情况',
  other: '其他原因'
};

const VIOLATION_REASON_ICONS = {
  forgot: '🤔',
  distracted: '📱',
  lazy: '😴',
  emergency: '🚨',
  other: '📝'
};

function ViolationHistory({ violations, policyName }) {
  if (!violations || violations.length === 0) {
    return (
      <div className="violation-history">
        <h4>📝 违约记录</h4>
        <div className="no-violations">
          <span className="success-icon">✨</span>
          <p>太棒了！没有违约记录</p>
          <p className="hint">继续保持你的神圣座位承诺</p>
        </div>
      </div>
    );
  }

  const sortedViolations = [...violations].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="violation-history">
      <h4>📝 违约记录 ({violations.length})</h4>
      
      <div className="violations-list">
        {sortedViolations.map(violation => (
          <div key={violation.id} className="violation-item">
            <div className="violation-header">
              <span className="violation-icon">
                {VIOLATION_REASON_ICONS[violation.reason] || '📝'}
              </span>
              <span className="violation-reason">
                {VIOLATION_REASON_LABELS[violation.reason] || violation.reason}
              </span>
              <span className="violation-date">
                {new Date(violation.date).toLocaleDateString('zh-CN', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            {violation.note && (
              <p className="violation-note">{violation.note}</p>
            )}
          </div>
        ))}
      </div>

      <div className="violation-summary">
        <p>
          共 <strong>{violations.length}</strong> 次违约记录
        </p>
        <p className="summary-hint">
          分析违约原因，找到改进方向
        </p>
      </div>
    </div>
  );
}

export default ViolationHistory;

// 最后更新时间: 2026-02-23 14:00
// 编辑人: Trae AI
