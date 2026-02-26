import { detectSteadyState, STEADY_STATE } from './steadyStateAnalysis';

describe('steadyStateAnalysis RSIP language', () => {
  const createHistory = (days, executedDays) => {
    return Array(days).fill(null).map((_, i) => ({
      timestamp: new Date(Date.now() - i * 86400000).toISOString(),
      executed: i < executedDays
    }));
  };

  test('training mode uses encouraging language', () => {
    const history = createHistory(21, 21);
    const result = detectSteadyState(history, { mode: 'training' });
    expect(result.message).toMatch(/太棒了|继续保持|加油/);
  });

  test('RSIP mode uses cold technical language', () => {
    const history = createHistory(21, 21);
    const result = detectSteadyState(history, { mode: 'rsip' });
    expect(result.message).not.toMatch(/太棒了|继续保持|加油|坚持/);
    expect(result.message).toMatch(/趋势|波动率|维持/);
  });

  test('RSIP declining message is technical', () => {
    const history = [];
    for (let i = 0; i < 21; i++) {
      history.push({
        timestamp: new Date(Date.now() - i * 86400000).toISOString(),
        executed: i < 14 ? true : false
      });
    }
    const result = detectSteadyState(history, { mode: 'rsip' });
    expect(result.message).not.toMatch(/太棒了|继续保持|加油|坚持/);
  });
});
