
import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedText from '@/components/ui/AnimatedText';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface DashboardHeaderProps {
  userName: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ userName }) => {
  return (
    <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <AnimatedText 
          text={`Welcome back, ${userName || 'Investor'}`}
          element="h1"
          className="text-3xl font-bold mb-2" 
        />
        <p className="text-muted-foreground">Your financial overview and goal progress</p>
      </div>
      
      <div className="mt-4 md:mt-0 flex space-x-4">
        <Link to="/goals/new">
          <Button variant="outline" className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Add Goal
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default DashboardHeader;
