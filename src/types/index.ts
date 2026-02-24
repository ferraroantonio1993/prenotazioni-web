import type { Session } from '@supabase/supabase-js';
import type { DatesSetArg } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';

export interface Property {
  id: string;
  name: string;
}

export interface EventExtendedProps {
  origin: string;
  status: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  extendedProps: EventExtendedProps;
}

export interface RawBooking {
  id: string | number;
  checkin: string;
  checkout: string;
  guest_name: string | null;
  status: string | null;
}

export interface RawCalendarEvent {
  id: string | number;
  title: string | null;
  start: string;
  end: string;
  origin: string | null;
  active: boolean;
}

export interface BookingContextType {
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  properties: Property[];
  selectedProperty: string;
  setSelectedProperty: (id: string) => void;
  events: CalendarEvent[];
  dataLoading: boolean;
  reloadCalendar: () => void;
  handleDatesSet: (dateInfo: DatesSetArg) => void;
  calendarRef: React.RefObject<FullCalendar | null>;
  resetRange: () => void;
}
