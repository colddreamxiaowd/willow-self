/**
 * SteadyStateDashboard - 稳态仪表盘
 * 
 * 理论基础：RSIP (递归稳态迭代协议) 第二代自控技术
 * 核心概念：通过分析行为稳态，识别"稳态陷阱"并优化长期行为模式
 * 
 * 灵感来源：知乎文章《自制力问题的数学物理方法》by edmond
 * 文章链接：https://www.zhihu.com/question/19888447/answer/1930799480401293785
 * 
 * 原理说明：
 * - 稳态分析：评估当前行为模式的稳定性和健康度
 * - 趋势分析：识别行为模式的上升、下降或稳定趋势
 * - 水密舱机制：失败时自动隔离，防止连锁崩溃
 * - 递归优化：通过迭代反馈不断优化行为模式
 */

import React from 'react';
import {
  STEADY_STATE_COLORS,
  STEADY_STATE_LABELS
} from '../../utils/steadyStateAnalysis';
import './SteadyStateDashboard.css';

function SteadyStateDashboard({ steadyState, suggestions, getMetrics }) {
  const metrics7 = getMetrics(7);
  const metrics14 = getMetrics(14);
  const metrics30 = getMetrics(30);

  const trendDirection = steadyState.trendSlope > 0.01 ? '↑' : 
                         steadyState.trendSlope < -0.01 ? '↓' : '→';
  const trendColor = steadyState.trendSlope > 0.01 ? '#4CAF50' : 
                     steadyState.trendSlope < -0.01 ? '#F44336' : '#9E9E9E';

  return (
    <div className="steady-state-dashboard">
      <div className="dashboard-header">
        <h4>📊 稳态分析</h4>
        <div
          className="state-badge"
          style={{ backgroundColor: STEADY_STATE_COLORS[steadyState.state] }}
        >
          {STEADY_STATE_LABELS[steadyState.state]}
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-value">
            {(metrics7.rate * 100).toFixed(0)}%
          </div>
          <div className="metric-label">最近7天</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">
            {(metrics14.rate * 100).toFixed(0)}%
          </div>
          <div className="metric-label">最近14天</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">
            {(metrics30.rate * 100).toFixed(0)}%
          </div>
          <div className="metric-label">最近30天</div>
        </div>
      </div>

      <div className="analysis-details">
        <div className="detail-item">
          <span className="detail-label">趋势方向：</span>
          <span className="detail-value" style={{ color: trendColor }}>
            {trendDirection} {steadyState.trendSlope > 0.01 ? '上升' : 
                              steadyState.trendSlope < -0.01 ? '下降' : '平稳'}
          </span>
        </div>
        <div className="detail-item">
          <span className="detail-label">波动率：</span>
          <span className="detail-value">
            {(steadyState.volatility * 100).toFixed(1)}%
          </span>
        </div>
        <div className="detail-item">
          <span className="detail-label">趋势强度：</span>
          <span className="detail-value">
            {Math.abs(steadyState.trendSlope * 100).toFixed(2)}%/天
          </span>
        </div>
      </div>

      <div className="insight-message">
        <p>{steadyState.message}</p>
      </div>

      {suggestions && suggestions.length > 0 && (
        <div className="suggestions-section">
          <h5>💡 调整建议</h5>
          <ul className="suggestions-list">
            {suggestions.map((s, i) => (
              <li key={i} className={`suggestion-${s.priority}`}>
                {s.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="confidence-indicator">
        <span className="confidence-label">置信度：</span>
        <div className="confidence-bar">
          <div
            className="confidence-fill"
            style={{ width: `${steadyState.confidence * 100}%` }}
          />
        </div>
        <span className="confidence-value">
          {(steadyState.confidence * 100).toFixed(0)}%
        </span>
        <div className="confidence-factors">
          <small>基于数据量、波动率、趋势稳定性综合计算</small>
        </div>
      </div>
    </div>
  );
}

export default SteadyStateDashboard;

// 最后更新时间: 2026-02-23 11:30
// 编辑人: Trae AI
