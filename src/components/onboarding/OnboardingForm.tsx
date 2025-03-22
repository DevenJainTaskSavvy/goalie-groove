
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '@/components/ui/GlassCard';
import { useToast } from '@/hooks/use-toast';
import { saveUserProfile, getUserProfile } from '@/services/api';
import { UserProfile } from '@/types/finance';
import FormStep from './FormStep';
import FormNavigation from './FormNavigation';
import FormLoading from './FormLoading';
import { formSteps } from './types';

const OnboardingForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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
  
  // Load existing profile data when component mounts
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setIsLoading(true);
        const profile = await getUserProfile();
        
        if (profile) {
          setFormData(profile);
          toast({
            title: 'Profile loaded',
            description: 'Your existing profile data has been loaded'
          });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your profile',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserProfile();
  }, [toast]);
  
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
    const currentFields = formSteps[currentStep].fields;
    const isValid = currentFields.every(field => 
      !field.required || formData[field.name as keyof typeof formData]
    );
    
    if (isValid) {
      if (currentStep < formSteps.length - 1) {
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
  
  if (isLoading) {
    return <FormLoading />;
  }
  
  return (
    <GlassCard className="w-full max-w-md mx-auto">
      <FormNavigation 
        currentStep={currentStep} 
        totalSteps={formSteps.length}
        isSubmitting={isSubmitting}
        onNext={handleNext}
        hasExistingProfile={!!formData.id}
      />
      
      <FormStep 
        step={formSteps[currentStep]} 
        formData={formData} 
        onChange={handleChange} 
      />
    </GlassCard>
  );
};

export default OnboardingForm;
