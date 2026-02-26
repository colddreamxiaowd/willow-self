import React, { createContext, useContext } from 'react';
import usePolicyTreeStore from '../hooks/usePolicyTreeStore';

const PolicyTreeContext = createContext(null);

export const usePolicyTreeContext = () => {
  const context = useContext(PolicyTreeContext);
  if (!context) {
    throw new Error('usePolicyTreeContext must be used within PolicyTreeProvider');
  }
  return context;
};

export const PolicyTreeProvider = ({ children }) => {
  const store = usePolicyTreeStore();
  
  // 转换为树结构（兼容现有代码）
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
  
  const policyTreeData = convertNodesToTree(store.nodes);
  
  const value = {
    policyTreeData,
    nodes: store.nodes,
    edges: store.edges,
    setNodes: store.setNodes,
    setEdges: store.setEdges,
    addNode: store.addNode,
    removeNode: store.removeNode,
    updateNode: store.updateNode,
    addEdge: store.addEdge,
    clear: store.clear,
    save: store.save,
    getTreeData: store.getTreeData,
    isFromWizard: false,
    setWizardGeneratedTree: store.setNodes,
    clearWizardFlag: () => {},
    updatePolicyTreeData: store.setNodes,
    setPolicyTreeData: store.setNodes
  };

  return (
    <PolicyTreeContext.Provider value={value}>
      {children}
    </PolicyTreeContext.Provider>
  );
};

export default PolicyTreeProvider;
