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
      title: 'Social Media Oversharing Crisis',
      scenario: 'Your friend tags you in a public Instagram post showing both of you celebrating at a restaurant. The post includes the location, shows your student ID card on the table (with your full name and student number visible), mentions that you\'re both going on spring break to Cancun next week, and includes hashtags with your university name. The post has already received 50 likes and several comments from strangers.',
      question: 'What should be your immediate priority to protect your privacy and security?',
      options: [
        { 
          id: 'A', 
          text: 'Leave it alone - it\'s just a fun post and nothing bad will happen', 
          feedback: 'This exposes multiple privacy risks: identity theft via student ID, home security risks during travel, and location tracking.' 
        },
        { 
          id: 'B', 
          text: 'Ask your friend to delete the entire post immediately', 
          feedback: 'While removing the post would help, this doesn\'t address the information that may have already been captured or shared.' 
        },
        { 
          id: 'C', 
          text: 'Untag yourself, ask friend to blur the ID card and remove travel details, then have a conversation about privacy boundaries', 
          correct: true,
          feedback: 'Excellent! This addresses immediate risks while educating your friend about privacy implications. Always act quickly to limit exposure of sensitive information.' 
        },
        { 
          id: 'D', 
          text: 'Report the post to Instagram for privacy violations', 
          feedback: 'Reporting won\'t be effective since your friend posted it consensually. Direct communication and removal is more appropriate.' 
        },
      ],
      tips: [
        'Student IDs contain information that can be used for identity verification on many websites',
        'Broadcasting travel plans on social media alerts potential burglars that your home is empty',
        'Location data from posts can be used to track your regular patterns and movements',
        'Public posts can be seen by anyone, including people with malicious intent',
        'Set clear privacy boundaries with friends about what you\'re comfortable sharing'
      ]
    },
    {
      id: 'privacy-2fa-advanced',
      type: 'knowledge',
      title: 'Advanced Two-Factor Authentication Strategy',
      scenario: 'You\'re setting up 2FA for your most critical accounts. You have the choice between SMS codes, authenticator apps (like Google Authenticator), hardware security keys (like YubiKey), and backup codes. Your threat model includes protection against SIM swapping attacks, account takeovers, and state-level adversaries.',
      question: 'What is the most secure 2FA setup strategy for maximum protection?',
      options: [
        { 
          id: 'A', 
          text: 'Use SMS for everything because it\'s convenient and works on any phone',
          feedback: 'SMS is vulnerable to SIM swapping attacks where attackers transfer your phone number to their device. This is the least secure option.' 
        },
        { 
          id: 'B', 
          text: 'Use hardware security keys as primary method, authenticator app as backup, avoid SMS entirely',
          correct: true,
          feedback: 'Perfect! Hardware keys provide the strongest protection against phishing and account takeovers. Authenticator apps are excellent backups, and avoiding SMS eliminates SIM swapping risks.' 
        },
        { 
          id: 'C', 
          text: 'Use only authenticator apps for all accounts',
          feedback: 'Good choice, but having only one method creates risk if you lose your device. Always have secure backup methods.' 
        },
        { 
          id: 'D', 
          text: 'Use a combination of SMS and authenticator apps for redundancy',
          feedback: 'The SMS component weakens your overall security by creating a SIM swapping vulnerability, even if you have stronger methods available.' 
        },
      ],
      tips: [
        'Hardware security keys (FIDO2/WebAuthn) provide the strongest protection against phishing',
        'SIM swapping attacks can bypass SMS-based 2FA by transferring your number to attacker\'s phone',
        'Always have multiple backup methods in case you lose access to your primary 2FA device',
        'Authenticator apps (TOTP) are much more secure than SMS but less secure than hardware keys',
        'Store backup recovery codes in a secure location separate from your devices'
      ]
    },
    {
      id: 'privacy-workplace',
      type: 'scenario',
      title: 'Workplace Privacy Violation',
      scenario: 'You work at a marketing company and discover that your manager has been monitoring employees\' personal social media accounts, reading private messages on company computers, and keeping detailed files on employees\' personal relationships and political opinions. This information is being used to make promotion decisions. You also notice that the company WiFi is intercepting HTTPS traffic and the IT department has installed monitoring software on all devices.',
      question: 'What is the most appropriate and effective response to protect yourself and address these privacy violations?',
      options: [
        { 
          id: 'A', 
          text: 'Confront your manager directly about the surveillance and demand they stop',
          feedback: 'Direct confrontation could backfire and put your job at risk without resolving the systemic privacy issues affecting all employees.' 
        },
        { 
          id: 'B', 
          text: 'Document everything, consult with HR/legal about policy violations, use personal devices on cellular data for private communications',
          correct: true,
          feedback: 'Excellent approach! Documentation protects you legally, proper channels address the violations, and using personal devices on cellular prevents further monitoring of your private communications.' 
        },
        { 
          id: 'C', 
          text: 'Start looking for a new job immediately and don\'t address the issue',
          feedback: 'While leaving might protect you, it doesn\'t address the privacy violations affecting other employees or hold the company accountable for illegal practices.' 
        },
        { 
          id: 'D', 
          text: 'Report the company to authorities immediately without internal escalation',
          feedback: 'While reporting may be necessary, many organizations prefer to address issues internally first. Documentation and internal reporting should typically precede external complaints.' 
        },
      ],
      tips: [
        'Workplace privacy laws vary by location, but monitoring personal accounts often violates privacy rights',
        'Document all evidence of privacy violations with dates, times, and specific incidents',
        'Never use company networks or devices for personal communications if you suspect monitoring',
        'HR departments should have policies against using personal information for employment decisions',
        'Legal consultation may be necessary for serious workplace privacy violations'
      ]
    },
    {
      id: 'privacy-data-breach',
      type: 'scenario',
      title: 'Personal Data Breach Response',
      scenario: 'You receive a notification that a major retailer where you shopped online has suffered a data breach. The exposed information includes your full name, email address, phone number, home address, purchase history, partial credit card numbers, and encrypted passwords. The breach affected 50 million customers and occurred 6 months ago but was only recently discovered. The company is offering 2 years of free credit monitoring.',
      question: 'What is the most comprehensive response to protect yourself from the long-term impacts of this breach?',
      options: [
        { 
          id: 'A', 
          text: 'Accept the free credit monitoring and change your password on that retailer\'s website',
          feedback: 'This addresses only immediate concerns. Data breaches require more comprehensive response to protect against long-term identity theft and fraud.' 
        },
        { 
          id: 'B', 
          text: 'Ignore it since the passwords were encrypted and your credit card wasn\'t fully exposed',
          feedback: 'Encrypted passwords can still be cracked, and partial credit card data combined with other information can still be used for fraud. Never ignore breach notifications.' 
        },
        { 
          id: 'C', 
          text: 'Change passwords on all accounts, monitor credit reports, consider credit freeze, update security questions, watch for social engineering attempts',
          correct: true,
          feedback: 'Comprehensive approach! Breached data can be used across multiple accounts and for social engineering. This response addresses both immediate and long-term risks.' 
        },
        { 
          id: 'D', 
          text: 'Close all your credit cards and bank accounts immediately',
          feedback: 'This is an overreaction that could disrupt your financial life unnecessarily. Monitoring and strategic security measures are more appropriate than closing all accounts.' 
        },
      ],
      tips: [
        'Data from breaches is often sold on dark web markets and used months or years later',
        'Change passwords on any accounts that might use the same password as the breached site',
        'Credit freezes prevent new accounts from being opened in your name',
        'Breached personal information is often used for convincing social engineering attacks',
        'Monitor all financial accounts and credit reports for unusual activity for at least 2 years'
      ]
    },
    {
      id: 'privacy-smart-devices',
      type: 'scenario',
      title: 'Smart Home Privacy Dilemma',
      scenario: 'You\'re moving into a new apartment and considering setting up smart home devices. You\'re looking at smart speakers (Alexa, Google Home), smart TVs with built-in cameras and microphones, smart thermostats, connected security cameras, and smart doorbells with facial recognition. You value convenience but are concerned about privacy. You work from home with confidential client information and often have sensitive phone calls.',
      question: 'What\'s the best approach to balance smart home convenience with privacy protection for your professional needs?',
      options: [
        { 
          id: 'A', 
          text: 'Install all devices but keep them disconnected from the internet',
          feedback: 'This defeats the purpose of smart devices, which rely on internet connectivity for their main features. You\'d lose most of the convenience benefits.' 
        },
        { 
          id: 'B', 
          text: 'Avoid all smart devices to maintain complete privacy',
          feedback: 'While this ensures privacy, it may be unnecessarily restrictive. There are ways to use smart devices more privately with proper precautions.' 
        },
        { 
          id: 'C', 
          text: 'Use smart devices with cameras/microphones only in non-work areas, enable privacy modes, create separate network for IoT devices, review privacy settings regularly',
          correct: true,
          feedback: 'Excellent strategy! This approach allows you to enjoy smart home benefits while protecting sensitive work areas and implementing multiple layers of privacy protection.' 
        },
        { 
          id: 'D', 
          text: 'Install everything but use voice activation words that are hard for others to guess',
          feedback: 'Voice activation security is not the main privacy concern. These devices are always listening for wake words and may record more than intended.' 
        },
      ],
      tips: [
        'Smart devices with microphones and cameras pose risks in areas where you handle confidential information',
        'Create separate IoT networks to isolate smart devices from computers containing sensitive data',
        'Regularly review and update privacy settings as manufacturers often change policies',
        'Physical privacy switches or covers provide additional protection for cameras and microphones',
        'Consider the privacy policies of device manufacturers and how they use your data'
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