/**
 * ReactFlow 节点和边构建工具
 * 将国策树数据转换为 ReactFlow 可用的格式
 */

import { MarkerType } from 'reactflow';
import { getGrade, calculateControllability } from './treeCalculations';

// 等级颜色配置
export const GRADE_COLORS = {
  '🌟': { bg: 'rgba(74, 222, 128, 0.2)', border: '#4ade80' },
  '⚡': { bg: 'rgba(251, 191, 36, 0.2)', border: '#fbbf24' },
  '🛡️': { bg: 'rgba(59, 130, 246, 0.2)', border: '#3b82f6' },
  '📈': { bg: 'rgba(168, 85, 247, 0.2)', border: '#a855f7' },
  '○': { bg: 'rgba(107, 114, 128, 0.2)', border: '#6b7280' }
};

export const DEFAULT_COLORS = GRADE_COLORS['○'];

/**
 * 构建 ReactFlow 节点和边
 * @param {Object} treeData - 国策树数据
 * @param {Array} interventionPath - 干预路径
 * @param {Function} calculateScore - 评分计算函数
 * @returns {Object} { nodes: Array, edges: Array }
 */
export function buildNodesAndEdges(treeData, interventionPath = [], calculateScore) {
  if (!treeData || typeof treeData !== 'object') {
    return { nodes: [], edges: [] };
  }

  const nodes = [];
  const edges = [];
  const pathSet = new Set((interventionPath || []).map(n => n?.id).filter(Boolean));

  function traverse(node, parentId = null, depth = 0, xOffset = 0) {
    if (!node || typeof node !== 'object') {
      return;
    }

    const nodeId = node.id || `node-${nodes.length}`;
    const isInPath = pathSet.has(nodeId);
    const isIntervention = interventionPath.length > 0 &&
                           interventionPath[interventionPath.length - 1]?.id === nodeId;

    const score = calculateScore ? calculateScore(node) : null;
    const grade = score ? getGrade(score, node) : '○';
    const controllability = calculateControllability(node);

    const nodeData = {
      id: nodeId,
      type: depth === 0 ? 'root' : (isIntervention ? 'intervention' : 'policy'),
      position: { x: xOffset * 200, y: depth * 150 },
      data: {
        ...node,
        grade,
        score,
        controllability,
        isInPath,
        type: node.type || (depth === 0 ? 'ROOT' : 'STATE')
      }
    };

    nodes.push(nodeData);

    if (parentId) {
      edges.push({
        id: `edge-${parentId}-${nodeId}`,
        source: parentId,
        target: nodeId,
        type: 'smoothstep',
        animated: isInPath,
        style: isInPath ? { stroke: '#4ade80', strokeWidth: 2 } : { stroke: '#4b5563' },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: isInPath ? '#4ade80' : '#4b5563'
        }
      });
    }

    if (Array.isArray(node.children) && node.children.length > 0) {
      const childWidth = node.children.length;
      const startX = xOffset - (childWidth - 1) / 2;

      node.children.forEach((child, index) => {
        traverse(child, nodeId, depth + 1, startX + index);
      });
    }
  }

  traverse(treeData);
  return { nodes, edges };
}

/**
 * 获取节点颜色配置
 * @param {string} grade - 等级符号
 * @returns {Object} 颜色配置对象
 */
export function getNodeColors(grade) {
  return GRADE_COLORS[grade] || DEFAULT_COLORS;
}

/**
 * 获取 MiniMap 节点颜色
 * @param {Object} node - ReactFlow 节点
 * @returns {string} 颜色值
 */
export function getMiniMapNodeColor(node) {
  if (node.data?.isInPath) return '#4ade80';
  return '#4b5563';
}

// 最后更新时间: 2026-02-21 16:00
// 编辑人: Senior-Code-Review-Engineer
// 说明: 从 PolicyTree 组件中提取的构建函数，便于测试和复用
