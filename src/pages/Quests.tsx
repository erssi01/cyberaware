import { Target, Calendar, Zap, Trophy } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';

const Quests = () => {
  const currentQuests = [
    {
      id: 'daily-challenge',
      title: 'Daily Challenge',
      description: 'Complete 2 challenges in any module',
      progress: 0,
      maxProgress: 2,
      xpReward: 25,
      timeLeft: '18h 23m',
      type: 'daily',
    },
    {
      id: 'phishing-focus',
      title: 'Phishing Focus',
      description: 'Complete 3 phishing challenges this week',
      progress: 1,
      maxProgress: 3,
      xpReward: 50,
      timeLeft: '4d 12h',
      type: 'weekly',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
            <Target className="h-8 w-8 text-accent" />
            Daily & Weekly Quests
          </h1>
          <p className="text-muted-foreground">Complete quests to earn bonus XP and stay engaged</p>
        </div>

        <div className="grid gap-6">
          {currentQuests.map((quest) => (
            <Card key={quest.id} className="bg-gradient-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-accent" />
                    {quest.title}
                  </CardTitle>
                  <Badge variant={quest.type === 'daily' ? 'default' : 'secondary'}>
                    {quest.type}
                  </Badge>
                </div>
                <CardDescription>{quest.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span>{quest.progress} / {quest.maxProgress}</span>
                  </div>
                  <Progress value={(quest.progress / quest.maxProgress) * 100} />
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-accent" />
                    <span className="text-sm font-medium">+{quest.xpReward} XP</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{quest.timeLeft} left</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Quests;