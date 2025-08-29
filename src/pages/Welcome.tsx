import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Zap, Trophy, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGame } from '@/contexts/GameContext';

const Welcome = () => {
  const navigate = useNavigate();
  const { dispatch } = useGame();
  const [nickname, setNickname] = useState('');
  const [role, setRole] = useState('');

  const handleStart = () => {
    if (nickname && role) {
      const newUser = {
        id: crypto.randomUUID(),
        nickname,
        role,
        xp: 0,
        level: 1,
        streakDays: 0,
        completedModules: [],
        badges: [],
        lastActivity: new Date(),
      };
      
      dispatch({ type: 'SET_USER', payload: newUser });
      navigate('/assessment');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-cyber flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Shield className="h-16 w-16 text-accent mr-4" />
            <h1 className="text-5xl font-bold text-foreground">CyberAware</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Master cybersecurity through gamified learning. Build essential security habits with 
            interactive challenges, simulations, and real-world scenarios.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-gradient-card border-border shadow-card">
            <CardHeader>
              <Zap className="h-8 w-8 text-accent mb-2" />
              <CardTitle>Interactive Challenges</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Learn through hands-on simulations and real-world scenarios
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border shadow-card">
            <CardHeader>
              <Trophy className="h-8 w-8 text-success mb-2" />
              <CardTitle>Gamified Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Earn XP, unlock badges, and track your cybersecurity mastery
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border shadow-card">
            <CardHeader>
              <Users className="h-8 w-8 text-warning mb-2" />
              <CardTitle>Personalized Learning</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Adaptive content based on your assessment and progress
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Registration Form */}
        <Card className="max-w-md mx-auto bg-gradient-card border-border shadow-cyber">
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>
              Create your profile to begin your cybersecurity journey
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="nickname">Nickname</Label>
              <Input
                id="nickname"
                placeholder="Choose your display name"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="bg-background border-border"
              />
            </div>
            
            <div>
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="professional">Young Professional</SelectItem>
                  <SelectItem value="researcher">Researcher</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleStart}
              disabled={!nickname || !role}
              className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
            >
              Start Assessment
            </Button>
          </CardContent>
        </Card>

        {/* Privacy Note */}
        <p className="text-center text-sm text-muted-foreground mt-6 max-w-lg mx-auto">
          Your privacy matters. We collect minimal data for personalization and never store real passwords or sensitive information.
        </p>
      </div>
    </div>
  );
};

export default Welcome;