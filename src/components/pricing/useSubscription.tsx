
import { useState, useEffect } from 'react';

export type Subscription = {
  id: string;
  plan: 'free' | 'pro' | 'premium';
  status: 'active' | 'canceled' | 'past_due';
  created_at: string;
  expires_at: string | null;
};

export const useSubscription = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        setLoading(true);
        
        // Check if user is authenticated
        const userString = localStorage.getItem('growvest_user');
        
        if (!userString) {
          setSubscription(null);
          return;
        }
        
        // Get user subscription from localStorage
        const subString = localStorage.getItem('growvest_subscription');
        
        if (subString) {
          setSubscription(JSON.parse(subString) as Subscription);
        } else {
          // If no subscription exists, create a free one
          const newSub: Subscription = {
            id: crypto.randomUUID(),
            plan: 'free',
            status: 'active',
            created_at: new Date().toISOString(),
            expires_at: null
          };
          
          localStorage.setItem('growvest_subscription', JSON.stringify(newSub));
          setSubscription(newSub);
        }
      } catch (err) {
        console.error('Error fetching subscription:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
    
    // Listen for auth changes (sign in/out)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'growvest_user') {
        fetchSubscription();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return { subscription, loading, error };
};
