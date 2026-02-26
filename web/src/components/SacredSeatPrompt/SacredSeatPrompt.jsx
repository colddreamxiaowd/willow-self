// web/src/components/SacredSeatPrompt/SacredSeatPrompt.js

import React from 'react';
import './SacredSeatPrompt.css';

function SacredSeatPrompt({ potentialSeat, policyName, onConfirm, onIgnore, onLearnMore }) {
  if (!potentialSeat) return null;

  return (
    <div className="sacred-seat-prompt-overlay">
      <div className="sacred-seat-prompt">
        <div className="prompt-icon">🔍</div>
        <h3>发现潜在的神圣座位！</h3>
        
        <div className="prompt-content">
          <p>
            你在"<strong>{potentialSeat.trigger.label}</strong>"时执行
            "<strong>{policyName}</strong>"
          </p>
          <p className="prompt-stats">
            成功率：<strong>{(potentialSeat.stats.executionRate * 100).toFixed(0)}%</strong>
            {' '}（共{potentialSeat.stats.totalOccurrences}次）
          </p>
          <p className="prompt-explanation">
            这可能是一个神圣座位——特定情境下的高执行率模式。
          </p>
        </div>

        <div className="prompt-actions">
          <button className="prompt-btn primary" onClick={onConfirm}>
            确认神圣座位
          </button>
          <button className="prompt-btn" onClick={onIgnore}>
            忽略
          </button>
          <button className="prompt-btn link" onClick={onLearnMore}>
            了解更多
          </button>
        </div>
      </div>
    </div>
  );
}

export default SacredSeatPrompt;

// 最后更新时间: 2026-02-23 11:00
// 编辑人: Trae AI
