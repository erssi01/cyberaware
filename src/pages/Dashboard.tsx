import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Shield, Trophy, Target, Zap, Calendar, TrendingUp, BookOpen, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useGame } from '@/contexts/GameContext';
import Navigation from '@/components/Navigation';
import { Breadcrumb } from '@/components/Breadcrumb';
import { AchievementToast } from '@/components/AchievementToast';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useGame();
  const [assessmentResults, setAssessmentResults] = useState<any>(null);
  const [achievement, setAchievement] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (location.state?.assessmentResults) {
      setAssessmentResults(location.state.assessmentResults);
    }
    
    // Simulate loading for smooth UX
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
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
      progress: Math.floor(Math.random() * 30), // Simulated progress
      challenges: 8,
      estimatedTime: '45 min',
      difficulty: 'Beginner',
      recommended: assessmentResults?.recommendedModules?.includes('password'),
    },
    {
      id: 'phishing',
      name: 'Phishing Defense',
      icon: Target,
      description: 'Identify and avoid email and web-based threats',
      progress: Math.floor(Math.random() * 25),
      challenges: 12,
      estimatedTime: '60 min',
      difficulty: 'Intermediate',
      recommended: assessmentResults?.recommendedModules?.includes('phishing'),
    },
    {
      id: 'privacy',
      name: 'Privacy Protection',
      icon: Shield,
      description: 'Safeguard your personal information online',
      progress: Math.floor(Math.random() * 20),
      challenges: 10,
      estimatedTime: '50 min',
      difficulty: 'Beginner',
      recommended: assessmentResults?.recommendedModules?.includes('privacy'),
    },
    {
      id: 'updates',
      name: 'System Updates',
      icon: TrendingUp,
      description: 'Keep your systems secure with proper updates',
      progress: Math.floor(Math.random() * 15),
      challenges: 6,
      estimatedTime: '30 min',
      difficulty: 'Beginner',
      recommended: assessmentResults?.recommendedModules?.includes('updates'),
    },
  ];

  const stats = [
    { label: 'Total XP', value: state.user.xp, icon: Zap, color: 'text-accent' },
    { label: 'Current Level', value: state.user.level, icon: TrendingUp, color: 'text-success' },
    { label: 'Badges Earned', value: state.user.badges.length, icon: Trophy, color: 'text-warning' },
    { label: 'Streak Days', value: state.user.streakDays, icon: Calendar, color: 'text-primary' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="loading-pulse w-16 h-16 rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background page-enter-active">
      <Navigation />
      <AchievementToast 
        achievement={achievement} 
        onClose={() => setAchievement(null)} 
      />
      
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb />
        
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 bg-gradient-hero bg-clip-text text-transparent">
            Welcome back, {state.user.nickname}!
          </h1>
          <p className="text-lg text-muted-foreground">
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
          {stats.map((stat, index) => (
            <Card 
              key={stat.label} 
              className="bg-gradient-card border-border hover-lift"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground progress-animate">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Level Progress */}
        <Card className="mb-8 bg-gradient-card border-border hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-gradient-level">
                  <TrendingUp className="h-5 w-5 text-background" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Level {state.user.level}</h3>
                  <p className="text-sm text-muted-foreground">Security Apprentice</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">XP Progress</p>
                <span className="text-lg font-bold text-foreground">
                  {state.user.xp % 200} / 200
                </span>
              </div>
            </div>
            <Progress value={levelProgress} className="mb-3 progress-animate h-3" />
            <div className="flex justify-between text-sm">
              <span className="text-success">+{state.user.xp % 200} XP earned</span>
              <span className="text-muted-foreground">
                {nextLevelXp - state.user.xp} XP to next level
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Learning Modules */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-foreground">Learning Modules</h2>
            <Button variant="outline" onClick={() => navigate('/modules')}>
              <BookOpen className="h-4 w-4 mr-2" />
              View All Modules
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module, index) => (
              <Card 
                key={module.id} 
                className={`bg-gradient-card border-border hover-lift hover-glow cursor-pointer group ${
                  module.recommended ? 'ring-2 ring-accent shadow-cyber' : ''
                }`}
                onClick={() => navigate(`/modules/${module.id}`)}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="p-2 rounded-lg bg-gradient-cyber group-hover:shadow-glow transition-all duration-300">
                      <module.icon className="h-6 w-6 text-background" />
                    </div>
                    {module.recommended && (
                      <Badge className="bg-accent text-accent-foreground shadow-glow">
                        Recommended
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg group-hover:text-accent transition-colors">
                    {module.name}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {module.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Module Stats */}
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      <span>{module.challenges} challenges</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{module.estimatedTime}</span>
                    </div>
                  </div>

                  {/* Difficulty Badge */}
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {module.difficulty}
                    </Badge>
                  </div>

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{module.progress}%</span>
                    </div>
                    <Progress value={module.progress} className="progress-animate" />
                  </div>
                  
                  <Button className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300 group-hover:scale-105">
                    {module.progress > 0 ? 'Continue Learning' : 'Start Module'}
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