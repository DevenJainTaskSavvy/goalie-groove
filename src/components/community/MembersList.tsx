
import React from 'react';
import { 
  Card,
  CardContent
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { UserPlus, MoreHorizontal, UserCheck, Shield } from 'lucide-react';
import { CircleMember } from '@/types/community';
import { formatDate } from '@/services/utils/formatters';

interface MembersListProps {
  members: CircleMember[];
  onInviteMember: () => void;
  circleAdmin: string;
}

const MembersList: React.FC<MembersListProps> = ({ 
  members, 
  onInviteMember,
  circleAdmin
}) => {
  const formatMemberDate = (date: Date) => {
    return formatDate(date);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Circle Members</h3>
        <span className="text-sm text-muted-foreground">{members.length} members</span>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Contribution</TableHead>
              <TableHead className="text-right">Joined</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      {member.name.charAt(0)}
                    </div>
                    <span>{member.name}</span>
                    {member.name === circleAdmin && (
                      <Badge variant="outline" className="ml-2 bg-primary/10">
                        <Shield className="h-3 w-3 mr-1" />
                        Admin
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {member.name === circleAdmin ? (
                    <Badge variant="outline" className="bg-primary/10">Owner</Badge>
                  ) : (
                    <Badge variant="outline">Member</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  ${member.contribution.toLocaleString()}
                </TableCell>
                <TableCell className="text-right text-sm text-muted-foreground">
                  {formatMemberDate(member.joinedAt)}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <Button 
        variant="outline" 
        className="w-full mt-6"
        onClick={onInviteMember}
      >
        <UserPlus className="mr-2 h-4 w-4" />
        Invite New Member
      </Button>
    </div>
  );
};

export default MembersList;
