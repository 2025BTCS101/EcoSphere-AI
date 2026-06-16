import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from './header';
import { useEco } from '../context/EcoContext';

vi.mock('../context/EcoContext', () => ({
  useEco: vi.fn(),
}));

describe('Header Component', () => {
  const mockResetData = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correct title for dashboard view in Sandbox Mode', () => {
    useEco.mockReturnValue({
      apiKey: '',
      resetData: mockResetData,
    });

    render(<Header currentView="dashboard" />);

    expect(screen.getByText('Analytics Dashboard')).toBeDefined();
    expect(screen.getByText('Sandbox Mode (Simulated AI)')).toBeDefined();
  });

  it('renders correct title for coach view in Cloud Mode', () => {
    useEco.mockReturnValue({
      apiKey: 'test-api-key',
      resetData: mockResetData,
    });

    render(<Header currentView="coach" />);

    expect(screen.getByText('AI Sustainability Coach')).toBeDefined();
    expect(screen.getByText('Cloud Mode (Gemini Active)')).toBeDefined();
  });

  it('confirms and calls resetData on reset button click', () => {
    useEco.mockReturnValue({
      apiKey: '',
      resetData: mockResetData,
    });

    const confirmSpy = vi.spyOn(window, 'confirm');
    
    // Test case 1: User cancels reset confirmation
    confirmSpy.mockReturnValue(false);
    render(<Header currentView="settings" />);
    
    const resetBtn = screen.getByLabelText('Reset application data');
    fireEvent.click(resetBtn);
    expect(mockResetData).not.toHaveBeenCalled();

    // Test case 2: User confirms reset
    confirmSpy.mockReturnValue(true);
    // Mock page reload to prevent Vitest from throwing
    const reloadSpy = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: reloadSpy },
      writable: true
    });

    fireEvent.click(resetBtn);
    expect(mockResetData).toHaveBeenCalledTimes(1);
    expect(reloadSpy).toHaveBeenCalledTimes(1);
    
    confirmSpy.mockRestore();
  });
});
