/**
 * 错误处理工具
 * 提供全局错误捕获和处理
 */

import { toast } from 'react-toastify';

/**
 * 全局错误处理器
 */
export const setupErrorHandler = () => {
  // 捕获未处理的 Promise 错误
  window.addEventListener('unhandledrejection', (event) => {
    console.error('未处理的 Promise 错误:', event.reason);
    toast.error('操作失败，请重试');
    event.preventDefault();
  });

  // 捕获全局错误
  window.addEventListener('error', (event) => {
    console.error('全局错误:', event.error);
    
    // 忽略 React Flow 的警告
    if (event.message && event.message.includes('react-flow')) {
      return;
    }
    
    toast.error('发生错误，请刷新页面重试');
    event.preventDefault();
  });
};

/**
 * 包装异步函数，自动处理错误
 */
export const withErrorHandler = (fn, errorMessage = '操作失败') => {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      console.error(errorMessage, error);
      toast.error(`${errorMessage}: ${error.message}`);
      throw error;
    }
  };
};

/**
 * 安全解析 JSON
 */
export const safeJSONParse = (str, defaultValue = null) => {
  try {
    return JSON.parse(str);
  } catch (error) {
    console.warn('JSON 解析失败:', error);
    return defaultValue;
  }
};

/**
 * 安全获取 localStorage
 */
export const safeGetStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? safeJSONParse(item, defaultValue) : defaultValue;
  } catch (error) {
    console.warn(`获取 localStorage[${key}] 失败:`, error);
    return defaultValue;
  }
};

/**
 * 安全设置 localStorage
 */
export const safeSetStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`设置 localStorage[${key}] 失败:`, error);
    
    if (error.name === 'QuotaExceededError') {
      toast.error('存储空间不足，请导出数据后清理');
    } else {
      toast.error('保存失败，请重试');
    }
    
    return false;
  }
};

// 最后更新时间: 2026-02-25 16:00
// 编辑人: Trae AI
