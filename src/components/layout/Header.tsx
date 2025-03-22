
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Home, LineChart, Target, User } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Dashboard', path: '/dashboard', icon: LineChart },
    { name: 'Goals', path: '/goals', icon: Target },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/5">
      <div className="container mx-auto py-4 px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-gradient">DEZERV</Link>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
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
        
        <div className="md:hidden flex items-center space-x-6">
          {navItems.map((item) => {
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
        </div>
      </div>
    </header>
  );
};

export default Header;
