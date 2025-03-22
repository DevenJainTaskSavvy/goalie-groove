
import React from 'react';
import { Info } from 'lucide-react';
import { formatCurrency } from '@/services/api';

interface RemainingCapacityInfoProps {
  remainingCapacity: number;
}

const RemainingCapacityInfo: React.FC<RemainingCapacityInfoProps> = ({ 
  remainingCapacity 
}) => {
  return (
    <div className="flex items-center p-4 mb-6 rounded-lg bg-blue-500/10 border border-blue-500/20">
      <Info className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
      <div>
        <p className="text-sm">Your remaining monthly investment capacity: <span className="font-semibold">{formatCurrency(remainingCapacity)}</span></p>
      </div>
    </div>
  );
};

export default RemainingCapacityInfo;
