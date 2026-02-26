import React, { useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import './NodeEditor.css';
import StateNode from './nodes/StateNode';
import InterventionNode from './nodes/InterventionNode';

const nodeTypes = {
  state: StateNode,
  intervention: InterventionNode,
};

const initialNodes = [];
const initialEdges = [];

function NodeEditor() {
  // eslint-disable-next-line no-unused-vars
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="node-editor">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}

export default NodeEditor;

// 最后更新时间: 2026-02-22 14:00
// 编辑人: Trae AI
// 用途: 节点编辑器主组件，基于 ReactFlow 实现可视化拖拽
