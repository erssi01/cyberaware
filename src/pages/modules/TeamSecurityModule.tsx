import { useState } from 'react';
import { Users, ArrowLeft, Check, X, Zap, AlertTriangle, FileText, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';

const TeamSecurityModule = () => {
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
      id: 'incident-response-plan',
      type: 'scenario',
      title: 'Security Incident Response Planning',
      scenario: 'You\'re the IT coordinator for a 50-person marketing agency. At 2 PM on Wednesday, an employee reports that their computer is acting strangely - files are being renamed with ".locked" extensions, and a popup appeared demanding payment. Three other employees on the same floor mention similar issues. Your agency handles sensitive client data and has an important campaign launching tomorrow.',
      question: 'What should be your immediate incident response priorities in the first 30 minutes?',
      options: [
        { 
          id: 'A', 
          text: 'Focus on the campaign launch - isolate affected computers and work around the problem using backup systems',
          feedback: 'While business continuity is important, a spreading security incident requires immediate containment to prevent total system compromise.' 
        },
        { 
          id: 'B', 
          text: 'Immediately implement the incident response plan: isolate affected systems, assess scope, notify stakeholders, and activate the response team',
          correct: true,
          feedback: 'Excellent! Proper incident response prioritizes containment, assessment, and communication. This prevents further damage and enables effective recovery.' 
        },
        { 
          id: 'C', 
          text: 'Call the police first, then start backing up unaffected systems',
          feedback: 'Law enforcement involvement comes later in the process. Immediate containment and internal response should happen first.' 
        },
        { 
          id: 'D', 
          text: 'Try to identify the attack source and fix the affected computers individually',
          feedback: 'Individual fixes during an active incident waste precious time. Systematic containment and coordinated response are more effective.' 
        },
      ],
      tips: [
        'Incident response plans should be tested and practiced before emergencies occur',
        'Containment is usually the first priority to prevent incident spread',
        'Clear communication channels and role assignments are crucial during incidents',
        'Document everything during the incident for later analysis and improvement',
        'Business continuity plans should work alongside security incident response'
      ]
    },
    {
      id: 'security-policy-development',
      type: 'knowledge',
      title: 'Developing Effective Security Policies',
      scenario: 'Your startup has grown from 5 to 30 employees in six months. You\'ve been using informal security practices, but now need formal policies. Employees use personal devices, work remotely, access cloud applications, and handle customer data. Some team members are security-conscious, others find security measures annoying. The CEO wants policies that are comprehensive but don\'t slow down the fast-paced work environment.',
      question: 'What approach will create the most effective and adopted security policies for your growing team?',
      options: [
        { 
          id: 'A', 
          text: 'Copy comprehensive security policies from a large corporation and implement them immediately',
          feedback: 'Large corporate policies are often too complex and restrictive for startups, leading to poor adoption and workarounds.' 
        },
        { 
          id: 'B', 
          text: 'Create minimal policies focused only on the most critical risks, and expand gradually as the company grows',
          correct: true,
          feedback: 'Smart approach! Start with essential policies that address your biggest risks, ensure good adoption, then expand. This builds security culture gradually.' 
        },
        { 
          id: 'C', 
          text: 'Let each department create their own security policies based on their specific needs',
          feedback: 'Departmental policies can create inconsistencies and gaps. You need organization-wide standards with some flexibility for implementation.' 
        },
        { 
          id: 'D', 
          text: 'Focus only on technical controls and skip written policies until the company is larger',
          feedback: 'Policies provide the framework for consistent security behavior. Technical controls alone don\'t address human factors and business processes.' 
        },
      ],
      tips: [
        'Effective policies balance security needs with business requirements',
        'Involve employees in policy development to improve buy-in and practicality',
        'Start with policies addressing your highest risks and most common scenarios',
        'Make policies clear, actionable, and easy to understand',
        'Regular review and updates keep policies relevant as the business evolves'
      ]
    },
    {
      id: 'security-awareness-training',
      type: 'scenario',
      title: 'Security Training Program Design',
      scenario: 'You\'re designing a security awareness program for a diverse team: developers who think they know everything about security, sales people who are always rushed, customer service reps who handle sensitive data daily, executives who travel frequently, and remote workers across different time zones. Previous training was a boring 2-hour presentation that most people ignored or complained about.',
      question: 'How can you design a training program that effectively engages all these different groups?',
      options: [
        { 
          id: 'A', 
          text: 'Create one comprehensive training session that covers everything everyone needs to know',
          feedback: 'One-size-fits-all training often fails because different roles have different security needs and learning preferences.' 
        },
        { 
          id: 'B', 
          text: 'Design role-specific, interactive training modules with real scenarios relevant to each group\'s daily work',
          correct: true,
          feedback: 'Excellent! Role-specific, scenario-based training is more engaging and practical. People learn better when content relates to their actual work.' 
        },
        { 
          id: 'C', 
          text: 'Send everyone articles and videos to review on their own time',
          feedback: 'Self-directed learning can work for some, but lacks engagement and doesn\'t ensure comprehension or consistent coverage.' 
        },
        { 
          id: 'D', 
          text: 'Focus training only on the highest-risk groups like customer service and executives',
          feedback: 'Security is everyone\'s responsibility. Limiting training to some groups leaves security gaps and creates inconsistent culture.' 
        },
      ],
      tips: [
        'Tailor training content to specific roles and daily work scenarios',
        'Use interactive elements like simulations and real-world examples',
        'Keep sessions short and focused rather than comprehensive and lengthy',
        'Provide different delivery methods (in-person, online, mobile) for flexibility',
        'Regular reinforcement is more effective than infrequent comprehensive training'
      ]
    },
    {
      id: 'secure-collaboration',
      type: 'simulation',
      title: 'Secure Team Collaboration Setup',
      scenario: 'Your team needs to collaborate on a confidential project involving financial data. Team members are located in three countries, some work from home, others from offices. You need to share documents, communicate securely, and ensure only authorized team members access the information. The project involves external consultants who need limited access.',
      question: 'Set up a secure collaboration environment by selecting appropriate tools and configurations.',
      simulationType: 'collaboration-setup',
      correctActions: ['encrypted-communication', 'access-controls', 'secure-file-sharing', 'audit-logging'],
      incorrectActions: ['public-cloud-storage', 'email-attachments', 'shared-passwords'],
      tips: [
        'Use end-to-end encrypted communication tools for sensitive discussions',
        'Implement role-based access controls to limit information exposure',
        'Choose collaboration platforms with proper security certifications',
        'Document who has access to what information and when'
      ]
    },
    {
      id: 'vendor-security-assessment',
      type: 'knowledge',
      title: 'Third-Party Vendor Security Assessment',
      scenario: 'Your company is evaluating three software vendors for a new customer relationship management (CRM) system that will store all customer contact information, purchase history, and communication records. Vendor A is the cheapest with basic security measures, Vendor B has mid-range pricing with SOC 2 compliance, and Vendor C is the most expensive with advanced security features and multiple certifications. Your CEO is focused on cost savings, but you\'re responsible for data security.',
      question: 'How should you approach the vendor selection process to balance cost and security concerns?',
      options: [
        { 
          id: 'A', 
          text: 'Choose Vendor A to save money and implement additional security measures on your end',
          feedback: 'You can\'t fully compensate for vendor security weaknesses with external measures. Core data security must be built into the vendor\'s platform.' 
        },
        { 
          id: 'B', 
          text: 'Automatically choose Vendor C because they have the most security features',
          feedback: 'The most expensive option isn\'t always necessary. You need to match security requirements to actual business risks and budget constraints.' 
        },
        { 
          id: 'C', 
          text: 'Conduct a risk assessment to determine minimum security requirements, then evaluate vendors against these criteria alongside cost',
          correct: true,
          feedback: 'Perfect approach! Risk-based vendor selection ensures you get adequate security for your specific needs while considering business constraints.' 
        },
        { 
          id: 'D', 
          text: 'Let the CEO make the final decision since they understand the business priorities',
          feedback: 'Security decisions require technical expertise. You should provide clear risk analysis to help leadership make informed decisions.' 
        },
      ],
      tips: [
        'Define minimum security requirements before evaluating vendors',
        'Consider the total cost of security failures, not just upfront software costs',
        'Review vendor security certifications and audit reports',
        'Understand what happens to your data if you stop using the vendor',
        'Include security requirements in vendor contracts and service level agreements'
      ]
    },
    {
      id: 'remote-work-security',
      type: 'scenario',
      title: 'Remote Work Security Challenges',
      scenario: 'Your company has shifted to a hybrid work model where employees split time between office and home. You\'ve noticed security challenges: employees using personal devices for work, connecting to unsecured home networks, working from coffee shops and co-working spaces, family members having access to work computers, and important documents being stored on personal cloud accounts for easy access across locations.',
      question: 'What\'s the most practical approach to securing this hybrid work environment?',
      options: [
        { 
          id: 'A', 
          text: 'Ban all remote work and require employees to work only from secure office locations',
          feedback: 'This eliminates security risks but is impractical in today\'s work environment and would hurt employee satisfaction and productivity.' 
        },
        { 
          id: 'B', 
          text: 'Provide company-managed devices, VPN access, and clear remote work security policies with regular training',
          correct: true,
          feedback: 'Excellent balanced approach! This addresses the main risks while enabling flexible work. Combines technology solutions with policy and education.' 
        },
        { 
          id: 'C', 
          text: 'Trust employees to follow basic security practices and only address issues when they occur',
          feedback: 'Reactive security is risky, especially with remote work challenges. Proactive measures prevent many security incidents.' 
        },
        { 
          id: 'D', 
          text: 'Implement strict monitoring and control over all employee activities when working remotely',
          feedback: 'Excessive monitoring can harm employee trust and productivity. Focus on protecting data and systems rather than surveillance.' 
        },
      ],
      tips: [
        'Provide secure alternatives rather than just restricting risky behaviors',
        'Company-managed devices eliminate many BYOD security risks',
        'VPNs help secure connections from untrusted networks',
        'Clear policies should address common remote work scenarios',
        'Regular security awareness training addresses evolving remote work risks'
      ]
    },
    {
      id: 'data-breach-communication',
      type: 'scenario',
      title: 'Data Breach Communication Strategy',
      scenario: 'Your company has experienced a data breach affecting 5,000 customer records including names, email addresses, and encrypted payment information. The breach was discovered on Friday evening, contained by Saturday morning, and investigation shows it was caused by an employee falling for a sophisticated phishing attack. You have legal requirements to notify customers within 72 hours, and news of the breach is starting to spread on social media.',
      question: 'What\'s the best approach for communicating about this breach to maintain customer trust and meet legal requirements?',
      options: [
        { 
          id: 'A', 
          text: 'Wait to communicate until you have complete information about the breach to avoid giving incorrect details',
          feedback: 'Delays can violate legal requirements and allow misinformation to spread. Timely communication with available facts is better.' 
        },
        { 
          id: 'B', 
          text: 'Send a brief legal compliance notice with minimal details to meet notification requirements',
          feedback: 'Minimal communication may meet legal requirements but doesn\'t build trust or help customers understand the situation.' 
        },
        { 
          id: 'C', 
          text: 'Provide transparent communication about what happened, what data was affected, steps taken to address it, and actions customers should take',
          correct: true,
          feedback: 'Excellent approach! Transparent, actionable communication builds trust and helps customers protect themselves. Shows accountability and competence.' 
        },
        { 
          id: 'D', 
          text: 'Focus the communication on blaming the employee who caused the breach to show it wasn\'t a company system failure',
          feedback: 'Blaming individuals damages company reputation and deflects from organizational responsibility for security training and systems.' 
        },
      ],
      tips: [
        'Transparent communication during crises often builds more trust than secrecy',
        'Focus on facts, impacts, and protective actions rather than speculation',
        'Provide clear next steps for affected individuals',
        'Prepare communication templates for different breach scenarios in advance',
        'Coordinate legal, PR, and technical teams for consistent messaging'
      ]
    },
    {
      id: 'security-culture-building',
      type: 'knowledge',
      title: 'Building a Security-Conscious Culture',
      scenario: 'You\'ve been hired as the first dedicated security person at a creative agency where the culture values innovation, speed, and flexibility. Security has historically been seen as an obstacle to creativity and productivity. Employees often share login credentials, use personal cloud storage for convenience, and download unofficial software tools. The leadership recognizes the need for better security but worries about stifling the creative, collaborative culture that makes the company successful.',
      question: 'How can you build security awareness and practices while maintaining the company\'s innovative culture?',
      options: [
        { 
          id: 'A', 
          text: 'Implement strict security policies and controls immediately to address all the risky behaviors',
          feedback: 'Sudden strict controls often create resistance and workarounds. Cultural change requires a more gradual, collaborative approach.' 
        },
        { 
          id: 'B', 
          text: 'Start with education about why security matters, involve employees in finding solutions, and implement changes gradually with their input',
          correct: true,
          feedback: 'Perfect approach! Security culture builds through understanding, participation, and gradual positive change rather than imposed restrictions.' 
        },
        { 
          id: 'C', 
          text: 'Focus only on technical security controls that work behind the scenes without changing employee behavior',
          feedback: 'Technical controls alone can\'t address all risks. Human behavior is a critical component of organizational security.' 
        },
        { 
          id: 'D', 
          text: 'Wait for a security incident to occur, then use it as motivation for implementing security measures',
          feedback: 'Waiting for incidents is risky and reactive. Proactive culture building prevents many security problems.' 
        },
      ],
      tips: [
        'Frame security as enabling business success rather than restricting creativity',
        'Involve employees in identifying security solutions that work for their workflows',
        'Celebrate security-conscious behaviors to reinforce positive culture',
        'Make security tools and processes as user-friendly as possible',
        'Show how good security practices protect the company\'s creative work and reputation'
      ]
    },
    {
      id: 'security-metrics-reporting',
      type: 'scenario',
      title: 'Security Metrics and Executive Reporting',
      scenario: 'You need to report on your organization\'s security posture to the executive team and board of directors. They want to understand if their security investments are working, but they\'re not technical people. You have data on: number of security incidents (up 20% from last year), employee security training completion rates (85%), phishing simulation click rates (down from 15% to 8%), patch compliance (92% within 30 days), and security tool alerts (thousands per month, 95% false positives).',
      question: 'How should you present this security data to provide meaningful insights for business decision-makers?',
      options: [
        { 
          id: 'A', 
          text: 'Present all the raw numbers and let the executives draw their own conclusions',
          feedback: 'Raw data without context and interpretation isn\'t useful for business decision-making. Executives need meaningful insights.' 
        },
        { 
          id: 'B', 
          text: 'Focus only on positive metrics and downplay any areas of concern to maintain confidence',
          feedback: 'Hiding problems prevents proper resource allocation and decision-making. Balanced reporting builds more credibility.' 
        },
        { 
          id: 'C', 
          text: 'Translate metrics into business impact and risk language, highlighting both improvements and areas needing attention',
          correct: true,
          feedback: 'Perfect! Business leaders need security metrics translated into business terms with clear implications and recommended actions.' 
        },
        { 
          id: 'D', 
          text: 'Present detailed technical explanations for each metric to ensure complete understanding',
          feedback: 'Too much technical detail can overwhelm non-technical executives and obscure the key messages they need to hear.' 
        },
      ],
      tips: [
        'Translate security metrics into business language and risk terms',
        'Compare metrics to industry benchmarks when possible',
        'Focus on trends and changes rather than just point-in-time numbers',
        'Connect security metrics to business objectives and outcomes',
        'Provide clear recommendations based on the data you present'
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
        `Excellent setup! You configured ${correctActions} secure collaboration elements correctly.` :
        `Your setup needs improvement. Focus on encryption, access controls, and secure platforms for team collaboration.`
      );
    } else {
      const selectedOption = challenge.options.find(opt => opt.id === selectedAnswer);
      const correct = selectedOption?.correct || false;
      
      setIsCorrect(correct);
      setFeedback(selectedOption?.feedback || '');
    }
    
    if (isCorrect) {
      const xpGain = attempts === 0 ? 20 : attempts === 1 ? 15 : 10;
      dispatch({ type: 'ADD_XP', payload: xpGain });
      
      if (currentChallenge === 0 && attempts === 0) {
        dispatch({ type: 'UNLOCK_BADGE', payload: 'Team Security Leader' });
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

    const tools = [
      { id: 'encrypted-communication', label: 'End-to-end encrypted messaging platform (Signal, Wire)', type: 'correct' },
      { id: 'access-controls', label: 'Role-based access control system with multi-factor authentication', type: 'correct' },
      { id: 'secure-file-sharing', label: 'Enterprise file sharing with encryption and audit trails', type: 'correct' },
      { id: 'audit-logging', label: 'Comprehensive access and activity logging', type: 'correct' },
      { id: 'public-cloud-storage', label: 'Free public cloud storage (Dropbox, Google Drive personal)', type: 'incorrect' },
      { id: 'email-attachments', label: 'Email with large file attachments', type: 'incorrect' },
      { id: 'shared-passwords', label: 'Shared team passwords for all systems', type: 'incorrect' },
    ];

    return (
      <div className="space-y-4">
        <Alert className="border-accent bg-accent/10">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Select the tools and practices you would implement for secure team collaboration on confidential financial data.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <h4 className="font-medium">Choose your collaboration security setup:</h4>
          <div className="grid gap-2">
            {tools.map((tool) => {
              const isSelected = simulationState?.selectedTools?.includes(tool.id);
              return (
                <button
                  key={tool.id}
                  onClick={() => {
                    setSimulationState(prev => {
                      const currentTools = prev?.selectedTools || [];
                      const newTools = isSelected 
                        ? currentTools.filter(t => t !== tool.id)
                        : [...currentTools, tool.id];
                      
                      const correctActions = newTools.filter(t => 
                        tools.find(tool => tool.id === t)?.type === 'correct'
                      ).length;
                      
                      const incorrectActions = newTools.filter(t => 
                        tools.find(tool => tool.id === t)?.type === 'incorrect'
                      ).length;

                      return {
                        selectedTools: newTools,
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
                    <span className="text-sm">{tool.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        
        <Button 
          onClick={handleSubmit}
          disabled={!simulationState?.selectedTools?.length}
          className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
        >
          Implement Collaboration Setup
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
              <Users className="h-6 w-6 text-accent" />
              Team Security
            </h1>
            <p className="text-muted-foreground">Learn collaborative security practices for teams</p>
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
                <AlertTriangle className="h-5 w-5 text-accent mt-1" />
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
                <Users className="h-5 w-5 text-accent mt-1" />
                <div>
                  <h4 className="font-medium mb-2 text-accent">💡 Team Security Best Practices:</h4>
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
                
                {(isCorrect || challenge.type === 'simulation') && (
                  <Button
                    onClick={challenge.type === 'simulation' && !isCorrect ? handleSubmit : handleNext}
                    className="bg-gradient-success hover:shadow-glow transition-all duration-300"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    {challenge.type === 'simulation' && !isCorrect ? 'Submit Setup' : 
                     currentChallenge === challenges.length - 1 ? 'Complete Module' : 'Next Challenge'}
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

export default TeamSecurityModule;