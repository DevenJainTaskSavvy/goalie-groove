
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { FormStep } from './types';

interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  isSubmitting: boolean;
  onNext: () => void;
  hasExistingProfile: boolean;
}

const FormNavigation: React.FC<FormNavigationProps> = ({
  currentStep,
  totalSteps,
  isSubmitting,
  onNext,
  hasExistingProfile
}) => {
  return (
    <>
      <div className="flex space-x-1 mt-4 mb-6">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div 
            key={index} 
            className={`h-1 flex-1 rounded-full transition-all duration-500 ${
              index === currentStep ? 'bg-primary' : 
              index < currentStep ? 'bg-primary/60' : 'bg-white/10'
            }`} 
          />
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <Button 
          onClick={onNext}
          className="group"
          disabled={isSubmitting}
        >
          {currentStep < totalSteps - 1 ? (
            <>
              Next
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          ) : (
            <>
              {hasExistingProfile ? 'Update' : 'Complete'}
              <CheckCircle2 className="ml-2 w-4 h-4" />
            </>
          )}
        </Button>
      </div>
    </>
  );
};

export default FormNavigation;
