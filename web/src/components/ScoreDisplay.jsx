import React, { useMemo, memo } from 'react';
import { TrendingUp, Star, Zap, Shield } from 'lucide-react';
import './ScoreDisplay.css';
import { calculateTreeStats } from '../utils';

/**
 * 评分展示组件
 * 显示国策树的统计信息和评分分布
 */

// 性能优化：使用 memo 包装组件
const ScoreDisplay = memo(function ScoreDisplay({ treeData, calculateScore }) {
  const stats = useMemo(() => {
    return calculateTreeStats(treeData, calculateScore);
  }, [treeData, calculateScore]);

  if (!stats) return null;

  return (
    <div className="score-display">
      <h3 className="score-title">评分统计</h3>

      <div className="score-overview">
        <div className="stat-card">
          <span className="stat-value">{stats.totalNodes}</span>
          <span className="stat-label">总节点数</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.avgScore?.toFixed(1) ?? '0.0'}</span>
          <span className="stat-label">平均分</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.maxScore?.toFixed(1) ?? '0.0'}</span>
          <span className="stat-label">最高分</span>
        </div>
      </div>

      <div className="grade-distribution">
        <div className="grade-item">
          <Star size={16} className="grade-icon preferred" />
          <span className="grade-name">优选国策</span>
          <span className="grade-count">{stats.preferred}</span>
        </div>
        <div className="grade-item">
          <Zap size={16} className="grade-icon leverage" />
          <span className="grade-name">高杠杆</span>
          <span className="grade-count">{stats.highLeverage}</span>
        </div>
        <div className="grade-item">
          <Shield size={16} className="grade-icon defensive" />
          <span className="grade-name">防御型</span>
          <span className="grade-count">{stats.defensive}</span>
        </div>
        <div className="grade-item">
          <TrendingUp size={16} className="grade-icon aggressive" />
          <span className="grade-name">进取型</span>
          <span className="grade-count">{stats.aggressive}</span>
        </div>
      </div>

      <div className="top-nodes">
        <h4>Top 5 高分节点</h4>
        <ul>
          {stats.topNodes.map((item, index) => (
            <li key={item.node.id ?? index} className="top-node-item">
              <span className="rank">#{index + 1}</span>
              <span className="node-name">{item.node.description}</span>
              <span className="node-score">{item.score?.toFixed(2) ?? '0.00'}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="formula-reminder">
        <code>Score = (Coupling x Impact) / (Resistance x Maintenance + 1)</code>
      </div>
    </div>
  );
});

export default ScoreDisplay;

// 最后更新时间: 2026-02-21 16:00
// 编辑人: Senior-Code-Review-Engineer
// 优化内容:
// 1. 使用工具函数替代内联逻辑
// 2. 使用空值合并运算符 ?? 替代 ||
