
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';
import GlassCard from '@/components/ui/GlassCard';
import AnimatedText from '@/components/ui/AnimatedText';
import { Check, Target, CreditCard, Calendar } from 'lucide-react';

const GOAL_TYPES = [
  { id: 'retirement', label: 'Retirement', icon: Calendar },
  { id: 'education', label: 'Education', icon: Target },
  { id: 'housing', label: 'Housing', icon: CreditCard },
  { id: 'travel', label: 'Travel', icon: Target },
  { id: 'vehicle', label: 'Vehicle', icon: Target },
  { id: 'other', label: 'Other', icon: Target },
];

const NewGoal = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    goalType: '',
    goalName: '',
    targetAmount: '',
    timeline: '',
    description: '',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleGoalTypeSelect = (goalType: string) => {
    setFormData(prev => ({ ...prev, goalType }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.goalType || !formData.goalName || !formData.targetAmount || !formData.timeline) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would save to a database
    toast({
      title: "Goal created!",
      description: "Your new financial goal has been added.",
    });
    
    // Navigate back to goals list
    navigate('/goals');
  };
  
  return (
    <div className="min-h-screen bg-background pt-16">
      <Header />
      
      <main className="container mx-auto px-4 py-10">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <AnimatedText 
              text="Create a New Financial Goal" 
              element="h1"
              className="text-3xl font-bold mb-2"
              variant="gradient"
            />
            <p className="text-muted-foreground">
              Define your financial goals to track progress and get personalized recommendations.
            </p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <GlassCard className="mb-6">
              <div className="mb-6">
                <Label className="mb-3 block">Select Goal Type</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {GOAL_TYPES.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      type="button"
                      className={`relative p-4 rounded-lg border transition-all ${
                        formData.goalType === id 
                          ? 'border-primary bg-primary/10' 
                          : 'border-border hover:border-primary/50 bg-background/40'
                      }`}
                      onClick={() => handleGoalTypeSelect(id)}
                    >
                      <div className="flex flex-col items-center">
                        <Icon className="h-6 w-6 mb-2 text-primary/80" />
                        <span>{label}</span>
                        
                        {formData.goalType === id && (
                          <div className="absolute top-2 right-2">
                            <Check className="h-4 w-4 text-primary" />
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="goalName">Goal Name</Label>
                  <Input
                    id="goalName"
                    name="goalName"
                    value={formData.goalName}
                    onChange={handleChange}
                    placeholder="e.g., Retirement Fund, Dream Home"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="targetAmount">Target Amount (₹)</Label>
                  <Input
                    id="targetAmount"
                    name="targetAmount"
                    value={formData.targetAmount}
                    onChange={handleChange}
                    placeholder="e.g., 50,00,000"
                    className="mt-1"
                    type="number"
                  />
                </div>
                
                <div>
                  <Label htmlFor="timeline">Timeline (years)</Label>
                  <Input
                    id="timeline"
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleChange}
                    placeholder="e.g., 10"
                    className="mt-1"
                    type="number"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Add details about your goal..."
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </div>
            </GlassCard>
            
            <div className="flex justify-end gap-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/goals')}
              >
                Cancel
              </Button>
              <Button type="submit">Create Goal</Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default NewGoal;
