// web/src/components/PolicyTreeEditor/utils/treeLayout.js
// 树形布局算法 - 自动计算国策树节点位置

const CONFIG = {
  HORIZONTAL_SPACING: 300,  // 同一层级节点水平间距
  VERTICAL_SPACING: 150,    // 层级之间垂直间距
  NODE_WIDTH: 240,          // 节点宽度
  NODE_HEIGHT: 120,         // 节点高度估计值
  OFFSET_X: 200,            // 整体向右偏移
  START_Y: 50,              // 起始 Y 位置
};

/**
 * 计算树形布局 - 使用层级布局算法
 * @param {Object} treeData - 树形数据 { id, name, children: [...] }
 * @returns {Object} { nodes: [], edges: [] }
 */
export function calculateTreeLayout(treeData) {
  const nodes = [];
  const edges = [];
  const nodePositions = new Map();
  
  // 第一步：计算每个节点的子树宽度（后序遍历）
  function calculateSubtreeWidth(node) {
    if (!node.children || node.children.length === 0) {
      node._subtreeWidth = CONFIG.HORIZONTAL_SPACING;
      return node._subtreeWidth;
    }
    
    let totalWidth = 0;
    node.children.forEach(child => {
      totalWidth += calculateSubtreeWidth(child);
    });
    
    node._subtreeWidth = totalWidth;
    return totalWidth;
  }
  
  // 第二步：计算节点位置（先序遍历）
  function calculatePosition(node, tier, leftBound, parentId, childIndex) {
    const nodeId = node.id || `node-${tier}-${childIndex}`;
    const y = CONFIG.START_Y + tier * CONFIG.VERTICAL_SPACING;
    
    // 存储父节点ID，用于后续创建节点数据
    node._parentId = parentId;
    
    let x;
    if (!node.children || node.children.length === 0) {
      // 叶子节点：位于子树宽度中心
      x = leftBound + node._subtreeWidth / 2;
    } else {
      // 非叶子节点：先计算子节点，再确定自己的位置
      let childLeft = leftBound;
      const childXPositions = [];
      
      node.children.forEach((child, i) => {
        const childNodeId = child.id || `node-${tier + 1}-${i}`;
        calculatePosition(child, tier + 1, childLeft, nodeId, i);
        
        // 记录子节点位置
        const childPos = nodePositions.get(childNodeId);
        if (childPos) {
          childXPositions.push(childPos.x);
        }
        
        childLeft += child._subtreeWidth;
      });
      
      // 父节点位于子节点中心
      if (childXPositions.length > 0) {
        x = (childXPositions[0] + childXPositions[childXPositions.length - 1]) / 2;
      } else {
        x = leftBound + node._subtreeWidth / 2;
      }
    }
    
    // 存储节点位置
    nodePositions.set(nodeId, { x: x + CONFIG.OFFSET_X, y, node, tier });
    
    // 创建边
    if (parentId) {
      edges.push({
        id: `e-${parentId}-${nodeId}`,
        source: parentId,
        target: nodeId,
        animated: tier === 1
      });
    }
  }
  
  // 执行计算
  calculateSubtreeWidth(treeData);
  calculatePosition(treeData, 0, 0, null, 0);
  
  // 创建节点数组
  for (const [nodeId, { x, y, node, tier }] of nodePositions) {
    nodes.push({
      id: nodeId,
      type: 'policy',
      position: { x, y },
      draggable: true, // 确保节点可拖动
      data: {
        id: nodeId,
        name: node.name || '未命名国策',
        description: node.description || '',
        tier: tier,
        parentId: node._parentId || null, // 添加父节点ID
        status: node.status || node.data?.status || 'inactive',
        enhancement: node.enhancement || node.data?.enhancement || 0,
        enhancementConfig: node.enhancementConfig || node.data?.enhancementConfig || {
          mode: 'auto',
          autoConfig: {
            baseValue: '1',
            step: 1,
            unit: '单位',
            format: '效果{value}'
          }
        }
      }
    });
  }
  
  // 清理临时属性
  function cleanup(node) {
    delete node._subtreeWidth;
    delete node._parentId; // 清理父节点ID临时属性
    if (node.children) {
      node.children.forEach(cleanup);
    }
  }
  cleanup(treeData);
  
  return { nodes, edges };
}

/**
 * 计算边界框
 * @param {Array} nodes - 节点数组
 * @returns {Object} { minX, maxX, minY, maxY, width, height, centerX, centerY }
 */
export function calculateBoundingBox(nodes) {
  if (!nodes || nodes.length === 0) {
    return { minX: 0, maxX: 0, minY: 0, maxY: 0, width: 0, height: 0, centerX: 0, centerY: 0 };
  }
  
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  
  nodes.forEach(node => {
    const x = node.position.x;
    const y = node.position.y;
    
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  });
  
  // 加上节点尺寸
  const width = maxX - minX + CONFIG.NODE_WIDTH;
  const height = maxY - minY + CONFIG.NODE_HEIGHT;
  
  return {
    minX,
    maxX,
    minY,
    maxY,
    width,
    height,
    centerX: (minX + maxX + CONFIG.NODE_WIDTH) / 2,
    centerY: (minY + maxY + CONFIG.NODE_HEIGHT) / 2
  };
}

/**
 * 计算最佳缩放比例
 * @param {Object} boundingBox - 边界框
 * @param {Object} containerSize - 容器尺寸 { width, height }
 * @returns {number} 缩放比例
 */
export function calculateOptimalZoom(boundingBox, containerSize) {
  if (!containerSize || containerSize.width === 0 || containerSize.height === 0) {
    return 1;
  }
  
  const padding = 100; // 边距
  const availableWidth = containerSize.width - padding * 2;
  const availableHeight = containerSize.height - padding * 2;
  
  const scaleX = availableWidth / boundingBox.width;
  const scaleY = availableHeight / boundingBox.height;
  
  // 限制缩放范围：最小 0.3，最大 1.5
  return Math.max(0.3, Math.min(1.5, Math.min(scaleX, scaleY)));
}

/**
 * 将现有节点转换为树形结构
 * @param {Array} nodes - 节点数组
 * @param {Array} edges - 边数组
 * @returns {Object} 树形数据
 */
export function nodesToTree(nodes, edges) {
  // 构建父子关系映射
  const nodeMap = {};
  const childrenMap = {};
  
  nodes.forEach(node => {
    // 直接从 node.data 获取数据
    // 注意：保存编辑后，数据已经在 node.data 中了
    const nodeData = {
      ...node.data,
      id: node.id
    };
    
    nodeMap[node.id] = nodeData;
    childrenMap[node.id] = [];
  });
  
  let rootId = null;
  edges.forEach(edge => {
    if (childrenMap[edge.source]) {
      childrenMap[edge.source].push(edge.target);
    }
  });
  
  // 找到根节点（没有入边的节点）
  const hasParent = new Set(edges.map(e => e.target));
  nodes.forEach(node => {
    if (!hasParent.has(node.id)) {
      rootId = node.id;
    }
  });
  
  // 递归构建树
  function buildTree(nodeId) {
    const node = nodeMap[nodeId];
    if (!node) return null;
    
    const children = childrenMap[nodeId];
    if (children && children.length > 0) {
      node.children = children.map(buildTree).filter(Boolean);
    }
    
    return node;
  }
  
  return buildTree(rootId);
}

// 最后更新时间: 2026-02-26 15:45
// 编辑人: Trae AI
// 更新内容: 优化 calculateTreeLayout 状态读取逻辑，优先使用 node.data 内部状态
