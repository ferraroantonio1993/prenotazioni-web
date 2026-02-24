import React, { useRef, ReactNode, useEffect, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import { DatesSetArg } from '@fullcalendar/core';
import { useAuth } from '../hooks/useAuth';
import { useBookings } from '../hooks/useBookings';
import { BookingContext } from './useBooking';
import type { BookingContextType } from '../types';

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { session, loading, login, logout } = useAuth();
  const {
    properties,
    selectedProperty,
    setSelectedProperty,
    events,
    dataLoading,
    fetchEvents,
    resetRange,
  } = useBookings(session);

  const calendarRef = useRef<FullCalendar>(null);

  const reloadCalendar = useCallback(() => {
    if (calendarRef.current) {
      const api = calendarRef.current.getApi();
      resetRange();
      fetchEvents(api.view.activeStart, api.view.activeEnd);
    }
  }, [fetchEvents, resetRange]);

  const handleLogout = useCallback(async () => {
    await logout();
    resetRange();
  }, [logout, resetRange]);

  useEffect(() => {
    if (selectedProperty && calendarRef.current) {
      reloadCalendar();
    }
  }, [selectedProperty, reloadCalendar]);

  const handleDatesSet = useCallback(
    (dateInfo: DatesSetArg) => {
      fetchEvents(dateInfo.start, dateInfo.end);
    },
    [fetchEvents],
  );

  const value = React.useMemo<BookingContextType>(
    () => ({
      session,
      loading,
      login,
      logout: handleLogout,
      properties,
      selectedProperty,
      setSelectedProperty,
      events,
      dataLoading,
      reloadCalendar,
      handleDatesSet,
      calendarRef,
      resetRange,
    }),
    [
      session,
      loading,
      login,
      handleLogout,
      properties,
      selectedProperty,
      setSelectedProperty,
      events,
      dataLoading,
      reloadCalendar,
      handleDatesSet,
      resetRange,
    ],
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};
