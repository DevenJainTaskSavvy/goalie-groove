
import React from 'react';
import { 
  Card,
  CardContent
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { InvestmentCircle } from '@/types/community';
import { 
  DollarSign, 
  UserPlus, 
  Calendar, 
  Target, 
  Milestone,
  User, 
  Star
} from 'lucide-react';

interface ActivityFeedProps {
  circle: InvestmentCircle;
}

interface ActivityItem {
  id: string;
  type: 'contribution' | 'member_joined' | 'target_updated' | 'circle_created' | 'goal_reached';
  actorName: string;
  targetName?: string;
  amount?: number;
  date: Date;
  description: string;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ circle }) => {
  // Generate sample activity based on circle data
  const generateSampleActivity = (): ActivityItem[] => {
    const now = new Date();
    
    const activities: ActivityItem[] = [
      {
        id: '1',
        type: 'circle_created',
        actorName: circle.createdBy,
        date: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        description: `created the "${circle.name}" investment circle`
      }
    ];
    
    // Add member joined activities
    circle.members.forEach((member, index) => {
      if (member.name !== circle.createdBy) {
        activities.push({
          id: `join-${member.id}`,
          type: 'member_joined',
          actorName: member.name,
          date: member.joinedAt,
          description: `joined the "${circle.name}" circle`
        });
      }
    });
    
    // Add contribution activities
    circle.members.forEach((member) => {
      activities.push({
        id: `contrib-${member.id}`,
        type: 'contribution',
        actorName: member.name,
        amount: member.contribution,
        date: new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
        description: `contributed $${member.contribution.toLocaleString()} to the circle`
      });
    });
    
    // Sort by date, newest first
    return activities.sort((a, b) => b.date.getTime() - a.date.getTime());
  };
  
  const activityItems = generateSampleActivity();
  
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'contribution':
        return <DollarSign className="h-4 w-4" />;
      case 'member_joined':
        return <UserPlus className="h-4 w-4" />;
      case 'target_updated':
        return <Target className="h-4 w-4" />;
      case 'circle_created':
        return <Milestone className="h-4 w-4" />;
      case 'goal_reached':
        return <Star className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };
  
  const getActivityColor = (type: string) => {
    switch (type) {
      case 'contribution':
        return "bg-green-500/20 text-green-500";
      case 'member_joined':
        return "bg-blue-500/20 text-blue-500";
      case 'target_updated':
        return "bg-yellow-500/20 text-yellow-500";
      case 'circle_created':
        return "bg-purple-500/20 text-purple-500";
      case 'goal_reached':
        return "bg-amber-500/20 text-amber-500";
      default:
        return "bg-gray-500/20 text-gray-500";
    }
  };
  
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInSecs = Math.floor(diffInMs / 1000);
    const diffInMins = Math.floor(diffInSecs / 60);
    const diffInHours = Math.floor(diffInMins / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInSecs < 60) {
      return 'just now';
    } else if (diffInMins < 60) {
      return `${diffInMins} ${diffInMins === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Activity Feed</h3>
        <Badge variant="outline">{activityItems.length} activities</Badge>
      </div>
      
      <div className="space-y-4">
        {activityItems.map((activity) => (
          <Card key={activity.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1 ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1 gap-1">
                    <div className="font-medium text-sm flex items-center">
                      <span className="truncate">{activity.actorName}</span>
                      {activity.type === 'contribution' && (
                        <Badge variant="outline" className="ml-2 bg-green-500/10 text-green-500">
                          +${activity.amount?.toLocaleString()}
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">{formatDate(activity.date)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {activity.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Button variant="outline" className="w-full">
        Load more activities
      </Button>
    </div>
  );
};

export default ActivityFeed;
