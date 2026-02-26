import { useCallback, useMemo } from 'react';

/**
 * 级联状态管理 Hook
 * 当父节点熄灭时，所有子节点也熄灭
 */
export function useCascadeStatus(policies, edges) {
  // 构建父子关系映射
  const parentChildMap = useMemo(() => {
    const map = {};
    edges.forEach(edge => {
      if (!map[edge.source]) {
        map[edge.source] = [];
      }
      map[edge.source].push(edge.target);
    });
    return map;
  }, [edges]);

  // 获取所有后代节点ID（递归）
  const getAllDescendants = useCallback((nodeId, visited = new Set()) => {
    if (visited.has(nodeId)) return [];
    visited.add(nodeId);
    
    const children = parentChildMap[nodeId] || [];
    const descendants = [...children];
    
    children.forEach(childId => {
      const childDescendants = getAllDescendants(childId, visited);
      descendants.push(...childDescendants);
    });
    
    return descendants;
  }, [parentChildMap]);

  // 处理状态变更（带级联）
  const handleStatusChange = useCallback((nodeId, newStatus, onUpdate) => {
    const updates = [];
    
    // 更新当前节点
    updates.push({ id: nodeId, status: newStatus });
    
    // 如果是熄灭状态，级联熄灭所有子节点
    if (newStatus === 'extinguished') {
      const descendants = getAllDescendants(nodeId);
      descendants.forEach(descendantId => {
        updates.push({ id: descendantId, status: 'extinguished' });
      });
    }
    
    // 应用所有更新
    updates.forEach(update => {
      onUpdate(update.id, { status: update.status });
    });
    
    return updates;
  }, [getAllDescendants]);

  // 计算节点的有效状态（考虑父节点状态）
  const getEffectiveStatus = useCallback((nodeId, nodeStatus) => {
    // 如果节点本身已熄灭，直接返回
    if (nodeStatus === 'extinguished') {
      return 'extinguished';
    }
    
    // 检查是否有父节点已熄灭
    const findParentStatus = (id, visited = new Set()) => {
      if (visited.has(id)) return 'active';
      visited.add(id);
      
      const parentEdge = edges.find(e => e.target === id);
      if (!parentEdge) return 'active';
      
      const parent = policies.find(p => p.id === parentEdge.source);
      if (!parent) return 'active';
      
      if (parent.status === 'extinguished') {
        return 'extinguished';
      }
      
      return findParentStatus(parent.id, visited);
    };
    
    const parentStatus = findParentStatus(nodeId);
    if (parentStatus === 'extinguished') {
      return 'extinguished';
    }
    
    return nodeStatus;
  }, [policies, edges]);

  return {
    handleStatusChange,
    getEffectiveStatus,
    getAllDescendants
  };
}

export default useCascadeStatus;
