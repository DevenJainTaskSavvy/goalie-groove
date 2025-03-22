
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import AnimatedText from '@/components/ui/AnimatedText';

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
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    savings: '',
    monthlyInvestment: '',
    relationshipStatus: 'single',
    hasKids: 'no',
    retirementAge: '',
    purchasePlans: 'none'
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
        { name: 'monthlyInvestment', label: 'Monthly Investment Capacity (₹)', type: 'number', placeholder: 'Enter amount you can invest monthly', required: true }
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
        { name: 'purchasePlans', label: 'Major Purchase Plans', type: 'select', placeholder: 'Select planned purchases', options: ['Home', 'Car', 'Both', 'None'], required: true }
      ]
    }
  ];
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNext = () => {
    const currentFields = steps[currentStep].fields;
    const isValid = currentFields.every(field => 
      !field.required || formData[field.name as keyof typeof formData]
    );
    
    if (isValid) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        console.log("Form submitted:", formData);
        navigate('/dashboard');
      }
    } else {
      alert("Please fill in all required fields");
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
                value={formData[field.name as keyof typeof formData] as string}
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
                value={formData[field.name as keyof typeof formData] as string}
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
