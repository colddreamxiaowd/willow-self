/**
 * 存储管理工具
 * 提供 localStorage 的增强功能，包括备份、恢复、导出、导入
 */

const STORAGE_KEYS = {
  POLICY_TREE: 'policytree_editor_data',
  CHECKIN: 'policytree_checkin_data',
  JOURNAL: 'journal-projects',
  ONBOARDING: 'policytree_onboarding_completed',
  SETTINGS: 'policytree_settings'
};

/**
 * 获取所有应用数据
 */
export const getAllData = () => {
  return {
    policyTree: JSON.parse(localStorage.getItem(STORAGE_KEYS.POLICY_TREE) || '{}'),
    checkin: JSON.parse(localStorage.getItem(STORAGE_KEYS.CHECKIN) || '{}'),
    journal: JSON.parse(localStorage.getItem(STORAGE_KEYS.JOURNAL) || '[]'),
    onboarding: localStorage.getItem(STORAGE_KEYS.ONBOARDING),
    settings: JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS) || '{}'),
    exportTime: new Date().toISOString(),
    version: '1.0.0'
  };
};

/**
 * 导出数据为 JSON 文件
 */
export const exportData = () => {
  const data = getAllData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `policytree-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  return true;
};

/**
 * 导出数据为 YAML 格式
 */
export const exportAsYAML = (treeData) => {
  const yaml = convertToYAML(treeData);
  const blob = new Blob([yaml], { type: 'text/yaml' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `policytree-${treeData.name || 'export'}.yaml`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  return true;
};

/**
 * 将数据转换为 YAML 格式
 */
const convertToYAML = (data) => {
  const { name, description, nodes = [], edges = [] } = data;
  
  let yaml = `# PolicyTree 导出\n`;
  yaml += `# 导出时间: ${new Date().toLocaleString()}\n\n`;
  yaml += `name: ${name || '未命名国策树'}\n`;
  yaml += `description: ${description || ''}\n\n`;
  yaml += `policies:\n`;
  
  nodes.forEach(node => {
    yaml += `  - id: ${node.id}\n`;
    yaml += `    name: ${node.data?.name || ''}\n`;
    yaml += `    description: ${node.data?.description || ''}\n`;
    yaml += `    tier: ${node.data?.tier || 0}\n`;
    yaml += `    status: ${node.data?.status || 'inactive'}\n`;
    yaml += `    parentId: ${node.data?.parentId || 'null'}\n`;
    yaml += `    enhancement: ${node.data?.enhancement || 0}\n`;
    yaml += `    position:\n`;
    yaml += `      x: ${node.position?.x || 0}\n`;
    yaml += `      y: ${node.position?.y || 0}\n`;
  });
  
  return yaml;
};

/**
 * 导入数据
 */
export const importData = (jsonData) => {
  try {
    const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
    
    if (data.policyTree) {
      localStorage.setItem(STORAGE_KEYS.POLICY_TREE, JSON.stringify(data.policyTree));
    }
    if (data.checkin) {
      localStorage.setItem(STORAGE_KEYS.CHECKIN, JSON.stringify(data.checkin));
    }
    if (data.journal) {
      localStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(data.journal));
    }
    if (data.settings) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings));
    }
    
    return { success: true, message: '数据导入成功' };
  } catch (error) {
    return { success: false, message: `导入失败: ${error.message}` };
  }
};

/**
 * 创建自动备份
 */
export const createAutoBackup = () => {
  const data = getAllData();
  const backups = JSON.parse(localStorage.getItem('policytree_backups') || '[]');
  
  // 只保留最近10个备份
  if (backups.length >= 10) {
    backups.shift();
  }
  
  backups.push({
    data,
    timestamp: new Date().toISOString(),
    id: Date.now()
  });
  
  localStorage.setItem('policytree_backups', JSON.stringify(backups));
  return true;
};

/**
 * 获取所有备份
 */
export const getBackups = () => {
  return JSON.parse(localStorage.getItem('policytree_backups') || '[]');
};

/**
 * 恢复到指定备份
 */
export const restoreBackup = (backupId) => {
  const backups = getBackups();
  const backup = backups.find(b => b.id === backupId);
  
  if (!backup) {
    return { success: false, message: '备份不存在' };
  }
  
  return importData(backup.data);
};

/**
 * 清空所有数据
 */
export const clearAllData = () => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
  return true;
};

/**
 * 检查存储空间
 */
export const checkStorage = () => {
  let total = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length * 2; // UTF-16 编码
    }
  }
  
  const limit = 5 * 1024 * 1024; // 5MB 限制
  const used = (total / 1024 / 1024).toFixed(2);
  const percent = ((total / limit) * 100).toFixed(1);
  
  return {
    used: `${used} MB`,
    limit: '5 MB',
    percent: `${percent}%`,
    isWarning: percent > 80
  };
};

export { STORAGE_KEYS };

// 最后更新时间: 2026-02-25 16:00
// 编辑人: Trae AI
// 功能说明: 存储管理工具，提供备份、恢复、导出、导入功能
