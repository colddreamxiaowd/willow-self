import { useEffect, useCallback } from 'react';

const SHORTCUTS = {
  'ctrl+s': 'save',
  'ctrl+o': 'load',
  'ctrl+z': 'undo',
  'ctrl+y': 'redo',
  'delete': 'deleteSelected',
  'backspace': 'deleteSelected',
  'escape': 'cancel',
  'enter': 'startRSIP',
  'n': 'addPredecessor',
  'i': 'toggleIntervention',
  'd': 'showDiscount',
  't': 'startThoughtExperiment',
  'f': 'fitView',
  '.': 'fitSelected',
};

export function useKeyboardShortcuts(handlers) {
  const handleKeyDown = useCallback((event) => {
    const key = [
      event.ctrlKey && 'ctrl',
      event.shiftKey && 'shift',
      event.altKey && 'alt',
      event.key.toLowerCase(),
    ].filter(Boolean).join('+');

    const action = SHORTCUTS[key];
    
    if (action && handlers[action]) {
      event.preventDefault();
      handlers[action]();
    }
  }, [handlers]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

export default useKeyboardShortcuts;

// 最后更新时间: 2026-02-22 14:25
// 编辑人: Trae AI
// 用途: 节点编辑器快捷键 Hook，支持保存、加载、撤销、重做等操作
