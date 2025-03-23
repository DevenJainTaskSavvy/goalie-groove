
import React from 'react';
import RemainingCapacityInfo from '@/components/goals/RemainingCapacityInfo';
import GoalSizeSelector from '@/components/goals/GoalSizeSelector';
import GoalDetailCard from '@/components/goals/GoalDetailCard';
import GoalFormActions from '@/components/goals/GoalFormActions';
import useGoalForm from '@/hooks/useGoalForm';

const GoalForm = () => {
  const {
    formData,
    goalSize,
    autoDebit,
    isSubmitting,
    remainingCapacity,
    calculatedContribution,
    setAutoDebit,
    handleChange,
    handleGoalTypeSelect,
    handleRiskLevelSelect,
    handleGoalSizeSelect,
    handleSubmit
  } = useGoalForm();
  
  return (
    <>
      <RemainingCapacityInfo remainingCapacity={remainingCapacity} />
      
      <GoalSizeSelector 
        goalSize={goalSize} 
        onSelectGoalSize={handleGoalSizeSelect} 
      />
      
      <form onSubmit={handleSubmit}>
        <GoalDetailCard
          formData={formData}
          goalSize={goalSize}
          autoDebit={autoDebit}
          calculatedContribution={calculatedContribution}
          remainingCapacity={remainingCapacity}
          handleChange={handleChange}
          handleGoalTypeSelect={handleGoalTypeSelect}
          handleRiskLevelSelect={handleRiskLevelSelect}
          setAutoDebit={setAutoDebit}
        />
        
        <GoalFormActions
          isSubmitting={isSubmitting}
          calculatedContribution={calculatedContribution}
          remainingCapacity={remainingCapacity}
        />
      </form>
    </>
  );
};

export default GoalForm;
