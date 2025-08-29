import { User, Settings, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGame } from '@/contexts/GameContext';
import Navigation from '@/components/Navigation';

const Profile = () => {
  const { state } = useGame();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
            <User className="h-8 w-8 text-accent" />
            Profile & Settings
          </h1>
        </div>

        <Card className="bg-gradient-card border-border mb-6">
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">Nickname</label>
              <p className="font-medium">{state.user?.nickname}</p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Role</label>
              <p className="font-medium">{state.user?.role}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Level</label>
                <p className="font-medium">{state.user?.level}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Total XP</label>
                <p className="font-medium">{state.user?.xp}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Data & Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              <Download className="h-4 w-4 mr-2" />
              Export My Data (CSV)
            </Button>
            <p className="text-sm text-muted-foreground">
              Download your anonymized learning progress and analytics data.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;