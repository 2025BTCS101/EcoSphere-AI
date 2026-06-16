import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Calculator from './calculator';
import { useEco } from '../context/EcoContext';

// Mock the useEco hook
vi.mock('../context/EcoContext', () => ({
  useEco: vi.fn(),
}));

describe('Calculator Component', () => {
  it('renders inputs and updates calculator value on slider change', () => {
    const mockUpdateInputs = vi.fn();
    useEco.mockReturnValue({
      calculatorInputs: {
        transportDistance: 350,
        vehicleType: 'sedan',
        flightDistance: 0,
        electricityKwh: 220,
        dietType: 'balanced',
        shoppingSpend: 150,
      },
      updateInputs: mockUpdateInputs,
      currentEmissions: {
        transport: 60,
        electricity: 105,
        food: 165,
        shopping: 18,
        total: 348,
      },
      logCurrentToHistory: vi.fn(),
      ecoScore: 676,
    });

    render(<Calculator />);

    // Check sliders are rendered
    const roadTravelSlider = screen.getByLabelText(/Monthly Road Travel/i);
    expect(roadTravelSlider).toBeDefined();
    expect(roadTravelSlider.value).toBe('350');

    // Simulate change
    fireEvent.change(roadTravelSlider, { target: { value: '500' } });
    expect(mockUpdateInputs).toHaveBeenCalledWith({ transportDistance: 500 });
  });
});
