// web/src/utils/contextInference.test.js

import { inferContextFromTime, getContextLabel, createContextKey } from './contextInference';

describe('contextInference', () => {
  test('should infer morning waking context at 7am', () => {
    const date = new Date('2026-02-23T07:00:00');
    const context = inferContextFromTime(date);
    expect(context.activityType).toBe('morning_waking');
    expect(context.label).toBe('刚起床');
  });

  test('should infer morning working context at 10am', () => {
    const date = new Date('2026-02-23T10:00:00');
    const context = inferContextFromTime(date);
    expect(context.activityType).toBe('morning_working');
  });

  test('should infer night sleeping context at 2am', () => {
    const date = new Date('2026-02-23T02:00:00');
    const context = inferContextFromTime(date);
    expect(context.activityType).toBe('night_sleeping');
  });

  test('should return correct label for context key', () => {
    expect(getContextLabel('morning_waking')).toBe('早上刚起床');
    expect(getContextLabel('unknown')).toBe('unknown');
  });

  test('should create context key correctly', () => {
    const context = { timeOfDay: 'morning', activityType: 'waking' };
    expect(createContextKey(context)).toBe('morning_waking');
  });
});

// 最后更新时间: 2026-02-23 11:00
// 编辑人: Trae AI
