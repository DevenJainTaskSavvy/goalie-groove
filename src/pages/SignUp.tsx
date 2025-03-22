
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AnimatedText from '@/components/ui/AnimatedText';
import GlassCard from '@/components/ui/GlassCard';
import { useToast } from '@/hooks/use-toast';
import { ChevronRight, Mail, Phone, User } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AuthContext } from '@/App';

const SignUp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('signup');
  const { login } = useContext(AuthContext);
  
  // Signup state
  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    phone: '',
  });
  
  // Login state
  const [loginForm, setLoginForm] = useState({
    email: '',
    phone: '',
  });
  
  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!signupForm.name || !signupForm.email || !signupForm.phone) {
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
    
    // If validation passes
    toast({
      title: "Account created!",
      description: "Welcome to GrowVest. Let's set up your profile.",
    });
    
    // Store user details in localStorage
    localStorage.setItem('growvest_user', JSON.stringify(signupForm));
    
    // Call the login function to update auth state
    login();
    
    // Navigate to onboarding
    navigate('/onboarding');
  };
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if ((!loginForm.email && !loginForm.phone) || (loginForm.email === '' && loginForm.phone === '')) {
      toast({
        title: "Missing information",
        description: "Please enter your email or phone number.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would verify against a database
    toast({
      title: "Welcome back!",
      description: "Successfully logged in to your GrowVest account.",
    });
    
    // Mock user data for login
    const mockUser = {
      name: "User",
      email: loginForm.email || "user@example.com",
      phone: loginForm.phone || "1234567890"
    };
    
    // Store the mock user data in localStorage
    localStorage.setItem('growvest_user', JSON.stringify(mockUser));
    
    // Call the login function to update auth state
    login();
    
    // Navigate to dashboard
    navigate('/dashboard');
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
                  
                  <Button type="submit" className="w-full mt-6 group">
                    Create Account
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
                    <Label htmlFor="login-phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input 
                        id="login-phone"
                        name="phone"
                        placeholder="+1234567890" 
                        className="pl-10"
                        value={loginForm.phone}
                        onChange={handleLoginChange}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Enter either email or phone number to login</p>
                  </div>
                  
                  <Button type="submit" className="w-full mt-6 group">
                    Login
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
