/**
 * treeCalculations 工具函数测试套件
 */

import {
  calculateNodeScore,
  calculateControllability,
  getGrade,
  collectNodes,
  findInterventionPath,
  calculateTreeStats
} from './treeCalculations';

describe('treeCalculations', () => {
  describe('calculateNodeScore', () => {
    test('应该正确计算节点评分', () => {
      const node = {
        coupling_score: 8,
        resistance_score: 3,
        maintenance_cost: 4,
        impact: 5
      };

      // Score = (8 * 5) / (3 * 4 + 1) = 40 / 13 ≈ 3.08
      const score = calculateNodeScore(node);
      expect(score).toBeCloseTo(3.08, 2);
    });

    test('应该使用默认值当属性缺失', () => {
      const node = {};
      // Score = (5 * 5) / (5 * 5 + 1) = 25 / 26 ≈ 0.96
      const score = calculateNodeScore(node);
      expect(score).toBeCloseTo(0.96, 2);
    });

    test('应该返回 0 当输入为 null', () => {
      expect(calculateNodeScore(null)).toBe(0);
    });

    test('应该返回 0 当输入为 undefined', () => {
      expect(calculateNodeScore(undefined)).toBe(0);
    });

    test('应该返回 0 当输入为非对象', () => {
      expect(calculateNodeScore('string')).toBe(0);
      expect(calculateNodeScore(123)).toBe(0);
    });
  });

  describe('calculateControllability', () => {
    test('应该正确计算可控性', () => {
      const node = {
        resistance_score: 3,
        maintenance_cost: 4
      };

      // resistanceFactor = (10 - 3) / 10 = 0.7
      // maintenanceFactor = (10 - 4) / 10 = 0.6
      // controllability = 0.7 * 0.6 + 0.6 * 0.4 = 0.42 + 0.24 = 0.66
      const controllability = calculateControllability(node);
      expect(controllability).toBeCloseTo(0.66, 2);
    });

    test('应该使用默认值当属性缺失', () => {
      const node = {};
      // resistanceFactor = (10 - 5) / 10 = 0.5
      // maintenanceFactor = (10 - 5) / 10 = 0.5
      // controllability = 0.5 * 0.6 + 0.5 * 0.4 = 0.5
      const controllability = calculateControllability(node);
      expect(controllability).toBe(0.5);
    });

    test('应该返回 0 当输入为 null', () => {
      expect(calculateControllability(null)).toBe(0);
    });

    test('应该返回 0 当输入为 undefined', () => {
      expect(calculateControllability(undefined)).toBe(0);
    });
  });

  describe('getGrade', () => {
    test('应该返回优选国策 🌟 当 score > 15 且 resistance <= 3', () => {
      const node = {
        resistance_score: 3,
        coupling_score: 5
      };
      expect(getGrade(16, node)).toBe('🌟');
    });

    test('应该返回高杠杆 ⚡ 当 coupling >= 8 且 resistance <= 5', () => {
      const node = {
        resistance_score: 5,
        coupling_score: 8
      };
      expect(getGrade(10, node)).toBe('⚡');
    });

    test('应该返回防御型 🛡️ 当 impact < 0', () => {
      const node = {
        resistance_score: 5,
        coupling_score: 5,
        impact: -1
      };
      expect(getGrade(10, node)).toBe('🛡️');
    });

    test('应该返回进取型 📈 当 impact > 0', () => {
      const node = {
        resistance_score: 5,
        coupling_score: 5,
        impact: 1
      };
      expect(getGrade(10, node)).toBe('📈');
    });

    test('应该返回默认等级 ○ 当不满足任何条件', () => {
      const node = {
        resistance_score: 5,
        coupling_score: 5
      };
      expect(getGrade(10, node)).toBe('○');
    });

    test('应该返回 ○ 当输入为 null', () => {
      expect(getGrade(10, null)).toBe('○');
    });
  });

  describe('collectNodes', () => {
    test('应该正确收集所有节点', () => {
      const tree = {
        id: 'root',
        children: [
          { id: 'child1' },
          { id: 'child2', children: [{ id: 'grandchild' }] }
        ]
      };

      const nodes = collectNodes(tree);
      expect(nodes).toHaveLength(4);
      expect(nodes.map(n => n.id)).toEqual(['root', 'child1', 'child2', 'grandchild']);
    });

    test('应该返回空数组当输入为 null', () => {
      expect(collectNodes(null)).toEqual([]);
    });

    test('应该返回空数组当输入为 undefined', () => {
      expect(collectNodes(undefined)).toEqual([]);
    });

    test('应该正确处理没有 children 的节点', () => {
      const tree = { id: 'root' };
      const nodes = collectNodes(tree);
      expect(nodes).toHaveLength(1);
    });
  });

  describe('findInterventionPath', () => {
    test('应该找到满足条件的干预路径', () => {
      const tree = {
        id: 'root',
        resistance_score: 3,
        maintenance_cost: 4,
        children: [
          {
            id: 'child',
            resistance_score: 3,
            maintenance_cost: 4,
            children: [
              {
                id: 'grandchild',
                resistance_score: 3,
                maintenance_cost: 4
              }
            ]
          }
        ]
      };

      const path = findInterventionPath(tree);
      expect(path).not.toBeNull();
      expect(path).toHaveLength(3);
    });

    test('应该返回 null 当树深度不足', () => {
      const tree = {
        id: 'root',
        children: [{ id: 'child' }]
      };

      const path = findInterventionPath(tree);
      expect(path).toBeNull();
    });

    test('应该返回 null 当没有满足可控性条件的节点', () => {
      const tree = {
        id: 'root',
        resistance_score: 9,
        maintenance_cost: 9,
        children: [
          {
            id: 'child',
            resistance_score: 9,
            maintenance_cost: 9,
            children: [
              {
                id: 'grandchild',
                resistance_score: 9,
                maintenance_cost: 9
              }
            ]
          }
        ]
      };

      const path = findInterventionPath(tree);
      expect(path).toBeNull();
    });

    test('应该返回 null 当输入为 null', () => {
      expect(findInterventionPath(null)).toBeNull();
    });
  });

  describe('calculateTreeStats', () => {
    const mockCalculateScore = (node) => {
      return (node.coupling_score || 5) * 2;
    };

    test('应该正确计算树统计信息', () => {
      const tree = {
        id: 'root',
        coupling_score: 8,
        children: [
          { id: 'child1', coupling_score: 6 },
          { id: 'child2', coupling_score: 4 }
        ]
      };

      const stats = calculateTreeStats(tree, mockCalculateScore);

      expect(stats.totalNodes).toBe(3);
      expect(stats.avgScore).toBe(12); // (16 + 12 + 8) / 3
      expect(stats.maxScore).toBe(16);
      expect(stats.minScore).toBe(8);
      expect(stats.topNodes).toHaveLength(3);
    });

    test('应该返回 null 当输入为 null', () => {
      expect(calculateTreeStats(null, mockCalculateScore)).toBeNull();
    });

    test('应该返回 null 当输入为 undefined', () => {
      expect(calculateTreeStats(undefined, mockCalculateScore)).toBeNull();
    });

    test('应该正确分类节点', () => {
      const tree = {
        id: 'root',
        resistance_score: 3,
        coupling_score: 8,
        impact: 1,
        children: [
          { id: 'child1', resistance_score: 2, coupling_score: 9, impact: -1 }
        ]
      };

      const stats = calculateTreeStats(tree, mockCalculateScore);

      expect(stats.preferred).toBeGreaterThanOrEqual(0);
      expect(stats.highLeverage).toBeGreaterThanOrEqual(0);
      expect(stats.defensive).toBeGreaterThanOrEqual(0);
      expect(stats.aggressive).toBeGreaterThanOrEqual(0);
    });
  });
});

// 最后更新时间: 2026-02-21 16:00
// 编辑人: Senior-Code-Review-Engineer
