
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Share2 } from 'lucide-react';

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  result: {
    correct: number;
    total: number;
    streak: number;
  };
}

const ShareModal: React.FC<ShareModalProps> = ({ open, onClose, result }) => {
  const [recipient, setRecipient] = useState('');
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    if (!recipient) {
      toast.error('Please enter a recipient address or ENS name');
      return;
    }

    setIsSharing(true);
    
    // Mock XMTP sharing
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success(`Result shared with ${recipient}!`);
      onClose();
    } catch (error) {
      toast.error('Failed to share results. Please try again.');
    } finally {
      setIsSharing(false);
    }
  };

  const handleCopyLink = () => {
    // Generate a shareable link
    const shareText = `I scored ${result.correct}/${result.total} on Chain Trivia today! My current streak is ${result.streak} days. Play at chain-trivia-verse.vercel.app`;
    
    navigator.clipboard.writeText(shareText)
      .then(() => toast.success('Copied to clipboard!'))
      .catch(() => toast.error('Failed to copy.'));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-trivia-background border-trivia-primary/30">
        <DialogHeader>
          <DialogTitle>Share Your Results</DialogTitle>
          <DialogDescription>
            Share your trivia results with friends via XMTP or copy a shareable message.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="recipient">Send via XMTP to:</Label>
            <Input
              id="recipient"
              placeholder="ENS name or wallet address"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="bg-trivia-background/50 border-trivia-primary/30"
            />
          </div>
          
          <div className="p-4 rounded-md bg-trivia-primary/10 text-center">
            <p className="font-medium">Today's Score</p>
            <p className="text-2xl font-bold trivia-gradient mt-1">
              {result.correct}/{result.total}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {result.streak} day streak
            </p>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            className="sm:flex-1 border-trivia-primary/30 text-trivia-primary hover:text-trivia-light hover:bg-trivia-primary/20"
            onClick={handleCopyLink}
          >
            Copy as Text
          </Button>
          <Button 
            className="sm:flex-1 bg-trivia-secondary hover:bg-trivia-secondary/90"
            onClick={handleShare}
            disabled={isSharing}
          >
            {isSharing ? (
              <div className="flex items-center">
                <div className="h-4 w-4 mr-2 rounded-full border-2 border-trivia-light border-t-transparent animate-spin"></div>
                Sending...
              </div>
            ) : (
              <>
                <Share2 className="h-4 w-4 mr-2" />
                Share via XMTP
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
