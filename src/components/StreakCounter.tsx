import { useState, useEffect } from 'react';
import { Calendar, Flame, Gift } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useGame } from '@/contexts/GameContext';
import { toast } from '@/hooks/use-toast';

export const StreakCounter = () => {
  const { state, dispatch } = useGame();
  const [showReward, setShowReward] = useState(false);
  const [canClaimReward, setCanClaimReward] = useState(false);

  useEffect(() => {
    if (!state.user) return;
    
    const today = new Date().toDateString();
    const lastLogin = new Date(state.user.lastLoginDate).toDateString();
    
    // Check if user can claim daily reward
    if (today !== lastLogin) {
      setCanClaimReward(true);
    }
  }, [state.user]);

  const claimDailyReward = () => {
    if (!state.user || !canClaimReward) return;
    
    const streakBonus = Math.min(state.user.dailyLoginStreak * 5, 50);
    const baseReward = 20;
    const totalReward = baseReward + streakBonus;
    
    dispatch({ type: 'UPDATE_DAILY_STREAK' });
    dispatch({ type: 'ADD_XP', payload: totalReward });
    dispatch({ 
      type: 'ADD_ACHIEVEMENT', 
      payload: {
        id: `daily-${Date.now()}`,
        type: 'streak',
        title: 'Daily Login',
        description: `Logged in for ${state.user.dailyLoginStreak + 1} days in a row!`,
        value: totalReward,
        timestamp: new Date()
      }
    });
    
    setShowReward(true);
    setCanClaimReward(false);
    
    toast({
      title: "Daily Reward Claimed!",
      description: `+${totalReward} XP (${baseReward} base + ${streakBonus} streak bonus)`,
    });
    
    setTimeout(() => setShowReward(false), 3000);
  };

  if (!state.user) return null;

  return (
    <Card className="bg-gradient-card border-border relative overflow-hidden">
      {showReward && (
        <div className="absolute inset-0 bg-gradient-primary/20 animate-pulse z-10 flex items-center justify-center">
          <div className="text-center">
            <Gift className="h-12 w-12 text-accent mx-auto mb-2 animate-bounce" />
            <p className="text-xl font-bold text-accent">Reward Claimed!</p>
          </div>
        </div>
      )}
      
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          Daily Streak
        </CardTitle>
        <CardDescription>Keep your learning momentum going!</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Flame className="h-8 w-8 text-orange-500" />
            <span className="text-4xl font-bold text-foreground">
              {state.user.dailyLoginStreak}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">Day streak</p>
        </div>

        <div className="flex justify-center gap-1">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className={`w-6 h-6 rounded-full border-2 ${
                i < (state.user?.dailyLoginStreak || 0) % 7
                  ? 'bg-orange-500 border-orange-500'
                  : 'border-muted-foreground/30'
              }`}
            />
          ))}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Streak Milestones</span>
            <span className="text-muted-foreground">
              Next: {Math.ceil((state.user.dailyLoginStreak + 1) / 7) * 7} days
            </span>
          </div>
          
          <div className="flex flex-wrap gap-1">
            {[7, 14, 30, 50, 100].map((milestone) => (
              <Badge
                key={milestone}
                variant={state.user!.dailyLoginStreak >= milestone ? "default" : "outline"}
                className="text-xs"
              >
                {milestone}d
              </Badge>
            ))}
          </div>
        </div>

        {canClaimReward && (
          <Button 
            onClick={claimDailyReward}
            className="w-full bg-gradient-primary hover:shadow-glow animate-pulse"
          >
            <Gift className="h-4 w-4 mr-2" />
            Claim Daily Reward (+{20 + Math.min(state.user.dailyLoginStreak * 5, 50)} XP)
          </Button>
        )}
        
        {!canClaimReward && (
          <div className="text-center py-2">
            <Calendar className="h-6 w-6 text-success mx-auto mb-1" />
            <p className="text-sm text-success">Daily reward claimed!</p>
            <p className="text-xs text-muted-foreground">Come back tomorrow for more XP</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};