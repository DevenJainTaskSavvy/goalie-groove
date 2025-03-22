
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Home, Info, CreditCard } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

interface NavbarProps {
  transparent?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ transparent = false }) => {
  return (
    <header className={cn(
      'w-full py-4 px-6 flex items-center justify-between',
      transparent ? 'absolute top-0 left-0 z-50 bg-transparent' : 'bg-background/80 backdrop-blur-md border-b border-white/5'
    )}>
      <div className="flex items-center">
        <Link to="/" className="text-2xl font-bold text-gradient mr-8">GROWVEST</Link>
        
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Link to="/#about">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <Info className="mr-2 h-4 w-4" />
                  About Us
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Link to="/#pricing">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pricing
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      
      <div className="flex items-center space-x-4">
        <Link to="/signup" className="hidden md:block">
          <Button variant="outline" size="sm">
            Login
          </Button>
        </Link>
        <Link to="/signup">
          <Button size="sm">
            Sign Up
          </Button>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
