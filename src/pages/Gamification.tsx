import { useState } from 'react';
import { Gamepad2, Trophy, Users, Target, RotateCcw, Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navigation from '@/components/Navigation';
import { StreakCounter } from '@/components/StreakCounter';
import { Leaderboard } from '@/components/Leaderboard';
import { SpinWheel, QuickQuiz } from '@/components/MiniGames';
import { CommunityFeed, FriendChallenges } from '@/components/SocialFeatures';

const Gamification = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
            <Gamepad2 className="h-8 w-8 text-accent" />
            Gamification Hub
          </h1>
          <p className="text-muted-foreground">
            Engage with interactive features, compete with others, and track your progress!
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="games" className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              Mini Games
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Leaderboard
            </TabsTrigger>
            <TabsTrigger value="community" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Community
            </TabsTrigger>
            <TabsTrigger value="streaks" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Streaks
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <StreakCounter />
              <Leaderboard />
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <QuickQuiz />
              <FriendChallenges />
            </div>
          </TabsContent>

          <TabsContent value="games" className="space-y-6 mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <SpinWheel />
              <QuickQuiz />
            </div>
          </TabsContent>

          <TabsContent value="leaderboard" className="mt-6">
            <Leaderboard />
          </TabsContent>

          <TabsContent value="community" className="mt-6">
            <CommunityFeed />
          </TabsContent>

          <TabsContent value="streaks" className="space-y-6 mt-6">
            <StreakCounter />
            <div className="grid md:grid-cols-2 gap-6">
              <FriendChallenges />
              <SpinWheel />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Gamification;