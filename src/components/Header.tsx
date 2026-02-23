import React from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => (
  <header className="mb-4 flex items-center justify-between gap-4 sm:mb-8">
    <div className="flex items-center gap-2">
      <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg sm:h-10 sm:w-10">
        <span className="text-primary text-lg font-black sm:text-xl">B</span>
      </div>
      <h1 className="text-primary text-xl font-extrabold tracking-tight italic sm:text-2xl lg:text-3xl">
        Booking Calendar
      </h1>
    </div>
    <Button
      variant="destructive"
      size="sm"
      onClick={onLogout}
      className="flex items-center gap-2 px-3 shadow-lg sm:px-4"
    >
      <LogOut size={16} />
      <span className="xs:inline hidden">Logout</span>
    </Button>
  </header>
);

export default Header;
