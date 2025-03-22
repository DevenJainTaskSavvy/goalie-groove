
import React from 'react';
import Header from '@/components/layout/Header';
import PricingSection from '@/components/pricing/PricingSection';
import { useSubscription } from '@/components/pricing/useSubscription';
import { Loader2 } from 'lucide-react';

const Pricing = () => {
  const { subscription, loading } = useSubscription();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading subscription information...</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container pt-24 px-4 mx-auto">
        <div className="max-w-4xl mx-auto mb-8">
          <h1 className="text-3xl font-bold mb-2">Upgrade Your Plan</h1>
          <p className="text-muted-foreground">
            Get access to advanced features and tools to supercharge your investment journey
          </p>
        </div>
        
        <PricingSection 
          variant="dashboard" 
          currentPlan={subscription?.plan || 'free'} 
        />
      </main>
    </div>
  );
};

export default Pricing;
