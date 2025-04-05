
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LeaderboardEntry, TimeFrame } from '@/types';
import { Trophy, Users } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  timeFrame?: TimeFrame;
  onTimeFrameChange?: (timeFrame: TimeFrame) => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ 
  entries, 
  timeFrame = 'daily',
  onTimeFrameChange = () => {} 
}) => {
  return (
    <Card className="bg-trivia-background/80 border-trivia-primary/30 w-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <Users className="h-5 w-5 text-trivia-primary mr-2" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={timeFrame} onValueChange={(value) => onTimeFrameChange(value as TimeFrame)}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="allTime">All Time</TabsTrigger>
          </TabsList>
          
          {['daily', 'weekly', 'allTime'].map((tf) => (
            <TabsContent key={tf} value={tf}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Rank</TableHead>
                    <TableHead>Player</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                    <TableHead className="text-right">Streak</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entries.map((entry, index) => (
                    <TableRow key={entry.address}>
                      <TableCell className="font-medium">
                        {index < 3 ? (
                          <span className="flex items-center justify-center h-6 w-6 rounded-full bg-trivia-primary/20">
                            <Trophy className={`h-3 w-3 ${
                              index === 0 ? 'text-yellow-500' : 
                              index === 1 ? 'text-gray-300' : 'text-amber-600'
                            }`} />
                          </span>
                        ) : (
                          index + 1
                        )}
                      </TableCell>
                      <TableCell>{entry.displayName}</TableCell>
                      <TableCell className="text-right">{entry.score}</TableCell>
                      <TableCell className="text-right">{entry.streak}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default Leaderboard;
