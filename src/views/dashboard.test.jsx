import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Dashboard from './dashboard';
import { useEco } from '../context/EcoContext';

vi.mock('../context/EcoContext', () => ({
  useEco: vi.fn(),
}));

// Mock Recharts elements since they contain SVG rendering sizes not supported in jsdom
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div data-testid="resp-container">{children}</div>,
  AreaChart: ({ children }) => <div data-testid="area-chart">{children}</div>,
  Area: () => <div data-testid="area" />,
  XAxis: () => <div data-testid="xaxis" />,
  YAxis: () => <div data-testid="yaxis" />,
  CartesianGrid: () => <div data-testid="grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  PieChart: ({ children }) => <div data-testid="pie-chart">{children}</div>,
  Pie: () => <div data-testid="pie" />,
  Cell: () => <div data-testid="cell" />,
}));

describe('Dashboard Component', () => {
  it('renders stats, new personalized insight card, and checklist', () => {
    const mockToggleHabit = vi.fn();
    useEco.mockReturnValue({
      currentEmissions: {
        transport: 300, // Highest emission category
        electricity: 100,
        food: 50,
        shopping: 80,
        total: 530,
      },
      ecoScore: 590,
      getEcoRank: () => ({ title: 'Climate Guardian', color: 'mock-color' }),
      historicalData: [
        { month: 'Jan', transport: 290, electricity: 95, food: 50, shopping: 75, total: 510 },
      ],
      habits: [
        { id: '1', name: 'Used public transit instead of driving', points: 30, category: 'transport', completed: false },
      ],
      toggleHabit: mockToggleHabit,
      treesEquivalent: '289.6',
    });

    render(<Dashboard />);

    // Check stats cards are displayed
    expect(screen.getByText('590')).toBeDefined(); // Eco Score
    expect(screen.getByText('530')).toBeDefined(); // Total Carbon
    expect(screen.getByText('289.6')).toBeDefined(); // Trees Equivalent

    // Check the new Personalized Reduction Priority card is rendered
    expect(screen.getByText('Personalized Reduction Priority')).toBeDefined();
    // Transport is highest emissions, so we check that the UI flags Transport
    expect(screen.getAllByText('Transport')[0]).toBeDefined();
    expect(screen.getByText(/Ground commute is your largest emission sector/i)).toBeDefined();

    // Check checklist items are rendered
    const habitCheckBtn = screen.getByRole('button', { name: /Toggle habit: Used public transit/i });
    expect(habitCheckBtn).toBeDefined();

    // Trigger toggle click
    fireEvent.click(habitCheckBtn);
    expect(mockToggleHabit).toHaveBeenCalledWith('1');
  });
});
