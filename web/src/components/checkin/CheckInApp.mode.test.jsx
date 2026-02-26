import { render, screen, fireEvent } from '@testing-library/react';
import CheckInApp from './CheckInApp';
import { RUNTIME_MODE_STORAGE_KEY, RUNTIME_MODE } from '../../utils/constants';

describe('CheckInApp mode switching', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('shows RSIP entry in training mode', () => {
    localStorage.setItem(RUNTIME_MODE_STORAGE_KEY, RUNTIME_MODE.TRAINING);
    render(<CheckInApp onViewTree={() => {}} />);
    expect(screen.getByText(/进入RSIP/i)).toBeInTheDocument();
  });

  test('does not show RSIP entry in RSIP mode', () => {
    localStorage.setItem(RUNTIME_MODE_STORAGE_KEY, RUNTIME_MODE.RSIP);
    render(<CheckInApp onViewTree={() => {}} />);
    expect(screen.queryByText(/进入RSIP/i)).not.toBeInTheDocument();
  });

  test('switching to RSIP is irreversible after confirmation', () => {
    localStorage.setItem(RUNTIME_MODE_STORAGE_KEY, RUNTIME_MODE.TRAINING);
    render(<CheckInApp onViewTree={() => {}} />);
    
    const rsipButton = screen.getByText(/进入RSIP/i);
    fireEvent.click(rsipButton);
    
    const confirmButton = screen.getByText(/确认切换/i);
    fireEvent.click(confirmButton);
    
    expect(screen.queryByText(/进入RSIP/i)).not.toBeInTheDocument();
    expect(localStorage.getItem(RUNTIME_MODE_STORAGE_KEY)).toBe(RUNTIME_MODE.RSIP);
  });
});
