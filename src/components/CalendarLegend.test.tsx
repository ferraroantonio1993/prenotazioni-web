import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CalendarLegend from './CalendarLegend';
import { BOOKING_CONFIG } from '../lib/constants';

describe('CalendarLegend', () => {
  it('renders the legend items correctly', () => {
    render(<CalendarLegend />);

    expect(screen.getByText(BOOKING_CONFIG.STATUS_LABELS.DIRECT)).toBeInTheDocument();
    expect(screen.getByText(BOOKING_CONFIG.STATUS_LABELS.AIRBNB)).toBeInTheDocument();
  });

  it('has the correct background colors for dots', () => {
    const { container } = render(<CalendarLegend />);

    const dots = container.querySelectorAll('.dot');
    expect(dots).toHaveLength(2);

    const directDot = dots[0] as HTMLElement;
    const airbnbDot = dots[1] as HTMLElement;

    expect(directDot.style.backgroundColor).not.toBe('');
    expect(airbnbDot.style.backgroundColor).not.toBe('');
  });
});
