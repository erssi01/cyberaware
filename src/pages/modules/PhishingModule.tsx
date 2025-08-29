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
      title: 'Banking Email Deception',
      description: 'Compare these two banking emails carefully. One is legitimate, one is a sophisticated phishing attempt.',
      emails: [
        {
          id: 'safe',
          from: 'notifications@bankofamerica.com',
          subject: 'Your Monthly Statement is Ready',
          preview: 'Your February 2024 account statement is now available...',
          body: 'Dear John Smith,\n\nYour monthly account statement for February 2024 is now available for viewing in your Online Banking account.\n\nTo access your statement:\n1. Visit bankofamerica.com\n2. Log in to Online Banking\n3. Navigate to Statements & Documents\n\nYour statement will be available for 18 months from the statement date.\n\nIf you have questions about your account, please contact us at 1-800-432-1000 or visit any Bank of America financial center.\n\nThank you for choosing Bank of America.\n\nBank of America Online Banking Team',
          domain: 'bankofamerica.com',
          isPhishing: false,
        },
        {
          id: 'phishing',
          from: 'security-alert@bank0famerica.com',
          subject: 'URGENT: Suspicious Activity Detected - Immediate Action Required',
          preview: 'We have detected multiple failed login attempts on your account...',
          body: 'URGENT SECURITY ALERT\n\nDear Customer,\n\nWe have detected MULTIPLE SUSPICIOUS LOGIN ATTEMPTS on your Bank of America account from an unrecognized device in Russia.\n\nFOR YOUR SECURITY, your account has been TEMPORARILY SUSPENDED to prevent unauthorized access.\n\nYou must VERIFY YOUR IDENTITY immediately to restore full access to your account.\n\n>>> CLICK HERE TO VERIFY NOW <<<\nhttps://secure-verification-bankofamerica.net/urgent-verify/\n\nWARNING: Failure to verify within 24 hours will result in PERMANENT ACCOUNT CLOSURE.\n\nTime remaining: 23 hours, 47 minutes\n\nBank of America Security Department\nDO NOT REPLY TO THIS EMAIL',
          domain: 'secure-verification-bankofamerica.net',
          isPhishing: true,
        },
      ],
      redFlags: [
        'Domain spoofing: "bank0famerica.com" uses zero instead of "o"',
        'Extreme urgency language and ALL CAPS text',
        'Threats of permanent account closure',
        'Generic greeting "Dear Customer" instead of your name',
        'Suspicious verification domain not matching bank\'s official site',
        'Countdown timer creating false urgency',
        'Instruction not to reply (legitimate banks want communication)',
      ],
      explanation: 'The first email is legitimate with proper domain, professional tone, and clear instructions. The second shows classic phishing tactics: domain spoofing, urgency, threats, and suspicious links.',
    },
    {
      id: 'phish-intermediate',
      title: 'Microsoft Account Security Alert',
      description: 'These Microsoft security emails look very similar. One is real, one is phishing. Can you spot the difference?',
      emails: [
        {
          id: 'phishing',
          from: 'account-security@microsoftaccounts.com',
          subject: 'Microsoft Account: Unusual sign-in activity',
          preview: 'We noticed a new sign-in to your Microsoft account...',
          body: 'Hello,\n\nWe noticed a new sign-in to your Microsoft account from:\n\nDevice: iPhone Safari\nLocation: Lagos, Nigeria\nDate: March 15, 2024, 3:42 AM EST\n\nIf this was you, you can safely ignore this email.\n\nIf you don\'t recognize this activity, your account may be compromised. Please secure your account immediately:\n\n→ Review recent activity: https://microsoftaccounts.com/security/review\n→ Change your password: https://microsoftaccounts.com/password/reset\n→ Enable two-factor authentication: https://microsoftaccounts.com/security/2fa\n\nFor immediate assistance, contact Microsoft Support at +1-800-MICROSOFT\n\nThank you,\nMicrosoft Account Team\n\nThis email was sent to: john.doe@email.com',
          domain: 'microsoftaccounts.com',
          isPhishing: true,
        },
        {
          id: 'safe',
          from: 'account-security-noreply@accountprotection.microsoft.com',
          subject: 'New sign-in to your Microsoft account',
          preview: 'We noticed a new sign-in to your Microsoft account...',
          body: 'Hello John,\n\nWe noticed a new sign-in to your Microsoft account on March 15, 2024.\n\nDevice: Chrome on Windows 11\nLocation: New York, United States (approximate)\nTime: 3:42 PM EST\n\nIf this was you, no action is needed.\n\nIf you don\'t recognize this activity:\n• Secure your account at https://account.microsoft.com/security\n• Change your password\n• Review your recent activity\n• Consider enabling additional security verification\n\nTo review all account activity, visit: https://account.microsoft.com/activity\n\nThanks,\nMicrosoft Account Team\n\nYou\'re receiving this email because you enabled security notifications for john.doe@email.com. To change these settings, visit https://account.microsoft.com/notifications',
          domain: 'account.microsoft.com',
          isPhishing: false,
        },
      ],
      redFlags: [
        'Wrong domain: "microsoftaccounts.com" instead of "account.microsoft.com"',
        'All links point to the fake domain instead of official Microsoft sites',
        'Phone number format looks suspicious (+1-800-MICROSOFT is not real)',
        'Time inconsistency (3:42 AM vs 3:42 PM in legitimate version)',
        'Less personalized content and security information',
      ],
      explanation: 'The legitimate email uses Microsoft\'s actual domain (account.microsoft.com), provides more specific details, and all links point to official Microsoft properties.',
    },
    {
      id: 'phish-advanced',
      title: 'PayPal Payment Dispute',
      description: 'Someone disputed a payment on your PayPal account. One of these emails is from PayPal, one is a scam. Which do you trust?',
      emails: [
        {
          id: 'safe',
          from: 'service@paypal.com',
          subject: 'Resolution Center: You have a new case',
          preview: 'A buyer has opened a case for transaction...',
          body: 'Hello John Doe,\n\nA buyer has opened a case in the PayPal Resolution Center.\n\nCase ID: PP-D-27834569\nTransaction ID: 8XY42591JK765432L\nAmount: $127.50 USD\nReason: Item not received\nBuyer: sarah_m_2024@email.com\n\nWhat happens next:\n• You have 7 days to respond to this case\n• Upload tracking information if available\n• Communicate with the buyer through PayPal messages\n\nTo respond to this case:\n1. Log in to your PayPal account\n2. Go to Resolution Center\n3. Select case PP-D-27834569\n\nImportant: Only respond to cases through your PayPal account, not by email.\n\nIf you have questions, visit our Help Center at https://www.paypal.com/help\n\nPayPal\n\nThis email was sent to: john.doe@email.com (your confirmed email address)\nPayPal Email ID: PP001234567',
          domain: 'paypal.com',
          isPhishing: false,
        },
        {
          id: 'phishing',
          from: 'dispute-resolution@paypal-security.net',
          subject: 'URGENT: Unauthorized Transaction Alert - $489.99',
          preview: 'Suspicious activity detected on your PayPal account...',
          body: 'PAYPAL SECURITY ALERT\n\nUnauthorized transaction detected:\n\nAmount: $489.99 USD\nMerchant: Electronics Store Online\nDate: March 15, 2024\nLocation: Unknown\n\nThis transaction has been FLAGGED as potentially fraudulent.\n\nTo DISPUTE this charge and secure your account:\n\n1. CLICK HERE: https://paypal-security.net/dispute/urgent/auth?ref=USR78432\n2. Verify your account information\n3. Confirm legitimate transactions\n4. Report fraudulent activity\n\nWARNING: If you do not respond within 2 hours, this transaction will be processed and cannot be reversed.\n\nFor immediate assistance: 1-800-PAYPAL-HELP\n\nPayPal Fraud Prevention Team\nCase #: SEC-991847263',
          domain: 'paypal-security.net',
          isPhishing: true,
        },
      ],
      redFlags: [
        'Fake domain: "paypal-security.net" instead of official "paypal.com"',
        'Creates false urgency with 2-hour deadline',
        'Asks you to click links instead of logging in directly',
        'Unusual transaction amount and details designed to create panic',
        'Phone number format doesn\'t match PayPal\'s actual support',
        'Generic case number format',
      ],
      explanation: 'PayPal never asks you to verify account information through email links. Legitimate case notifications direct you to log into your PayPal account directly.',
    },
    {
      id: 'phish-expert',
      title: 'Cryptocurrency Exchange Security Notice',
      description: 'You use a cryptocurrency exchange for trading. Both emails claim to be security notices. One is legitimate, one is trying to steal your crypto.',
      emails: [
        {
          id: 'phishing',
          from: 'security@coinbase-pro.org',
          subject: 'Security Alert: API Keys Compromised',
          preview: 'We detected suspicious API activity on your account...',
          body: 'COINBASE PRO SECURITY NOTICE\n\nCRITICAL: We have detected that your API keys may have been compromised in a recent security incident affecting select accounts.\n\nAffected Services:\n• Trading API\n• Portfolio API\n• Advanced Trading\n\nImmediate action required to prevent unauthorized trading:\n\n1. Reset API Keys: https://coinbase-pro.org/api/emergency-reset\n2. Verify recent transactions\n3. Update security settings\n4. Enable additional 2FA methods\n\nFAILURE TO ACT WITHIN 6 HOURS MAY RESULT IN:\n• Unauthorized trades\n• Asset liquidation\n• Account suspension\n\nIf you need assistance, our security team is standing by:\nEmail: emergency@coinbase-pro.org\nPhone: 1-855-COINBASE-SEC\n\nCoinbase Pro Security Team\nIncident ID: CBPRO-SEC-789456',
          domain: 'coinbase-pro.org',
          isPhishing: true,
        },
        {
          id: 'safe',
          from: 'no-reply@coinbase.com',
          subject: 'Coinbase: New device signed in',
          preview: 'A new device recently signed in to your Coinbase account...',
          body: 'Hi John,\n\nA new device recently signed in to your Coinbase account.\n\nDevice: Chrome 122 on macOS\nLocation: San Francisco, CA, United States\nDate: March 15, 2024 at 2:30 PM PST\nIP Address: 192.168.1.xxx (last digits hidden for security)\n\nIf this was you, no action is needed.\n\nIf this wasn\'t you:\n1. Secure your account at https://www.coinbase.com/settings/security\n2. Change your password immediately\n3. Review your account activity\n4. Contact support if you notice unauthorized activity\n\nSecurity tips:\n• Use a unique, strong password\n• Enable two-factor authentication\n• Never share your login credentials\n• Always log in directly through coinbase.com\n\nQuestions? Visit our Help Center: https://help.coinbase.com\n\nThe Coinbase Team\n\nThis message was sent to john.doe@email.com\nCoinbase, Inc. | 100 Pine Street, Suite 1250 | San Francisco, CA 94111',
          domain: 'coinbase.com',
          isPhishing: false,
        },
      ],
      redFlags: [
        'Wrong domain: "coinbase-pro.org" instead of official "coinbase.com"',
        'Fake urgency with 6-hour deadline',
        'API compromise claims designed to panic crypto traders',
        'Suspicious contact methods (emergency@coinbase-pro.org)',
        'Threats of asset liquidation to create fear',
        'Phone number format doesn\'t match Coinbase support',
      ],
      explanation: 'Cryptocurrency phishing is especially dangerous because transactions are irreversible. Always verify security alerts by logging into your exchange directly, never through email links.',
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