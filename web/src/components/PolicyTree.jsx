import React, { useMemo, useCallback, memo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState
} from 'reactflow';
import 'reactflow/dist/style.css';
import './PolicyTree.css';
import { buildNodesAndEdges, getNodeColors, getMiniMapNodeColor } from '../utils';

/**
 * 性能优化说明 - 大型树结构虚拟化建议
 * ============================================
 *
 * 当树节点数量超过 500 个时，建议采用以下优化策略：
 *
 * 1. 虚拟化渲染 (Virtualization)
 *    - 使用 react-window 或 react-virtualized 进行节点虚拟化
 *    - 只渲染可视区域内的节点，大幅减少 DOM 元素数量
 *    - 示例：结合 ReactFlow 的 onlyRenderVisibleElements 属性
 *
 * 2. 分层加载 (Lazy Loading)
 *    - 初始只加载前 2-3 层节点
 *    - 用户展开节点时动态加载子节点
 *    - 使用 Suspense 和 lazy 进行代码分割
 *
 * 3. 节点聚合 (Node Clustering)
 *    - 当缩放级别较小时，将相邻节点聚合为组
 *    - 放大时再展开显示详细节点
 *
 * 4. 性能监控
 *    - 使用 React DevTools Profiler 监控渲染性能
 *    - 设置性能预算：初始渲染 < 100ms，交互响应 < 16ms
 *
 * 5. 数据优化
 *    - 对树数据进行预处理，缓存计算结果
 *    - 使用 Web Worker 处理大型树的遍历和计算
 *
 * 推荐库：
 * - react-window: 轻量级虚拟化方案
 * - @tanstack/react-virtual: 更现代的虚拟化方案
 * - ReactFlow 自带的 onlyRenderVisibleElements
 */

// 性能优化：使用 React.memo 包装组件，避免不必要的重渲染
const PolicyNode = memo(function PolicyNode({ data }) {
  const colors = getNodeColors(data.grade);
  const isInPath = data.isInPath;

  return (
    <div
      className={`policy-node ${isInPath ? 'in-path' : ''}`}
      style={{
        background: isInPath ? 'rgba(74, 222, 128, 0.3)' : colors.bg,
        borderColor: isInPath ? '#4ade80' : colors.border
      }}
    >
      <div className="node-header">
        <span className="node-grade">{data.grade}</span>
        <span className="node-type">{data.type}</span>
      </div>
      <div className="node-description">{data.description}</div>
      <div className="node-scores">
        <span title="阻力">R:{data.resistance_score ?? 5}</span>
        <span title="耦合">C:{data.coupling_score ?? 5}</span>
        <span title="维护">M:{data.maintenance_cost ?? 5}</span>
      </div>
      {data.score !== undefined && data.score !== null && (
        <div className="node-score">Score: {data.score.toFixed(2)}</div>
      )}
      {data.controllability !== undefined && data.controllability !== null && (
        <div className="node-controllability">
          可控性: {(data.controllability * 100).toFixed(0)}%
        </div>
      )}
    </div>
  );
});

const InterventionNode = memo(function InterventionNode({ data }) {
  return (
    <div className="intervention-node">
      <div className="node-header">
        <span className="node-grade">🎯</span>
        <span className="node-type">干预点</span>
      </div>
      <div className="node-description">{data.description}</div>
      <div className="node-highlight">
        推荐干预此节点
      </div>
    </div>
  );
});

const RootNode = memo(function RootNode({ data }) {
  return (
    <div className="root-node">
      <div className="node-header">
        <span className="node-grade">🌳</span>
        <span className="node-type">根节点</span>
      </div>
      <div className="node-description">{data.description}</div>
    </div>
  );
});

// 性能优化：nodeTypes 定义移至组件外部，避免每次渲染重新创建
const nodeTypes = {
  policy: PolicyNode,
  intervention: InterventionNode,
  root: RootNode
};

function PolicyTree({ data, interventionPath, onNodeClick, calculateScore }) {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    // 在 useMemo 内部处理默认值，避免依赖项变化问题
    const safeData = data || null;
    const safeInterventionPath = interventionPath || [];
    return buildNodesAndEdges(safeData, safeInterventionPath, calculateScore);
  }, [data, interventionPath, calculateScore]);

  // eslint-disable-next-line no-unused-vars
  const [nodes, _setNodes, onNodesChange] = useNodesState(initialNodes);
  // eslint-disable-next-line no-unused-vars
  const [edges, _setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onNodeClickHandler = useCallback((event, node) => {
    if (onNodeClick) {
      onNodeClick(node.data);
    }
  }, [onNodeClick]);

  return (
    <div className="policy-tree-container">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClickHandler}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
      >
        <Background color="#333" gap={20} />
        <Controls />
        <MiniMap
          nodeColor={getMiniMapNodeColor}
          maskColor="rgba(26, 26, 46, 0.8)"
        />
      </ReactFlow>
    </div>
  );
}

export default PolicyTree;

// 最后更新时间: 2026-02-21 16:00
// 编辑人: Senior-Code-Review-Engineer
// 优化内容:
// 1. 使用工具函数替代内联逻辑
// 2. 移除重复代码
// 3. 使用空值合并运算符 ?? 替代 ||
