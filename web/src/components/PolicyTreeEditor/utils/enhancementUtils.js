/**
 * 计算自动模式的强化效果
 * @param {Object} autoConfig - 自动模式配置
 * @param {number} level - 当前等级
 * @returns {string} 效果描述
 */
export function calculateAutoEffect(autoConfig, level) {
  if (!autoConfig) return '';
  
  const { baseValue, step, format } = autoConfig;
  
  // 尝试解析时间为数值
  const timeMatch = baseValue.match(/(\d+):(\d+)/);
  if (timeMatch) {
    // 时间格式处理
    let hours = parseInt(timeMatch[1]);
    let minutes = parseInt(timeMatch[2]);
    
    // 计算总分钟数
    let totalMinutes = hours * 60 + minutes + (step * level);
    
    // 处理跨天
    while (totalMinutes < 0) totalMinutes += 24 * 60;
    while (totalMinutes >= 24 * 60) totalMinutes -= 24 * 60;
    
    // 转换回时间格式
    const newHours = Math.floor(totalMinutes / 60);
    const newMinutes = totalMinutes % 60;
    const timeStr = `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
    
    return format.replace('{value}', timeStr);
  }
  
  // 数值格式处理
  const baseNum = parseInt(baseValue);
  if (!isNaN(baseNum)) {
    const result = baseNum + (step * level);
    return format.replace('{value}', result);
  }
  
  // 默认返回格式字符串
  return format.replace('{value}', baseValue);
}

/**
 * 获取当前等级的强化效果描述
 * @param {Object} enhancementConfig - 强化配置
 * @param {number} currentLevel - 当前等级
 * @returns {string} 效果描述
 */
export function getEnhancementEffect(enhancementConfig, currentLevel) {
  if (!enhancementConfig) return '';
  
  const { mode, autoConfig, customEffects } = enhancementConfig;
  
  if (mode === 'auto' && autoConfig) {
    return calculateAutoEffect(autoConfig, currentLevel);
  }
  
  if (mode === 'custom' && customEffects) {
    const effect = customEffects.find(e => e.level === currentLevel);
    return effect ? effect.description : '';
  }
  
  return '';
}

/**
 * 生成自动模式的预览
 * @param {Object} autoConfig - 自动模式配置
 * @param {number} maxLevel - 最大等级
 * @returns {Array} 各级效果预览
 */
export function generateAutoPreview(autoConfig, maxLevel = 5) {
  const preview = [];
  for (let i = 0; i <= maxLevel; i++) {
    preview.push({
      level: i,
      description: calculateAutoEffect(autoConfig, i)
    });
  }
  return preview;
}

/**
 * 验证自动配置
 * @param {Object} autoConfig - 自动模式配置
 * @returns {boolean} 是否有效
 */
export function validateAutoConfig(autoConfig) {
  if (!autoConfig) return false;
  const { baseValue, step, format } = autoConfig;
  return baseValue && step !== undefined && format && format.includes('{value}');
}
