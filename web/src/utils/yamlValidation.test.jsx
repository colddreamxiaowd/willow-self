/**
 * yamlValidation 工具函数测试套件
 */

import {
  VALIDATION_LIMITS,
  VALID_TYPES,
  validateNode,
  sanitizeString,
  sanitizeObject,
  validateYamlSize,
  validateTreeData
} from './yamlValidation';

describe('yamlValidation', () => {
  describe('VALIDATION_LIMITS', () => {
    test('应该包含所有必要的限制常量', () => {
      expect(VALIDATION_LIMITS.MAX_YAML_SIZE).toBe(1024 * 1024); // 1MB
      expect(VALIDATION_LIMITS.MAX_TREE_DEPTH).toBe(20);
      expect(VALIDATION_LIMITS.MAX_CHILDREN_PER_NODE).toBe(50);
      expect(VALIDATION_LIMITS.MAX_ID_LENGTH).toBe(100);
      expect(VALIDATION_LIMITS.MAX_DESCRIPTION_LENGTH).toBe(500);
      expect(VALIDATION_LIMITS.SCORE_MIN).toBe(1);
      expect(VALIDATION_LIMITS.SCORE_MAX).toBe(10);
    });
  });

  describe('VALID_TYPES', () => {
    test('应该包含所有有效的节点类型', () => {
      expect(VALID_TYPES).toContain('ROOT');
      expect(VALID_TYPES).toContain('GOAL');
      expect(VALID_TYPES).toContain('ACTION');
      expect(VALID_TYPES).toContain('MILESTONE');
    });
  });

  describe('validateNode', () => {
    test('应该验证通过有效的节点', () => {
      const node = {
        id: 'test-node',
        description: '测试节点',
        type: 'GOAL',
        resistance_score: 5,
        coupling_score: 5,
        maintenance_cost: 5
      };

      const errors = validateNode(node);
      expect(errors).toHaveLength(0);
    });

    test('应该检测缺少 id 的节点', () => {
      const node = {
        description: '测试节点'
      };

      const errors = validateNode(node);
      expect(errors).toContain('节点必须包含有效的 id 字段');
    });

    test('应该检测缺少 description 的节点', () => {
      const node = {
        id: 'test-node'
      };

      const errors = validateNode(node);
      expect(errors).toContain('节点必须包含有效的 description 字段');
    });

    test('应该检测过长的 id', () => {
      const node = {
        id: 'a'.repeat(101),
        description: '测试节点'
      };

      const errors = validateNode(node);
      expect(errors).toContain('id 字段长度不能超过 100 字符');
    });

    test('应该检测过长的 description', () => {
      const node = {
        id: 'test-node',
        description: 'a'.repeat(501)
      };

      const errors = validateNode(node);
      expect(errors).toContain('description 字段长度不能超过 500 字符');
    });

    test('应该检测无效的 type', () => {
      const node = {
        id: 'test-node',
        description: '测试节点',
        type: 'INVALID_TYPE'
      };

      const errors = validateNode(node);
      expect(errors.some(e => e.includes('type 必须是以下值之一'))).toBe(true);
    });

    test('应该检测超出范围的 score', () => {
      const node = {
        id: 'test-node',
        description: '测试节点',
        resistance_score: 15
      };

      const errors = validateNode(node);
      expect(errors.some(e => e.includes('resistance_score 必须在 1-10 之间'))).toBe(true);
    });

    test('应该检测非数字的 score', () => {
      const node = {
        id: 'test-node',
        description: '测试节点',
        resistance_score: 'invalid'
      };

      const errors = validateNode(node);
      expect(errors.some(e => e.includes('resistance_score 必须是数字'))).toBe(true);
    });

    test('应该检测过深的树', () => {
      const createDeepTree = (depth) => {
        if (depth === 0) {
          return { id: `node-${depth}`, description: `节点 ${depth}` };
        }
        return {
          id: `node-${depth}`,
          description: `节点 ${depth}`,
          children: [createDeepTree(depth - 1)]
        };
      };

      const deepTree = createDeepTree(25);
      const errors = validateNode(deepTree);
      expect(errors.some(e => e.includes('树深度超过最大限制'))).toBe(true);
    });

    test('应该检测过多的子节点', () => {
      const node = {
        id: 'test-node',
        description: '测试节点',
        children: Array(51).fill(null).map((_, i) => ({
          id: `child-${i}`,
          description: `子节点 ${i}`
        }))
      };

      const errors = validateNode(node);
      expect(errors.some(e => e.includes('子节点数量不能超过'))).toBe(true);
    });
  });

  describe('sanitizeString', () => {
    test('应该移除 script 标签', () => {
      const input = '<script>alert("xss")</script>';
      expect(sanitizeString(input)).toBe('');
    });

    test('应该移除 javascript: 协议', () => {
      const input = 'javascript:alert("xss")';
      expect(sanitizeString(input)).toBe('');
    });

    test('应该移除事件处理器', () => {
      const input = 'onclick=alert("xss")';
      expect(sanitizeString(input)).toBe('');
    });

    test('应该保留普通文本', () => {
      const input = 'Hello World';
      expect(sanitizeString(input)).toBe('Hello World');
    });

    test('应该处理非字符串输入', () => {
      expect(sanitizeString(123)).toBe(123);
      expect(sanitizeString(null)).toBe(null);
    });
  });

  describe('sanitizeObject', () => {
    test('应该清理对象中的所有字符串', () => {
      const input = {
        id: 'test',
        description: '<script>alert("xss")</script>',
        nested: {
          value: 'javascript:alert("xss")'
        }
      };

      const result = sanitizeObject(input);
      expect(result.description).toBe('');
      expect(result.nested.value).toBe('');
      expect(result.id).toBe('test');
    });

    test('应该处理数组', () => {
      const input = [
        '<script>alert("xss")</script>',
        'safe text'
      ];

      const result = sanitizeObject(input);
      expect(result[0]).toBe('');
      expect(result[1]).toBe('safe text');
    });

    test('应该处理 null', () => {
      expect(sanitizeObject(null)).toBe(null);
    });
  });

  describe('validateYamlSize', () => {
    test('应该通过小于 1MB 的内容', () => {
      const content = 'a'.repeat(1024 * 512); // 512KB
      expect(validateYamlSize(content)).toBe(true);
    });

    test('应该拒绝大于 1MB 的内容', () => {
      const content = 'a'.repeat(1024 * 1024 + 1); // 1MB + 1
      expect(validateYamlSize(content)).toBe(false);
    });
  });

  describe('validateTreeData', () => {
    test('应该验证通过有效的树数据', () => {
      const treeData = {
        id: 'root',
        description: '根节点',
        type: 'ROOT'
      };

      const result = validateTreeData(treeData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('应该检测缺少 id', () => {
      const treeData = {
        description: '根节点'
      };

      const result = validateTreeData(treeData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('YAML 必须包含 id 字段');
    });

    test('应该检测缺少 description', () => {
      const treeData = {
        id: 'root'
      };

      const result = validateTreeData(treeData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('YAML 必须包含 description 字段');
    });

    test('应该检测 null 输入', () => {
      const result = validateTreeData(null);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('数据为空或格式不正确');
    });

    test('应该检测 undefined 输入', () => {
      const result = validateTreeData(undefined);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('数据为空或格式不正确');
    });
  });
});

// 最后更新时间: 2026-02-21 16:00
// 编辑人: Senior-Code-Review-Engineer
