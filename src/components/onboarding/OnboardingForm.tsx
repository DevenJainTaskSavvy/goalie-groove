
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import AnimatedText from '@/components/ui/AnimatedText';
import { useToast } from '@/hooks/use-toast';
import { saveUserProfile } from '@/services/api';
import { UserProfile } from '@/types/finance';

interface FormStep {
  title: string;
  fields: {
    name: string;
    label: string;
    type: string;
    placeholder: string;
    options?: string[];
    required: boolean;
  }[];
}

const OnboardingForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: '',
    age: undefined,
    savings: undefined,
    monthlyInvestmentCapacity: undefined,
    relationshipStatus: 'single',
    hasKids: 'no',
    retirementAge: undefined,
    purchasePlans: 'none',
    riskTolerance: 'moderate'
  });
  
  const steps: FormStep[] = [
    {
      title: "Let's get to know you",
      fields: [
        { name: 'name', label: 'Your Name', type: 'text', placeholder: 'Enter your full name', required: true },
        { name: 'age', label: 'Your Age', type: 'number', placeholder: 'Enter your age', required: true }
      ]
    },
    {
      title: "Let's talk about your finances",
      fields: [
        { name: 'savings', label: 'Current Savings (₹)', type: 'number', placeholder: 'Enter current savings amount', required: true },
        { name: 'monthlyInvestmentCapacity', label: 'Monthly Investment Capacity (₹)', type: 'number', placeholder: 'Enter amount you can invest monthly', required: true }
      ]
    },
    {
      title: "Tell us about your life goals",
      fields: [
        { name: 'relationshipStatus', label: 'Relationship Status', type: 'select', placeholder: 'Select your status', options: ['Single', 'Married', 'In a relationship'], required: true },
        { name: 'hasKids', label: 'Do you have children?', type: 'select', placeholder: 'Select an option', options: ['Yes', 'No', 'Planning for children'], required: true }
      ]
    },
    {
      title: "Planning for the future",
      fields: [
        { name: 'retirementAge', label: 'Desired Retirement Age', type: 'number', placeholder: 'At what age do you want to retire?', required: true },
        { name: 'purchasePlans', label: 'Major Purchase Plans', type: 'select', placeholder: 'Select planned purchases', options: ['Home', 'Car', 'Both', 'None'], required: true },
        { name: 'riskTolerance', label: 'Risk Tolerance', type: 'select', placeholder: 'Select your risk tolerance', options: ['Conservative', 'Moderate', 'Aggressive'], required: true }
      ]
    }
  ];
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // For number inputs, convert the value to a number
    if (e.target.type === 'number') {
      setFormData({ ...formData, [name]: Number(value) });
    } else {
      setFormData({ ...formData, [name]: value.toLowerCase() });
    }
  };

  const handleNext = async () => {
    const currentFields = steps[currentStep].fields;
    const isValid = currentFields.every(field => 
      !field.required || formData[field.name as keyof typeof formData]
    );
    
    if (isValid) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        // Final step - submit profile
        try {
          setIsSubmitting(true);
          
          // Check if all required fields are present
          const profileKeys: (keyof UserProfile)[] = [
            'name', 'age', 'savings', 'monthlyInvestmentCapacity', 
            'relationshipStatus', 'hasKids', 'retirementAge', 'purchasePlans'
          ];
          
          // Make sure all required fields are present
          const isComplete = profileKeys.every(key => formData[key] !== undefined);
          
          if (!isComplete) {
            toast({
              title: 'Missing information',
              description: 'Please fill in all required fields',
              variant: 'destructive'
            });
            return;
          }
          
          await saveUserProfile(formData as UserProfile);
          
          toast({
            title: 'Profile updated',
            description: 'Your financial profile has been saved'
          });
          
          navigate('/dashboard');
        } catch (error) {
          toast({
            title: 'Error',
            description: 'Failed to save your profile. Please try again.',
            variant: 'destructive'
          });
          console.error(error);
        } finally {
          setIsSubmitting(false);
        }
      }
    } else {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
    }
  };
  
  const currentForm = steps[currentStep];
  
  return (
    <GlassCard className="w-full max-w-md mx-auto">
      <div className="mb-6">
        <AnimatedText 
          text={currentForm.title} 
          element="h2"
          className="text-xl font-semibold mb-1" 
        />
        
        <div className="flex space-x-1 mt-4">
          {steps.map((_, index) => (
            <div 
              key={index} 
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                index === currentStep ? 'bg-primary' : 
                index < currentStep ? 'bg-primary/60' : 'bg-white/10'
              }`} 
            />
          ))}
        </div>
      </div>
      
      <div className="space-y-4">
        {currentForm.fields.map((field) => (
          <div key={field.name} className="space-y-2 animate-fade-in">
            <Label htmlFor={field.name}>{field.label}</Label>
            
            {field.type === 'select' ? (
              <select
                id={field.name}
                name={field.name}
                value={formData[field.name as keyof typeof formData] as string || ''}
                onChange={handleChange}
                className="w-full h-10 px-3 rounded-md border border-input bg-background/50 text-foreground"
                required={field.required}
              >
                <option value="">{field.placeholder}</option>
                {field.options?.map((option) => (
                  <option key={option} value={option.toLowerCase()}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <Input
                id={field.name}
                name={field.name}
                type={field.type}
                placeholder={field.placeholder}
                value={formData[field.name as keyof typeof formData] as string || ''}
                onChange={handleChange}
                required={field.required}
                className="bg-background/50"
              />
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-8 flex justify-end">
        <Button 
          onClick={handleNext}
          className="group"
          disabled={isSubmitting}
        >
          {currentStep < steps.length - 1 ? (
            <>
              Next
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          ) : (
            <>
              Complete
              <CheckCircle2 className="ml-2 w-4 h-4" />
            </>
          )}
        </Button>
      </div>
    </GlassCard>
  );
};

export default OnboardingForm;
