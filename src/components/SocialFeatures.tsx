import { useState } from 'react';
import { Users, MessageSquare, Share2, Heart, Award, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { useGame } from '@/contexts/GameContext';
import { toast } from '@/hooks/use-toast';

interface CommunityPost {
  id: string;
  userId: string;
  username: string;
  level: number;
  content: string;
  type: 'achievement' | 'tip' | 'question';
  likes: number;
  timestamp: Date;
  isLiked?: boolean;
}

export const CommunityFeed = () => {
  const { state } = useGame();
  const [posts, setPosts] = useState<CommunityPost[]>([
    {
      id: '1',
      userId: 'user1',
      username: 'CyberNinja',
      level: 12,
      content: 'Just earned the Password Pro badge! 🔒 The key is using passphrases instead of passwords. "Coffee!Morning!Sunshine!" is much stronger than "P@ssw0rd123"',
      type: 'achievement',
      likes: 23,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: '2',
      userId: 'user2',
      username: 'SecureSteve',
      level: 8,
      content: 'Pro tip: Always check the sender\'s email address carefully. Scammers often use domains that look similar to legitimate ones (like "gmai1.com" instead of "gmail.com")',
      type: 'tip',
      likes: 45,
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    },
    {
      id: '3',
      userId: 'user3',
      username: 'PrivacyPro',
      level: 15,
      content: 'Question: What\'s the best way to handle suspicious links in emails? I usually just delete the email, but should I report it somewhere?',
      type: 'question',
      likes: 12,
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    }
  ]);
  
  const [newPost, setNewPost] = useState('');
  const [postType, setPostType] = useState<'tip' | 'question'>('tip');

  const getPostIcon = (type: string) => {
    switch (type) {
      case 'achievement': return <Award className="h-4 w-4 text-warning" />;
      case 'tip': return <TrendingUp className="h-4 w-4 text-success" />;
      case 'question': return <MessageSquare className="h-4 w-4 text-accent" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'achievement': return 'bg-warning/20 text-warning';
      case 'tip': return 'bg-success/20 text-success';
      case 'question': return 'bg-accent/20 text-accent';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.isLiked ? post.likes - 1 : post.likes + 1, isLiked: !post.isLiked }
        : post
    ));
  };

  const handleShare = (post: CommunityPost) => {
    if (navigator.share) {
      navigator.share({
        title: 'CyberAware Community Post',
        text: post.content,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(`Check out this cybersecurity tip: "${post.content}"`);
      toast({
        title: "Copied to clipboard!",
        description: "Share this tip with others to help them stay secure.",
      });
    }
  };

  const submitPost = () => {
    if (!newPost.trim() || !state.user) return;
    
    const post: CommunityPost = {
      id: Date.now().toString(),
      userId: state.user.id,
      username: state.user.nickname,
      level: state.user.level,
      content: newPost,
      type: postType,
      likes: 0,
      timestamp: new Date(),
    };
    
    setPosts([post, ...posts]);
    setNewPost('');
    
    toast({
      title: "Post shared!",
      description: "Thanks for contributing to the community!",
    });
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Create Post */}
      {state.user && (
        <Card className="bg-gradient-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-accent" />
              Share with Community
            </CardTitle>
            <CardDescription>
              Help others learn by sharing tips, asking questions, or celebrating achievements!
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button
                variant={postType === 'tip' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPostType('tip')}
              >
                💡 Tip
              </Button>
              <Button
                variant={postType === 'question' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPostType('question')}
              >
                ❓ Question
              </Button>
            </div>
            
            <Textarea
              placeholder={postType === 'tip' 
                ? "Share a cybersecurity tip you've learned..." 
                : "Ask the community a question..."
              }
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="resize-none"
              rows={3}
            />
            
            <Button 
              onClick={submitPost}
              disabled={!newPost.trim()}
              className="bg-gradient-primary hover:shadow-glow"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share Post
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Community Posts */}
      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className="bg-gradient-card border-border">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                    {post.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{post.username}</span>
                    <Badge variant="outline" className="text-xs">
                      Level {post.level}
                    </Badge>
                    <Badge className={`text-xs ${getTypeColor(post.type)}`}>
                      {getPostIcon(post.type)}
                      <span className="ml-1 capitalize">{post.type}</span>
                    </Badge>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">
                      {formatTimeAgo(post.timestamp)}
                    </span>
                  </div>
                  
                  <p className="text-sm leading-relaxed">{post.content}</p>
                  
                  <div className="flex items-center gap-4 pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(post.id)}
                      className={`gap-1 ${post.isLiked ? 'text-red-500' : ''}`}
                    >
                      <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
                      {post.likes}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleShare(post)}
                      className="gap-1"
                    >
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export const FriendChallenges = () => {
  const { state } = useGame();
  const [challenges] = useState([
    {
      id: '1',
      challenger: 'CyberNinja',
      challengerLevel: 12,
      challenge: 'Complete 3 Password Security challenges',
      reward: '100 XP',
      expiresIn: '2 days',
      status: 'pending' as const
    },
    {
      id: '2',
      challenger: 'SecureSteve',
      challengerLevel: 8,
      challenge: 'Maintain a 7-day login streak',
      reward: '50 XP',
      expiresIn: '5 days',
      status: 'active' as const
    }
  ]);

  const acceptChallenge = (challengeId: string) => {
    toast({
      title: "Challenge Accepted!",
      description: "Good luck! The challenge has been added to your quests.",
    });
  };

  return (
    <Card className="bg-gradient-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-accent" />
          Friend Challenges
        </CardTitle>
        <CardDescription>
          Compete with friends in friendly cybersecurity challenges!
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {challenges.map((challenge) => (
          <div key={challenge.id} className="p-4 border border-border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs">
                    {challenge.challenger.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <span className="font-medium">{challenge.challenger}</span>
                  <Badge variant="outline" className="ml-2 text-xs">
                    Level {challenge.challengerLevel}
                  </Badge>
                </div>
              </div>
              <Badge 
                variant={challenge.status === 'active' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {challenge.status}
              </Badge>
            </div>
            
            <p className="text-sm mb-3">{challenge.challenge}</p>
            
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                <span>Reward: {challenge.reward}</span>
                <span className="ml-4">Expires in: {challenge.expiresIn}</span>
              </div>
              
              {challenge.status === 'pending' && (
                <Button 
                  size="sm"
                  onClick={() => acceptChallenge(challenge.id)}
                  className="bg-gradient-primary hover:shadow-glow"
                >
                  Accept
                </Button>
              )}
            </div>
          </div>
        ))}
        
        {challenges.length === 0 && (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No active challenges</p>
            <p className="text-sm text-muted-foreground">
              Invite friends to start competing!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};