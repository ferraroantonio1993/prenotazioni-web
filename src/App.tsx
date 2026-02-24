import React from 'react';
import { BookingProvider } from './context/BookingContext';
import { useBooking } from './context/useBooking';
import Header from './components/Header';
import LoginForm from './components/LoginForm';
import LoadingScreen from './components/LoadingScreen';
import PropertySelector from './components/PropertySelector';
import CalendarLegend from './components/CalendarLegend';
import BookingCalendar from './components/BookingCalendar';

import { Card, CardContent } from '@/components/ui/card';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

const BookingDashboard: React.FC = () => {
  const {
    session,
    loading,
    login,
    logout,
    properties,
    selectedProperty,
    setSelectedProperty,
    events,
    dataLoading,
    reloadCalendar,
    handleDatesSet,
    calendarRef,
  } = useBooking();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!session) {
    const handleLogin = async (email: string, password: string) => {
      try {
        await login(email, password);
      } catch (err) {
        const error = err as Error;
        toast.error('Login error: ' + error.message);
      }
    };
    return (
      <>
        <LoginForm onLogin={handleLogin} />
        <Toaster position="top-right" richColors />
      </>
    );
  }

  return (
    <>
      <div className="animate-in fade-in mx-auto w-full max-w-7xl space-y-4 p-2 duration-500 sm:space-y-8 sm:p-6 lg:p-8">
        <Header onLogout={logout} />

        <Card className="border-border/60 bg-card/30 overflow-hidden shadow-xl backdrop-blur-md">
          <CardContent className="space-y-4 p-3 sm:space-y-8 sm:p-6">
            <PropertySelector
              properties={properties}
              selectedProperty={selectedProperty}
              onSelect={(id: string) => {
                setSelectedProperty(id);
              }}
              onReload={reloadCalendar}
              loading={dataLoading}
            />

            <div className="pt-2">
              <CalendarLegend />
            </div>

            <div className="border-border/40 bg-background/20 overflow-hidden rounded-xl border p-0.5 shadow-inner sm:p-1">
              <BookingCalendar ref={calendarRef} events={events} onDatesSet={handleDatesSet} />
            </div>
          </CardContent>
        </Card>
      </div>
      <Toaster position="top-right" richColors />
    </>
  );
};

function App() {
  return (
    <BookingProvider>
      <BookingDashboard />
    </BookingProvider>
  );
}

export default App;
