import React, { memo, useMemo } from 'react';
import './CyberDashboard.css';

/**
 * 赛博朋克风格仪表盘组件
 * 展示国策树的关键统计数据
 */
const CyberDashboard = memo(function CyberDashboard({ data, stats }) {
  // 计算统计数据
  const dashboardStats = useMemo(() => {
    if (!data) {
      return {
        totalNodes: 0,
        avgScore: 0,
        maxScore: 0,
        avgControllability: 0,
        gradeDistribution: {},
        depth: 0
      };
    }

    let totalNodes = 0;
    let totalScore = 0;
    let maxScore = 0;
    let totalControllability = 0;
    let gradeDistribution = {};
    let maxDepth = 0;

    function traverse(node, depth = 0) {
      if (!node) return;
      
      totalNodes++;
      maxDepth = Math.max(maxDepth, depth);
      
      if (node.score !== undefined && node.score !== null) {
        totalScore += node.score;
        maxScore = Math.max(maxScore, node.score);
      }
      
      if (node.controllability !== undefined && node.controllability !== null) {
        totalControllability += node.controllability;
      }
      
      const grade = node.grade || '○';
      gradeDistribution[grade] = (gradeDistribution[grade] || 0) + 1;
      
      if (node.children && Array.isArray(node.children)) {
        node.children.forEach(child => traverse(child, depth + 1));
      }
    }

    traverse(data);

    return {
      totalNodes,
      avgScore: totalNodes > 0 ? totalScore / totalNodes : 0,
      maxScore,
      avgControllability: totalNodes > 0 ? totalControllability / totalNodes : 0,
      gradeDistribution,
      depth: maxDepth
    };
  }, [data]);

  const { totalNodes, avgScore, maxScore, avgControllability, gradeDistribution, depth } = 
    stats || dashboardStats;

  return (
    <div className="cyber-dashboard">
      {/* 主标题 */}
      <div className="dashboard-header">
        <h2 className="dashboard-title">
          <span className="title-icon">◈</span>
          SYSTEM ANALYTICS
          <span className="title-icon">◈</span>
        </h2>
        <div className="header-line" />
      </div>

      {/* 核心指标网格 */}
      <div className="metrics-grid">
        {/* 总节点数 */}
        <div className="metric-card primary">
          <div className="metric-glow" />
          <div className="metric-icon">⬡</div>
          <div className="metric-content">
            <span className="metric-value">{totalNodes}</span>
            <span className="metric-label">TOTAL NODES</span>
          </div>
          <div className="metric-bar">
            <div className="bar-fill" style={{ width: '100%' }} />
          </div>
        </div>

        {/* 平均分数 */}
        <div className="metric-card success">
          <div className="metric-glow" />
          <div className="metric-icon">◈</div>
          <div className="metric-content">
            <span className="metric-value">{avgScore?.toFixed(1) || '0.0'}</span>
            <span className="metric-label">AVG SCORE</span>
          </div>
          <div className="metric-bar">
            <div className="bar-fill" style={{ width: `${(avgScore / 10) * 100}%` }} />
          </div>
        </div>

        {/* 最高分数 */}
        <div className="metric-card warning">
          <div className="metric-glow" />
          <div className="metric-icon">◆</div>
          <div className="metric-content">
            <span className="metric-value">{maxScore?.toFixed(1) || '0.0'}</span>
            <span className="metric-label">MAX SCORE</span>
          </div>
          <div className="metric-bar">
            <div className="bar-fill" style={{ width: `${(maxScore / 10) * 100}%` }} />
          </div>
        </div>

        {/* 可控性 */}
        <div className="metric-card info">
          <div className="metric-glow" />
          <div className="metric-icon">◎</div>
          <div className="metric-content">
            <span className="metric-value">{((avgControllability || 0) * 100).toFixed(0)}%</span>
            <span className="metric-label">CONTROL</span>
          </div>
          <div className="metric-bar">
            <div className="bar-fill" style={{ width: `${(avgControllability || 0) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* 等级分布 */}
      <div className="grade-section">
        <h3 className="section-title">
          <span className="title-decorator">[</span>
          GRADE DISTRIBUTION
          <span className="title-decorator">]</span>
        </h3>
        <div className="grade-bars">
          {Object.entries(gradeDistribution || {}).map(([grade, count]) => (
            <div key={grade} className="grade-item">
              <span className="grade-label">{grade}</span>
              <div className="grade-bar-container">
                <div 
                  className="grade-bar-fill" 
                  style={{ width: `${(count / totalNodes) * 100}%` }}
                />
              </div>
              <span className="grade-count">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 系统状态 */}
      <div className="system-status">
        <div className="status-item">
          <span className="status-indicator active" />
          <span className="status-label">SYSTEM ONLINE</span>
        </div>
        <div className="status-item">
          <span className="status-indicator active" />
          <span className="status-label">DEPTH: {depth}</span>
        </div>
        <div className="status-item">
          <span className="status-indicator pulse" />
          <span className="status-label">ANALYZING</span>
        </div>
      </div>

      {/* 装饰性元素 */}
      <div className="dashboard-decoration">
        <div className="corner top-left" />
        <div className="corner top-right" />
        <div className="corner bottom-left" />
        <div className="corner bottom-right" />
      </div>
    </div>
  );
});

export default CyberDashboard;

// 最后更新时间: 2026-02-21 18:00
// 编辑人: Frontend Design Skill
