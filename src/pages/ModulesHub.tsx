import { Shield, Target, Lock, Users, RefreshCw, Database } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';

const ModulesHub = () => {
  const navigate = useNavigate();

  const modules = [
    {
      id: 'password',
      name: 'Password Security',
      icon: Shield,
      description: 'Master strong password creation and management techniques',
      progress: 0,
      challenges: 8,
      xpReward: 150,
      difficulty: 'Beginner',
      estimatedTime: '15 min',
      topics: ['Password strength', 'Password managers', 'Common attacks'],
    },
    {
      id: 'phishing',
      name: 'Phishing Defense',
      icon: Target,
      description: 'Identify and avoid email and web-based social engineering threats',
      progress: 0,
      challenges: 10,
      xpReward: 200,
      difficulty: 'Intermediate',
      estimatedTime: '20 min',
      topics: ['Email analysis', 'URL inspection', 'Social engineering tactics'],
    },
    {
      id: 'privacy',
      name: 'Privacy Protection',
      icon: Lock,
      description: 'Safeguard your personal information across digital platforms',
      progress: 0,
      challenges: 6,
      xpReward: 120,
      difficulty: 'Beginner',
      estimatedTime: '12 min',
      topics: ['Social media privacy', '2FA setup', 'Data sharing'],
    },
    {
      id: 'updates',
      name: 'Updates & Patches',
      icon: RefreshCw,
      description: 'Keep your systems secure with proper update management',
      progress: 0,
      challenges: 5,
      xpReward: 100,
      difficulty: 'Beginner',
      estimatedTime: '10 min',
      topics: ['Auto-updates', 'Security patches', 'End-of-life software'],
    },
    {
      id: 'backups',
      name: 'Data Protection',
      icon: Database,
      description: 'Protect against data loss with effective backup strategies',
      progress: 0,
      challenges: 5,
      xpReward: 140,
      difficulty: 'Intermediate',
      estimatedTime: '18 min',
      topics: ['3-2-1 backup rule', 'Ransomware recovery', 'Cloud backups'],
    },
    {
      id: 'team-security',
      name: 'Team Security',
      icon: Users,
      description: 'Learn collaborative security practices for teams',
      progress: 0,
      challenges: 9,
      xpReward: 180,
      difficulty: 'Advanced',
      estimatedTime: '25 min',
      topics: ['Incident response', 'Security policies', 'Team training'],
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-success';
      case 'Intermediate': return 'text-warning';
      case 'Advanced': return 'text-danger';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Learning Modules</h1>
          <p className="text-muted-foreground">
            Choose your cybersecurity learning path. Complete challenges to earn XP and unlock badges.
          </p>
        </div>

        {/* Module Grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {modules.map((module) => (
            <Card 
              key={module.id} 
              className={`bg-gradient-card border-border hover:shadow-glow transition-all duration-300 cursor-pointer`}
              onClick={() => navigate(`/modules/${module.id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <module.icon className="h-8 w-8 text-accent" />
                    <div>
                      <CardTitle className="text-lg">{module.name}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getDifficultyColor(module.difficulty)}`}
                        >
                          {module.difficulty}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{module.estimatedTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <CardDescription className="mt-2">{module.description}</CardDescription>
              </CardHeader>
              
              <CardContent>
                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span>{module.progress}% complete</span>
                  </div>
                  <Progress value={module.progress} />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Challenges</p>
                    <p className="font-semibold">{module.challenges}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">XP Reward</p>
                    <p className="font-semibold text-accent">{module.xpReward}</p>
                  </div>
                </div>

                {/* Topics */}
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-2">Topics covered:</p>
                  <div className="flex flex-wrap gap-1">
                    {module.topics.map((topic) => (
                      <Badge key={topic} variant="secondary" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <Button 
                  className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
                >
                  {module.progress > 0 ? 'Continue Module' : 'Start Module'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Learning Path Recommendation */}
        <Card className="mt-8 bg-gradient-card border-border shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-accent" />
              Recommended Learning Path
            </CardTitle>
            <CardDescription>
              Based on your assessment, we suggest starting with these modules in order
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-accent text-accent-foreground">1. Password Security</Badge>
              <Badge variant="outline">2. Phishing Defense</Badge>
              <Badge variant="outline">3. Privacy Protection</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              Complete the recommended modules first to build a solid foundation, then explore advanced topics.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ModulesHub;