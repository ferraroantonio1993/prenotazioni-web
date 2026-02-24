import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingScreen: React.FC = () => (
  <div className="bg-background flex h-screen items-center justify-center">
    <Loader2 className="text-primary animate-spin" size={48} />
  </div>
);

export default LoadingScreen;
