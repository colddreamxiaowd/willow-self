/**
 * 国策树计算工具函数
 * 包含评分计算、可控性计算、等级评估等纯函数
 */

const DEFAULT_IMPACT = 5;
const DEFAULT_SCORE = 5;

/**
 * 计算节点评分
 * Score = (Coupling x Impact) / (Resistance x Maintenance + 1)
 * @param {Object} node - 国策树节点
 * @returns {number} 计算得分
 */
export function calculateNodeScore(node) {
  if (!node || typeof node !== 'object') {
    return 0;
  }

  const coupling = node.coupling_score ?? DEFAULT_SCORE;
  const resistance = node.resistance_score ?? DEFAULT_SCORE;
  const maintenance = node.maintenance_cost ?? DEFAULT_SCORE;
  const impact = node.impact ?? DEFAULT_IMPACT;

  const numerator = coupling * impact;
  const denominator = resistance * maintenance + 1;

  return numerator / denominator;
}

/**
 * 计算节点可控性
 * @param {Object} node - 国策树节点
 * @returns {number} 可控性值 (0-1)
 */
export function calculateControllability(node) {
  if (!node || typeof node !== 'object') {
    return 0;
  }

  const resistance = node.resistance_score ?? DEFAULT_SCORE;
  const maintenance = node.maintenance_cost ?? DEFAULT_SCORE;

  const resistanceFactor = Math.max(0, (10 - resistance) / 10);
  const maintenanceFactor = Math.max(0, (10 - maintenance) / 10);

  return (resistanceFactor * 0.6 + maintenanceFactor * 0.4);
}

/**
 * 根据评分和节点属性获取等级
 * @param {number} score - 节点评分
 * @param {Object} node - 国策树节点
 * @returns {string} 等级符号
 */
export function getGrade(score, node) {
  if (!node || typeof node !== 'object') {
    return '○';
  }

  const resistance = node.resistance_score ?? DEFAULT_SCORE;
  const coupling = node.coupling_score ?? DEFAULT_SCORE;

  if (score > 15 && resistance <= 3) return '🌟';
  if (coupling >= 8 && resistance <= 5) return '⚡';
  if (node.impact && node.impact < 0) return '🛡️';
  if (node.impact && node.impact > 0) return '📈';
  return '○';
}

/**
 * 递归收集所有节点
 * @param {Object} node - 根节点
 * @param {Array} allNodes - 收集结果数组
 * @returns {Array} 所有节点数组
 */
export function collectNodes(node, allNodes = []) {
  if (!node || typeof node !== 'object') {
    return allNodes;
  }

  allNodes.push(node);

  if (Array.isArray(node.children)) {
    node.children.forEach(child => collectNodes(child, allNodes));
  }

  return allNodes;
}

/**
 * 查找干预路径
 * @param {Object} node - 当前节点
 * @param {Array} path - 当前路径
 * @param {number} minDepth - 最小深度要求
 * @returns {Array|null} 干预路径或null
 */
export function findInterventionPath(node, path = [], minDepth = 3) {
  if (!node || typeof node !== 'object') {
    return null;
  }

  const currentPath = [...path, node];

  // 递归查找子节点
  if (Array.isArray(node.children) && node.children.length > 0) {
    for (const child of node.children) {
      const result = findInterventionPath(child, currentPath, minDepth);
      if (result && result.length >= minDepth) {
        return result;
      }
    }
  }

  // 检查当前路径是否满足干预条件
  if (currentPath.length >= minDepth) {
    const controllability = calculateControllability(node);
    if (controllability > 0.5) {
      return currentPath;
    }
  }

  return null;
}

/**
 * 计算树统计信息
 * @param {Object} treeData - 国策树数据
 * @param {Function} calculateScore - 评分计算函数
 * @returns {Object|null} 统计信息
 */
export function calculateTreeStats(treeData, calculateScore) {
  if (!treeData || typeof treeData !== 'object') {
    return null;
  }

  const allNodes = collectNodes(treeData);

  if (allNodes.length === 0) {
    return null;
  }

  const scores = allNodes.map(node => ({
    node,
    score: calculateScore ? calculateScore(node) : 0
  }));

  const sortedByScore = [...scores].sort((a, b) => b.score - a.score);
  const topNodes = sortedByScore.slice(0, 5);

  const avgScore = scores.reduce((sum, s) => sum + s.score, 0) / scores.length;
  const maxScore = Math.max(...scores.map(s => s.score));
  const minScore = Math.min(...scores.map(s => s.score));

  const preferred = scores.filter(s =>
    s.score > 15 && (s.node.resistance_score ?? DEFAULT_SCORE) <= 3
  );

  const highLeverage = scores.filter(s =>
    (s.node.coupling_score ?? DEFAULT_SCORE) >= 8 &&
    (s.node.resistance_score ?? DEFAULT_SCORE) <= 5
  );

  const defensive = scores.filter(s => s.node.impact && s.node.impact < 0);
  const aggressive = scores.filter(s => s.node.impact && s.node.impact > 0);

  return {
    totalNodes: allNodes.length,
    avgScore,
    maxScore,
    minScore,
    topNodes,
    preferred: preferred.length,
    highLeverage: highLeverage.length,
    defensive: defensive.length,
    aggressive: aggressive.length
  };
}

// 最后更新时间: 2026-02-21 16:00
// 编辑人: Senior-Code-Review-Engineer
// 说明: 从 usePolicyTree hook 中提取的纯计算函数，便于测试和复用
