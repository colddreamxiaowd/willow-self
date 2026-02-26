import { useState, useCallback, useMemo } from 'react';
import YAML from 'yaml';
import {
  DEFAULT_YAML,
  validateYamlSize,
  sanitizeObject,
  validateTreeData,
  calculateNodeScore,
  findInterventionPath
} from '../utils';

/**
 * usePolicyTree Hook
 * 管理国策树的状态和操作
 * 重构后：业务逻辑已提取到 utils，hook 只负责状态管理
 */
export function usePolicyTree() {
  const [treeData, setTreeData] = useState(null);
  const [yamlContent, setYamlContent] = useState(DEFAULT_YAML);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [interventionPath, setInterventionPath] = useState(null);

  /**
   * 解析 YAML 内容
   */
  const parseYaml = useCallback(() => {
    setLoading(true);
    setError(null);
    setInterventionPath(null);

    try {
      const contentToParse = yamlContent || DEFAULT_YAML;

      // 验证输入大小
      if (!validateYamlSize(contentToParse)) {
        throw new Error('输入内容超过最大限制 (1MB)');
      }

      const parsed = YAML.parse(contentToParse);

      if (!parsed) {
        throw new Error('YAML 解析结果为空，请检查输入内容');
      }

      // 清理和验证数据
      const sanitized = sanitizeObject(parsed);
      const validation = validateTreeData(sanitized);

      if (!validation.isValid) {
        throw new Error(`数据验证失败:\n${validation.errors.join('\n')}`);
      }

      setTreeData(sanitized);
      setError(null);
    } catch (err) {
      setError(`YAML 解析错误: ${err.message}`);
      setTreeData(null);
    } finally {
      setLoading(false);
    }
  }, [yamlContent]);

  /**
   * 查找干预点
   */
  const findIntervention = useCallback(() => {
    if (!treeData) {
      setError('请先解析 YAML 数据');
      return;
    }

    const path = findInterventionPath(treeData);
    if (path) {
      setInterventionPath(path);
    } else {
      setError('未找到合适的干预点，请检查国策树结构是否达到最小深度要求(3层)');
    }
  }, [treeData]);

  /**
   * 计算节点评分（使用 useMemo 缓存）
   */
  const calculateScore = useCallback((node) => {
    return calculateNodeScore(node);
  }, []);

  /**
   * 重置干预路径
   */
  const resetIntervention = useCallback(() => {
    setInterventionPath(null);
  }, []);

  // 使用 useMemo 缓存评分函数引用
  const scoreFunction = useMemo(() => calculateScore, [calculateScore]);

  return {
    // 状态
    treeData,
    yamlContent,
    loading,
    error,
    interventionPath,

    // 状态设置
    setYamlContent,

    // 操作
    parseYaml,
    findIntervention,
    calculateScore: scoreFunction,
    resetIntervention
  };
}

export default usePolicyTree;

// 最后更新时间: 2026-02-21 16:00
// 编辑人: Senior-Code-Review-Engineer
// 优化内容:
// 1. 将业务逻辑提取到 utils 目录
// 2. 简化 hook 职责，只负责状态管理
// 3. 代码行数从 280+ 减少到 100+
