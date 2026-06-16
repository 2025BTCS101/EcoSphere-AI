import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import GlassCard from './glass-card';

describe('GlassCard Component', () => {
  it('renders children and default classes correctly', () => {
    render(
      <GlassCard>
        <span data-testid="child">Test Content</span>
      </GlassCard>
    );

    const child = screen.getByTestId('child');
    expect(child).toBeDefined();
    expect(child.parentElement.className).toContain('glass-card');
    expect(child.parentElement.className).toContain('glass-card-hover');
  });

  it('handles custom classNames and hoverEffect overrides', () => {
    render(
      <GlassCard className="custom-class" hoverEffect={false}>
        <span>Test</span>
      </GlassCard>
    );

    const container = screen.getByText('Test').parentElement;
    expect(container.className).toContain('custom-class');
    expect(container.className).not.toContain('glass-card-hover');
  });

  it('triggers onClick handler and keyboard events when clickable', () => {
    const handleClick = vi.fn();
    render(
      <GlassCard onClick={handleClick}>
        <span>Clickable Card</span>
      </GlassCard>
    );

    const card = screen.getByText('Clickable Card').parentElement;
    expect(card.getAttribute('role')).toBe('button');
    expect(card.getAttribute('tabindex')).toBe('0');

    // Click trigger
    fireEvent.click(card);
    expect(handleClick).toHaveBeenCalledTimes(1);

    // Enter key trigger
    fireEvent.keyDown(card, { key: 'Enter' });
    expect(handleClick).toHaveBeenCalledTimes(2);

    // Space key trigger
    fireEvent.keyDown(card, { key: ' ' });
    expect(handleClick).toHaveBeenCalledTimes(3);

    // Random key trigger (should not trigger)
    fireEvent.keyDown(card, { key: 'a' });
    expect(handleClick).toHaveBeenCalledTimes(3);
  });
});
