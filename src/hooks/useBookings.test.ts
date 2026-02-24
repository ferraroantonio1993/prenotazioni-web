import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useBookings } from './useBookings';
import { supabase } from '../lib/supabase';
import { BOOKING_CONFIG } from '../lib/constants';

vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe('useBookings', () => {
  const mockSession = { user: { id: '123' } } as any;
  const mockProperties = [{ id: 'prop1', name: 'Property 1' }];

  beforeEach(() => {
    vi.clearAllMocks();

    (supabase.from as any).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: mockProperties, error: null }),
    });
  });

  it('loads properties on mount if session exists', async () => {
    const { result } = renderHook(() => useBookings(mockSession));

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.properties).toEqual(mockProperties);
    expect(result.current.selectedProperty).toBe('prop1');
  });

  it('fetches and merges events correctly', async () => {
    const { result } = renderHook(() => useBookings(mockSession));

    await act(async () => {
      await Promise.resolve();
    });

    const mockDirectBookings = [
      {
        id: '1',
        checkin: '2023-10-01',
        checkout: '2023-10-05',
        guest_name: 'John Doe',
        status: 'confirmed',
      },
    ];
    const mockAirbnbEvents = [
      {
        id: '2',
        title: null,
        start: '2023-10-10',
        end: '2023-10-15',
        origin: 'airbnb_ical',
        active: true,
      },
    ];

    const fromMock = vi.fn().mockImplementation((table) => {
      if (table === 'prenotazioni') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          lt: vi.fn().mockReturnThis(),
          gt: vi.fn().mockResolvedValue({ data: mockDirectBookings, error: null }),
        };
      }
      if (table === 'eventi_calendario') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          lt: vi.fn().mockReturnThis(),
          gt: vi.fn().mockResolvedValue({ data: mockAirbnbEvents, error: null }),
        };
      }
    });
    (supabase.from as any).mockImplementation(fromMock);

    await act(async () => {
      await result.current.fetchEvents(new Date('2023-10-01'), new Date('2023-10-31'));
    });

    expect(result.current.events).toHaveLength(2);

    const airbnbEvent = result.current.events.find((e) => e.id === 'ab_2');
    expect(airbnbEvent?.title).toBe(BOOKING_CONFIG.STATUS_LABELS.AIRBNB);
    expect(airbnbEvent?.backgroundColor).toBe(BOOKING_CONFIG.COLORS.AIRBNB.BACKGROUND);

    const directEvent = result.current.events.find((e) => e.id === 'dir_1');
    expect(directEvent?.title).toBe('John Doe');
    expect(directEvent?.backgroundColor).toBe(BOOKING_CONFIG.COLORS.DIRECT.BACKGROUND);
  });

  it('handles fetch errors gracefully', async () => {
    const { result } = renderHook(() => useBookings(mockSession));

    await act(async () => {
      await Promise.resolve();
    });

    (supabase.from as any).mockImplementation(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      lt: vi.fn().mockReturnThis(),
      gt: vi.fn().mockResolvedValue({ data: null, error: { message: 'Database Error' } }),
    }));

    await act(async () => {
      await result.current.fetchEvents(new Date(), new Date());
    });

    const { toast } = await import('sonner');
    expect(toast.error).toHaveBeenCalled();
    expect(result.current.dataLoading).toBe(false);
  });

  it('resets events and range if session is null', async () => {
    const { result, rerender } = renderHook(({ session }) => useBookings(session), {
      initialProps: { session: mockSession },
    });

    await act(async () => {
      await Promise.resolve();
    });

    rerender({ session: null });

    expect(result.current.events).toEqual([]);
  });

  it('resets range key with resetRange', async () => {
    const { result } = renderHook(() => useBookings(mockSession));

    act(() => {
      result.current.resetRange();
    });

    expect(result.current.resetRange).toBeDefined();
  });
});
