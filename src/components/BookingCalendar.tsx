import React, { forwardRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { DatesSetArg, EventContentArg, EventInput } from '@fullcalendar/core';
import { BOOKING_CONFIG } from '../lib/constants';
import type { CalendarEvent } from '../types';

interface BookingCalendarProps {
  events: CalendarEvent[];
  onDatesSet: (arg: DatesSetArg) => void;
}

const BookingCalendar = forwardRef<FullCalendar, BookingCalendarProps>(
  ({ events, onDatesSet }, ref) => {
    const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);

    React.useEffect(() => {
      const handleResize = () => setIsMobile(window.innerWidth < 768);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
      <div id="calendar" className="mt-2 sm:mt-4">
        <FullCalendar
          ref={ref}
          plugins={[dayGridPlugin, timeGridPlugin]}
          initialView={isMobile ? 'dayGridMonth' : 'dayGridMonth'}
          firstDay={1}
          height="auto"
          contentHeight={isMobile ? 500 : 'auto'}
          aspectRatio={isMobile ? 0.8 : 1.35}
          navLinks={true}
          fixedWeekCount={false}
          showNonCurrentDates={false}
          eventDisplay="block"
          dayMaxEvents={isMobile ? 2 : 6}
          headerToolbar={
            isMobile
              ? {
                  left: 'prev,next',
                  center: 'title',
                  right: '',
                }
              : {
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,timeGridWeek,timeGridDay',
                }
          }
          events={events as EventInput[]}
          datesSet={onDatesSet}
          eventContent={(arg: EventContentArg) => {
            const title = arg.event.title || '';
            const origin = arg.event.extendedProps?.origin || '';
            const status = arg.event.extendedProps?.status || '';
            const sub =
              origin === BOOKING_CONFIG.ORIGINS.AIRBNB
                ? BOOKING_CONFIG.STATUS_LABELS.AIRBNB
                : origin === BOOKING_CONFIG.ORIGINS.DIRECT
                  ? BOOKING_CONFIG.STATUS_LABELS.DIRECT
                  : origin;
            const sub2 = status ? ` • ${status}` : '';

            return (
              <div className="overflow-hidden">
                <div className="truncate text-[9px] leading-tight font-bold sm:text-xs">
                  {title}
                </div>
                {!isMobile && (
                  <div className="cm-sub truncate">
                    {sub}
                    {sub2}
                  </div>
                )}
              </div>
            );
          }}
        />
      </div>
    );
  },
);

BookingCalendar.displayName = 'BookingCalendar';

export default BookingCalendar;
