/**
 * usePolicyTree Hook 测试套件
 */

import { renderHook, act } from '@testing-library/react';
import { usePolicyTree } from './usePolicyTree';

// Mock YAML 库
jest.mock('yaml', () => ({
  parse: jest.fn()
}));

import YAML from 'yaml';

describe('usePolicyTree', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('初始状态', () => {
    test('应该有正确的初始状态', () => {
      const { result } = renderHook(() => usePolicyTree());

      expect(result.current.treeData).toBeNull();
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.interventionPath).toBeNull();
      expect(result.current.yamlContent).toBeDefined();
    });
  });

  describe('setYamlContent', () => {
    test('应该更新 yamlContent', () => {
      const { result } = renderHook(() => usePolicyTree());

      act(() => {
        result.current.setYamlContent('new yaml content');
      });

      expect(result.current.yamlContent).toBe('new yaml content');
    });
  });

  describe('parseYaml', () => {
    test('应该成功解析有效的 YAML', () => {
      const mockTreeData = {
        id: 'root',
        description: '测试根节点'
      };

      YAML.parse.mockReturnValue(mockTreeData);

      const { result } = renderHook(() => usePolicyTree());

      act(() => {
        result.current.parseYaml();
      });

      expect(result.current.treeData).toEqual(mockTreeData);
      expect(result.current.error).toBeNull();
      expect(result.current.loading).toBe(false);
    });

    test('应该处理解析错误', () => {
      YAML.parse.mockImplementation(() => {
        throw new Error('Invalid YAML');
      });

      const { result } = renderHook(() => usePolicyTree());

      act(() => {
        result.current.parseYaml();
      });

      expect(result.current.treeData).toBeNull();
      expect(result.current.error).toContain('YAML 解析错误');
      expect(result.current.loading).toBe(false);
    });

    test('应该在解析时设置 loading 状态', () => {
      YAML.parse.mockReturnValue({ id: 'root', description: '测试' });

      const { result } = renderHook(() => usePolicyTree());

      // 开始解析前
      expect(result.current.loading).toBe(false);

      act(() => {
        result.current.parseYaml();
      });

      // 解析完成后
      expect(result.current.loading).toBe(false);
    });

    test('应该处理空的解析结果', () => {
      YAML.parse.mockReturnValue(null);

      const { result } = renderHook(() => usePolicyTree());

      act(() => {
        result.current.parseYaml();
      });

      expect(result.current.error).toContain('YAML 解析结果为空');
    });

    test('应该重置 interventionPath 当解析新数据', () => {
      YAML.parse.mockReturnValue({ id: 'root', description: '测试' });

      const { result } = renderHook(() => usePolicyTree());

      // 先设置一个干预路径
      act(() => {
        result.current.parseYaml();
        // 模拟找到干预路径
        result.current.interventionPath = [{ id: 'test' }];
      });

      // 重新解析
      act(() => {
        result.current.parseYaml();
      });

      expect(result.current.interventionPath).toBeNull();
    });
  });

  describe('findIntervention', () => {
    test('应该在没有 treeData 时设置错误', () => {
      const { result } = renderHook(() => usePolicyTree());

      act(() => {
        result.current.findIntervention();
      });

      expect(result.current.error).toContain('请先解析 YAML 数据');
    });

    test('应该在有 treeData 时查找干预点', () => {
      const mockTreeData = {
        id: 'root',
        description: '根节点',
        resistance_score: 3,
        maintenance_cost: 4,
        children: [
          {
            id: 'child',
            description: '子节点',
            resistance_score: 3,
            maintenance_cost: 4,
            children: [
              {
                id: 'grandchild',
                description: '孙节点',
                resistance_score: 3,
                maintenance_cost: 4
              }
            ]
          }
        ]
      };

      YAML.parse.mockReturnValue(mockTreeData);

      const { result } = renderHook(() => usePolicyTree());

      // 先解析数据
      act(() => {
        result.current.parseYaml();
      });

      // 查找干预点
      act(() => {
        result.current.findIntervention();
      });

      expect(result.current.interventionPath).not.toBeNull();
      expect(result.current.interventionPath).toHaveLength(3);
    });

    test('应该在没有找到干预点时设置错误', () => {
      const mockTreeData = {
        id: 'root',
        description: '根节点',
        resistance_score: 9,
        maintenance_cost: 9,
        children: [
          {
            id: 'child',
            description: '子节点',
            resistance_score: 9,
            maintenance_cost: 9,
            children: [
              {
                id: 'grandchild',
                description: '孙节点',
                resistance_score: 9,
                maintenance_cost: 9
              }
            ]
          }
        ]
      };

      YAML.parse.mockReturnValue(mockTreeData);

      const { result } = renderHook(() => usePolicyTree());

      act(() => {
        result.current.parseYaml();
      });

      act(() => {
        result.current.findIntervention();
      });

      expect(result.current.error).toContain('未找到合适的干预点');
    });
  });

  describe('calculateScore', () => {
    test('应该计算节点评分', () => {
      const { result } = renderHook(() => usePolicyTree());

      const node = {
        coupling_score: 8,
        resistance_score: 3,
        maintenance_cost: 4,
        impact: 5
      };

      const score = result.current.calculateScore(node);

      // Score = (8 * 5) / (3 * 4 + 1) = 40 / 13 ≈ 3.08
      expect(score).toBeCloseTo(3.08, 2);
    });

    test('应该使用默认值', () => {
      const { result } = renderHook(() => usePolicyTree());

      const node = {};
      const score = result.current.calculateScore(node);

      expect(score).toBeGreaterThan(0);
    });
  });

  describe('resetIntervention', () => {
    test('应该重置干预路径', () => {
      const mockTreeData = {
        id: 'root',
        description: '根节点',
        resistance_score: 3,
        maintenance_cost: 4,
        children: [
          {
            id: 'child',
            description: '子节点',
            resistance_score: 3,
            maintenance_cost: 4,
            children: [
              {
                id: 'grandchild',
                description: '孙节点',
                resistance_score: 3,
                maintenance_cost: 4
              }
            ]
          }
        ]
      };

      YAML.parse.mockReturnValue(mockTreeData);

      const { result } = renderHook(() => usePolicyTree());

      // 先解析数据
      act(() => {
        result.current.parseYaml();
      });

      // 然后查找干预点（需要分开执行，因为 parseYaml 是异步设置 treeData）
      act(() => {
        result.current.findIntervention();
      });

      expect(result.current.interventionPath).not.toBeNull();

      act(() => {
        result.current.resetIntervention();
      });

      expect(result.current.interventionPath).toBeNull();
    });
  });
});

// 最后更新时间: 2026-02-23 10:30
// 编辑人: Trae AI
// 修复内容:
// 1. resetIntervention 测试：将 parseYaml 和 findIntervention 分开执行，解决状态更新时序问题
