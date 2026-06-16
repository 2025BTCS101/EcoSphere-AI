import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from './sidebar';
import { useEco } from '../context/EcoContext';

vi.mock('../context/EcoContext', () => ({
  useEco: vi.fn(),
}));

describe('Sidebar Component', () => {
  it('renders brand layout and navigation items correctly', () => {
    useEco.mockReturnValue({
      ecoScore: 650,
      getEcoRank: () => ({ title: 'Climate Guardian', color: 'mock-color' }),
    });

    const setViewMock = vi.fn();
    render(<Sidebar currentView="dashboard" setView={setViewMock} />);

    // Brand and logo check
    expect(screen.getByText('EcoSphere')).toBeDefined();
    expect(screen.getByText('Climate Guardian')).toBeDefined();
    expect(screen.getByText('650/1000')).toBeDefined();

    // Nav elements check
    const dashboardBtn = screen.getByRole('tab', { name: /Dashboard/i });
    const calculatorBtn = screen.getByRole('tab', { name: /Carbon Calculator/i });
    expect(dashboardBtn).toBeDefined();
    expect(calculatorBtn).toBeDefined();

    // Active item styling validation (dashboard is active)
    expect(dashboardBtn.className).toContain('bg-brandGreen-600');
    expect(calculatorBtn.className).not.toContain('bg-brandGreen-600');

    // Click handler validation
    fireEvent.click(calculatorBtn);
    expect(setViewMock).toHaveBeenCalledWith('calculator');
  });
});
