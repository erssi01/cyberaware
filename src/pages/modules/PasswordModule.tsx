import { useState, useEffect } from 'react';
import { Shield, ArrowLeft, Check, X, Zap, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
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
  const [showPassword, setShowPassword] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

  const challenges = [
    {
      id: 'pwd-strength-1',
      type: 'builder',
      title: 'Transform a Weak Password into a Fortress',
      prompt: 'You found this weak password being used by a colleague: "password123". Help them create a much stronger alternative that would resist common attacks while remaining memorable.',
      description: 'Transform this dangerously common weak password into a secure one that could withstand dictionary attacks, brute force attempts, and social engineering',
      hints: ['Aim for 14+ characters for maximum security', 'Mix uppercase, lowercase, numbers, and symbols', 'Avoid dictionary words and personal information', 'Consider using passphrases with symbols', 'Think about what would be hard for hackers to guess but easy for you to remember'],
      minScore: 4,
    },
    {
      id: 'pwd-strength-2',
      type: 'builder', 
      title: 'Remove Personal Information Vulnerabilities',
      prompt: 'This password contains personal information that could be discovered through social media or data breaches: "john1985!". Create a replacement that maintains security while removing all personal elements.',
      description: 'Eliminate personal information vulnerabilities and create a strong alternative using secure password techniques',
      hints: ['Never use your name, birth year, or family members', 'Hackers can find personal info from social media', 'Try random word combinations instead', 'Use the "four random words" method', 'Add numbers and symbols that aren\'t personal dates'],
      minScore: 4,
    },
    {
      id: 'pwd-strength-3',
      type: 'builder',
      title: 'Create a High-Security Password for Banking',
      prompt: 'You need to create a new password for your online banking account. This password will protect your financial assets and must be extremely secure against sophisticated attacks. Create a password that would take centuries to crack.',
      description: 'Design a maximum-security password suitable for protecting critical financial accounts',
      hints: ['Banking passwords should be 16+ characters', 'Use a completely random approach', 'Include multiple symbol types (!@#$%^&*)', 'Avoid any patterns that hackers might predict', 'Consider using a passphrase with creative substitutions'],
      minScore: 5,
    },
    {
      id: 'pwd-knowledge-1',
      type: 'mcq',
      title: 'Password Management Best Practices',
      prompt: 'You have 50+ online accounts across different websites and services. What is the MOST secure and practical approach to managing all these passwords effectively?',
      options: [
        { id: 'A', text: 'Use one very strong master password for all accounts to ensure maximum security' },
        { id: 'B', text: 'Create unique, complex passwords for each account and store them in a password manager', correct: true },
        { id: 'C', text: 'Use variations of a strong base password (like MyPassword1!, MyPassword2!) for different accounts' },
        { id: 'D', text: 'Write down all passwords in a encrypted document stored on your computer' },
      ],
      explanation: 'Using a password manager with unique passwords for each account is the gold standard. It prevents credential stuffing attacks and ensures that if one account is breached, your other accounts remain secure. Password managers also generate and remember complex passwords you couldn\'t possibly memorize.',
    },
    {
      id: 'pwd-knowledge-2',
      type: 'mcq',
      title: 'Password Security Myths and Realities',
      prompt: 'Your company\'s IT department just sent an email stating they will be implementing new password policies. Which of these common password requirements actually DECREASES security rather than improving it?',
      options: [
        { id: 'A', text: 'Requiring passwords to be at least 12 characters long' },
        { id: 'B', text: 'Forcing users to change passwords every 30 days', correct: true },
        { id: 'C', text: 'Requiring a mix of uppercase, lowercase, numbers, and symbols' },
        { id: 'D', text: 'Prohibiting the use of dictionary words in passwords' },
      ],
      explanation: 'Frequent mandatory password changes (like every 30 days) actually decrease security because users tend to create weaker, more predictable passwords or simply increment numbers (Password1, Password2, etc.). Current security experts recommend only changing passwords when there\'s evidence of compromise.',
    },
    {
      id: 'pwd-scenario',
      type: 'mcq',
      title: 'Workplace Password Security Dilemma',
      prompt: 'You\'re working on a critical project with a tight deadline. Your coworker asks to borrow your laptop to access a shared company system because their computer crashed and IT won\'t have a replacement until tomorrow. The system requires your personal login credentials. What\'s the most secure approach?',
      options: [
        { id: 'A', text: 'Share your password with them temporarily and change it later' },
        { id: 'B', text: 'Log them in on your laptop and let them work while you supervise' },
        { id: 'C', text: 'Contact IT or your manager to arrange temporary access credentials', correct: true },
        { id: 'D', text: 'Create a temporary shared account for the project' },
      ],
      explanation: 'Never share personal credentials, even temporarily. The secure approach is to contact IT or management to arrange proper temporary access. This maintains accountability, audit trails, and doesn\'t compromise your personal account security. Most organizations have procedures for emergency access situations.',
    },
  ];

  const challenge = challenges[currentChallenge];
  const progress = ((currentChallenge + 1) / challenges.length) * 100;

  const checkPasswordStrength = (password: string) => {
    let score = 0;
    const feedback = [];
    const checks = [];

    // Length check
    if (password.length >= 16) {
      score += 2;
      checks.push({ name: 'Length (16+ chars)', passed: true, icon: CheckCircle });
    } else if (password.length >= 12) {
      score += 1;
      checks.push({ name: 'Length (12+ chars)', passed: true, icon: CheckCircle });
      feedback.push('Consider 16+ characters for maximum security');
    } else {
      checks.push({ name: 'Length (12+ chars)', passed: false, icon: AlertCircle });
      feedback.push('Use at least 12 characters');
    }

    // Character type checks
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (hasLower) {
      score += 1;
      checks.push({ name: 'Lowercase letters', passed: true, icon: CheckCircle });
    } else {
      checks.push({ name: 'Lowercase letters', passed: false, icon: AlertCircle });
      feedback.push('Include lowercase letters');
    }

    if (hasUpper) {
      score += 1;
      checks.push({ name: 'Uppercase letters', passed: true, icon: CheckCircle });
    } else {
      checks.push({ name: 'Uppercase letters', passed: false, icon: AlertCircle });
      feedback.push('Include uppercase letters');
    }

    if (hasNumber) {
      score += 1;
      checks.push({ name: 'Numbers', passed: true, icon: CheckCircle });
    } else {
      checks.push({ name: 'Numbers', passed: false, icon: AlertCircle });
      feedback.push('Include numbers');
    }

    if (hasSymbol) {
      score += 1;
      checks.push({ name: 'Special characters', passed: true, icon: CheckCircle });
    } else {
      checks.push({ name: 'Special characters', passed: false, icon: AlertCircle });
      feedback.push('Include special characters (!@#$%^&*)');
    }

    // Pattern checks
    const hasCommonPatterns = /password|123|qwerty|admin|letmein|welcome/i.test(password);
    if (!hasCommonPatterns && password.length > 0) {
      score += 1;
      checks.push({ name: 'No common patterns', passed: true, icon: CheckCircle });
    } else if (password.length > 0) {
      score -= 2;
      checks.push({ name: 'No common patterns', passed: false, icon: AlertCircle });
      feedback.push('Avoid common words and patterns');
    }

    // Entropy bonus
    const uniqueChars = new Set(password).size;
    if (uniqueChars >= password.length * 0.7 && password.length > 8) {
      score += 1;
      checks.push({ name: 'Good character diversity', passed: true, icon: CheckCircle });
    } else if (password.length > 8) {
      checks.push({ name: 'Good character diversity', passed: false, icon: AlertCircle });
      feedback.push('Use more diverse characters');
    }

    const strengthLevel = score >= 6 ? 'Excellent' : score >= 5 ? 'Strong' : score >= 4 ? 'Good' : score >= 2 ? 'Fair' : 'Weak';
    const strengthColor = score >= 6 ? 'text-emerald-400' : score >= 5 ? 'text-green-400' : score >= 4 ? 'text-yellow-400' : score >= 2 ? 'text-orange-400' : 'text-red-400';

    return { 
      score: Math.max(0, score), 
      feedback, 
      checks,
      strengthLevel,
      strengthColor,
      estimatedCrackTime: calculateCrackTime(password)
    };
  };

  const calculateCrackTime = (password: string) => {
    if (password.length === 0) return '';
    
    let charset = 0;
    if (/[a-z]/.test(password)) charset += 26;
    if (/[A-Z]/.test(password)) charset += 26;
    if (/\d/.test(password)) charset += 10;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) charset += 32;
    
    const combinations = Math.pow(charset, password.length);
    const attemptsPerSecond = 1000000000; // 1 billion attempts/sec
    const seconds = combinations / (2 * attemptsPerSecond);
    
    if (seconds < 60) return 'Less than a minute';
    if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
    if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
    if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
    if (seconds < 31536000000) return `${Math.round(seconds / 31536000)} years`;
    return 'Centuries';
  };

  // Real-time feedback with debouncing
  const handlePasswordChange = (value: string) => {
    setUserInput(value);
    
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    
    const timeout = setTimeout(() => {
      if (challenge.type === 'builder' && value.length > 0) {
        const strength = checkPasswordStrength(value);
        // Provide gentle real-time feedback without being intrusive
      }
    }, 500);
    
    setTypingTimeout(timeout);
  };

  useEffect(() => {
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [typingTimeout]);

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
              <div className="space-y-4">
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your improved password..."
                    value={userInput}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    className="bg-background border-border text-lg font-mono pr-12 transition-all duration-200 focus:ring-2 focus:ring-accent/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {userInput && (
                  <div className="space-y-4 animate-fade-in">
                    {/* Strength Meter */}
                    <div className="p-4 bg-muted/30 rounded-lg border border-muted backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium">Password Strength</span>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-semibold ${checkPasswordStrength(userInput).strengthColor}`}>
                            {checkPasswordStrength(userInput).strengthLevel}
                          </span>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5, 6].map((level) => {
                              const strength = checkPasswordStrength(userInput);
                              return (
                                <div
                                  key={level}
                                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                    strength.score >= level
                                      ? strength.score >= 6
                                        ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.4)]'
                                        : strength.score >= 5
                                        ? 'bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.4)]'
                                        : strength.score >= 4
                                        ? 'bg-yellow-400 shadow-[0_0_4px_rgba(250,204,21,0.4)]'
                                        : strength.score >= 2
                                        ? 'bg-orange-400'
                                        : 'bg-red-400'
                                      : 'bg-muted border border-muted-foreground/20'
                                  }`}
                                />
                              );
                            })}
                          </div>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-muted rounded-full h-2 mb-3 overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 ease-out ${
                            checkPasswordStrength(userInput).score >= 6 ? 'bg-gradient-to-r from-emerald-400 to-green-400' :
                            checkPasswordStrength(userInput).score >= 5 ? 'bg-gradient-to-r from-green-400 to-yellow-400' :
                            checkPasswordStrength(userInput).score >= 4 ? 'bg-gradient-to-r from-yellow-400 to-orange-400' :
                            checkPasswordStrength(userInput).score >= 2 ? 'bg-gradient-to-r from-orange-400 to-red-400' :
                            'bg-red-400'
                          }`}
                          style={{ width: `${Math.min(100, (checkPasswordStrength(userInput).score / 6) * 100)}%` }}
                        />
                      </div>

                      {/* Crack Time Estimate */}
                      <div className="text-xs text-muted-foreground mb-3">
                        <span className="font-medium">Estimated crack time: </span>
                        <span className={checkPasswordStrength(userInput).strengthColor}>
                          {checkPasswordStrength(userInput).estimatedCrackTime}
                        </span>
                      </div>

                      {/* Security Checks */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {checkPasswordStrength(userInput).checks.map((check, index) => {
                          const Icon = check.icon;
                          return (
                            <div key={index} className={`flex items-center gap-2 text-xs transition-all duration-200 ${
                              check.passed ? 'text-green-400' : 'text-muted-foreground'
                            }`}>
                              <Icon className={`h-3 w-3 ${check.passed ? 'text-green-400' : 'text-muted-foreground'}`} />
                              <span>{check.name}</span>
                            </div>
                          );
                        })}
                      </div>
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
              <div className="p-4 bg-gradient-to-r from-accent/10 to-accent/5 rounded-lg border border-accent/20 backdrop-blur-sm">
                <h4 className="font-medium mb-3 text-accent flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Security Tips
                </h4>
                <div className="grid gap-2">
                  {challenge.hints.map((hint, index) => (
                    <div key={index} className="flex items-start gap-3 text-sm group">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center mt-0.5 group-hover:bg-accent/30 transition-colors">
                        <span className="text-xs font-bold text-accent">{index + 1}</span>
                      </div>
                      <span className="text-muted-foreground group-hover:text-foreground transition-colors">{hint}</span>
                    </div>
                  ))}
                </div>
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