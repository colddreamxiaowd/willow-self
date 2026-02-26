// web/src/utils/sacredSeatDetection.js

import { getContextLabel } from './contextInference';

export const SACRED_SEAT_STATUS = {
  ACTIVE: 'active',
  PAUSED: 'paused',
  CANCELLED: 'cancelled'
};

export const SACRED_SEAT_THRESHOLDS = {
  MIN_OCCURRENCES: 5,
  MIN_EXECUTION_RATE: 0.7,
  MIN_RATE_DIFFERENCE: 0.2
};

export function detectSacredSeat(records, contextPatterns) {
  if (!contextPatterns || !contextPatterns.bestCondition) {
    return null;
  }

  const { bestCondition, bestRate, contextStats } = contextPatterns;
  const stats = contextStats[bestCondition];

  if (stats.total < SACRED_SEAT_THRESHOLDS.MIN_OCCURRENCES) {
    return null;
  }

  if (bestRate < SACRED_SEAT_THRESHOLDS.MIN_EXECUTION_RATE) {
    return null;
  }

  const otherRates = Object.entries(contextStats)
    .filter(([key]) => key !== bestCondition)
    .map(([, s]) => s.executed / s.total);

  const avgOtherRate = otherRates.length > 0
    ? otherRates.reduce((a, b) => a + b, 0) / otherRates.length
    : 0;

  if (bestRate - avgOtherRate < SACRED_SEAT_THRESHOLDS.MIN_RATE_DIFFERENCE) {
    return null;
  }

  return {
    trigger: {
      type: 'activity',
      value: bestCondition,
      label: getContextLabel(bestCondition)
    },
    stats: {
      totalOccurrences: stats.total,
      executedCount: stats.executed,
      executionRate: bestRate
    },
    confidence: calculateSacredSeatConfidence(stats.total, bestRate)
  };
}

function calculateSacredSeatConfidence(occurrences, rate) {
  const occurrenceScore = Math.min(occurrences / 10, 1);
  const rateScore = rate;
  return occurrenceScore * 0.4 + rateScore * 0.6;
}

export function shouldPromptSacredSeat(existingSacredSeat, newDetection) {
  if (existingSacredSeat && existingSacredSeat.status === SACRED_SEAT_STATUS.ACTIVE) {
    return false;
  }

  return newDetection && newDetection.confidence >= 0.6;
}

// 最后更新时间: 2026-02-23 11:30
// 编辑人: Trae AI
