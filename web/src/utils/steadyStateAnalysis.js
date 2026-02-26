// web/src/utils/steadyStateAnalysis.js

export const STEADY_STATE = {
  STABLE: 'stable',
  RISING: 'rising',
  DECLINING: 'declining',
  OSCILLATING: 'oscillating',
  INSUFFICIENT_DATA: 'insufficient_data'
};

export const STEADY_STATE_COLORS = {
  [STEADY_STATE.STABLE]: '#4CAF50',
  [STEADY_STATE.RISING]: '#2196F3',
  [STEADY_STATE.DECLINING]: '#F44336',
  [STEADY_STATE.OSCILLATING]: '#FF9800',
  [STEADY_STATE.INSUFFICIENT_DATA]: '#9E9E9E'
};

export const STEADY_STATE_LABELS = {
  [STEADY_STATE.STABLE]: '稳定',
  [STEADY_STATE.RISING]: '上升',
  [STEADY_STATE.DECLINING]: '下降',
  [STEADY_STATE.OSCILLATING]: '震荡',
  [STEADY_STATE.INSUFFICIENT_DATA]: '数据不足'
};

export function detectSteadyState(executionHistory, options = {}) {
  const {
    analysisWindowSize = 14,
    trendWindowSize = 7,
    minDataPoints = 14,
    mode = 'training'
  } = options;

  if (executionHistory.length < minDataPoints) {
    return {
      state: STEADY_STATE.INSUFFICIENT_DATA,
      message: mode === 'rsip' 
        ? '数据不足：需持续记录以建立基线' 
        : '数据不足，继续记录以获取分析结果',
      confidence: 0,
      recentRate: 0,
      volatility: 0
    };
  }

  const dailyRates = groupByDate(executionHistory);
  const sortedDates = Object.keys(dailyRates).sort();

  const recentDates = sortedDates.slice(-analysisWindowSize);
  const recentRates = recentDates.map(date => dailyRates[date]);
  const recentRate = recentRates.reduce((a, b) => a + b, 0) / recentRates.length;

  const trendDates = sortedDates.slice(-trendWindowSize);
  const trendRates = trendDates.map(date => dailyRates[date]);
  const trendRate = trendRates.reduce((a, b) => a + b, 0) / trendRates.length;

  const volatility = calculateVolatility(executionHistory, analysisWindowSize);
  const trendSlope = calculateTrendSlope(trendRates);
  const dynamicThreshold = calculateDynamicThreshold(recentRate, volatility, analysisWindowSize);

  let state, message;

  if (volatility < dynamicThreshold.stability) {
    state = STEADY_STATE.STABLE;
    message = generateStableMessage(recentRate, mode);
  } else if (trendSlope > dynamicThreshold.trend) {
    state = STEADY_STATE.RISING;
    message = mode === 'rsip' 
      ? '趋势为正：维持策略' 
      : '执行率正在上升，继续保持！';
  } else if (trendSlope < -dynamicThreshold.trend) {
    state = STEADY_STATE.DECLINING;
    message = mode === 'rsip' 
      ? '趋势为负：建议重整化（降级/减载）' 
      : '执行率在下降，建议检查原因并调整。';
  } else {
    state = STEADY_STATE.OSCILLATING;
    message = mode === 'rsip' 
      ? '波动率高：需识别干扰源并稳定化' 
      : '执行不稳定，建议检查触发条件或降低难度。';
  }

  return {
    state,
    trend: state === STEADY_STATE.STABLE ? 'stable' : 
           state === STEADY_STATE.RISING ? 'up' :
           state === STEADY_STATE.DECLINING ? 'down' : 'unstable',
    recentRate,
    previousRate: trendRate,
    volatility,
    trendSlope,
    message,
    confidence: calculateConfidence(executionHistory.length, volatility, trendSlope)
  };
}

function calculateVolatility(history, windowSize) {
  if (history.length < windowSize) return 1;

  const dailyRates = groupByDate(history);

  const sortedDates = Object.keys(dailyRates).sort();
  const recentRates = sortedDates.slice(-windowSize).map(date => dailyRates[date]);

  if (recentRates.length < 2) return 1;
  return calculateStandardDeviation(recentRates);
}

function groupByDate(history) {
  const dailyData = new Map();

  history.forEach(record => {
    const date = new Date(record.timestamp).toDateString();
    if (!dailyData.has(date)) {
      dailyData.set(date, { executed: 0, total: 0 });
    }
    const dayData = dailyData.get(date);
    dayData.total++;
    if (record.executed) {
      dayData.executed++;
    }
  });

  const result = {};
  dailyData.forEach((data, date) => {
    result[date] = data.total > 0 ? data.executed / data.total : 0;
  });

  return result;
}

function calculateTrendSlope(rates) {
  if (rates.length < 2) return 0;

  const n = rates.length;
  const x = rates.map((_, i) => i);
  const y = rates;

  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  return isNaN(slope) ? 0 : slope;
}

function calculateDynamicThreshold(rate, volatility, windowSize) {
  const sampleSizeFactor = Math.min(windowSize / 30, 1);
  
  const stabilityThreshold = volatility * (1.5 - sampleSizeFactor * 0.3);
  const trendThreshold = volatility * (0.5 + sampleSizeFactor * 0.2);

  return {
    stability: Math.max(stabilityThreshold, 0.05),
    trend: Math.max(trendThreshold, 0.02)
  };
}

function calculateConfidence(dataPoints, volatility, trendSlope) {
  let confidence = 0;

  const sizeConfidence = Math.min(dataPoints / 30, 1);
  const volatilityPenalty = Math.min(volatility / 0.3, 1);
  const trendStability = Math.max(1 - Math.abs(trendSlope) * 5, 0);

  confidence = sizeConfidence * 0.4 + 
              (1 - volatilityPenalty) * 0.35 + 
              trendStability * 0.25;

  return Math.max(0, Math.min(1, confidence));
}

function calculateStandardDeviation(arr) {
  const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
  const squareDiffs = arr.map(value => Math.pow(value - mean, 2));
  return Math.sqrt(squareDiffs.reduce((a, b) => a + b, 0) / arr.length);
}

function generateStableMessage(rate, mode = 'training') {
  if (mode === 'rsip') {
    if (rate >= 0.9) {
      return '波动率低：可考虑升级/扩张（取决于预算）';
    } else if (rate >= 0.7) {
      return '趋势稳定：维持当前策略';
    } else if (rate >= 0.5) {
      return '趋势稳定但执行率偏低：建议重整化';
    } else {
      return '趋势稳定但执行率过低：需重新评估策略价值';
    }
  }
  
  if (rate >= 0.9) {
    return '太棒了！你已经达到高稳态，可以考虑提高标准挑战更高目标！';
  } else if (rate >= 0.7) {
    return '稳态良好！继续保持，如果想提升可以尝试增加强化等级。';
  } else if (rate >= 0.5) {
    return '虽然稳定，但执行率还有提升空间。建议检查国策是否过于困难。';
  } else {
    return '执行率偏低。建议降低国策难度或重新评估国策价值。';
  }
}

export function generateAdjustmentSuggestions(steadyStateResult, contextPatterns) {
  const suggestions = [];

  switch (steadyStateResult.state) {
    case STEADY_STATE.STABLE:
      if (steadyStateResult.recentRate >= 0.9) {
        suggestions.push({
          type: 'upgrade',
          priority: 'high',
          message: '执行率很高，建议提高标准或增加强化等级',
          action: 'increase_enhancement'
        });
      } else if (steadyStateResult.recentRate < 0.5) {
        suggestions.push({
          type: 'downgrade',
          priority: 'high',
          message: '执行率偏低但稳定，建议降低国策难度',
          action: 'decrease_difficulty'
        });
      }
      break;

    case STEADY_STATE.DECLINING:
      suggestions.push({
        type: 'alert',
        priority: 'high',
        message: '执行率在下降，请检查是否有外部干扰',
        action: 'review_circumstances'
      });
      suggestions.push({
        type: 'adjustment',
        priority: 'medium',
        message: '考虑降低国策难度，重建稳态',
        action: 'decrease_difficulty'
      });
      break;

    case STEADY_STATE.OSCILLATING:
      suggestions.push({
        type: 'analysis',
        priority: 'medium',
        message: '执行不稳定，检查最佳执行条件',
        action: 'analyze_context_patterns'
      });
      if (contextPatterns?.bestCondition) {
        suggestions.push({
          type: 'insight',
          priority: 'high',
          message: `在"${contextPatterns.bestCondition}"时执行率最高`,
          action: 'optimize_timing'
        });
      }
      break;

    case STEADY_STATE.RISING:
      suggestions.push({
        type: 'encouragement',
        priority: 'low',
        message: '趋势良好，继续保持！',
        action: 'maintain'
      });
      break;
  }

  return suggestions;
}

// 最后更新时间: 2026-02-23 11:00
// 编辑人: Trae AI
