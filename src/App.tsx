
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect, createContext } from "react";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Goals from "./pages/Goals";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";
import SignUp from "./pages/SignUp";
import NewGoal from "./pages/NewGoal";
import Pricing from "./pages/Pricing";
import Community from "./pages/Community";
import AdventureMap from "./pages/AdventureMap";

// Create authentication context
export const AuthContext = createContext<{
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

const queryClient = new QueryClient();

const App = () => {
  // Check if user is authenticated from localStorage
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  useEffect(() => {
    // Check for user in localStorage
    const user = localStorage.getItem('growvest_user');
    setIsAuthenticated(!!user);
  }, []);
  
  const login = () => {
    setIsAuthenticated(true);
  };
  
  const logout = () => {
    // Remove user from localStorage
    localStorage.removeItem('growvest_user');
    setIsAuthenticated(false);
  };

  // Protected route component
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!isAuthenticated) {
      return <Navigate to="/" replace />;
    }
    return <>{children}</>;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <TooltipProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/signup" element={<SignUp />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/goals" 
                element={
                  <ProtectedRoute>
                    <Goals />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/goals/new" 
                element={
                  <ProtectedRoute>
                    <NewGoal />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/pricing" 
                element={
                  <ProtectedRoute>
                    <Pricing />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/community" 
                element={
                  <ProtectedRoute>
                    <Community />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/adventure-map" 
                element={
                  <ProtectedRoute>
                    <AdventureMap />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/onboarding" 
                element={
                  <ProtectedRoute>
                    <Onboarding />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Onboarding />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </BrowserRouter>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
};

export default App;
