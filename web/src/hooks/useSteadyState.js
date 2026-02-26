// web/src/hooks/useSteadyState.js

import { useState, useCallback, useMemo, useEffect } from 'react';
import { detectSteadyState, generateAdjustmentSuggestions } from '../utils/steadyStateAnalysis';
import { useContextTracking } from './useContextTracking';

const STEADY_STATE_STORAGE_KEY = 'policytree_steady_state';

export function useSteadyState(policyId) {
  const { records, patterns: contextPatterns } = useContextTracking(policyId);
  
  const [steadyStateData, setSteadyStateData] = useState(() => {
    try {
      const saved = localStorage.getItem(STEADY_STATE_STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        return data[policyId] || null;
      }
    } catch (error) {
      console.error('加载稳态数据失败:', error);
    }
    return null;
  });

  const executionHistory = useMemo(() => {
    return records.map(r => ({
      timestamp: r.timestamp,
      executed: r.executed
    }));
  }, [records]);

  const steadyStateResult = useMemo(() => {
    return detectSteadyState(executionHistory);
  }, [executionHistory]);

  const suggestions = useMemo(() => {
    return generateAdjustmentSuggestions(steadyStateResult, contextPatterns);
  }, [steadyStateResult, contextPatterns]);

  useEffect(() => {
    const data = {
      state: steadyStateResult.state,
      recentRate: steadyStateResult.recentRate,
      volatility: steadyStateResult.volatility,
      lastUpdated: new Date().toISOString()
    };
    
    try {
      const saved = localStorage.getItem(STEADY_STATE_STORAGE_KEY);
      const allData = saved ? JSON.parse(saved) : {};
      allData[policyId] = data;
      localStorage.setItem(STEADY_STATE_STORAGE_KEY, JSON.stringify(allData));
      setSteadyStateData(data);
    } catch (error) {
      console.error('保存稳态数据失败:', error);
    }
  }, [policyId, steadyStateResult]);

  const getMetrics = useCallback((days = 30) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    
    const recentRecords = records.filter(r => 
      new Date(r.timestamp) >= cutoff
    );
    
    const executed = recentRecords.filter(r => r.executed).length;
    const total = recentRecords.length;
    
    return {
      total,
      executed,
      rate: total > 0 ? executed / total : 0,
      period: days
    };
  }, [records]);

  return {
    steadyState: steadyStateResult,
    suggestions,
    contextPatterns,
    getMetrics,
    records
  };
}

export default useSteadyState;

// 最后更新时间: 2026-02-23 11:30
// 编辑人: Trae AI
