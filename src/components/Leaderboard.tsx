import { useState } from 'react';
import { Trophy, Medal, Crown, Zap, Target, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useGame } from '@/contexts/GameContext';

export const Leaderboard = () => {
  const { state } = useGame();
  const [selectedTab, setSelectedTab] = useState('global');

  // Mock leaderboard data - in real app this would come from backend
  const globalLeaderboard = [
    { userId: '1', nickname: 'CyberNinja', xp: 2450, level: 13, badges: 8, streakDays: 15 },
    { userId: '2', nickname: 'SecureSteve', xp: 2100, level: 11, badges: 6, streakDays: 22 },
    { userId: '3', nickname: 'PrivacyPro', xp: 1980, level: 10, badges: 7, streakDays: 8 },
    { userId: '4', nickname: 'PhishingHunter', xp: 1750, level: 9, badges: 5, streakDays: 12 },
    { userId: '5', nickname: 'DataDefender', xp: 1620, level: 9, badges: 4, streakDays: 5 },
    ...(state.user ? [{ 
      userId: state.user.id, 
      nickname: state.user.nickname, 
      xp: state.user.xp, 
      level: state.user.level, 
      badges: state.user.badges.length, 
      streakDays: state.user.dailyLoginStreak || 0 
    }] : [])
  ].sort((a, b) => b.xp - a.xp);

  const weeklyLeaderboard = globalLeaderboard.map(user => ({
    ...user,
    xp: Math.floor(user.xp * 0.3) // Mock weekly XP
  })).sort((a, b) => b.xp - a.xp);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Trophy className="h-5 w-5 text-amber-600" />;
      default: return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    if (rank <= 3) return 'bg-gradient-primary text-primary-foreground';
    if (rank <= 10) return 'bg-accent text-accent-foreground';
    return 'bg-secondary text-secondary-foreground';
  };

  const currentUserRank = globalLeaderboard.findIndex(user => user.userId === state.user?.id) + 1;

  const LeaderboardList = ({ data, isWeekly = false }: { data: any[], isWeekly?: boolean }) => (
    <div className="space-y-2">
      {data.map((user, index) => {
        const rank = index + 1;
        const isCurrentUser = user.userId === state.user?.id;
        
        return (
          <Card 
            key={user.userId}
            className={`transition-all duration-200 ${
              isCurrentUser 
                ? 'bg-gradient-card border-accent shadow-glow ring-1 ring-accent/50' 
                : 'bg-gradient-card border-border hover:shadow-card'
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${getRankBadgeColor(rank)}`}>
                  {getRankIcon(rank)}
                </div>
                
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                    {user.nickname.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className={`font-semibold truncate ${
                      isCurrentUser ? 'text-accent' : 'text-foreground'
                    }`}>
                      {user.nickname}
                      {isCurrentUser && <span className="text-xs text-accent ml-1">(You)</span>}
                    </h3>
                    <Badge variant="outline" className="text-xs">
                      Level {user.level}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      <span>{user.xp.toLocaleString()} XP{isWeekly ? ' this week' : ''}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Trophy className="h-3 w-3" />
                      <span>{user.badges} badges</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      <span>{user.streakDays}d streak</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-foreground">#{rank}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  return (
    <Card className="bg-gradient-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-warning" />
          Leaderboard
        </CardTitle>
        <CardDescription>
          Compete with other learners and climb the ranks!
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {state.user && currentUserRank > 0 && (
          <div className="mb-6 p-4 bg-gradient-primary/10 rounded-lg border border-accent/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Your Current Rank</p>
                <p className="text-2xl font-bold text-accent">#{currentUserRank}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Progress to Next Rank</p>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium">
                    {currentUserRank > 1 
                      ? `${globalLeaderboard[currentUserRank - 2].xp - state.user.xp} XP to go`
                      : 'You\'re #1!'
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="global">All Time</TabsTrigger>
            <TabsTrigger value="weekly">This Week</TabsTrigger>
          </TabsList>
          
          <TabsContent value="global" className="mt-4">
            <LeaderboardList data={globalLeaderboard.slice(0, 10)} />
          </TabsContent>
          
          <TabsContent value="weekly" className="mt-4">
            <LeaderboardList data={weeklyLeaderboard.slice(0, 10)} isWeekly />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};