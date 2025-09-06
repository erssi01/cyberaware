import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Zap, Trophy, Users, User, UserPlus, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGame } from '@/contexts/GameContext';

const Welcome = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useGame();
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [loginNickname, setLoginNickname] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleRegister = () => {
    if (nickname && password && role) {
      const newUser = {
        id: crypto.randomUUID(),
        nickname,
        role,
        password,
        isGuest: false,
        xp: 0,
        level: 1,
        streakDays: 0,
        completedModules: [],
        badges: [],
        lastActivity: new Date(),
        hasCompletedAssessment: false,
        // Enhanced gamification fields
        dailyLoginStreak: 0,
        lastLoginDate: new Date().toDateString(),
        weeklyXP: 0,
        monthlyXP: 0,
        totalChallengesCompleted: 0,
        perfectScoreCount: 0,
        fastestCompletionTime: 0,
        achievements: [],
        preferences: {
          difficulty: 'medium' as const,
          reminders: true,
          soundEnabled: true,
          animationsEnabled: true,
        },
        stats: {
          averageScore: 0,
          strongestModule: '',
          weakestModule: '',
          studyTimeMinutes: 0,
          favoriteTimeOfDay: '',
        },
      };
      
      dispatch({ type: 'REGISTER_USER', payload: newUser });
      navigate('/assessment');
    }
  };

  const handleLogin = () => {
    if (loginNickname && loginPassword) {
      console.log('Attempting login for:', loginNickname);
      console.log('Available users:', state.registeredUsers.map(u => ({ nickname: u.nickname, hasCompleted: u.hasCompletedAssessment })));
      
      const existingUser = state.registeredUsers.find(
        u => u.nickname === loginNickname && u.password === loginPassword
      );
      
      if (existingUser) {
        console.log('Found user:', existingUser.nickname, 'hasCompleted:', existingUser.hasCompletedAssessment);
        dispatch({ type: 'LOGIN_USER', payload: { nickname: loginNickname, password: loginPassword } });
        // If user has completed assessment, go to dashboard, otherwise assessment
        navigate(existingUser.hasCompletedAssessment ? '/dashboard' : '/assessment');
      } else {
        console.log('No matching user found');
        setLoginError('Invalid credentials. Please check your nickname and password.');
      }
    }
  };

  const handleGuest = () => {
    const guestUser = {
      id: crypto.randomUUID(),
      nickname: `Guest${Date.now()}`,
      role: 'guest',
      isGuest: true,
      xp: 0,
      level: 1,
      streakDays: 0,
      completedModules: [],
      badges: [],
      lastActivity: new Date(),
      hasCompletedAssessment: false,
      // Enhanced gamification fields
      dailyLoginStreak: 0,
      lastLoginDate: new Date().toDateString(),
      weeklyXP: 0,
      monthlyXP: 0,
      totalChallengesCompleted: 0,
      perfectScoreCount: 0,
      fastestCompletionTime: 0,
      achievements: [],
      preferences: {
        difficulty: 'medium' as const,
        reminders: true,
        soundEnabled: true,
        animationsEnabled: true,
      },
      stats: {
        averageScore: 0,
        strongestModule: '',
        weakestModule: '',
        studyTimeMinutes: 0,
        favoriteTimeOfDay: '',
      },
    };
    
    dispatch({ type: 'SET_USER', payload: guestUser });
    navigate('/assessment');
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
              Create an account, login, or continue as guest
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="register" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="register" className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Register
                </TabsTrigger>
                <TabsTrigger value="login" className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Login
                </TabsTrigger>
                <TabsTrigger value="guest" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Guest
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="register" className="space-y-4 mt-4">
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
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a secure password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                  onClick={handleRegister}
                  disabled={!nickname || !password || !role}
                  className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
                >
                  Create Account & Start
                </Button>
              </TabsContent>

              <TabsContent value="login" className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="loginNickname">Nickname</Label>
                  <Input
                    id="loginNickname"
                    placeholder="Enter your nickname"
                    value={loginNickname}
                    onChange={(e) => {
                      setLoginNickname(e.target.value);
                      setLoginError('');
                    }}
                    className="bg-background border-border"
                  />
                </div>
                
                <div>
                  <Label htmlFor="loginPassword">Password</Label>
                  <Input
                    id="loginPassword"
                    type="password"
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => {
                      setLoginPassword(e.target.value);
                      setLoginError('');
                    }}
                    className="bg-background border-border"
                  />
                </div>

                {loginError && (
                  <p className="text-sm text-danger">{loginError}</p>
                )}

                <Button 
                  onClick={handleLogin}
                  disabled={!loginNickname || !loginPassword}
                  className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
                >
                  Login & Continue
                </Button>
              </TabsContent>

              <TabsContent value="guest" className="space-y-4 mt-4">
                <div className="text-center py-4">
                  <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-2">Continue as Guest</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Start learning immediately without creating an account. 
                    Note: Your progress won't be saved permanently.
                  </p>
                  <Button 
                    onClick={handleGuest}
                    variant="outline"
                    className="w-full hover:shadow-glow transition-all duration-300"
                  >
                    Continue as Guest
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
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