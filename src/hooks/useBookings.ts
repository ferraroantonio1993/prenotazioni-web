import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { toLocalYMD } from '../utils/dateUtils';
import { BOOKING_CONFIG } from '../lib/constants';
import { toast } from 'sonner';
import type { Session } from '@supabase/supabase-js';
import type { Property, CalendarEvent, RawBooking, RawCalendarEvent } from '../types';

export const useBookings = (session: Session | null) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<string>('');
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [dataLoading, setDataLoading] = useState<boolean>(false);

  const lastRangeRef = useRef<string>('');

  const loadProperties = useCallback(async () => {
    const { data, error } = await supabase.from('strutture').select('id,name:nome').order('nome');
    if (error) {
      console.error('Properties error:', error);
      toast.error('Failed to load properties');
      return;
    }

    const propertiesData = (data as Property[]) || [];
    setProperties(propertiesData);

    if (propertiesData.length > 0) {
      setSelectedProperty((prev) => (prev ? prev : propertiesData[0].id));
    }
  }, []);

  useEffect(() => {
    if (session) {
      loadProperties();
    } else {
      setEvents([]);
      lastRangeRef.current = '';
    }
  }, [session, loadProperties]);

  const fetchEvents = useCallback(
    async (start: Date, end: Date) => {
      if (!selectedProperty) return;

      const startStr = toLocalYMD(start.toISOString());
      const endStr = toLocalYMD(end.toISOString());
      const rangeKey = `${selectedProperty}|${startStr}|${endStr}`;

      if (rangeKey === lastRangeRef.current) return;
      lastRangeRef.current = rangeKey;

      setDataLoading(true);
      try {
        const dirQ = supabase
          .from('prenotazioni')
          .select('id, checkin, checkout, guest_name:nome_ospite, status:stato')
          .eq('struttura_id', selectedProperty)
          .lt('checkin', endStr)
          .gt('checkout', startStr);

        const abQ = supabase
          .from('eventi_calendario')
          .select('id, title:titolo, start:inizio, end:fine, origin:origine, active:attivo')
          .eq('struttura_id', selectedProperty)
          .eq('origine', BOOKING_CONFIG.ORIGINS.AIRBNB)
          .eq('attivo', true)
          .lt('inizio', endStr)
          .gt('fine', startStr);

        const [dirRes, abRes] = await Promise.all([dirQ, abQ]);

        if (dirRes.error) throw dirRes.error;
        if (abRes.error) throw abRes.error;

        const airbnbEvents: CalendarEvent[] = ((abRes.data as RawCalendarEvent[]) || [])
          .map((r) => ({
            id: 'ab_' + r.id,
            title: r.title ?? BOOKING_CONFIG.STATUS_LABELS.AIRBNB,
            start: toLocalYMD(r.start),
            end: toLocalYMD(r.end),
            allDay: true,
            backgroundColor: BOOKING_CONFIG.COLORS.AIRBNB.BACKGROUND,
            borderColor: 'transparent',
            textColor: BOOKING_CONFIG.COLORS.AIRBNB.TEXT,
            extendedProps: { origin: r.origin ?? BOOKING_CONFIG.ORIGINS.AIRBNB, status: '' },
          }))
          .filter((e: CalendarEvent) => e.start && e.end);

        const directEvents: CalendarEvent[] = ((dirRes.data as RawBooking[]) || [])
          .map((r) => ({
            id: 'dir_' + r.id,
            title:
              r.guest_name && r.guest_name.trim()
                ? r.guest_name.trim()
                : BOOKING_CONFIG.STATUS_LABELS.DIRECT,
            start: toLocalYMD(r.checkin),
            end: toLocalYMD(r.checkout),
            allDay: true,
            backgroundColor: BOOKING_CONFIG.COLORS.DIRECT.BACKGROUND,
            borderColor: 'transparent',
            textColor: BOOKING_CONFIG.COLORS.DIRECT.TEXT,
            extendedProps: { origin: BOOKING_CONFIG.ORIGINS.DIRECT, status: r.status ?? '' },
          }))
          .filter((e: CalendarEvent) => e.start && e.end);

        setEvents([...airbnbEvents, ...directEvents]);
      } catch (err) {
        const error = err as Error;
        console.error('Error fetching events:', error);
        toast.error('Error fetching calendar events: ' + (error.message || 'Unknown error'));
      } finally {
        setDataLoading(false);
      }
    },
    [selectedProperty],
  );

  const resetRange = useCallback(() => {
    lastRangeRef.current = '';
  }, []);

  return {
    properties,
    selectedProperty,
    setSelectedProperty,
    events,
    dataLoading,
    fetchEvents,
    resetRange,
  };
};
