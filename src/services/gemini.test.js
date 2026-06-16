import { describe, it, expect, vi } from 'vitest';
import { getSustainabilityAdvice, getCarbonPredictionInsights } from './gemini';

describe('Gemini Service Fallback Engine', () => {
  const mockEmissions = {
    transport: 150,
    electricity: 120,
    food: 165,
    shopping: 30,
    total: 465,
  };

  it('provides appropriate simulated advice when Transport keywords are queried', async () => {
    const result = await getSustainabilityAdvice('', [{ text: 'How do I optimize transport?' }], mockEmissions);
    expect(result).toContain('transport emissions');
    expect(result).toContain('Optimize Commuting');
  });

  it('provides appropriate simulated advice when Diet keywords are queried', async () => {
    const result = await getSustainabilityAdvice('', [{ text: 'Give me food tips' }], mockEmissions);
    expect(result).toContain('dietary emissions');
    expect(result).toContain('Reduce Red Meat');
  });

  it('provides appropriate simulated advice when Electricity keywords are queried', async () => {
    const result = await getSustainabilityAdvice('', [{ text: 'How to save energy?' }], mockEmissions);
    expect(result).toContain('electricity impact');
    expect(result).toContain('LED Transition');
  });

  it('provides general diagnostic recommendations when no key terms match', async () => {
    const result = await getSustainabilityAdvice('', [{ text: 'Hello coach' }], mockEmissions);
    expect(result).toContain('total carbon footprint');
    expect(result).toContain('trees');
  });

  it('provides carbon trend prediction summaries based on historical records', async () => {
    const history = [
      { month: 'May', total: 490 },
      { month: 'Jun', total: 465 }
    ];
    const decreasingEmissions = { ...mockEmissions, total: 400 };
    const result = await getCarbonPredictionInsights('', history, decreasingEmissions);
    expect(result).toContain('decreasing');
    expect(result).toContain('forecast');
  });
});
