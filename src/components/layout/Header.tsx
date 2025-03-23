
import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Home, LineChart, Target, User, LogOut, CreditCard, Users, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthContext } from '@/App';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useContext(AuthContext);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const isLandingPage = location.pathname === '/';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Home', path: '/', icon: Home, alwaysShow: true },
    { name: 'Dashboard', path: '/dashboard', icon: LineChart, requiresAuth: true },
    { name: 'Goals', path: '/goals', icon: Target, requiresAuth: true },
    { name: 'Community', path: '/community', icon: Users, requiresAuth: true },
    { name: 'Adventure Map', path: '/adventure-map', icon: Map, requiresAuth: true },
    { name: 'Pricing', path: '/pricing', icon: CreditCard, requiresAuth: true },
    { name: 'Profile', path: '/profile', icon: User, requiresAuth: true },
  ];

  // Filter nav items based on authentication status
  const filteredNavItems = navItems.filter(item => 
    item.alwaysShow || (item.requiresAuth && isAuthenticated)
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/5">
      <div className="container mx-auto py-4 px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-gradient">GROWVEST</Link>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          {filteredNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'text-sm font-medium relative px-2 py-1.5 transition-colors',
                'hover:text-primary',
                {
                  'text-primary': isActive(item.path),
                  'text-muted-foreground': !isActive(item.path),
                }
              )}
            >
              <span className="smooth-transition">{item.name}</span>
              {isActive(item.path) && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full animate-scale-in" />
              )}
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center space-x-3">
          {isLandingPage && !isAuthenticated ? (
            <>
              <Link to="/signup">
                <Button variant="outline" size="sm" className="hidden md:inline-flex">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" className="hidden md:inline-flex">
                  Sign Up
                </Button>
              </Link>
            </>
          ) : isAuthenticated ? (
            <Button variant="outline" size="sm" onClick={handleLogout} className="hidden md:inline-flex gap-2">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          ) : null}
          
          <div className="md:hidden flex items-center space-x-6">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'text-sm relative p-1.5 transition-colors',
                    {
                      'text-primary': isActive(item.path),
                      'text-muted-foreground': !isActive(item.path),
                    }
                  )}
                >
                  <Icon size={24} className="smooth-transition" />
                  {isActive(item.path) && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full animate-scale-in" />
                  )}
                </Link>
              );
            })}
            
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="text-sm relative p-1.5 transition-colors text-muted-foreground"
              >
                <LogOut size={24} className="smooth-transition" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
