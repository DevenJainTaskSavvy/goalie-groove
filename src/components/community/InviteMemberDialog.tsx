
import React, { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus, Mail, AtSign, Check } from 'lucide-react';

interface InviteMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  circleName: string;
  onInvite: (email: string) => void;
}

const InviteMemberDialog: React.FC<InviteMemberDialogProps> = ({
  open,
  onOpenChange,
  circleName,
  onInvite
}) => {
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  
  const handleInvite = () => {
    if (email && !isSending) {
      setIsSending(true);
      
      // Simulate sending invitation
      setTimeout(() => {
        onInvite(email);
        setIsSending(false);
        setIsSent(true);
        
        // Reset after a short delay
        setTimeout(() => {
          setIsSent(false);
          setEmail('');
          onOpenChange(false);
        }, 1500);
      }, 1000);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite to "{circleName}"</DialogTitle>
          <DialogDescription>
            Send an invitation to join your investment circle
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <div className="relative">
              <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                placeholder="friend@example.com"
                type="email"
                className="pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSending || isSent}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Invitation message</Label>
            <div className="rounded-md border p-3 text-sm">
              Hey! I'm inviting you to join my investment circle "{circleName}". We're saving together to reach our financial goals faster. Join me!
            </div>
          </div>
        </div>
        
        <DialogFooter className="sm:justify-between">
          <Button
            type="button"
            variant="ghost"
            disabled={isSending || isSent}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleInvite}
            disabled={!email || isSending || isSent}
            className="min-w-[120px]"
          >
            {isSending ? (
              <span className="flex items-center">
                <Mail className="mr-2 h-4 w-4 animate-pulse" />
                Sending...
              </span>
            ) : isSent ? (
              <span className="flex items-center">
                <Check className="mr-2 h-4 w-4" />
                Sent!
              </span>
            ) : (
              <span className="flex items-center">
                <UserPlus className="mr-2 h-4 w-4" />
                Send Invite
              </span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InviteMemberDialog;
