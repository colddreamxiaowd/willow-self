/**
 * YAML 验证和清理工具函数
 * 包含输入验证、节点验证、数据清理等安全相关功能
 */

// 安全限制常量
export const VALIDATION_LIMITS = {
  MAX_YAML_SIZE: 1024 * 1024, // 1MB
  MAX_TREE_DEPTH: 20,
  MAX_CHILDREN_PER_NODE: 50,
  MAX_ID_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500,
  SCORE_MIN: 1,
  SCORE_MAX: 10
};

export const VALID_TYPES = ['ROOT', 'GOAL', 'ACTION', 'MILESTONE'];

/**
 * 验证单个节点结构
 * @param {Object} node - 节点对象
 * @param {number} depth - 当前深度
 * @returns {string[]} 错误信息数组
 */
export function validateNode(node, depth = 0) {
  const errors = [];
  const { MAX_TREE_DEPTH, MAX_CHILDREN_PER_NODE, MAX_ID_LENGTH, MAX_DESCRIPTION_LENGTH, SCORE_MIN, SCORE_MAX } = VALIDATION_LIMITS;

  if (depth > MAX_TREE_DEPTH) {
    errors.push(`树深度超过最大限制 (${MAX_TREE_DEPTH})`);
    return errors;
  }

  // 必需字段验证
  if (!node.id || typeof node.id !== 'string') {
    errors.push('节点必须包含有效的 id 字段');
  } else if (node.id.length > MAX_ID_LENGTH) {
    errors.push(`id 字段长度不能超过 ${MAX_ID_LENGTH} 字符`);
  }

  if (!node.description || typeof node.description !== 'string') {
    errors.push('节点必须包含有效的 description 字段');
  } else if (node.description.length > MAX_DESCRIPTION_LENGTH) {
    errors.push(`description 字段长度不能超过 ${MAX_DESCRIPTION_LENGTH} 字符`);
  }

  // 类型验证
  if (node.type && !VALID_TYPES.includes(node.type)) {
    errors.push(`type 必须是以下值之一: ${VALID_TYPES.join(', ')}`);
  }

  // 评分范围验证
  const scoreFields = ['resistance_score', 'coupling_score', 'maintenance_cost', 'impact'];
  scoreFields.forEach(field => {
    if (node[field] !== undefined) {
      const value = Number(node[field]);
      if (isNaN(value)) {
        errors.push(`${field} 必须是数字`);
      } else if (value < SCORE_MIN || value > SCORE_MAX) {
        errors.push(`${field} 必须在 ${SCORE_MIN}-${SCORE_MAX} 之间`);
      }
    }
  });

  // 递归验证子节点
  if (node.children && Array.isArray(node.children)) {
    if (node.children.length > MAX_CHILDREN_PER_NODE) {
      errors.push(`每个节点的子节点数量不能超过 ${MAX_CHILDREN_PER_NODE}`);
    }

    node.children.forEach((child, index) => {
      const childErrors = validateNode(child, depth + 1);
      childErrors.forEach(err => {
        errors.push(`子节点[${index}]: ${err}`);
      });
    });
  }

  return errors;
}

/**
 * 清理字符串输入（防止 XSS）
 * @param {string} str - 输入字符串
 * @returns {string} 清理后的字符串
 */
export function sanitizeString(str) {
  if (typeof str !== 'string') return str;

  // XSS 危险模式检测 - 如果检测到危险模式，返回空字符串
  const dangerousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /data:/gi,
    /vbscript:/gi
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(str)) {
      return '';
    }
  }

  return str;
}

/**
 * 深度清理对象
 * @param {*} obj - 输入对象
 * @returns {*} 清理后的对象
 */
export function sanitizeObject(obj) {
  if (obj === null || typeof obj !== 'object') {
    return typeof obj === 'string' ? sanitizeString(obj) : obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }

  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    const sanitizedKey = sanitizeString(key);
    sanitized[sanitizedKey] = sanitizeObject(value);
  }

  return sanitized;
}

/**
 * 验证 YAML 内容大小
 * @param {string} content - YAML 内容
 * @returns {boolean} 是否通过验证
 */
export function validateYamlSize(content) {
  return content.length <= VALIDATION_LIMITS.MAX_YAML_SIZE;
}

/**
 * 验证解析后的树数据
 * @param {Object} treeData - 解析后的树数据
 * @returns {Object} { isValid: boolean, errors: string[] }
 */
export function validateTreeData(treeData) {
  if (!treeData || typeof treeData !== 'object') {
    return { isValid: false, errors: ['数据为空或格式不正确'] };
  }

  if (!treeData.id) {
    return { isValid: false, errors: ['YAML 必须包含 id 字段'] };
  }

  if (!treeData.description) {
    return { isValid: false, errors: ['YAML 必须包含 description 字段'] };
  }

  const validationErrors = validateNode(treeData);

  if (validationErrors.length > 0) {
    return { isValid: false, errors: validationErrors };
  }

  return { isValid: true, errors: [] };
}

// 最后更新时间: 2026-02-23 10:30
// 编辑人: Trae AI
// 修复内容:
// 1. sanitizeString 函数：检测到 XSS 危险模式时返回空字符串，而非仅移除模式
// 2. 增加更多危险模式检测：data:, vbscript:
