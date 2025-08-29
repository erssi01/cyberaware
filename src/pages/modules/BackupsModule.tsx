import { useState } from 'react';
import { HardDrive, ArrowLeft, Check, X, Zap, Shield, AlertTriangle, Cloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';

const BackupsModule = () => {
  const navigate = useNavigate();
  const { dispatch } = useGame();
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [simulationState, setSimulationState] = useState<any>(null);

  const challenges = [
    {
      id: 'backup-321-rule',
      type: 'knowledge',
      title: 'The 3-2-1 Backup Rule Explained',
      scenario: 'You\'re setting up a backup strategy for your important files: family photos (50GB), work documents (10GB), and personal projects (20GB). You have a laptop with 500GB storage, an external hard drive (1TB), access to cloud storage (100GB free), and a USB flash drive (32GB). You want to implement the industry-standard 3-2-1 backup rule.',
      question: 'What does the 3-2-1 backup rule mean and how should you implement it with your available resources?',
      options: [
        { 
          id: 'A', 
          text: '3 copies on your laptop, 2 on external drive, 1 in cloud storage',
          feedback: 'This misunderstands the rule. The "3" means total copies including the original, not 3 additional copies.' 
        },
        { 
          id: 'B', 
          text: '3 total copies (original + 2 backups), 2 different media types, 1 offsite location',
          correct: true,
          feedback: 'Perfect! 3-2-1 means: 3 total copies of important data, stored on 2 different media types, with 1 copy stored offsite (like cloud storage).' 
        },
        { 
          id: 'C', 
          text: '3 different cloud providers, 2 external drives, 1 local copy',
          feedback: 'This over-complicates the strategy and misses the point of different media types and offsite storage.' 
        },
        { 
          id: 'D', 
          text: '3 times per week backups, 2 weeks retention, 1 month archive',
          feedback: 'This describes a backup schedule, not the 3-2-1 rule which is about storage locations and media diversity.' 
        },
      ],
      tips: [
        'The 3-2-1 rule protects against multiple failure types: hardware failure, accidental deletion, and site disasters',
        'Different media types could be: internal drive, external drive, cloud storage, optical media',
        'Offsite storage protects against fires, floods, theft, and other local disasters',
        'Cloud storage is an excellent offsite option for most users',
        'Test your backups regularly to ensure they can be restored successfully'
      ]
    },
    {
      id: 'ransomware-scenario',
      type: 'simulation',
      title: 'Ransomware Attack Response',
      scenario: 'You arrive at work Monday morning to find this message on your computer screen: "All your files have been encrypted! Pay 0.5 Bitcoin ($20,000) within 72 hours or your data will be permanently deleted. Do not restart your computer or contact IT - this will trigger immediate data destruction!" You have important client files and project work on this computer.',
      question: 'What should be your immediate response to this ransomware attack?',
      simulationType: 'ransomware-response',
      correctActions: ['disconnect-network', 'document-attack', 'contact-it', 'check-backups'],
      incorrectActions: ['pay-ransom', 'restart-computer', 'try-decrypt'],
      tips: [
        'Never pay ransoms - it funds criminal activity and doesn\'t guarantee data recovery',
        'Disconnect from network immediately to prevent spread to other systems',
        'Document everything for incident response and potential law enforcement',
        'Professional IT teams have tools and procedures for ransomware response'
      ]
    },
    {
      id: 'backup-testing',
      type: 'scenario',
      title: 'Backup Verification Crisis',
      scenario: 'Your company has been diligently backing up data to a cloud service for 2 years. During a routine audit, you decide to test the backup system by trying to restore a 6-month-old project file. The restore process fails with "corrupted backup" errors. You try several other files from different dates - same error. You realize you\'ve never actually tested restores before, only verified that backups were running.',
      question: 'What critical backup principle did your company violate, and what should you do now?',
      options: [
        { 
          id: 'A', 
          text: 'The backup system is clearly faulty - switch to a new provider immediately',
          feedback: 'Switching providers doesn\'t address the underlying issue: lack of testing. You need to understand what went wrong first.' 
        },
        { 
          id: 'B', 
          text: 'Continue using the current backups but start testing new ones going forward',
          feedback: 'This ignores the possibility that your current backup strategy is fundamentally flawed and may have been failing for months.' 
        },
        { 
          id: 'C', 
          text: 'Implement regular backup testing procedures and create a verified "known good" backup immediately',
          correct: true,
          feedback: 'Excellent! "Untested backups are not backups" - regular testing is essential. You need both immediate action and long-term testing procedures.' 
        },
        { 
          id: 'D', 
          text: 'Assume recent backups are fine and only test older ones',
          feedback: 'This assumption could be dangerous. If there\'s a systematic problem, recent backups might be affected too.' 
        },
      ],
      tips: [
        'Untested backups are not real backups - regular testing is essential',
        'Backup corruption can happen gradually and affect multiple restore points',
        'Test different types of restores: full system, individual files, specific dates',
        'Document your testing procedures and results',
        'Schedule regular restore tests as part of your backup strategy'
      ]
    },
    {
      id: 'personal-backup-strategy',
      type: 'scenario',
      title: 'Personal Data Backup Planning',
      scenario: 'You\'re a college student with: 10 years of family photos on your phone and laptop (irreplaceable memories), thesis research and drafts (6 months of work), course materials and assignments, personal documents (birth certificate scans, etc.), and creative projects (music, art, writing). Your laptop is 4 years old and occasionally crashes. You have a limited budget but want comprehensive data protection.',
      question: 'What\'s the most cost-effective backup strategy that adequately protects your most important data?',
      options: [
        { 
          id: 'A', 
          text: 'Buy the largest external hard drive you can afford and backup everything weekly',
          feedback: 'Single external drive creates a single point of failure. If the drive fails or is stolen with your laptop, you lose everything.' 
        },
        { 
          id: 'B', 
          text: 'Use free cloud storage (Google Drive, OneDrive) for most important files, plus one external drive',
          correct: true,
          feedback: 'Smart budget approach! Free cloud storage for most critical files (photos, thesis) plus external drive creates 3-2-1 backup for crucial data.' 
        },
        { 
          id: 'C', 
          text: 'Email important files to yourself as a backup method',
          feedback: 'Email has size limits, isn\'t designed for backup, and doesn\'t provide reliable long-term storage for large amounts of data.' 
        },
        { 
          id: 'D', 
          text: 'Copy everything to USB flash drives',
          feedback: 'USB drives are unreliable for long-term storage, have limited capacity, and are easy to lose or corrupt.' 
        },
      ],
      tips: [
        'Prioritize irreplaceable data (photos, original creative work) for cloud backup',
        'Many cloud services offer 15GB+ free storage - enough for most critical personal files',
        'External drives are cost-effective for large media collections and full system backups',
        'Consider automatic phone photo backup to prevent loss of new memories',
        'Graduate to paid cloud storage as your data grows and budget allows'
      ]
    },
    {
      id: 'backup-frequency',
      type: 'knowledge',
      title: 'Backup Frequency and Retention',
      scenario: 'You work as a freelance graphic designer. Your projects go through many iterations, and clients sometimes request changes to work completed months ago. You also need to maintain backups for legal/contract purposes. Your work includes: active project files (changing daily), completed projects (reference copies), client communications and contracts, and your creative assets library (fonts, stock images, templates).',
      question: 'What backup frequency and retention strategy best serves your business needs?',
      options: [
        { 
          id: 'A', 
          text: 'Daily backups of everything, keep all backups forever',
          feedback: 'While comprehensive, this is expensive and impractical. Different data types need different retention periods.' 
        },
        { 
          id: 'B', 
          text: 'Weekly backups of all files, 3-month retention',
          feedback: 'This frequency is too low for active projects (you could lose a week\'s work), and retention is too short for business needs.' 
        },
        { 
          id: 'C', 
          text: 'Daily backups of active projects, weekly backups of completed work, monthly backups of archives, with tiered retention (1 year active, 3+ years completed)',
          correct: true,
          feedback: 'Excellent strategy! This matches backup frequency to data change rate and retention needs to business requirements.' 
        },
        { 
          id: 'D', 
          text: 'Only backup when projects are completed',
          feedback: 'This risks losing work-in-progress. Active projects need frequent backup protection.' 
        },
      ],
      tips: [
        'Match backup frequency to how often data changes and how much loss you can tolerate',
        'Active work files need more frequent backup than static reference materials',
        'Business requirements (legal, contractual) often dictate minimum retention periods',
        'Consider version control for projects that go through many iterations',
        'Automated backups reduce the chance of forgetting to backup critical work'
      ]
    },
  ];

  const challenge = challenges[currentChallenge];
  const progress = ((currentChallenge + 1) / challenges.length) * 100;

  const handleSubmit = () => {
    if (!selectedAnswer && challenge.type !== 'simulation') return;
    
    setAttempts(prev => prev + 1);
    
    if (challenge.type === 'simulation') {
      // Handle simulation completion
      const correctActions = simulationState?.correctActions || 0;
      const incorrectActions = simulationState?.incorrectActions || 0;
      const correct = correctActions >= 3 && incorrectActions === 0;
      setIsCorrect(correct);
      setFeedback(correct ? 
        `Excellent response! You handled the ransomware attack correctly by taking ${correctActions} appropriate actions.` :
        `Your response needs improvement. In ransomware situations, never pay ransom and always involve IT security professionals immediately.`
      );
    } else {
      const selectedOption = challenge.options.find(opt => opt.id === selectedAnswer);
      const correct = selectedOption?.correct || false;
      
      setIsCorrect(correct);
      setFeedback(selectedOption?.feedback || '');
    }
    
    if (isCorrect) {
      const xpGain = attempts === 0 ? 15 : attempts === 1 ? 10 : 5;
      dispatch({ type: 'ADD_XP', payload: xpGain });
      
      if (currentChallenge === 0 && attempts === 0) {
        dispatch({ type: 'UNLOCK_BADGE', payload: 'Data Guardian' });
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
      setSimulationState(null);
    } else {
      navigate('/modules');
    }
  };

  const renderSimulationContent = () => {
    if (challenge.type !== 'simulation') return null;

    const actions = [
      { id: 'disconnect-network', label: 'Disconnect from network/internet', type: 'correct' },
      { id: 'document-attack', label: 'Take photos of the ransom message', type: 'correct' },
      { id: 'contact-it', label: 'Contact IT security team immediately', type: 'correct' },
      { id: 'check-backups', label: 'Check backup availability (after IT involvement)', type: 'correct' },
      { id: 'pay-ransom', label: 'Pay the ransom to recover files quickly', type: 'incorrect' },
      { id: 'restart-computer', label: 'Restart the computer to see if it fixes the issue', type: 'incorrect' },
      { id: 'try-decrypt', label: 'Try to decrypt files yourself using online tools', type: 'incorrect' },
    ];

    return (
      <div className="space-y-4">
        <Alert className="border-warning bg-warning/10">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Ransomware Detected!</strong> Choose your actions carefully. Some choices could make the situation worse.
          </AlertDescription>
        </Alert>
        
        <div className="p-4 bg-danger/10 border border-danger/20 rounded-lg">
          <p className="text-sm font-mono bg-black text-green-400 p-3 rounded">
            🔒 YOUR FILES HAVE BEEN ENCRYPTED! 🔒<br/>
            Pay 0.5 Bitcoin ($20,000) within 72 hours<br/>
            Email: recover_files_2024@darkweb.onion<br/>
            WARNING: Any attempt to remove this software will result in immediate data destruction!
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">What actions will you take? (Select multiple)</h4>
          <div className="grid gap-2">
            {actions.map((action) => {
              const isSelected = simulationState?.selectedActions?.includes(action.id);
              return (
                <button
                  key={action.id}
                  onClick={() => {
                    setSimulationState(prev => {
                      const currentActions = prev?.selectedActions || [];
                      const newActions = isSelected 
                        ? currentActions.filter(a => a !== action.id)
                        : [...currentActions, action.id];
                      
                      const correctActions = newActions.filter(a => 
                        actions.find(act => act.id === a)?.type === 'correct'
                      ).length;
                      
                      const incorrectActions = newActions.filter(a => 
                        actions.find(act => act.id === a)?.type === 'incorrect'
                      ).length;

                      return {
                        selectedActions: newActions,
                        correctActions,
                        incorrectActions
                      };
                    });
                  }}
                  className={`p-3 text-left rounded-lg border transition-all ${
                    isSelected
                      ? 'bg-accent/10 border-accent'
                      : 'border-border hover:border-accent/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded border ${
                      isSelected ? 'bg-accent border-accent' : 'border-border'
                    }`}>
                      {isSelected && <Check className="h-3 w-3 text-white" />}
                    </div>
                    <span className="text-sm">{action.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        
        <Button 
          onClick={handleSubmit}
          disabled={!simulationState?.selectedActions?.length}
          className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
        >
          Execute Response Plan
        </Button>
      </div>
    );
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
              <HardDrive className="h-6 w-6 text-accent" />
              Backup & Recovery
            </h1>
            <p className="text-muted-foreground">Protect your data with effective backup strategies</p>
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
                {challenge.type === 'simulation' ? 'Interactive Simulation' : 
                 challenge.type === 'scenario' ? 'Real-World Scenario' : 'Knowledge Check'}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Scenario */}
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-accent mt-1" />
                <div>
                  <h4 className="font-medium mb-2">Scenario:</h4>
                  <p className="text-sm">{challenge.scenario}</p>
                </div>
              </div>
            </div>

            {/* Simulation Content */}
            {challenge.type === 'simulation' && renderSimulationContent()}

            {/* Question for non-simulation challenges */}
            {challenge.type !== 'simulation' && (
              <>
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
              </>
            )}

            {/* Tips */}
            <div className="p-4 bg-accent/10 rounded-lg">
              <div className="flex items-start gap-3">
                <Cloud className="h-5 w-5 text-accent mt-1" />
                <div>
                  <h4 className="font-medium mb-2 text-accent">💡 Backup Best Practices:</h4>
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
                {!isCorrect && challenge.type !== 'simulation' && (
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

export default BackupsModule;