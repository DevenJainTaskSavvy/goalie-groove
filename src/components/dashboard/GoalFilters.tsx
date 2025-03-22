
import React from 'react';
import { Button } from '@/components/ui/button';
import { Filter, ArrowDownAZ, ArrowUpZA } from 'lucide-react';
import { GoalCategory } from '@/types/finance';
import GlassCard from '@/components/ui/GlassCard';

interface GoalFiltersProps {
  filter: GoalCategory | 'All';
  setFilter: (filter: GoalCategory | 'All') => void;
  categories: (GoalCategory | 'All')[];
  sortOrder: 'asc' | 'desc';
  toggleSortOrder: () => void;
}

const GoalFilters: React.FC<GoalFiltersProps> = ({
  filter,
  setFilter,
  categories,
  sortOrder,
  toggleSortOrder,
}) => {
  return (
    <GlassCard className="mb-8 p-4">
      <div className="flex flex-wrap items-center justify-between">
        <div className="flex flex-wrap items-center gap-2 mb-2 md:mb-0">
          <Filter className="h-5 w-5 mr-2 text-muted-foreground" />
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={filter === category ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(category)}
                className="text-xs"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={toggleSortOrder}
          className="flex items-center gap-1"
        >
          {sortOrder === 'desc' ? (
            <>
              <ArrowDownAZ className="h-4 w-4" />
              <span>Highest Amount Due First</span>
            </>
          ) : (
            <>
              <ArrowUpZA className="h-4 w-4" />
              <span>Lowest Amount Due First</span>
            </>
          )}
        </Button>
      </div>
    </GlassCard>
  );
};

export default GoalFilters;
