// web/src/components/PolicyTreeEditor/hooks/usePolicyTreeStorage.js
// 国策树数据持久化 Hook

import { useCallback, useEffect, useRef } from 'react';
import { nodesToTree, calculateTreeLayout } from '../utils/treeLayout';

const STORAGE_KEY = 'policytree_editor_data';
const METADATA_KEY = 'policytree_saves_metadata';
const VIEW_STATE_KEY = 'policytree_view_state'; // 视图状态存储键
const AUTO_SAVE_INTERVAL = 30000; // 30秒自动保存
const MAX_SLOTS = 10;

/**
 * 国策树存储 Hook
 * @param {Array} nodes - 节点数组
 * @param {Array} edges - 边数组
 * @param {Function} setNodes - 设置节点函数
 * @param {Function} setEdges - 设置边函数
 * @param {Function} getViewport - 获取视口函数（可选）
 * @returns {Object} { saveToStorage, loadFromStorage, exportToYaml, importFromYaml, autoSaveEnabled, toggleAutoSave, saveViewState, loadViewState }
 */
export function usePolicyTreeStorage(nodes, edges, setNodes, setEdges, getViewport = null) {
  const autoSaveRef = useRef(true);

  // 保存到 localStorage（直接保存节点和边，保留位置）
  const saveToStorage = useCallback(() => {
    try {
      if (!nodes || nodes.length === 0) {
        console.warn('无法保存：没有节点数据');
        return false;
      }

      // 读取现有数据，检查时间戳
      const existingData = localStorage.getItem(STORAGE_KEY);
      let existingTimestamp = null;
      if (existingData) {
        try {
          const parsed = JSON.parse(existingData);
          existingTimestamp = parsed.timestamp;
        } catch (e) {
          console.warn('解析现有数据失败:', e);
        }
      }

      const currentTimestamp = new Date().toISOString();
      
      // 检查时间戳，如果现有数据在1秒内更新过，则跳过保存
      if (existingTimestamp) {
        const existingTime = new Date(existingTimestamp).getTime();
        const currentTime = new Date(currentTimestamp).getTime();
        const timeDiff = Math.abs(currentTime - existingTime);
        
        if (timeDiff < 1000) {
          console.log('检测到频繁保存，跳过（时间差:', timeDiff, 'ms');
          return true;
        }
      }

      const data = {
        version: '2.1',
        timestamp: currentTimestamp,
        nodes: nodes,
        edges: edges
      };

      // 如果提供了 getViewport，也保存视口位置
      if (getViewport) {
        data.viewport = getViewport();
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      console.log('国策树已保存到本地存储');
      return true;
    } catch (error) {
      console.error('保存国策树失败:', error);
      return false;
    }
  }, [nodes, edges, getViewport]);

  // 保存视图状态（当前查看的节点、缩放级别等）
  const saveViewState = useCallback((viewState) => {
    try {
      const data = {
        timestamp: new Date().toISOString(),
        ...viewState
      };
      localStorage.setItem(VIEW_STATE_KEY, JSON.stringify(data));
      console.log('视图状态已保存:', viewState);
      return true;
    } catch (error) {
      console.error('保存视图状态失败:', error);
      return false;
    }
  }, []);

  // 加载视图状态
  const loadViewState = useCallback(() => {
    try {
      const saved = localStorage.getItem(VIEW_STATE_KEY);
      if (!saved) {
        console.log('没有找到保存的视图状态');
        return null;
      }
      const data = JSON.parse(saved);
      console.log('视图状态已加载:', data);
      return data;
    } catch (error) {
      console.error('加载视图状态失败:', error);
      return null;
    }
  }, []);

  // 从 localStorage 加载
  const loadFromStorage = useCallback(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        console.log('没有找到保存的国策树数据');
        return false;
      }

      const data = JSON.parse(saved);
      
      if (data.nodes && data.edges) {
        // 新格式：直接加载节点和边
        setNodes(data.nodes);
        setEdges(data.edges);
        console.log('国策树已从本地存储加载');
        return true;
      } else if (data.tree) {
        // 兼容旧格式：从树形数据计算布局
        const { nodes: loadedNodes, edges: loadedEdges } = calculateTreeLayout(data.tree);
        setNodes(loadedNodes);
        setEdges(loadedEdges);
        console.log('国策树已从本地存储加载（旧格式）');
        return true;
      }
      
      console.error('无效的国策树数据格式');
      return false;
    } catch (error) {
      console.error('加载国策树失败:', error);
      return false;
    }
  }, [setNodes, setEdges]);

  // 导出为 YAML
  const exportToYaml = useCallback(() => {
    try {
      const treeData = nodesToTree(nodes, edges);
      if (!treeData) {
        throw new Error('无法导出：无效的国策树数据');
      }

      const yaml = treeToYaml(treeData);
      
      // 创建下载
      const blob = new Blob([yaml], { type: 'text/yaml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `policy-tree-${formatDate(new Date())}.yaml`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log('国策树已导出为 YAML');
      return true;
    } catch (error) {
      console.error('导出 YAML 失败:', error);
      return false;
    }
  }, [nodes, edges]);

  // 从 YAML 导入
  const importFromYaml = useCallback((yamlContent) => {
    try {
      const treeData = yamlToTree(yamlContent);
      
      // 验证数据
      if (!treeData || !treeData.name) {
        throw new Error('无效的 YAML 格式');
      }

      // 转换为 React Flow 格式
      const { nodes: importedNodes, edges: importedEdges } = calculateTreeLayout(treeData);
      
      setNodes(importedNodes);
      setEdges(importedEdges);
      
      // 自动保存
      setTimeout(() => saveToStorage(), 100);
      
      console.log('国策树已从 YAML 导入');
      return true;
    } catch (error) {
      console.error('导入 YAML 失败:', error);
      throw error;
    }
  }, [setNodes, setEdges, saveToStorage]);

  // 自动保存
  useEffect(() => {
    if (!autoSaveRef.current) return;

    const timer = setInterval(() => {
      if (nodes.length > 0) {
        saveToStorage();
      }
    }, AUTO_SAVE_INTERVAL);

    return () => clearInterval(timer);
  }, [nodes, saveToStorage]);

  // 页面卸载前保存
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (nodes.length > 0) {
        saveToStorage();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [nodes, saveToStorage]);

  // 切换自动保存
  const toggleAutoSave = useCallback(() => {
    autoSaveRef.current = !autoSaveRef.current;
    return autoSaveRef.current;
  }, []);

  // --- 多存档管理功能 ---

  // 获取所有存档元数据
  const getSavesMetadata = useCallback(() => {
    try {
      const saved = localStorage.getItem(METADATA_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('获取存档元数据失败:', error);
      return [];
    }
  }, []);

  // 保存到指定槽位
  const saveToSlot = useCallback((id, name) => {
    try {
      // 1. 获取当前工作区数据
      const currentData = localStorage.getItem(STORAGE_KEY);
      if (!currentData) {
        // 如果当前工作区没数据，先执行一次实时保存
        saveToStorage();
      }
      
      const dataToSave = localStorage.getItem(STORAGE_KEY);
      if (!dataToSave) return false;

      // 2. 存入指定 Slot
      localStorage.setItem(`policytree_save_${id}`, dataToSave);

      // 3. 更新元数据
      const metadata = getSavesMetadata();
      const existingIndex = metadata.findIndex(m => m.id === id);
      
      const newEntry = {
        id,
        name,
        timestamp: new Date().toISOString(),
        nodeCount: nodes.length
      };

      if (existingIndex > -1) {
        metadata[existingIndex] = newEntry;
      } else {
        metadata.push(newEntry);
      }

      localStorage.setItem(METADATA_KEY, JSON.stringify(metadata));
      console.log(`存档已保存到槽位 ${id}: ${name}`);
      return true;
    } catch (error) {
      console.error('保存存档到槽位失败:', error);
      return false;
    }
  }, [nodes, getSavesMetadata, saveToStorage]);

  // 从槽位加载
  const loadFromSlot = useCallback((id) => {
    try {
      const slotData = localStorage.getItem(`policytree_save_${id}`);
      if (!slotData) return false;

      // 覆盖到当前工作区
      localStorage.setItem(STORAGE_KEY, slotData);
      
      // 执行加载逻辑更新 UI
      return loadFromStorage();
    } catch (error) {
      console.error('从槽位加载失败:', error);
      return false;
    }
  }, [loadFromStorage]);

  // 删除槽位
  const deleteSlot = useCallback((id) => {
    try {
      localStorage.removeItem(`policytree_save_${id}`);
      
      const metadata = getSavesMetadata();
      const filtered = metadata.filter(m => m.id !== id);
      localStorage.setItem(METADATA_KEY, JSON.stringify(filtered));
      
      return true;
    } catch (error) {
      console.error('删除槽位失败:', error);
      return false;
    }
  }, [getSavesMetadata]);

  // 执行数据迁移
  const performMigration = useCallback(() => {
    try {
      const metadata = getSavesMetadata();
      const existingData = localStorage.getItem(STORAGE_KEY);
      
      // 如果有工作区数据且元数据为空，执行迁移
      if (existingData && metadata.length === 0) {
        console.log('检测到旧版数据，执行自动迁移...');
        const parsed = JSON.parse(existingData);
        const nodeCount = parsed.nodes ? parsed.nodes.length : 0;
        
        const migrationId = Date.now().toString();
        localStorage.setItem(`policytree_save_${migrationId}`, existingData);
        
        const initialMetadata = [{
          id: migrationId,
          name: '迁移存档 (自动)',
          timestamp: new Date().toISOString(),
          nodeCount: nodeCount
        }];
        
        localStorage.setItem(METADATA_KEY, JSON.stringify(initialMetadata));
        return true;
      }
      return false;
    } catch (error) {
      console.warn('数据迁移失败:', error);
      return false;
    }
  }, [getSavesMetadata]);

  return {
    saveToStorage,
    loadFromStorage,
    exportToYaml,
    importFromYaml,
    autoSaveEnabled: () => autoSaveRef.current,
    toggleAutoSave,
    saveViewState,
    loadViewState,
    // 新增多存档方法
    getSavesMetadata,
    saveToSlot,
    loadFromSlot,
    deleteSlot,
    performMigration,
    MAX_SLOTS
  };
}

/**
 * 将树形数据转换为 YAML
 * @param {Object} treeData - 树形数据
 * @param {number} indent - 缩进级别
 * @returns {string} YAML 字符串
 */
function treeToYaml(treeData, indent = 0) {
  const spaces = '  '.repeat(indent);
  let yaml = '';

  if (indent === 0) {
    yaml += '# Policy Tree Data\n';
    yaml += `version: "1.0"\n`;
    yaml += `createdAt: "${new Date().toISOString()}"\n`;
    yaml += `tree:\n`;
  }

  // 节点属性
  const fields = [
    { key: 'id', value: treeData.id },
    { key: 'name', value: treeData.name },
    { key: 'description', value: treeData.description },
    { key: 'tier', value: treeData.tier },
    { key: 'status', value: treeData.status },
    { key: 'enhancement', value: treeData.enhancement }
  ];

  fields.forEach(field => {
    if (field.value !== undefined && field.value !== null) {
      if (typeof field.value === 'string') {
        yaml += `${spaces}  ${field.key}: "${escapeYaml(field.value)}"\n`;
      } else {
        yaml += `${spaces}  ${field.key}: ${field.value}\n`;
      }
    }
  });

  // 强化配置
  if (treeData.enhancementConfig) {
    yaml += `${spaces}  enhancementConfig:\n`;
    yaml += `${spaces}    mode: ${treeData.enhancementConfig.mode}\n`;
    
    if (treeData.enhancementConfig.autoConfig) {
      yaml += `${spaces}    autoConfig:\n`;
      const auto = treeData.enhancementConfig.autoConfig;
      yaml += `${spaces}      baseValue: "${auto.baseValue}"\n`;
      yaml += `${spaces}      step: ${auto.step}\n`;
      yaml += `${spaces}      unit: "${auto.unit}"\n`;
      yaml += `${spaces}      format: "${auto.format}"\n`;
    }
    
    if (treeData.enhancementConfig.customEffects) {
      yaml += `${spaces}    customEffects:\n`;
      treeData.enhancementConfig.customEffects.forEach(effect => {
        yaml += `${spaces}      - level: ${effect.level}\n`;
        yaml += `${spaces}        description: "${escapeYaml(effect.description)}"\n`;
      });
    }
  }

  // 子节点
  if (treeData.children && treeData.children.length > 0) {
    yaml += `${spaces}  children:\n`;
    treeData.children.forEach(child => {
      yaml += `${spaces}    - `;
      const childYaml = treeToYaml(child, indent + 3);
      // 移除第一行的缩进，因为已经在 - 后面了
      yaml += childYaml.trimStart();
    });
  }

  return yaml;
}

/**
 * 解析 YAML 为树形数据
 * @param {string} yaml - YAML 字符串
 * @returns {Object} 树形数据
 */
function yamlToTree(yaml) {
  // 简单的 YAML 解析器
  const lines = yaml.split('\n');
  const stack = [{ obj: null, indent: -1 }];
  let root = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim() || line.trim().startsWith('#')) continue;

    const indent = line.search(/\S/);
    const content = line.trim();

    // 找到当前层级
    while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
      stack.pop();
    }

    const parent = stack[stack.length - 1];

    if (content.startsWith('- ')) {
      // 数组项
      const item = {};
      if (parent.obj) {
        if (!parent.obj.children) parent.obj.children = [];
        parent.obj.children.push(item);
      }
      stack.push({ obj: item, indent });
      
      // 处理同一行的属性
      const inlineContent = content.substring(2);
      if (inlineContent.includes(':')) {
        parseKeyValue(item, inlineContent);
      }
    } else if (content.includes(':')) {
      // 键值对
      const obj = parent.obj || {};
      if (!root) root = obj;
      parseKeyValue(obj, content);
      stack.push({ obj, indent });
    }
  }

  return root;
}

function parseKeyValue(obj, content) {
  const colonIndex = content.indexOf(':');
  const key = content.substring(0, colonIndex).trim();
  let value = content.substring(colonIndex + 1).trim();

  // 移除引号
  if ((value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1);
  }

  // 类型转换
  if (value === 'true') value = true;
  else if (value === 'false') value = false;
  else if (!isNaN(value) && value !== '') value = Number(value);

  obj[key] = value;
}

function escapeYaml(str) {
  if (!str) return '';
  return str.replace(/"/g, '\\"').replace(/\n/g, '\\n');
}

function formatDate(date) {
  return date.toISOString().split('T')[0];
}
