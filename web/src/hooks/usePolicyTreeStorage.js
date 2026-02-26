import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'policytree_editor_data';

export const usePolicyTreeStorage = () => {
  const [data, setData] = useState({ nodes: [], edges: [] });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setData({
          nodes: parsed.nodes || [],
          edges: parsed.edges || []
        });
      } catch (e) {
        console.error('加载数据失败:', e);
      }
    }
  }, []);

  const saveData = useCallback((newData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      ...newData,
      timestamp: new Date().toISOString()
    }));
    setData(newData);
  }, []);

  return { data, saveData };
};

export default usePolicyTreeStorage;
