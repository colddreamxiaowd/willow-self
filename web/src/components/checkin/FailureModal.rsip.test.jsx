import { render, screen } from '@testing-library/react';
import FailureModal from './FailureModal';

describe('FailureModal RSIP mode', () => {
  test('shows both extinguish and release options in training mode', () => {
    render(
      <FailureModal
        isOpen
        onClose={() => {}}
        policyName="测试国策"
        enhancement={2}
        onAction={() => {}}
        mode="training"
      />
    );
    expect(screen.getByText('熄灭国策')).toBeInTheDocument();
    expect(screen.getByText('释放储备')).toBeInTheDocument();
  });

  test('RSIP mode removes release option', () => {
    render(
      <FailureModal
        isOpen
        onClose={() => {}}
        policyName="测试国策"
        enhancement={2}
        onAction={() => {}}
        mode="rsip"
        lossPreview={{ nodes: 3, days: 12 }}
      />
    );
    expect(screen.queryByText('释放储备')).not.toBeInTheDocument();
    expect(screen.getByText('熄灭国策')).toBeInTheDocument();
  });

  test('RSIP mode shows loss preview', () => {
    render(
      <FailureModal
        isOpen
        onClose={() => {}}
        policyName="测试国策"
        enhancement={2}
        onAction={() => {}}
        mode="rsip"
        lossPreview={{ nodes: 5, days: 20 }}
      />
    );
    expect(screen.getByText(/将熄灭 5 个节点/)).toBeInTheDocument();
  });
});
