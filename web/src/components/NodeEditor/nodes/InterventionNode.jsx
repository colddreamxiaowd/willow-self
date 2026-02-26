import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

const InterventionNode = memo(function InterventionNode({ data }) {
  return (
    <div className="intervention-node">
      <Handle type="target" position={Position.Top} />
      
      <div className="intervention-node-header">
        <span className="intervention-node-icon">🌟</span>
        <span className="intervention-node-type">干预点</span>
      </div>
      
      <div className="intervention-node-description">
        {data.description || '干预行动'}
      </div>
      
      <div className="intervention-node-highlight">
        💡 这是你可以改变的地方！
      </div>
      
      <div className="intervention-node-actions">
        <button className="action-btn primary">开始执行</button>
        <button className="action-btn secondary">了解更多</button>
      </div>
      
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
});

export default InterventionNode;

// 最后更新时间: 2026-02-22 14:00
// 编辑人: Trae AI
// 用途: 干预节点组件，显示用户可以采取行动的干预点
