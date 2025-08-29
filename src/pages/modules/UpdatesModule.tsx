import { useState } from 'react';
import { RefreshCw, ArrowLeft, Check, X, Zap, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';

const UpdatesModule = () => {
  const navigate = useNavigate();
  const { dispatch } = useGame();
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [gameState, setGameState] = useState<any>(null);

  const challenges = [
    {
      id: 'update-timing',
      type: 'knowledge',
      title: 'Critical Security Update Dilemma',
      scenario: 'You\'re working on an important presentation due tomorrow morning. At 6 PM, your operating system prompts you to install a critical security update that patches a vulnerability currently being exploited by hackers. The update requires a restart and typically takes 20-30 minutes. You have 4 hours of work left on your presentation.',
      question: 'What is the most secure approach that balances security with your work deadline?',
      options: [
        { 
          id: 'A', 
          text: 'Postpone the update until after you submit the presentation tomorrow',
          feedback: 'Critical security updates should never be delayed when there are active exploits. Your system is vulnerable to attacks while you work.' 
        },
        { 
          id: 'B', 
          text: 'Install the update immediately, even if it means working later into the night',
          correct: true,
          feedback: 'Excellent! Critical security updates protect against active threats. The 30 minutes spent updating could save you from losing all your work to malware.' 
        },
        { 
          id: 'C', 
          text: 'Disconnect from the internet and work offline until you can update later',
          feedback: 'While this reduces some risk, it doesn\'t eliminate all attack vectors and your system remains vulnerable. Updating immediately is safer.' 
        },
        { 
          id: 'D', 
          text: 'Use a different computer for the rest of your work',
          feedback: 'This might work temporarily but doesn\'t address the security vulnerability on your main system, which could still be exploited later.' 
        },
      ],
      tips: [
        'Critical security updates patch vulnerabilities that are actively being exploited',
        'Delaying security updates can result in data loss, identity theft, or system compromise',
        'The time spent applying updates is minimal compared to recovery from a security breach',
        'Always save your work before applying updates to prevent data loss during restarts'
      ]
    },
    {
      id: 'update-sources',
      type: 'knowledge',
      title: 'Software Update Source Verification',
      scenario: 'You receive multiple notifications to update different software on your computer. You get update prompts from: 1) Windows Update through Settings, 2) A pop-up claiming Adobe Flash needs updating, 3) Your antivirus software\'s built-in updater, 4) A browser pop-up saying Java is out of date, and 5) An email claiming to be from Microsoft with an update attachment.',
      question: 'Which of these update sources should you NEVER trust and could be malicious?',
      options: [
        { 
          id: 'A', 
          text: 'Windows Update through Settings and antivirus built-in updater',
          feedback: 'These are legitimate, trusted sources for updates. Official system settings and software updaters are safe to use.' 
        },
        { 
          id: 'B', 
          text: 'Only the email attachment from Microsoft',
          feedback: 'While the email is definitely suspicious, browser pop-ups and Adobe Flash alerts are also commonly used for malware distribution.' 
        },
        { 
          id: 'C', 
          text: 'The email attachment, browser pop-ups, and Adobe Flash alerts',
          correct: true,
          feedback: 'Correct! These are common vectors for malware. Always download updates directly from official websites or built-in updaters, never from emails or pop-ups.' 
        },
        { 
          id: 'D', 
          text: 'All of them - you should only update software manually',
          feedback: 'Built-in updaters and official system update mechanisms are generally safe and recommended. Manual updating isn\'t always necessary.' 
        },
      ],
      tips: [
        'Never download updates from email attachments, even if they appear to be from legitimate companies',
        'Browser pop-ups claiming software is out of date are often malware attempts',
        'Adobe Flash has been discontinued and any Flash update alerts are likely malicious',
        'Always verify updates by going directly to the software company\'s official website',
        'Use built-in update mechanisms when available (Windows Update, Mac App Store, etc.)'
      ]
    },
    {
      id: 'update-prioritization',
      type: 'scenario',
      title: 'Update Priority Management',
      scenario: 'You manage IT for a small business with limited maintenance windows. You have pending updates for: Operating systems (critical security patches), Web browsers (security and feature updates), Office software (mostly feature updates), Antivirus definitions (daily security updates), Router firmware (security patches), and Third-party software (mixed security and feature updates). You can only apply updates during a 4-hour maintenance window this weekend.',
      question: 'How should you prioritize these updates for maximum security benefit?',
      options: [
        { 
          id: 'A', 
          text: 'Focus on user-facing software first (browsers, office) since employees use them most',
          feedback: 'While important, security patches for systems and infrastructure should take priority over feature updates for user software.' 
        },
        { 
          id: 'B', 
          text: 'Apply all updates equally without prioritization to ensure everything is current',
          feedback: 'With limited time, prioritization is essential. Some updates are more critical for security than others.' 
        },
        { 
          id: 'C', 
          text: 'Prioritize: 1) Antivirus definitions, 2) OS security patches, 3) Router firmware, 4) Browser security updates, 5) Other software',
          correct: true,
          feedback: 'Excellent prioritization! This focuses on the most critical security updates first: antivirus protection, system security, network security, then user-facing security updates.' 
        },
        { 
          id: 'D', 
          text: 'Start with the easiest/fastest updates first to get more done in the time available',
          feedback: 'Speed shouldn\'t determine security priority. Critical security updates should be applied first, regardless of how long they take.' 
        },
      ],
      tips: [
        'Antivirus definitions should be updated daily and are quick to apply',
        'Operating system security patches address fundamental vulnerabilities',
        'Network equipment (routers, firewalls) are prime targets for attackers',
        'Browser security updates are critical since browsers handle untrusted web content',
        'Feature updates can typically wait if time is limited'
      ]
    },
    {
      id: 'update-automation',
      type: 'game',
      title: 'Patch Management Simulation',
      scenario: 'You\'re the IT administrator for a company network. Vulnerabilities are appearing on your systems, and you need to patch them quickly before they can be exploited. Click on the systems that have critical vulnerabilities to patch them. You have 60 seconds!',
      gameType: 'patch-simulator',
      systems: [
        { id: 'server1', name: 'Web Server', severity: 'critical', patchTime: 2000 },
        { id: 'workstation1', name: 'HR Workstation', severity: 'high', patchTime: 1500 },
        { id: 'router1', name: 'Main Router', severity: 'critical', patchTime: 3000 },
        { id: 'laptop1', name: 'CEO Laptop', severity: 'medium', patchTime: 1000 },
        { id: 'server2', name: 'Database Server', severity: 'critical', patchTime: 2500 },
        { id: 'workstation2', name: 'Finance PC', severity: 'high', patchTime: 1500 },
        { id: 'printer1', name: 'Network Printer', severity: 'low', patchTime: 500 },
        { id: 'firewall1', name: 'Network Firewall', severity: 'critical', patchTime: 2000 },
      ],
      tips: [
        'Prioritize critical vulnerabilities first (usually shown in red)',
        'Network infrastructure (routers, firewalls) should be high priority',
        'Servers often contain more sensitive data than individual workstations',
        'Some patches take longer to apply than others'
      ]
    },
    {
      id: 'update-rollback',
      type: 'scenario',
      title: 'Update Rollback Decision',
      scenario: 'After installing a major operating system update on your work computer, you notice several critical issues: your main work software crashes frequently, the VPN client no longer connects properly, and some hardware drivers aren\'t working. However, the update included important security patches. Your IT department says they can rollback the update, but it will remove the security patches and take 2-3 hours.',
      question: 'What\'s the best approach to balance functionality and security?',
      options: [
        { 
          id: 'A', 
          text: 'Rollback immediately to restore full functionality for work',
          feedback: 'Rolling back removes important security protections. There may be better solutions that maintain both security and functionality.' 
        },
        { 
          id: 'B', 
          text: 'Keep the update and work around the issues until they\'re fixed',
          feedback: 'Working with broken critical software can impact productivity and may create other security risks if workarounds involve less secure methods.' 
        },
        { 
          id: 'C', 
          text: 'Rollback the update, but immediately implement temporary security measures and schedule a planned update once issues are resolved',
          correct: true,
          feedback: 'Smart approach! This restores functionality while maintaining security awareness and planning for a proper resolution.' 
        },
        { 
          id: 'D', 
          text: 'Use a different computer until the update issues are resolved',
          feedback: 'This might work short-term but doesn\'t address the underlying problem with the updated system, which still needs to be resolved.' 
        },
      ],
      tips: [
        'Update rollbacks should be temporary solutions, not permanent fixes',
        'Always have a backup plan when applying major system updates',
        'Test updates on non-critical systems first when possible',
        'Document update issues to help prevent similar problems in the future',
        'Consider staging updates (test environment before production)'
      ]
    },
  ];

  const challenge = challenges[currentChallenge];
  const progress = ((currentChallenge + 1) / challenges.length) * 100;

  const handleSubmit = () => {
    if (!selectedAnswer && challenge.type !== 'game') return;
    
    setAttempts(prev => prev + 1);
    
    if (challenge.type === 'game') {
      // Handle game completion
      const score = gameState?.score || 0;
      const correct = score >= 3; // Need to patch at least 3 critical systems
      setIsCorrect(correct);
      setFeedback(correct ? 
        `Great work! You patched ${score} critical systems. Quick response to vulnerabilities is crucial for security.` :
        `You need to patch more critical systems quickly. Try to prioritize high and critical severity vulnerabilities first.`
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
        dispatch({ type: 'UNLOCK_BADGE', payload: 'Update Hero' });
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
      setGameState(null);
    } else {
      navigate('/modules');
    }
  };

  const renderGameContent = () => {
    if (challenge.type !== 'game') return null;

    return (
      <div className="space-y-4">
        <div className="p-4 bg-muted rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">Network Status</span>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="text-sm">Time remaining: 60s</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {challenge.systems.map((system) => (
              <button
                key={system.id}
                onClick={() => {
                  // Simulate patching
                  setGameState(prev => ({
                    ...prev,
                    score: (prev?.score || 0) + 1,
                    patchedSystems: [...(prev?.patchedSystems || []), system.id]
                  }));
                }}
                disabled={gameState?.patchedSystems?.includes(system.id)}
                className={`p-3 rounded-lg border transition-all text-sm ${
                  gameState?.patchedSystems?.includes(system.id)
                    ? 'bg-success/10 border-success text-success'
                    : system.severity === 'critical'
                    ? 'bg-danger/10 border-danger hover:bg-danger/20'
                    : system.severity === 'high'
                    ? 'bg-warning/10 border-warning hover:bg-warning/20'
                    : 'bg-muted border-border hover:bg-muted/80'
                }`}
              >
                <div className="font-medium">{system.name}</div>
                <div className="text-xs mt-1">
                  {system.severity.charAt(0).toUpperCase() + system.severity.slice(1)}
                </div>
                {gameState?.patchedSystems?.includes(system.id) && (
                  <Check className="h-4 w-4 mx-auto mt-1" />
                )}
              </button>
            ))}
          </div>
        </div>
        
        <Button 
          onClick={handleSubmit}
          className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
        >
          Finish Patching Session
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
              <RefreshCw className="h-6 w-6 text-accent" />
              System Updates & Patches
            </h1>
            <p className="text-muted-foreground">Keep your systems secure with timely updates</p>
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
                {challenge.type === 'game' ? 'Interactive Simulation' : 
                 challenge.type === 'scenario' ? 'Real-World Scenario' : 'Knowledge Check'}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Scenario */}
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-accent mt-1" />
                <div>
                  <h4 className="font-medium mb-2">Scenario:</h4>
                  <p className="text-sm">{challenge.scenario}</p>
                </div>
              </div>
            </div>

            {/* Game Content */}
            {challenge.type === 'game' && renderGameContent()}

            {/* Question for non-game challenges */}
            {challenge.type !== 'game' && (
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
                <RefreshCw className="h-5 w-5 text-accent mt-1" />
                <div>
                  <h4 className="font-medium mb-2 text-accent">💡 Update Best Practices:</h4>
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
                {!isCorrect && challenge.type !== 'game' && (
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

export default UpdatesModule;