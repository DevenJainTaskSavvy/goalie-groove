
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AnimatedText from '@/components/ui/AnimatedText';
import GlassCard from '@/components/ui/GlassCard';
import { useToast } from '@/hooks/use-toast';
import { ChevronRight, Mail, Phone, User, Lock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AuthContext } from '@/App';
import { supabase } from '@/integrations/supabase/client';

const SignUp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('signup');
  const { login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  
  // Signup state
  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  
  // Login state
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });
  
  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!signupForm.name || !signupForm.email || !signupForm.phone || !signupForm.password) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields to continue.",
        variant: "destructive"
      });
      return;
    }
    
    if (!signupForm.email.includes('@') || !signupForm.email.includes('.')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }
    
    if (!signupForm.phone.match(/^\+?[0-9]{10,15}$/)) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid phone number.",
        variant: "destructive"
      });
      return;
    }
    
    if (signupForm.password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: signupForm.email,
        password: signupForm.password,
        options: {
          data: {
            name: signupForm.name,
            phone: signupForm.phone
          }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Account created!",
        description: "Welcome to GrowVest. Let's set up your profile.",
      });
      
      // Navigate to onboarding
      navigate('/onboarding');
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message || "Could not create your account. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!loginForm.email || !loginForm.password) {
      toast({
        title: "Missing information",
        description: "Please enter your email and password.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginForm.email,
        password: loginForm.password
      });
      
      if (error) throw error;
      
      toast({
        title: "Welcome back!",
        description: "Successfully logged in to your GrowVest account.",
      });
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="p-6 border-b border-white/5">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold text-gradient">GROWVEST</h1>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-10 flex flex-col items-center justify-center">
        <div className="max-w-md w-full mx-auto">
          <div className="text-center mb-10">
            <AnimatedText 
              text="Welcome to GrowVest" 
              element="h1"
              className="text-3xl md:text-4xl font-bold mb-3"
              variant="gradient"
            />
            <AnimatedText 
              text="Your path to financial freedom starts here" 
              element="p"
              className="text-lg text-muted-foreground"
              delay={300}
            />
          </div>
          
          <GlassCard className="w-full">
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 w-full mb-6">
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
                <TabsTrigger value="login">Login</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signup" className="animate-fade-in">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input 
                        id="name"
                        name="name"
                        placeholder="John Doe" 
                        className="pl-10"
                        value={signupForm.name}
                        onChange={handleSignupChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input 
                        id="email"
                        name="email"
                        type="email"
                        placeholder="example@email.com" 
                        className="pl-10"
                        value={signupForm.email}
                        onChange={handleSignupChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input 
                        id="phone"
                        name="phone"
                        placeholder="+1234567890" 
                        className="pl-10"
                        value={signupForm.phone}
                        onChange={handleSignupChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input 
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••" 
                        className="pl-10"
                        value={signupForm.password}
                        onChange={handleSignupChange}
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full mt-6 group" disabled={loading}>
                    {loading ? 'Creating Account...' : 'Create Account'}
                    <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="login" className="animate-fade-in">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input 
                        id="login-email"
                        name="email"
                        type="email"
                        placeholder="example@email.com" 
                        className="pl-10"
                        value={loginForm.email}
                        onChange={handleLoginChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input 
                        id="login-password"
                        name="password"
                        type="password"
                        placeholder="••••••••" 
                        className="pl-10"
                        value={loginForm.password}
                        onChange={handleLoginChange}
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full mt-6 group" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                    <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </GlassCard>
        </div>
      </main>
      
      <footer className="py-8 border-t border-white/5">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2023 GrowVest. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default SignUp;
