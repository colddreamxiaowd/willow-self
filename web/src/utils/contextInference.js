// web/src/utils/contextInference.js

const TIME_PERIODS = {
  EARLY_MORNING: { start: 6, end: 8, label: '刚起床', key: 'morning_waking' },
  MORNING: { start: 8, end: 12, label: '上午工作/学习', key: 'morning_working' },
  LUNCH: { start: 12, end: 14, label: '午休时间', key: 'lunch' },
  AFTERNOON: { start: 14, end: 18, label: '下午工作/学习', key: 'afternoon_working' },
  DINNER: { start: 18, end: 20, label: '晚饭时间', key: 'dinner' },
  EVENING: { start: 20, end: 23, label: '晚间时间', key: 'evening_resting' },
  NIGHT: { start: 23, end: 6, label: '深夜', key: 'night_sleeping' }
};

export function inferContextFromTime(date = new Date()) {
  const hour = date.getHours();
  
  for (const [name, period] of Object.entries(TIME_PERIODS)) {
    if (period.start < period.end) {
      if (hour >= period.start && hour < period.end) {
        return {
          timeOfDay: name.toLowerCase(),
          activityType: period.key,
          label: period.label
        };
      }
    } else {
      if (hour >= period.start || hour < period.end) {
        return {
          timeOfDay: name.toLowerCase(),
          activityType: period.key,
          label: period.label
        };
      }
    }
  }
  
  return {
    timeOfDay: 'unknown',
    activityType: 'unknown',
    label: '未知'
  };
}

export function getContextLabel(contextKey) {
  const labels = {
    'morning_waking': '早上刚起床',
    'morning_working': '上午工作/学习',
    'lunch': '午休时间',
    'afternoon_working': '下午工作/学习',
    'dinner': '晚饭时间',
    'evening_resting': '晚间休息',
    'night_sleeping': '深夜'
  };
  return labels[contextKey] || contextKey;
}

export function createContextKey(context) {
  if (!context) return 'unknown';
  return `${context.timeOfDay || 'unknown'}_${context.activityType || 'unknown'}`;
}

export const TIME_PERIODS_LIST = TIME_PERIODS;

// 最后更新时间: 2026-02-23 11:00
// 编辑人: Trae AI
