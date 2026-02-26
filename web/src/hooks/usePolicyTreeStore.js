import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'policytree_editor_data';

// 将节点数组转换为树结构
const convertNodesToTree = (nodes) => {
  if (!nodes || nodes.length === 0) return null;
  
  const rootNodes = nodes.filter(node => !node.data?.parentId);
  if (rootNodes.length === 0) return null;
  
  const buildTree = (node) => {
    const children = nodes.filter(n => n.data?.parentId === node.id);
    return {
      ...node.data,
      children: children.map(buildTree)
    };
  };
  
  return buildTree(rootNodes[0]);
};

// 从 localStorage 加载数据
const loadFromStorage = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export function usePolicyTreeStore() {
  const [nodes, setNodes] = useState(() => loadFromStorage()?.nodes || []);
  const [edges, setEdges] = useState(() => loadFromStorage()?.edges || []);
  
  // 保存到 localStorage
  const save = useCallback((newNodes, newEdges) => {
    try {
      const data = {
        version: '2.1',
        timestamp: new Date().toISOString(),
        nodes: newNodes,
        edges: newEdges
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('[usePolicyTreeStore] 保存失败:', error);
    }
  }, []);
  
  // 自动保存
  useEffect(() => {
    save(nodes, edges);
  }, [nodes, edges, save]);
  
  // 添加节点
  const addNode = useCallback((node) => {
    setNodes(prev => [...prev, node]);
  }, []);
  
  // 删除节点
  const removeNode = useCallback((nodeId) => {
    setNodes(prev => prev.filter(n => n.id !== nodeId));
    setEdges(prev => prev.filter(e => e.source !== nodeId && e.target !== nodeId));
  }, []);
  
  // 更新节点
  const updateNode = useCallback((nodeId, data) => {
    setNodes(prev => prev.map(n => 
      n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n
    ));
  }, []);
  
  // 添加边
  const addEdge = useCallback((edge) => {
    setEdges(prev => [...prev, edge]);
  }, []);
  
  // 清除所有数据
  const clear = useCallback(() => {
    setNodes([]);
    setEdges([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);
  
  // 获取树结构数据
  const getTreeData = useCallback(() => {
    return convertNodesToTree(nodes);
  }, [nodes]);
  
  return {
    nodes,
    setNodes,
    edges,
    setEdges,
    addNode,
    removeNode,
    updateNode,
    addEdge,
    clear,
    save,
    getTreeData
  };
}

export default usePolicyTreeStore;
