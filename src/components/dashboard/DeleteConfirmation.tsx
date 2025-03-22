
import React from 'react';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface DeleteConfirmationProps {
  title: string;
  onConfirm: () => void;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({ title, onConfirm }) => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete Goal</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete the goal "{title}"? This action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="mt-4">
        <Button variant="outline" type="button">
          Cancel
        </Button>
        <Button
          variant="destructive"
          type="button"
          onClick={onConfirm}
        >
          Delete
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default DeleteConfirmation;
