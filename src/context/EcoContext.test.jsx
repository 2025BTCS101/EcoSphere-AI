import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { EcoProvider, useEco } from './EcoContext';

beforeAll(() => {
  const store = {};
  const mockLocalStorage = {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = String(value); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { Object.keys(store).forEach(key => delete store[key]); }
  };
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    writable: true
  });
  global.localStorage = mockLocalStorage;
});

beforeEach(() => {
  localStorage.clear();
});

const TestComponent = () => {
  const { currentEmissions, ecoScore, updateInputs, toggleHabit } = useEco();
  return (
    <div>
      <div data-testid="transport">{currentEmissions.transport}</div>
      <div data-testid="electricity">{currentEmissions.electricity}</div>
      <div data-testid="food">{currentEmissions.food}</div>
      <div data-testid="shopping">{currentEmissions.shopping}</div>
      <div data-testid="total">{currentEmissions.total}</div>
      <div data-testid="score">{ecoScore}</div>
      <button data-testid="update-btn" onClick={() => updateInputs({ transportDistance: 1000 })}>
        Update Transport
      </button>
      <button data-testid="toggle-habit" onClick={() => toggleHabit('1')}>
        Toggle Habit
      </button>
    </div>
  );
};

describe('EcoContext Calculations', () => {
  it('provides correct default calculations', () => {
    render(
      <EcoProvider>
        <TestComponent />
      </EcoProvider>
    );

    // Default calculations:
    // transport: 350 * 0.17 (sedan) = 59.5 => Math.round() = 60
    // electricity: 220 * 0.475 = 104.5 => Math.round() = 105
    // food: balanced (5.5) * 30 = 165
    // shopping: 150 * 0.12 = 18
    // total: 60 + 105 + 165 + 18 = 348
    // base points: 850
    // penalty: 348 * 0.5 = 174
    // score: Math.round(850 - 174) = 676
    expect(screen.getByTestId('transport').textContent).toBe('60');
    expect(screen.getByTestId('electricity').textContent).toBe('105');
    expect(screen.getByTestId('food').textContent).toBe('165');
    expect(screen.getByTestId('shopping').textContent).toBe('18');
    expect(screen.getByTestId('total').textContent).toBe('348');
    expect(screen.getByTestId('score').textContent).toBe('676');
  });

  it('updates emissions and score correctly when inputs change', () => {
    render(
      <EcoProvider>
        <TestComponent />
      </EcoProvider>
    );

    const updateBtn = screen.getByTestId('update-btn');
    act(() => {
      updateBtn.click();
    });

    // transport becomes 1000 * 0.17 = 170.
    // other fields stay same.
    // total: 170 + 105 + 165 + 18 = 458
    // penalty: 458 * 0.5 = 229
    // score: Math.round(850 - 229) = 621
    expect(screen.getByTestId('transport').textContent).toBe('170');
    expect(screen.getByTestId('total').textContent).toBe('458');
    expect(screen.getByTestId('score').textContent).toBe('621');
  });

  it('updates score correctly when a habit is toggled', () => {
    render(
      <EcoProvider>
        <TestComponent />
      </EcoProvider>
    );

    const toggleBtn = screen.getByTestId('toggle-habit');
    act(() => {
      toggleBtn.click();
    });

    // Default calculations: total emissions = 348, penalty = 174
    // Habit 1 is worth 30 points.
    // score: Math.round(850 - 174 + 30) = 706
    expect(screen.getByTestId('score').textContent).toBe('706');
  });
});
