import { getRuntimeMode, setRuntimeMode, RUNTIME_MODE } from './constants';

describe('runtime mode', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('defaults to TRAINING when unset', () => {
    expect(getRuntimeMode()).toBe(RUNTIME_MODE.TRAINING);
  });

  test('can switch to RSIP and persists', () => {
    setRuntimeMode(RUNTIME_MODE.RSIP);
    expect(getRuntimeMode()).toBe(RUNTIME_MODE.RSIP);
  });

  test('RSIP is irreversible', () => {
    setRuntimeMode(RUNTIME_MODE.RSIP);
    setRuntimeMode(RUNTIME_MODE.TRAINING);
    expect(getRuntimeMode()).toBe(RUNTIME_MODE.RSIP);
  });
});
