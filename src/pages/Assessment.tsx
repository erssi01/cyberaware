import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertTriangle, Shield, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useGame } from '@/contexts/GameContext';

  const assessmentQuestions = [
    {
      id: 'confidence-password',
      question: 'How confident are you in creating strong, unique passwords that can withstand modern attacks and protect your accounts from unauthorized access?',
      type: 'confidence',
      options: [
        { value: '1', label: 'Not confident at all - I usually use simple, easy-to-remember passwords' },
        { value: '2', label: 'Slightly confident - I know some basics but often use variations of the same password' },
        { value: '3', label: 'Moderately confident - I create decent passwords but not sure if they\'re strong enough' },
        { value: '4', label: 'Very confident - I create strong passwords and use different ones for important accounts' },
        { value: '5', label: 'Extremely confident - I follow all best practices including password managers and unique passwords for every account' },
      ],
    },
    {
      id: 'confidence-phishing',
      question: 'How confident are you in identifying sophisticated phishing emails, fake websites, and social engineering attempts that could compromise your accounts or personal information?',
      type: 'confidence',
      options: [
        { value: '1', label: 'Not confident at all - I often can\'t tell if emails or websites are legitimate' },
        { value: '2', label: 'Slightly confident - I can spot obvious scams but worry about sophisticated attempts' },
        { value: '3', label: 'Moderately confident - I know some warning signs but sometimes second-guess myself' },
        { value: '4', label: 'Very confident - I can identify most phishing attempts and know how to verify suspicious communications' },
        { value: '5', label: 'Extremely confident - I can spot even advanced phishing techniques and always verify before taking action' },
      ],
    },
    {
      id: 'confidence-privacy',
      question: 'How confident are you in protecting your personal information online and managing privacy settings across social media, apps, and digital services?',
      type: 'confidence',
      options: [
        { value: '1', label: 'Not confident at all - I rarely check privacy settings and share information freely' },
        { value: '2', label: 'Slightly confident - I\'ve adjusted some settings but don\'t really understand the implications' },
        { value: '3', label: 'Moderately confident - I try to be careful but find privacy settings confusing' },
        { value: '4', label: 'Very confident - I regularly review privacy settings and am cautious about what I share' },
        { value: '5', label: 'Extremely confident - I actively manage my digital footprint and understand privacy implications of all services I use' },
      ],
    },
    {
      id: 'knowledge-2fa',
      question: 'Two-factor authentication (2FA) is becoming essential for account security. Which statement best describes what 2FA provides and why it\'s important?',
      type: 'knowledge',
      options: [
        { value: 'backup', label: 'A way to backup your data and recover it if your account is compromised' },
        { value: 'extra-security', label: 'An extra layer of security requiring two different forms of verification (like password + phone code) to access your account', correct: true },
        { value: 'password-strength', label: 'A method to automatically generate stronger passwords for your accounts' },
        { value: 'antivirus', label: 'A type of antivirus software that monitors your accounts for suspicious activity' },
      ],
    },
    {
      id: 'knowledge-phishing',
      question: 'You receive an urgent email claiming to be from your bank, stating that suspicious activity was detected and asking you to click a link to verify your account immediately. What is the BEST and safest way to handle this situation?',
      type: 'knowledge',
      options: [
        { value: 'click-links', label: 'Click the links in the email to quickly resolve the issue' },
        { value: 'reply-email', label: 'Reply to the email asking for more information about the suspicious activity' },
        { value: 'contact-directly', label: 'Contact your bank directly through their official phone number or website (not using information from the email) to verify if the alert is legitimate', correct: true },
        { value: 'forward-friends', label: 'Forward the email to friends or family to get their opinion on whether it looks legitimate' },
      ],
    },
    {
      id: 'knowledge-updates',
      question: 'Software updates and security patches are crucial for maintaining system security. What is the most important principle regarding when and how to apply these updates?',
      type: 'knowledge',
      options: [
        { value: 'monthly', label: 'Update all software once a month during a scheduled maintenance window' },
        { value: 'quarterly', label: 'Update software every 3 months to ensure stability and avoid conflicts' },
        { value: 'yearly', label: 'Update software once a year when you have time to deal with potential issues' },
        { value: 'asap', label: 'Apply security updates as soon as they become available, especially for critical vulnerabilities', correct: true },
      ],
    },
    {
      id: 'knowledge-backup',
      question: 'The "3-2-1 backup rule" is a widely recommended strategy for protecting important data. What does this rule specify to ensure comprehensive data protection?',
      type: 'knowledge',
      options: [
        { value: 'three-devices', label: 'Keep backups on 3 different devices in your home or office' },
        { value: 'three-two-one', label: 'Have 3 total copies of important data (including the original), stored on 2 different types of media, with 1 copy stored offsite', correct: true },
        { value: 'three-times', label: 'Backup your data 3 times per day, for 2 weeks, keeping copies for 1 year' },
        { value: 'three-passwords', label: 'Use 3 different passwords to encrypt 2 backup drives and 1 cloud storage account' },
      ],
    },
    {
      id: 'behavior-passwords',
      question: 'Considering your current password habits across all your online accounts (banking, social media, work, shopping, etc.), which option best describes your typical approach?',
      type: 'behavior',
      options: [
        { value: 'same-everywhere', label: 'I use the same password (or very similar passwords) for most of my accounts because it\'s easier to remember' },
        { value: 'similar-variations', label: 'I use a base password with small variations (like adding numbers or the site name) for different accounts' },
        { value: 'unique-simple', label: 'I create different passwords for each account, but they\'re usually simple enough for me to remember without writing them down' },
        { value: 'unique-strong', label: 'I create unique, strong passwords for each account and use a password manager or secure method to store them', preferred: true },
      ],
    },
    {
      id: 'behavior-updates',
      question: 'When your computer, phone, or apps notify you that updates are available, what do you typically do?',
      type: 'behavior',
      options: [
        { value: 'ignore', label: 'I usually ignore or postpone updates because they\'re inconvenient or I\'m worried they might cause problems' },
        { value: 'delay', label: 'I postpone updates for a few days or weeks to see if others report problems, then apply them' },
        { value: 'selective', label: 'I apply security updates quickly but delay feature updates until I have time to learn new interfaces' },
        { value: 'immediate', label: 'I apply most updates promptly, especially security updates, and have automatic updates enabled where possible', preferred: true },
      ],
    },
    {
      id: 'behavior-suspicious-emails',
      question: 'When you receive an unexpected email with links or attachments, even from what appears to be a legitimate source, what is your typical response?',
      type: 'behavior',
      options: [
        { value: 'click-first', label: 'I usually click links or open attachments if the email looks legitimate' },
        { value: 'sometimes-cautious', label: 'I\'m sometimes cautious, but if I recognize the sender or company name, I generally trust the email' },
        { value: 'verify-suspicious', label: 'I verify suspicious emails by contacting the sender directly, but I trust emails from companies I do business with' },
        { value: 'always-verify', label: 'I always verify unexpected emails through independent channels before clicking any links or opening attachments, regardless of the apparent source', preferred: true },
      ],
    },
  ];

const Assessment = () => {
  const navigate = useNavigate();
  const { dispatch } = useGame();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedAnswer, setSelectedAnswer] = useState('');

  const question = assessmentQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / assessmentQuestions.length) * 100;

  const handleNext = () => {
    if (selectedAnswer) {
      setAnswers(prev => ({ ...prev, [question.id]: selectedAnswer }));
      
      if (currentQuestion < assessmentQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer('');
      } else {
        // Assessment complete - analyze results and create personalized plan
        const results = analyzeResults({ ...answers, [question.id]: selectedAnswer });
        dispatch({ type: 'COMPLETE_ASSESSMENT' });
        navigate('/dashboard', { state: { assessmentResults: results } });
      }
    }
  };

  const analyzeResults = (answers: Record<string, string>) => {
    let passwordConfidence = parseInt(answers['confidence-password'] || '3');
    let phishingConfidence = parseInt(answers['confidence-phishing'] || '3');
    let privacyConfidence = parseInt(answers['confidence-privacy'] || '3');
    
    let knowledgeScore = 0;
    let totalKnowledge = 0;
    
    assessmentQuestions.forEach(q => {
      if (q.type === 'knowledge') {
        totalKnowledge++;
        const selectedOption = q.options.find(opt => opt.value === answers[q.id]);
        if (selectedOption && 'correct' in selectedOption && selectedOption.correct) {
          knowledgeScore++;
        }
      }
    });

    const knowledgePercentage = (knowledgeScore / totalKnowledge) * 100;

    // Determine recommended modules based on comprehensive assessment
    const recommendedModules: string[] = [];
    
    // Password module recommendation
    if (passwordConfidence <= 3 || answers['behavior-passwords'] !== 'unique-strong') {
      recommendedModules.push('password');
    }
    
    // Phishing module recommendation  
    if (phishingConfidence <= 3 || answers['knowledge-phishing'] !== 'contact-directly' || answers['behavior-suspicious-emails'] !== 'always-verify') {
      recommendedModules.push('phishing');
    }
    
    // Privacy module recommendation
    if (privacyConfidence <= 3) {
      recommendedModules.push('privacy');
    }
    
    // Updates module recommendation
    if (answers['knowledge-updates'] !== 'asap' || answers['behavior-updates'] !== 'immediate') {
      recommendedModules.push('updates');
    }
    
    // Backups module recommendation
    if (answers['knowledge-backup'] !== 'three-two-one' || knowledgePercentage < 75) {
      recommendedModules.push('backups');
    }

    return {
      passwordConfidence,
      phishingConfidence,
      privacyConfidence,
      knowledgeScore,
      knowledgePercentage,
      recommendedModules,
      totalQuestions: assessmentQuestions.length,
    };
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/welcome')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Welcome
          </Button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <Shield className="h-12 w-12 text-accent mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-foreground mb-2">Baseline Assessment</h1>
          <p className="text-muted-foreground">
            Help us personalize your learning journey
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Question {currentQuestion + 1} of {assessmentQuestions.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="bg-gradient-card border-border shadow-card">
          <CardHeader>
            <CardTitle className="text-xl">{question.question}</CardTitle>
            {question.type === 'confidence' && (
              <CardDescription>Rate your current confidence level</CardDescription>
            )}
            {question.type === 'knowledge' && (
              <CardDescription>Select the best answer</CardDescription>
            )}
            {question.type === 'behavior' && (
              <CardDescription>Choose the option that best describes your current behavior</CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
              {question.options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label 
                    htmlFor={option.value} 
                    className="flex-1 cursor-pointer text-sm"
                  >
                    {option.label}
                  </Label>
                  {option.correct && selectedAnswer === option.value && (
                    <CheckCircle className="h-4 w-4 text-success" />
                  )}
                  {question.type === 'knowledge' && selectedAnswer === option.value && !option.correct && (
                    <AlertTriangle className="h-4 w-4 text-warning" />
                  )}
                </div>
              ))}
            </RadioGroup>

            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
              <Button
                onClick={handleNext}
                disabled={!selectedAnswer}
                className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
              >
                {currentQuestion === assessmentQuestions.length - 1 ? 'Complete Assessment' : 'Next Question'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Assessment;