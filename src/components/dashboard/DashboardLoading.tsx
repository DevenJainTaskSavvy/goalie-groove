
import React from 'react';
import { Loader2 } from 'lucide-react';

const DashboardLoading: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
    </div>
  );
};

export default DashboardLoading;
