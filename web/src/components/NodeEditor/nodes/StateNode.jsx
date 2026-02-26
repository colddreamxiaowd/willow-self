import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

const StateNode = memo(function StateNode({ data }) {
  const controllabilityPercent = Math.round((data.controllability || 0) * 100);
  const controllabilityColor = 
    controllabilityPercent >= 70 ? '#4ade80' :
    controllabilityPercent >= 40 ? '#fbbf24' : '#ef4444';

  return (
    <div className="state-node">
      <Handle type="target" position={Position.Top} />
      
      <div className="state-node-header">
        <span className="state-node-icon">📍</span>
        <span className="state-node-type">生活状态</span>
      </div>
      
      <div className="state-node-description">
        {data.description || '未命名状态'}
      </div>
      
      <div className="state-node-controllability">
        <span className="controllability-label">可控性:</span>
        <div className="controllability-bar">
          <div 
            className="controllability-fill"
            style={{ 
              width: `${controllabilityPercent}%`,
              background: controllabilityColor 
            }}
          />
        </div>
        <span className="controllability-value">{controllabilityPercent}%</span>
      </div>
      
      {data.isInterventionPoint && (
        <div className="intervention-badge">🌟 干预点</div>
      )}
      
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
});

export default StateNode;

// 最后更新时间: 2026-02-22 14:00
// 编辑人: Trae AI
// 用途: 状态节点组件，显示生活状态和可控性
