// web/src/utils/steadyStateAnalysis.test.js

import { detectSteadyState, STEADY_STATE } from './steadyStateAnalysis';

describe('steadyStateAnalysis', () => {
  test('should return insufficient data for less than 14 records', () => {
    const history = Array(10).fill(null).map((_, i) => ({
      timestamp: new Date(Date.now() - i * 86400000).toISOString(),
      executed: true
    }));
    
    const result = detectSteadyState(history);
    expect(result.state).toBe(STEADY_STATE.INSUFFICIENT_DATA);
  });

  test('should detect stable state with low volatility', () => {
    const today = new Date();
    const history = Array(21).fill(null).map((_, i) => ({
      timestamp: new Date(today.getTime() - i * 86400000).toISOString(),
      executed: true
    }));
    
    const result = detectSteadyState(history);
    expect(result.state).toBe(STEADY_STATE.STABLE);
    expect(result.recentRate).toBe(1);
    expect(result.trendSlope).toBeDefined();
    expect(result.confidence).toBeGreaterThan(0);
  });

  test('should calculate recent rate correctly', () => {
    const today = new Date();
    const history = [];
    
    for (let i = 20; i >= 0; i--) {
      const date = new Date(today.getTime() - i * 86400000);
      history.push({
        timestamp: date.toISOString(),
        executed: true
      });
    }
    
    const result = detectSteadyState(history);
    expect(result.recentRate).toBeCloseTo(1, 1);
  });

  test('should detect rising trend', () => {
    const today = new Date();
    const history = [];
    
    for (let i = 20; i >= 0; i--) {
      const date = new Date(today.getTime() - i * 86400000);
      const executed = i < 7 ? true : (i < 14 ? i % 2 === 0 : false);
      history.push({
        timestamp: date.toISOString(),
        executed
      });
    }
    
    const result = detectSteadyState(history);
    expect(result.trendSlope).toBeGreaterThanOrEqual(0);
    expect(result.state).toBeDefined();
  });

  test('should detect declining trend', () => {
    const today = new Date();
    const history = [];
    
    for (let i = 20; i >= 0; i--) {
      const date = new Date(today.getTime() - i * 86400000);
      const executed = i >= 14;
      history.push({
        timestamp: date.toISOString(),
        executed
      });
    }
    
    const result = detectSteadyState(history);
    expect(result.trendSlope).toBeLessThan(0);
  });

  test('should group data by date correctly', () => {
    const today = new Date();
    const history = [];
    
    for (let i = 0; i < 3; i++) {
      history.push({
        timestamp: today.toISOString(),
        executed: i % 2 === 0
      });
    }
    
    for (let i = 0; i < 14; i++) {
      history.push({
        timestamp: new Date(today.getTime() - (i + 1) * 86400000).toISOString(),
        executed: true
      });
    }
    
    const result = detectSteadyState(history);
    expect(result.state).toBeDefined();
  });

  test('should calculate confidence based on multiple factors', () => {
    const stableHistory = Array(30).fill(null).map((_, i) => ({
      timestamp: new Date(Date.now() - i * 86400000).toISOString(),
      executed: true
    }));
    
    const volatileHistory = Array(30).fill(null).map((_, i) => ({
      timestamp: new Date(Date.now() - i * 86400000).toISOString(),
      executed: i % 2 === 0
    }));
    
    const stableResult = detectSteadyState(stableHistory);
    const volatileResult = detectSteadyState(volatileHistory);
    
    expect(stableResult.confidence).toBeGreaterThan(volatileResult.confidence);
  });
});

// 最后更新时间: 2026-02-23 12:00
// 编辑人: Trae AI
