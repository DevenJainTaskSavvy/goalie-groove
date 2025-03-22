
import React from 'react';
import GlassCard from '@/components/ui/GlassCard';

const FormLoading: React.FC = () => {
  return (
    <GlassCard className="w-full max-w-md mx-auto">
      <div className="flex flex-col items-center justify-center py-8">
        <div className="w-8 h-8 border-t-2 border-b-2 border-primary rounded-full animate-spin mb-4"></div>
        <p className="text-muted-foreground">Loading your profile...</p>
      </div>
    </GlassCard>
  );
};

export default FormLoading;
