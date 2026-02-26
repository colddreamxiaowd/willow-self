// web/src/hooks/useContextTracking.js

import { useState, useCallback } from 'react';
import { inferContextFromTime, createContextKey } from '../utils/contextInference';

const CONTEXT_TRACKING_STORAGE_KEY = 'policytree_context_tracking';

export function useContextTracking(policyId) {
  const [trackingData, setTrackingData] = useState(() => {
    try {
      const saved = localStorage.getItem(CONTEXT_TRACKING_STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        return data[policyId] || { records: [], patterns: null };
      }
    } catch (error) {
      console.error('加载情境追踪数据失败:', error);
    }
    return { records: [], patterns: null };
  });

  const saveTrackingData = useCallback((data) => {
    try {
      const saved = localStorage.getItem(CONTEXT_TRACKING_STORAGE_KEY);
      const allData = saved ? JSON.parse(saved) : {};
      allData[policyId] = data;
      localStorage.setItem(CONTEXT_TRACKING_STORAGE_KEY, JSON.stringify(allData));
      setTrackingData(data);
    } catch (error) {
      console.error('保存情境追踪数据失败:', error);
    }
  }, [policyId]);

  const recordCheckIn = useCallback((executed = true, confirmedContext = null) => {
    const timestamp = new Date();
    const inferredContext = inferContextFromTime(timestamp);
    
    const record = {
      id: `${policyId}_${timestamp.getTime()}`,
      timestamp: timestamp.toISOString(),
      executed,
      inferredContext,
      confirmedContext,
      contextKey: createContextKey(confirmedContext || inferredContext)
    };

    const newRecords = [...trackingData.records, record];
    const patterns = analyzeContextPatterns(newRecords);
    
    saveTrackingData({ records: newRecords, patterns });
    
    return record;
  }, [policyId, trackingData.records, saveTrackingData]);

  const confirmContext = useCallback((recordId, confirmedContext) => {
    const newRecords = trackingData.records.map(r => {
      if (r.id === recordId) {
        return {
          ...r,
          confirmedContext,
          contextKey: createContextKey(confirmedContext || r.inferredContext)
        };
      }
      return r;
    });
    
    const patterns = analyzeContextPatterns(newRecords);
    saveTrackingData({ records: newRecords, patterns });
  }, [trackingData.records, saveTrackingData]);

  const getTodayRecords = useCallback(() => {
    const today = new Date().toDateString();
    return trackingData.records.filter(r => 
      new Date(r.timestamp).toDateString() === today
    );
  }, [trackingData.records]);

  const getRecentRecords = useCallback((days = 7) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return trackingData.records.filter(r => 
      new Date(r.timestamp) >= cutoff
    );
  }, [trackingData.records]);

  return {
    records: trackingData.records,
    patterns: trackingData.patterns,
    recordCheckIn,
    confirmContext,
    getTodayRecords,
    getRecentRecords
  };
}

function analyzeContextPatterns(records) {
  if (records.length < 3) return null;

  const contextStats = {};
  
  records.forEach(record => {
    const key = record.contextKey;
    if (!contextStats[key]) {
      contextStats[key] = { total: 0, executed: 0 };
    }
    contextStats[key].total++;
    if (record.executed) {
      contextStats[key].executed++;
    }
  });

  let bestCondition = null;
  let bestRate = 0;
  
  Object.entries(contextStats).forEach(([key, stats]) => {
    if (stats.total >= 3) {
      const rate = stats.executed / stats.total;
      if (rate > bestRate) {
        bestRate = rate;
        bestCondition = key;
      }
    }
  });

  return {
    contextStats,
    bestCondition,
    bestRate,
    totalRecords: records.length,
    executionRate: records.filter(r => r.executed).length / records.length
  };
}

export default useContextTracking;

// 最后更新时间: 2026-02-23 11:15
// 编辑人: Trae AI
