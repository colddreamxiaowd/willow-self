import { triggerBulkhead } from './useCheckIn';

describe('triggerBulkhead RSIP defense', () => {
  test('triggerBulkhead returns null in RSIP mode', () => {
    const result = triggerBulkhead(null, 'reason', 'rsip');
    expect(result).toBeNull();
  });

  test('triggerBulkhead works in training mode', () => {
    const prevData = { bulkheads: [] };
    const result = triggerBulkhead(prevData, 'test reason', 'training');
    expect(result.bulkheads).toHaveLength(1);
    expect(result.bulkheads[0].reason).toBe('test reason');
  });
});
