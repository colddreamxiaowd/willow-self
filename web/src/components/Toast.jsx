import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AlertTriangle, Info, CheckCircle, X } from 'lucide-react';
import './Toast.css';

// Toast 上下文
const ToastContext = createContext(null);

// Toast 类型配置
const TOAST_CONFIG = {
  warning: {
    icon: AlertTriangle,
    className: 'toast-warning',
    duration: 8000 // 警告类消息显示更长时间
  },
  info: {
    icon: Info,
    className: 'toast-info',
    duration: 5000
  },
  success: {
    icon: CheckCircle,
    className: 'toast-success',
    duration: 3000
  }
};

// 单个 Toast 组件
const ToastItem = ({ id, type, message, onClose }) => {
  const config = TOAST_CONFIG[type] || TOAST_CONFIG.info;
  const IconComponent = config.icon;

  useEffect(() => {
    if (config.duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, config.duration);
      return () => clearTimeout(timer);
    }
  }, [id, config.duration, onClose]);

  return (
    <div className={`toast-item ${config.className}`}>
      <IconComponent size={20} className="toast-icon" />
      <div className="toast-message">{message}</div>
      <button 
        className="toast-close" 
        onClick={() => onClose(id)}
        aria-label="关闭"
      >
        <X size={16} />
      </button>
    </div>
  );
};

// Toast 容器组件
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, message) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, type, message }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // 便捷方法
  const toast = {
    warning: (message) => addToast('warning', message),
    info: (message) => addToast('info', message),
    success: (message) => addToast('success', message)
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toast-container">
        {toasts.map(toast => (
          <ToastItem
            key={toast.id}
            {...toast}
            onClose={removeToast}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// Hook 用于在组件中使用 Toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// 最后更新时间: 2026-02-21 14:35
// 编辑人: Performance-Optimization-Specialist
// 功能说明: 非阻塞式 Toast 通知组件，替代 alert 提升用户体验
