
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';

interface SignupSuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

const SignupSuccessDialog: React.FC<SignupSuccessDialogProps> = ({ isOpen, onClose, email }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass border-white/10">
        <DialogHeader>
          <DialogTitle>Account Created Successfully</DialogTitle>
          <DialogDescription>
            Your account has been created successfully. You can now sign in using your credentials.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-gray-300">
            Your account with email <span className="font-semibold">{email}</span> is ready to use.
          </p>
        </div>
        
        <DialogFooter>
          <Button onClick={onClose} className="bg-brand-red hover:bg-brand-red/90">
            Continue to Sign In
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SignupSuccessDialog;
