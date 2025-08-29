import { useState } from 'react';
import { Target, ArrowLeft, Check, X, Zap, Mail, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';

const PhishingModule = () => {
  const navigate = useNavigate();
  const { dispatch } = useGame();
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [showRedFlags, setShowRedFlags] = useState(false);

  const challenges = [
    {
      id: 'phish-basic-1',
      title: 'Spot the Phishing Email',
      description: 'Compare these two emails and identify which one is safer to trust',
      emails: [
        {
          id: 'safe',
          from: 'security@yourbank.com',
          subject: 'Monthly Security Update',
          preview: 'Your monthly security summary is now available...',
          body: 'Dear John,\n\nYour monthly security summary for March 2024 is now available in your secure account dashboard.\n\nTo view your summary, please log into your account at yourbank.com.\n\nThank you for choosing YourBank.\n\nBest regards,\nYourBank Security Team',
          domain: 'yourbank.com',
          isPhishing: false,
        },
        {
          id: 'phishing',
          from: 'security@yourb∀nk.com',
          subject: 'URGENT: Account Suspended - Action Required',
          preview: 'Your account has been suspended due to suspicious activity...',
          body: 'URGENT NOTICE\n\nYour account has been SUSPENDED due to suspicious activity detected on March 15, 2024.\n\nYou must verify your identity IMMEDIATELY to avoid permanent closure.\n\nCLICK HERE TO VERIFY: http://yourbank-secure-verification.net/urgent\n\nFailure to act within 24 hours will result in permanent account closure.\n\nYourBank Security',
          domain: 'yourbank-secure-verification.net',
          isPhishing: true,
        },
      ],
      redFlags: [
        'Look-alike domain with special character (∀ instead of a)',
        'Urgency language and threats',
        'Suspicious external domain for verification',
        'Generic greeting vs personalized',
        'ALL CAPS text for emphasis',
        'Shortened timeframe pressure'
      ],
      explanation: 'The first email is legitimate - it uses the correct domain, has no urgency, and directs you to the official website. The second is phishing with multiple red flags.',
    },
    {
      id: 'phish-intermediate',
      title: 'Advanced Phishing Detection',
      description: 'This one is trickier - look carefully at the details',
      emails: [
        {
          id: 'phishing',
          from: 'noreply@microsft-account.com',
          subject: 'Verify your Microsoft account',
          preview: 'We noticed a sign-in from a new device...',
          body: 'Hello,\n\nWe noticed a sign-in to your Microsoft account from a new device in Romania.\n\nIf this was you, you can safely ignore this email.\n\nIf this wasn\'t you, please secure your account immediately by clicking the link below:\n\nhttps://account.microsft-security.com/verify\n\nThank you,\nMicrosoft Account Team',
          domain: 'microsft-security.com',
          isPhishing: true,
        },
        {
          id: 'safe',
          from: 'account-security-noreply@accountprotection.microsoft.com',
          subject: 'New sign-in to your Microsoft account',
          preview: 'We noticed a new sign-in to your Microsoft account...',
          body: 'Hello John,\n\nWe noticed a new sign-in to your Microsoft account on March 15, 2024.\n\nDevice: Chrome on Windows\nLocation: New York, US (approximate)\n\nIf this was you, no action is needed.\n\nIf you don\'t recognize this activity, please secure your account at https://account.microsoft.com/security\n\nThanks,\nMicrosoft Account Team',
          domain: 'account.microsoft.com',
          isPhishing: false,
        },
      ],
      redFlags: [
        'Misspelled domain: "microsft" instead of "microsoft"',
        'Suspicious subdomain structure',
        'Less specific details about the sign-in',
        'Different domain for the verification link'
      ],
      explanation: 'The subtle misspelling in the domain is a common phishing technique. Always verify the exact spelling of domains in security emails.',
    },
  ];

  const challenge = challenges[currentChallenge];
  const progress = ((currentChallenge + 1) / challenges.length) * 100;

  const handleEmailSelect = (emailId: string) => {
    setSelectedEmail(emailId);
    setAttempts(prev => prev + 1);
    
    const selectedEmailData = challenge.emails.find(email => email.id === emailId);
    const correct = !selectedEmailData?.isPhishing;
    
    setIsCorrect(correct);
    
    if (correct) {
      setFeedback(challenge.explanation);
      const xpGain = attempts === 0 ? 15 : attempts === 1 ? 10 : 5;
      dispatch({ type: 'ADD_XP', payload: xpGain });
      
      if (currentChallenge === 0 && attempts === 0) {
        dispatch({ type: 'UNLOCK_BADGE', payload: 'Phishing Detective' });
      }
    } else {
      setFeedback('That\'s the phishing email! Look for the red flags that make it suspicious.');
      setShowRedFlags(true);
    }
  };

  const handleNext = () => {
    if (currentChallenge < challenges.length - 1) {
      setCurrentChallenge(prev => prev + 1);
      setSelectedEmail(null);
      setFeedback(null);
      setIsCorrect(null);
      setAttempts(0);
      setShowRedFlags(false);
    } else {
      navigate('/modules');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
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
              <Target className="h-6 w-6 text-accent" />
              Phishing Defense
            </h1>
            <p className="text-muted-foreground">Learn to identify and avoid email-based threats</p>
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

        {/* Challenge Instructions */}
        <Card className="mb-6 bg-gradient-card border-border">
          <CardHeader>
            <CardTitle className="text-xl">{challenge.title}</CardTitle>
            <CardDescription>{challenge.description}</CardDescription>
          </CardHeader>
        </Card>

        {/* Email Comparison */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {challenge.emails.map((email, index) => (
            <Card 
              key={email.id}
              className={`cursor-pointer transition-all duration-300 ${
                selectedEmail === email.id 
                  ? isCorrect === true && !email.isPhishing
                    ? 'ring-2 ring-success bg-success/10'
                    : isCorrect === false && selectedEmail === email.id
                    ? 'ring-2 ring-danger bg-danger/10'
                    : 'ring-2 ring-accent bg-accent/10'
                  : 'hover:shadow-glow'
              } ${email.isPhishing && showRedFlags ? 'ring-2 ring-warning bg-warning/10' : ''}`}
              onClick={() => !feedback && handleEmailSelect(email.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    Email {index + 1}
                  </Badge>
                  {email.isPhishing && showRedFlags && (
                    <Badge className="bg-warning text-warning-foreground">
                      Phishing
                    </Badge>
                  )}
                  {selectedEmail === email.id && isCorrect === true && !email.isPhishing && (
                    <Badge className="bg-success text-success-foreground">
                      ✓ Safe Choice
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {/* Email Header */}
                <div className="space-y-2 mb-4 p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4" />
                    <span className="font-medium">From:</span>
                    <span className={email.isPhishing && showRedFlags ? 'text-warning font-medium' : ''}>
                      {email.from}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Subject:</span> {email.subject}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {email.preview}
                  </div>
                </div>

                {/* Email Body */}
                <div className="p-3 bg-background rounded border text-sm whitespace-pre-line">
                  {email.body}
                </div>

                {/* Domain Info */}
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <ExternalLink className="h-3 w-3" />
                  <span>Links to: {email.domain}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Red Flags Alert */}
        {showRedFlags && (
          <Alert className="mb-6 border-warning bg-warning/10">
            <AlertDescription>
              <h4 className="font-medium mb-2 text-warning">🚩 Red Flags in the Phishing Email:</h4>
              <ul className="space-y-1 text-sm">
                {challenge.redFlags.map((flag, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-warning">•</span>
                    {flag}
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Feedback */}
        {feedback && (
          <Card className={`mb-6 ${
            isCorrect 
              ? 'bg-success/10 border-success/20' 
              : 'bg-warning/10 border-warning/20'
          }`}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {isCorrect ? (
                  <Check className="h-5 w-5 text-success mt-0.5" />
                ) : (
                  <X className="h-5 w-5 text-warning mt-0.5" />
                )}
                <p className="text-sm">{feedback}</p>
              </div>
            </CardContent>
          </Card>
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
            {!feedback && (
              <Button variant="outline" onClick={() => setShowRedFlags(true)}>
                Show Hints
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
      </div>
    </div>
  );
};

export default PhishingModule;