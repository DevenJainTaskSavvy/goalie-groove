
import React from 'react';
import FormField from './FormField';
import AnimatedText from '@/components/ui/AnimatedText';
import { FormStep as FormStepType } from './types';
import { UserProfile } from '@/types/finance';

interface FormStepProps {
  step: FormStepType;
  formData: Partial<UserProfile>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const FormStepComponent: React.FC<FormStepProps> = ({ 
  step, 
  formData, 
  onChange 
}) => {
  return (
    <>
      <div className="mb-6">
        <AnimatedText 
          text={step.title} 
          element="h2"
          className="text-xl font-semibold mb-1" 
        />
      </div>
      
      <div className="space-y-4">
        {step.fields.map((field) => (
          <FormField
            key={field.name}
            name={field.name}
            label={field.label}
            type={field.type}
            placeholder={field.placeholder}
            options={field.options}
            required={field.required}
            value={formData[field.name as keyof typeof formData]}
            onChange={onChange}
          />
        ))}
      </div>
    </>
  );
};

export default FormStepComponent;
