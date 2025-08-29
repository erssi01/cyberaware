import { useState } from 'react';
import { Lock, ArrowLeft, Check, X, Zap, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';

const PrivacyModule = () => {
  const navigate = useNavigate();
  const { dispatch } = useGame();
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [attempts, setAttempts] = useState(0);

  const challenges = [
    {
      id: 'privacy-social-1',
      type: 'scenario',
      title: 'Social Media Privacy Scenario',
      scenario: 'Your friend tags you in a public post showing your student ID card while celebrating getting into university. The post is visible to everyone and shows your full name, student ID number, and university logo.',
      question: 'What should you do?',
      options: [
        { 
          id: 'A', 
          text: 'Leave it - it\'s just celebrating good news', 
          feedback: 'Student ID numbers can be used for identity theft and account takeovers.' 
        },
        { 
          id: 'B', 
          text: 'Like the post and share it on your profile too', 
          feedback: 'This would make the problem worse by spreading your personal information further.' 
        },
        { 
          id: 'C', 
          text: 'Ask your friend to remove the tag and repost without showing the ID', 
          correct: true,
          feedback: 'Perfect! This protects your personal information while maintaining the celebration.' 
        },
        { 
          id: 'D', 
          text: 'Report the post to the social media platform', 
          feedback: 'This is unnecessarily harsh for a friend\'s innocent mistake. Communication first is better.' 
        },
      ],
      tips: [
        'Student IDs contain sensitive information that can be misused',
        'Always check what personal details are visible in photos before posting',
        'Friends may not realize the privacy implications - educate kindly'
      ]
    },
    {
      id: 'privacy-2fa',
      type: 'knowledge',
      title: '2FA Setup Priority',
      scenario: 'You want to enable two-factor authentication (2FA) on your accounts but can only set it up on 5 accounts right now due to time constraints.',
      question: 'Which accounts should you prioritize for 2FA? (Select the BEST answer)',
      options: [
        { 
          id: 'A', 
          text: 'Social media accounts because you use them most often',
          feedback: 'While important, other accounts have higher security priority.' 
        },
        { 
          id: 'B', 
          text: 'Email, banking, work/school, password manager, and cloud storage',
          correct: true,
          feedback: 'Excellent! These are your most critical accounts that, if compromised, could lead to access to other accounts.' 
        },
        { 
          id: 'C', 
          text: 'Gaming and entertainment accounts',
          feedback: 'These are less critical for your overall security.' 
        },
        { 
          id: 'D', 
          text: 'Shopping websites where you have payment info stored',
          feedback: 'Important, but email and banking should come first as they\'re often used for account recovery.' 
        },
      ],
      tips: [
        'Prioritize accounts that control access to other accounts (email, password manager)',
        'Financial accounts should always have 2FA enabled',
        'Work/school accounts often contain sensitive information'
      ]
    },
    {
      id: 'privacy-sharing',
      type: 'scenario',
      title: 'Information Sharing Dilemma',
      scenario: 'You\'re applying for a part-time job at a local café. The manager asks you to fill out an application form that requests: your full name, address, phone number, email, Social Security Number, bank account details for direct deposit, mother\'s maiden name, and your social media passwords "to check your online presence."',
      question: 'Which information should you be concerned about providing?',
      options: [
        { 
          id: 'A', 
          text: 'Only provide your social media passwords - everything else is normal',
          feedback: 'Never provide social media passwords! But other items on this list are also problematic.' 
        },
        { 
          id: 'B', 
          text: 'Provide everything except social media passwords',
          feedback: 'Several other items are inappropriate for a job application and could enable identity theft.' 
        },
        { 
          id: 'C', 
          text: 'Only provide: name, phone, email, and address. Question the other requests.',
          correct: true,
          feedback: 'Correct! SSN, bank details, and passwords should only be provided after hiring, and maiden names aren\'t needed for employment.' 
        },
        { 
          id: 'D', 
          text: 'Provide everything - they must need it for the job',
          feedback: 'This could lead to identity theft. Legitimate employers only request necessary information.' 
        },
      ],
      tips: [
        'Never give social media passwords to employers',
        'SSN and bank details should only be provided after you\'re hired',
        'Question requests for unnecessary personal information',
        'Legitimate employers follow privacy best practices'
      ]
    },
  ];

  const challenge = challenges[currentChallenge];
  const progress = ((currentChallenge + 1) / challenges.length) * 100;

  const handleSubmit = () => {
    if (!selectedAnswer) return;
    
    setAttempts(prev => prev + 1);
    
    const selectedOption = challenge.options.find(opt => opt.id === selectedAnswer);
    const correct = selectedOption?.correct || false;
    
    setIsCorrect(correct);
    setFeedback(selectedOption?.feedback || '');
    
    if (correct) {
      const xpGain = attempts === 0 ? 12 : attempts === 1 ? 8 : 4;
      dispatch({ type: 'ADD_XP', payload: xpGain });
      
      if (currentChallenge === 0 && attempts === 0) {
        dispatch({ type: 'UNLOCK_BADGE', payload: 'Privacy Protector' });
      }
    }
  };

  const handleNext = () => {
    if (currentChallenge < challenges.length - 1) {
      setCurrentChallenge(prev => prev + 1);
      setSelectedAnswer('');
      setFeedback(null);
      setIsCorrect(null);
      setAttempts(0);
    } else {
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
              <Lock className="h-6 w-6 text-accent" />
              Privacy Protection
            </h1>
            <p className="text-muted-foreground">Safeguard your personal information online</p>
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
                {challenge.type === 'scenario' ? 'Real-World Scenario' : 'Knowledge Check'}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Scenario */}
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-accent mt-1" />
                <div>
                  <h4 className="font-medium mb-2">Scenario:</h4>
                  <p className="text-sm">{challenge.scenario}</p>
                </div>
              </div>
            </div>

            {/* Question */}
            <div>
              <h4 className="font-medium mb-4">{challenge.question}</h4>
              
              <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
                {challenge.options.map((option) => (
                  <div key={option.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
                    <Label 
                      htmlFor={option.id} 
                      className="flex-1 cursor-pointer text-sm leading-relaxed"
                    >
                      <span className="font-medium mr-2">{option.id}.</span>
                      {option.text}
                      {selectedAnswer === option.id && option.correct && (
                        <Check className="inline h-4 w-4 text-success ml-2" />
                      )}
                      {selectedAnswer === option.id && !option.correct && feedback && (
                        <X className="inline h-4 w-4 text-warning ml-2" />
                      )}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Tips */}
            <div className="p-4 bg-accent/10 rounded-lg">
              <div className="flex items-start gap-3">
                <Settings className="h-5 w-5 text-accent mt-1" />
                <div>
                  <h4 className="font-medium mb-2 text-accent">💡 Privacy Tips:</h4>
                  <ul className="text-sm space-y-1">
                    {challenge.tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-accent">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

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
                    disabled={!selectedAnswer}
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

export default PrivacyModule;