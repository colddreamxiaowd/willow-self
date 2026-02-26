import { applyCheckInLock } from './useCheckIn';

describe('applyCheckInLock', () => {
  const today = '2026-02-23';
  const policyId = 'test-policy';

  test('allows first check-in in RSIP mode', () => {
    const prevData = { checkIns: {} };
    const result = applyCheckInLock(prevData, today, policyId, 'completed', 'rsip');
    expect(result.checkIns[today][policyId].status).toBe('completed');
  });

  test('blocks second check-in on same day in RSIP mode', () => {
    const prevData = {
      checkIns: {
        [today]: {
          [policyId]: { status: 'completed', timestamp: '2026-02-23T10:00:00Z' }
        }
      }
    };
    const result = applyCheckInLock(prevData, today, policyId, 'failed', 'rsip');
    expect(result.checkIns[today][policyId].status).toBe('completed');
  });

  test('allows second check-in in training mode', () => {
    const prevData = {
      checkIns: {
        [today]: {
          [policyId]: { status: 'completed', timestamp: '2026-02-23T10:00:00Z' }
        }
      }
    };
    const result = applyCheckInLock(prevData, today, policyId, 'failed', 'training');
    expect(result.checkIns[today][policyId].status).toBe('failed');
  });
});
