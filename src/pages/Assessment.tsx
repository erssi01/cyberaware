import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertTriangle, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useGame } from '@/contexts/GameContext';

const assessmentQuestions = [
  {
    id: 'confidence-password',
    question: 'How confident are you in creating strong passwords?',
    type: 'confidence',
    options: [
      { value: '1', label: 'Not confident at all' },
      { value: '2', label: 'Slightly confident' },
      { value: '3', label: 'Moderately confident' },
      { value: '4', label: 'Very confident' },
      { value: '5', label: 'Extremely confident' },
    ],
  },
  {
    id: 'confidence-phishing',
    question: 'How confident are you in identifying phishing emails?',
    type: 'confidence',
    options: [
      { value: '1', label: 'Not confident at all' },
      { value: '2', label: 'Slightly confident' },
      { value: '3', label: 'Moderately confident' },
      { value: '4', label: 'Very confident' },
      { value: '5', label: 'Extremely confident' },
    ],
  },
  {
    id: 'knowledge-2fa',
    question: 'What is two-factor authentication (2FA)?',
    type: 'knowledge',
    options: [
      { value: 'backup', label: 'A way to backup your data' },
      { value: 'extra-security', label: 'An extra layer of security requiring two forms of verification', correct: true },
      { value: 'password-strength', label: 'A method to make passwords stronger' },
      { value: 'antivirus', label: 'A type of antivirus software' },
    ],
  },
  {
    id: 'knowledge-phishing',
    question: 'Which is the BEST way to verify a suspicious email?',
    type: 'knowledge',
    options: [
      { value: 'click-links', label: 'Click the links to see where they go' },
      { value: 'reply-email', label: 'Reply to the email asking if it\'s legitimate' },
      { value: 'contact-directly', label: 'Contact the organization directly through official channels', correct: true },
      { value: 'forward-friends', label: 'Forward it to friends for their opinion' },
    ],
  },
  {
    id: 'knowledge-updates',
    question: 'How often should you update your software?',
    type: 'knowledge',
    options: [
      { value: 'monthly', label: 'Once a month' },
      { value: 'quarterly', label: 'Every 3 months' },
      { value: 'yearly', label: 'Once a year' },
      { value: 'asap', label: 'As soon as updates are available', correct: true },
    ],
  },
  {
    id: 'behavior-passwords',
    question: 'How do you typically create passwords?',
    type: 'behavior',
    options: [
      { value: 'same-everywhere', label: 'Use the same password for everything' },
      { value: 'similar-variations', label: 'Use similar passwords with small variations' },
      { value: 'unique-simple', label: 'Create unique but simple passwords' },
      { value: 'unique-strong', label: 'Create unique, strong passwords for each account', preferred: true },
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

    // Determine recommended modules based on assessment
    const recommendedModules: string[] = [];
    if (passwordConfidence <= 3 || answers['behavior-passwords'] !== 'unique-strong') {
      recommendedModules.push('password');
    }
    if (phishingConfidence <= 3 || !answers['knowledge-phishing']) {
      recommendedModules.push('phishing');
    }
    if (knowledgePercentage < 70) {
      recommendedModules.push('privacy', 'updates');
    }

    return {
      passwordConfidence,
      phishingConfidence,
      knowledgeScore,
      knowledgePercentage,
      recommendedModules,
      totalQuestions: assessmentQuestions.length,
    };
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
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