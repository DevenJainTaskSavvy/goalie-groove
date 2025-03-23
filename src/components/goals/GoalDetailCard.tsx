
import React from 'react';
import { Label } from '@/components/ui/label';
import GlassCard from '@/components/ui/GlassCard';
import GoalTypeSelector from '@/components/goals/GoalTypeSelector';
import GoalFormFields from '@/components/goals/GoalFormFields';
import RiskLevelSelector from '@/components/goals/RiskLevelSelector';
import GoalContributionInfo from '@/components/goals/GoalContributionInfo';
import AutoDebitOption from '@/components/goals/AutoDebitOption';

interface GoalFormData {
  goalType: string;
  goalName: string;
  targetAmount: string;
  currentAmount: string;
  timeline: string;
  description: string;
  riskLevel: string;
}

interface GoalDetailCardProps {
  formData: GoalFormData;
  goalSize: 'micro' | 'macro';
  autoDebit: boolean;
  calculatedContribution: number | null;
  remainingCapacity: number;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleGoalTypeSelect: (goalType: string) => void;
  handleRiskLevelSelect: (riskLevel: string) => void;
  setAutoDebit: (checked: boolean) => void;
}

const GoalDetailCard: React.FC<GoalDetailCardProps> = ({
  formData,
  goalSize,
  autoDebit,
  calculatedContribution,
  remainingCapacity,
  handleChange,
  handleGoalTypeSelect,
  handleRiskLevelSelect,
  setAutoDebit
}) => {
  return (
    <GlassCard className="mb-6">
      <div className="mb-6">
        <Label className="mb-3 block">Select Goal Type</Label>
        <GoalTypeSelector 
          goalSize={goalSize}
          selectedType={formData.goalType}
          onSelect={handleGoalTypeSelect}
        />
      </div>
      
      <GoalFormFields 
        formData={formData}
        goalSize={goalSize}
        onChange={handleChange}
      />
      
      <div className="mt-6">
        <RiskLevelSelector 
          selectedRiskLevel={formData.riskLevel}
          onSelect={handleRiskLevelSelect}
        />
      </div>
      
      <AutoDebitOption 
        autoDebit={autoDebit}
        setAutoDebit={setAutoDebit}
      />
      
      <GoalContributionInfo 
        calculatedContribution={calculatedContribution}
        remainingCapacity={remainingCapacity}
      />
    </GlassCard>
  );
};

export default GoalDetailCard;
