import { useState } from 'react';
import { Shield, ArrowLeft, Check, X, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';

const PasswordModule = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useGame();
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [attempts, setAttempts] = useState(0);

  const challenges = [
    {
      id: 'pwd-strength-1',
      type: 'builder',
      title: 'Fix This Weak Password',
      prompt: 'Improve this weak password to make it strong: "password123"',
      description: 'Transform this common weak password into a secure one',
      hints: ['Add more characters (12+ recommended)', 'Mix uppercase and lowercase', 'Include special symbols', 'Avoid dictionary words'],
      minScore: 4,
    },
    {
      id: 'pwd-strength-2',
      type: 'builder',
      title: 'Personal Info Challenge',
      prompt: 'Strengthen this password that contains personal info: "john1985"',
      description: 'Remove personal information and create a strong alternative',
      hints: ['Avoid using names or birth years', 'Use passphrases instead', 'Consider random word combinations', 'Add symbols and numbers'],
      minScore: 4,
    },
    {
      id: 'pwd-knowledge-1',
      type: 'mcq',
      title: 'Password Best Practices',
      prompt: 'Which of these password practices is MOST secure?',
      options: [
        { id: 'A', text: 'Use the same strong password everywhere' },
        { id: 'B', text: 'Use unique passwords for each account with a password manager', correct: true },
        { id: 'C', text: 'Write passwords down on paper and keep them safe' },
        { id: 'D', text: 'Use predictable patterns like Password1, Password2, etc.' },
      ],
      explanation: 'Using unique passwords for each account with a password manager is the gold standard. It prevents one breach from compromising all your accounts.',
    },
  ];

  const challenge = challenges[currentChallenge];
  const progress = ((currentChallenge + 1) / challenges.length) * 100;

  const checkPasswordStrength = (password: string) => {
    let score = 0;
    const feedback = [];

    if (password.length >= 12) score += 1;
    else feedback.push('Use at least 12 characters');

    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('Include lowercase letters');

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('Include uppercase letters');

    if (/\d/.test(password)) score += 1;
    else feedback.push('Include numbers');

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
    else feedback.push('Include special characters');

    // Check for common patterns
    if (/password|123|qwerty|admin/i.test(password)) {
      score -= 1;
      feedback.push('Avoid common words and patterns');
    }

    return { score: Math.max(0, score), feedback };
  };

  const handleSubmit = () => {
    setAttempts(prev => prev + 1);

    if (challenge.type === 'builder') {
      const strength = checkPasswordStrength(userInput);
      const isStrong = strength.score >= challenge.minScore;
      
      setIsCorrect(isStrong);
      
      if (isStrong) {
        setFeedback('Excellent! This is a strong password. Great job improving it!');
        const xpGain = attempts === 0 ? 15 : attempts === 1 ? 10 : 5;
        dispatch({ type: 'ADD_XP', payload: xpGain });
        
        if (currentChallenge === 0 && attempts === 0) {
          dispatch({ type: 'UNLOCK_BADGE', payload: 'Password Pro' });
        }
      } else {
        setFeedback(`Password needs improvement: ${strength.feedback.join(', ')}`);
      }
    } else if (challenge.type === 'mcq') {
      const selectedOption = challenge.options?.find(opt => opt.id === userInput);
      const correct = selectedOption?.correct || false;
      
      setIsCorrect(correct);
      
      if (correct) {
        setFeedback(challenge.explanation || 'Correct!');
        const xpGain = attempts === 0 ? 10 : attempts === 1 ? 7 : 3;
        dispatch({ type: 'ADD_XP', payload: xpGain });
      } else {
        setFeedback(challenge.explanation || 'Incorrect answer. Try again!');
      }
    }
  };

  const handleNext = () => {
    if (currentChallenge < challenges.length - 1) {
      setCurrentChallenge(prev => prev + 1);
      setUserInput('');
      setFeedback(null);
      setIsCorrect(null);
      setAttempts(0);
    } else {
      // Module complete
      navigate('/modules');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/modules')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Modules
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Shield className="h-6 w-6 text-accent" />
              Password Security
            </h1>
            <p className="text-muted-foreground">Master strong password creation and management</p>
          </div>
        </div>

        {/* Progress */}
        <Card className="mb-6 bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Challenge {currentChallenge + 1} of {challenges.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} />
          </CardContent>
        </Card>

        {/* Challenge Card */}
        <Card className="bg-gradient-card border-border shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">{challenge.title}</CardTitle>
              <Badge variant="outline" className="text-accent border-accent">
                {challenge.type === 'builder' ? 'Password Builder' : 'Multiple Choice'}
              </Badge>
            </div>
            <CardDescription>{challenge.description}</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Prompt */}
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-medium">{challenge.prompt}</p>
            </div>

            {/* Input Area */}
            {challenge.type === 'builder' ? (
              <div>
                <Input
                  type="text"
                  placeholder="Enter your improved password..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className="bg-background border-border text-lg font-mono"
                />
                {userInput && (
                  <div className="mt-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium">Password Strength:</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((level) => {
                          const strength = checkPasswordStrength(userInput);
                          return (
                            <div
                              key={level}
                              className={`w-6 h-2 rounded ${
                                strength.score >= level
                                  ? strength.score >= 4
                                    ? 'bg-success'
                                    : strength.score >= 3
                                    ? 'bg-warning'
                                    : 'bg-danger'
                                  : 'bg-muted'
                              }`}
                            />
                          );
                        })}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {checkPasswordStrength(userInput).score >= 4 ? 'Strong' : 
                         checkPasswordStrength(userInput).score >= 3 ? 'Good' : 
                         checkPasswordStrength(userInput).score >= 2 ? 'Fair' : 'Weak'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {challenge.options?.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setUserInput(option.id)}
                    className={`w-full p-4 text-left rounded-lg border transition-all ${
                      userInput === option.id
                        ? 'border-accent bg-accent/10'
                        : 'border-border hover:border-accent/50 hover:bg-muted/50'
                    }`}
                  >
                    <span className="font-medium mr-3">{option.id}.</span>
                    {option.text}
                  </button>
                ))}
              </div>
            )}

            {/* Hints */}
            {challenge.type === 'builder' && challenge.hints && (
              <div className="p-4 bg-accent/10 rounded-lg">
                <h4 className="font-medium mb-2 text-accent">💡 Hints:</h4>
                <ul className="text-sm space-y-1">
                  {challenge.hints.map((hint, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-accent">•</span>
                      {hint}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Feedback */}
            {feedback && (
              <div className={`p-4 rounded-lg flex items-start gap-3 ${
                isCorrect 
                  ? 'bg-success/10 border border-success/20' 
                  : 'bg-warning/10 border border-warning/20'
              }`}>
                {isCorrect ? (
                  <Check className="h-5 w-5 text-success mt-0.5" />
                ) : (
                  <X className="h-5 w-5 text-warning mt-0.5" />
                )}
                <p className="text-sm">{feedback}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentChallenge(Math.max(0, currentChallenge - 1))}
                disabled={currentChallenge === 0}
              >
                Previous
              </Button>
              
              <div className="flex gap-2">
                {!isCorrect && (
                  <Button
                    onClick={handleSubmit}
                    disabled={!userInput}
                    className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
                  >
                    Check Answer
                  </Button>
                )}
                
                {isCorrect && (
                  <Button
                    onClick={handleNext}
                    className="bg-gradient-success hover:shadow-glow transition-all duration-300"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    {currentChallenge === challenges.length - 1 ? 'Complete Module' : 'Next Challenge'}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PasswordModule;