import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Shield, Trophy, Target, Zap, Calendar, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useGame } from '@/contexts/GameContext';
import Navigation from '@/components/Navigation';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useGame();
  const [assessmentResults, setAssessmentResults] = useState<any>(null);

  useEffect(() => {
    if (location.state?.assessmentResults) {
      setAssessmentResults(location.state.assessmentResults);
    }
  }, [location.state]);

  if (!state.user) {
    navigate('/welcome');
    return null;
  }

  const levelProgress = (state.user.xp % 200) / 200 * 100;
  const nextLevelXp = state.user.level * 200;

  const modules = [
    {
      id: 'password',
      name: 'Password Security',
      icon: Shield,
      description: 'Master strong password creation and management',
      progress: 0,
      recommended: assessmentResults?.recommendedModules?.includes('password'),
    },
    {
      id: 'phishing',
      name: 'Phishing Defense',
      icon: Target,
      description: 'Identify and avoid email and web-based threats',
      progress: 0,
      recommended: assessmentResults?.recommendedModules?.includes('phishing'),
    },
    {
      id: 'privacy',
      name: 'Privacy Protection',
      icon: Shield,
      description: 'Safeguard your personal information online',
      progress: 0,
      recommended: assessmentResults?.recommendedModules?.includes('privacy'),
    },
  ];

  const stats = [
    { label: 'Total XP', value: state.user.xp, icon: Zap, color: 'text-accent' },
    { label: 'Current Level', value: state.user.level, icon: TrendingUp, color: 'text-success' },
    { label: 'Badges Earned', value: state.user.badges.length, icon: Trophy, color: 'text-warning' },
    { label: 'Streak Days', value: state.user.streakDays, icon: Calendar, color: 'text-primary' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {state.user.nickname}!
          </h1>
          <p className="text-muted-foreground">
            Continue your cybersecurity learning journey
          </p>
        </div>

        {/* Assessment Results */}
        {assessmentResults && (
          <Card className="mb-8 bg-gradient-card border-border shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-success" />
                Assessment Complete
              </CardTitle>
              <CardDescription>
                Based on your assessment, we've personalized your learning path
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Knowledge Score</p>
                  <div className="flex items-center gap-2">
                    <Progress value={assessmentResults.knowledgePercentage} className="flex-1" />
                    <span className="text-sm font-medium">{assessmentResults.knowledgePercentage.toFixed(0)}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Recommended Focus Areas</p>
                  <div className="flex flex-wrap gap-1">
                    {assessmentResults.recommendedModules.map((module: string) => (
                      <Badge key={module} variant="secondary" className="text-xs">
                        {module.charAt(0).toUpperCase() + module.slice(1)}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label} className="bg-gradient-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Level Progress */}
        <Card className="mb-8 bg-gradient-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Level {state.user.level}</h3>
              <span className="text-sm text-muted-foreground">
                {state.user.xp % 200} / 200 XP
              </span>
            </div>
            <Progress value={levelProgress} className="mb-2" />
            <p className="text-sm text-muted-foreground">
              {nextLevelXp - state.user.xp} XP to level {state.user.level + 1}
            </p>
          </CardContent>
        </Card>

        {/* Learning Modules */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Learning Modules</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => (
              <Card 
                key={module.id} 
                className={`bg-gradient-card border-border hover:shadow-glow transition-all duration-300 cursor-pointer ${
                  module.recommended ? 'ring-2 ring-accent' : ''
                }`}
                onClick={() => navigate(`/modules/${module.id}`)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <module.icon className="h-8 w-8 text-accent" />
                    {module.recommended && (
                      <Badge className="bg-accent text-accent-foreground">Recommended</Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg">{module.name}</CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{module.progress}%</span>
                    </div>
                    <Progress value={module.progress} />
                  </div>
                  <Button className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300">
                    {module.progress > 0 ? 'Continue' : 'Start Module'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-gradient-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-warning" />
                Your Badges
              </CardTitle>
            </CardHeader>
            <CardContent>
              {state.user.badges.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {state.user.badges.map((badge) => (
                    <Badge key={badge} variant="outline">
                      {badge}
                    </Badge>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground mb-2">No badges yet</p>
                  <Button variant="outline" onClick={() => navigate('/badges')}>
                    View Available Badges
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-accent" />
                Today's Quest
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Complete 2 challenges in any module</p>
              <Progress value={0} className="mb-2" />
              <p className="text-sm text-muted-foreground">0 / 2 challenges completed</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;