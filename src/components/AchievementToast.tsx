import { useEffect, useState } from 'react';
import { Trophy, Star, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Achievement {
  id: string;
  type: 'xp' | 'level' | 'badge';
  title: string;
  description: string;
  value?: number;
}

interface AchievementToastProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export const AchievementToast = ({ achievement, onClose }: AchievementToastProps) => {
  const [show, setShow] = useState(false);
  
  useEffect(() => {
    if (achievement) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onClose, 300); // Allow fade-out animation
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [achievement, onClose]);

  if (!achievement) return null;

  const getIcon = () => {
    switch (achievement.type) {
      case 'xp':
        return <Zap className="h-6 w-6 text-success" />;
      case 'level':
        return <Star className="h-6 w-6 text-warning" />;
      case 'badge':
        return <Trophy className="h-6 w-6 text-accent" />;
    }
  };

  const getBgGradient = () => {
    switch (achievement.type) {
      case 'xp':
        return 'bg-gradient-success';
      case 'level':
        return 'bg-gradient-level';
      case 'badge':
        return 'bg-gradient-cyber';
    }
  };

  return (
    <div className={cn(
      "fixed top-4 right-4 z-50 transition-all duration-300",
      show ? "opacity-100 transform translate-x-0" : "opacity-0 transform translate-x-full"
    )}>
      <Card className={cn(
        "achievement-pop hover-glow border-accent/50",
        getBgGradient()
      )}>
        <CardContent className="flex items-center gap-3 p-4">
          {getIcon()}
          <div>
            <h4 className="font-semibold text-foreground">{achievement.title}</h4>
            <p className="text-sm text-muted-foreground">{achievement.description}</p>
            {achievement.value && (
              <p className="text-xs font-medium text-accent">+{achievement.value} XP</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};