
import React from 'react';
import { Check } from 'lucide-react';
import { RISK_LEVELS } from '@/components/goals/goalConstants';
import { Label } from '@/components/ui/label';

interface RiskLevelSelectorProps {
  selectedRiskLevel: string;
  onSelect: (riskLevel: string) => void;
}

const RiskLevelSelector: React.FC<RiskLevelSelectorProps> = ({ 
  selectedRiskLevel, 
  onSelect 
}) => {
  return (
    <div>
      <Label className="mb-3 block">Risk Level</Label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {RISK_LEVELS.map(({ id, label, description }) => (
          <button
            key={id}
            type="button"
            className={`relative p-3 rounded-lg border text-left transition-all ${
              selectedRiskLevel === id 
                ? 'border-primary bg-primary/10' 
                : 'border-border hover:border-primary/50 bg-background/40'
            }`}
            onClick={() => onSelect(id)}
          >
            <div>
              <span className="block font-medium">{label}</span>
              <span className="text-xs text-muted-foreground">{description}</span>
              
              {selectedRiskLevel === id && (
                <div className="absolute top-2 right-2">
                  <Check className="h-4 w-4 text-primary" />
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RiskLevelSelector;
