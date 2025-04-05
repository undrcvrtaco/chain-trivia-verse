
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserProfile } from '@/types';
import { Trophy, User } from 'lucide-react';

interface UserProfileCardProps {
  profile: UserProfile;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ profile }) => {
  const displayName = profile.ensName || profile.lensHandle || profile.farcasterName || profile.address.slice(0, 6) + '...' + profile.address.slice(-4);
  
  const accuracy = profile.totalAnswered > 0 
    ? Math.round((profile.totalCorrect / profile.totalAnswered) * 100) 
    : 0;
  
  return (
    <Card className="bg-trivia-background/80 border-trivia-primary/30">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-trivia-primary/20 flex items-center justify-center mr-3">
            <User className="h-5 w-5 text-trivia-primary" />
          </div>
          <div>
            <div className="text-lg font-bold">{displayName}</div>
            <div className="text-xs text-muted-foreground">
              {profile.address.slice(0, 6)}...{profile.address.slice(-4)}
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="bg-trivia-background/50 p-3 rounded-lg border border-trivia-primary/20">
            <div className="text-xs text-muted-foreground">Current Streak</div>
            <div className="text-xl font-bold flex items-center">
              <Trophy className="h-4 w-4 text-trivia-primary mr-1" />
              {profile.currentStreak} days
            </div>
          </div>
          <div className="bg-trivia-background/50 p-3 rounded-lg border border-trivia-primary/20">
            <div className="text-xs text-muted-foreground">Best Streak</div>
            <div className="text-xl font-bold flex items-center">
              <Trophy className="h-4 w-4 text-trivia-accent mr-1" />
              {profile.bestStreak} days
            </div>
          </div>
          <div className="bg-trivia-background/50 p-3 rounded-lg border border-trivia-primary/20">
            <div className="text-xs text-muted-foreground">Total Correct</div>
            <div className="text-xl font-bold text-trivia-secondary">{profile.totalCorrect}</div>
          </div>
          <div className="bg-trivia-background/50 p-3 rounded-lg border border-trivia-primary/20">
            <div className="text-xs text-muted-foreground">Accuracy</div>
            <div className="text-xl font-bold text-trivia-accent">{accuracy}%</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfileCard;
