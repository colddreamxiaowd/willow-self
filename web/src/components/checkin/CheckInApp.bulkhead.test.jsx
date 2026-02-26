import { render, screen } from '@testing-library/react';
import CheckInApp from './CheckInApp';
import { RUNTIME_MODE_STORAGE_KEY, RUNTIME_MODE } from '../../utils/constants';

const POLICY_TREE_STORAGE_KEY = 'policytree_editor_data';

const mockActivePolicy = {
  nodes: [
    {
      id: 'test-policy',
      type: 'ACTION',
      data: {
        name: '测试国策',
        description: '测试描述',
        resistance_score: 3,
        coupling_score: 5,
        maintenance_cost: 2,
        status: 'active'
      }
    }
  ]
};

describe('CheckInApp bulkhead in RSIP mode', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('bulkhead section is visible in training mode when policies exist', () => {
    localStorage.setItem(RUNTIME_MODE_STORAGE_KEY, RUNTIME_MODE.TRAINING);
    localStorage.setItem(POLICY_TREE_STORAGE_KEY, JSON.stringify(mockActivePolicy));
    render(<CheckInApp onViewTree={() => {}} />);
    expect(screen.getByText('触发水密隔舱')).toBeInTheDocument();
  });

  test('bulkhead entry is disabled in RSIP mode even with policies', () => {
    localStorage.setItem(RUNTIME_MODE_STORAGE_KEY, RUNTIME_MODE.RSIP);
    localStorage.setItem(POLICY_TREE_STORAGE_KEY, JSON.stringify(mockActivePolicy));
    render(<CheckInApp onViewTree={() => {}} />);
    expect(screen.queryByText('触发水密隔舱')).not.toBeInTheDocument();
  });
});
