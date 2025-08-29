import { Trophy, Shield, Target, Lock, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useGame } from '@/contexts/GameContext';
import Navigation from '@/components/Navigation';

const Badges = () => {
  const { state } = useGame();

  const allBadges = [
    {
      id: 'password-pro',
      name: 'Password Pro',
      description: 'Create 5 strong passwords in a row',
      icon: Shield,
      category: 'Password Security',
      difficulty: 'Beginner',
      xpReward: 50,
      requirements: 'Complete password challenges with perfect scores',
      earned: state.user?.badges.includes('Password Pro') || false,
      progress: 0, // This would be calculated based on actual progress
      maxProgress: 5,
    },
    {
      id: 'phishing-detective',
      name: 'Phishing Detective',
      description: 'Correctly identify 5 phishing attempts',
      icon: Target,
      category: 'Phishing Defense',
      difficulty: 'Intermediate',
      xpReward: 75,
      requirements: 'Successfully spot phishing emails and explain red flags',
      earned: state.user?.badges.includes('Phishing Detective') || false,
      progress: 0,
      maxProgress: 5,
    },
    {
      id: 'privacy-protector',
      name: 'Privacy Protector',
      description: 'Complete all privacy scenarios successfully',
      icon: Lock,
      category: 'Privacy Protection',
      difficulty: 'Intermediate',
      xpReward: 60,
      requirements: 'Master privacy best practices in social media and personal data',
      earned: state.user?.badges.includes('Privacy Protector') || false,
      progress: 0,
      maxProgress: 3,
    },
    {
      id: 'update-hero',
      name: 'Update Hero',
      description: 'Maintain a 7-day update confirmation streak',
      icon: CheckCircle,
      category: 'System Security',
      difficulty: 'Beginner',
      xpReward: 40,
      requirements: 'Confirm software updates for 7 consecutive days',
      earned: false,
      progress: 0,
      maxProgress: 7,
      comingSoon: true,
    },
    {
      id: 'data-guardian',
      name: 'Data Guardian',
      description: 'Complete backup simulation and quiz with 80%+ score',
      icon: Shield,
      category: 'Data Protection',
      difficulty: 'Intermediate',
      xpReward: 65,
      requirements: 'Demonstrate mastery of backup strategies and recovery',
      earned: false,
      progress: 0,
      maxProgress: 1,
      comingSoon: true,
    },
    {
      id: 'cyber-master',
      name: 'Cyber Master',
      description: 'Earn all other badges and reach Level 10',
      icon: Trophy,
      category: 'Achievement',
      difficulty: 'Expert',
      xpReward: 200,
      requirements: 'Complete all modules and demonstrate comprehensive cybersecurity knowledge',
      earned: false,
      progress: 0,
      maxProgress: 1,
      comingSoon: true,
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-success';
      case 'Intermediate': return 'text-warning';
      case 'Expert': return 'text-danger';
      default: return 'text-muted-foreground';
    }
  };

  const earnedBadges = allBadges.filter(badge => badge.earned);
  const availableBadges = allBadges.filter(badge => !badge.earned && !badge.comingSoon);
  const upcomingBadges = allBadges.filter(badge => badge.comingSoon);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
            <Trophy className="h-8 w-8 text-warning" />
            Badge Collection
          </h1>
          <p className="text-muted-foreground">
            Earn badges by completing challenges and demonstrating cybersecurity mastery
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-card border-border">
            <CardContent className="p-4 text-center">
              <Trophy className="h-6 w-6 text-warning mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{earnedBadges.length}</p>
              <p className="text-sm text-muted-foreground">Earned</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card border-border">
            <CardContent className="p-4 text-center">
              <Target className="h-6 w-6 text-accent mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{availableBadges.length}</p>
              <p className="text-sm text-muted-foreground">Available</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card border-border">
            <CardContent className="p-4 text-center">
              <Clock className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{upcomingBadges.length}</p>
              <p className="text-sm text-muted-foreground">Coming Soon</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card border-border">
            <CardContent className="p-4 text-center">
              <Shield className="h-6 w-6 text-success mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">
                {Math.round((earnedBadges.length / allBadges.length) * 100)}%
              </p>
              <p className="text-sm text-muted-foreground">Complete</p>
            </CardContent>
          </Card>
        </div>

        {/* Earned Badges */}
        {earnedBadges.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Your Badges</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {earnedBadges.map((badge) => (
                <Card key={badge.id} className="bg-gradient-success border-success/20 shadow-glow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <badge.icon className="h-8 w-8 text-success" />
                      <Badge className="bg-success text-success-foreground">Earned</Badge>
                    </div>
                    <CardTitle className="text-lg">{badge.name}</CardTitle>
                    <CardDescription>{badge.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Category:</span>
                        <span>{badge.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">XP Reward:</span>
                        <span className="text-accent font-medium">+{badge.xpReward}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Available Badges */}
        {availableBadges.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Available Badges</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableBadges.map((badge) => (
                <Card key={badge.id} className="bg-gradient-card border-border hover:shadow-glow transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <badge.icon className="h-8 w-8 text-muted-foreground" />
                      <Badge 
                        variant="outline" 
                        className={`${getDifficultyColor(badge.difficulty)} border-current`}
                      >
                        {badge.difficulty}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{badge.name}</CardTitle>
                    <CardDescription>{badge.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Progress */}
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{badge.progress} / {badge.maxProgress}</span>
                        </div>
                        <Progress value={(badge.progress / badge.maxProgress) * 100} />
                      </div>
                      
                      {/* Details */}
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Category:</span>
                          <span>{badge.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">XP Reward:</span>
                          <span className="text-accent font-medium">+{badge.xpReward}</span>
                        </div>
                      </div>
                      
                      {/* Requirements */}
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Requirements:</p>
                        <p className="text-xs">{badge.requirements}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Coming Soon Badges */}
        {upcomingBadges.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Coming Soon</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingBadges.map((badge) => (
                <Card key={badge.id} className="bg-gradient-card border-border opacity-75">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <badge.icon className="h-8 w-8 text-muted-foreground" />
                      <Badge className="bg-muted text-muted-foreground">Coming Soon</Badge>
                    </div>
                    <CardTitle className="text-lg text-muted-foreground">{badge.name}</CardTitle>
                    <CardDescription>{badge.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Category:</span>
                        <span className="text-muted-foreground">{badge.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">XP Reward:</span>
                        <span className="text-muted-foreground">+{badge.xpReward}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {earnedBadges.length === 0 && (
          <Card className="bg-gradient-card border-border text-center py-12">
            <CardContent>
              <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No badges earned yet</h3>
              <p className="text-muted-foreground mb-4">
                Complete challenges in the learning modules to start earning badges!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Badges;