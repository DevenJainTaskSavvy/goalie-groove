
import React from 'react';
import { Check, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '@/services/api';

interface GoalContributionInfoProps {
  calculatedContribution: number | null;
  remainingCapacity: number;
}

const GoalContributionInfo: React.FC<GoalContributionInfoProps> = ({
  calculatedContribution,
  remainingCapacity
}) => {
  if (calculatedContribution === null) {
    return null;
  }

  const exceedsCapacity = calculatedContribution > remainingCapacity;

  return (
    <div className={`mt-6 p-4 rounded-lg ${
      exceedsCapacity
        ? 'bg-red-500/10 border border-red-500/20'
        : 'bg-green-500/10 border border-green-500/20'
    }`}>
      <div className="flex items-start">
        {exceedsCapacity ? (
          <AlertTriangle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
        ) : (
          <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
        )}
        <div>
          <p className="font-medium">
            {exceedsCapacity
              ? 'Exceeds your monthly capacity'
              : 'Within your monthly capacity'}
          </p>
          <p className="text-sm mt-1">
            This goal requires <span className="font-semibold">{formatCurrency(calculatedContribution)}</span> monthly contribution.
          </p>
          {exceedsCapacity && (
            <p className="text-sm mt-1 text-red-500">
              You need to reduce your target amount or extend your timeline.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoalContributionInfo;
