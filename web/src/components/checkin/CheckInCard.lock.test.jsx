import { render, screen } from '@testing-library/react';
import CheckInCard from './CheckInCard';

describe('CheckInCard RSIP lock', () => {
  const policy = {
    id: 'test-policy',
    data: {
      name: '测试国策',
      description: '测试描述'
    }
  };

  const stats = {
    enhancement: 2,
    consecutiveDays: 5,
    totalDays: 10,
    successDays: 8,
    successRate: 80
  };

  test('buttons are enabled in training mode without check-in', () => {
    render(
      <CheckInCard
        policy={policy}
        todayCheckIn={null}
        stats={stats}
        onCheckIn={() => {}}
        mode="training"
      />
    );
    expect(screen.getByText('✓ 完成')).not.toBeDisabled();
    expect(screen.getByText('部分')).not.toBeDisabled();
    expect(screen.getByText('失败')).not.toBeDisabled();
  });

  test('buttons are disabled in RSIP mode with existing check-in', () => {
    render(
      <CheckInCard
        policy={policy}
        todayCheckIn={{ status: 'completed', timestamp: '2026-02-23T10:00:00Z' }}
        stats={stats}
        onCheckIn={() => {}}
        mode="rsip"
      />
    );
    expect(screen.getByText('✓ 完成')).toBeDisabled();
    expect(screen.getByText('部分')).toBeDisabled();
    expect(screen.getByText('失败')).toBeDisabled();
  });

  test('buttons are enabled in RSIP mode without check-in', () => {
    render(
      <CheckInCard
        policy={policy}
        todayCheckIn={null}
        stats={stats}
        onCheckIn={() => {}}
        mode="rsip"
      />
    );
    expect(screen.getByText('✓ 完成')).not.toBeDisabled();
  });
});
