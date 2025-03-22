
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setSubscription(null);
          return;
        }
        
        // Get user subscription using the function we created
        const { data, error } = await supabase.rpc('get_user_subscription');
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          setSubscription(data[0] as Subscription);
        } else {
          // If no subscription exists, create a free one
          const { data: newSub, error: insertError } = await supabase
            .from('subscriptions')
            .insert({
              user_id: session.user.id,
              plan: 'free',
              status: 'active'
            })
            .select()
            .single();
          
          if (insertError) throw insertError;
          setSubscription(newSub as Subscription);
        }
      } catch (err) {
        console.error('Error fetching subscription:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
    
    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        fetchSubscription();
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return { subscription, loading, error };
};
