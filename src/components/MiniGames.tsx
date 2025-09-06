import { useState, useEffect } from 'react';
import { Gamepad2, Zap, Timer, Target, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useGame } from '@/contexts/GameContext';
import { toast } from '@/hooks/use-toast';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export const SpinWheel = () => {
  const { dispatch } = useGame();
  const [isSpinning, setIsSpinning] = useState(false);
  const [canSpin, setCanSpin] = useState(true);
  const [rotation, setRotation] = useState(0);

  const rewards = [
    { label: '10 XP', value: 10, color: 'bg-blue-500' },
    { label: '25 XP', value: 25, color: 'bg-green-500' },
    { label: '50 XP', value: 50, color: 'bg-yellow-500' },
    { label: '5 XP', value: 5, color: 'bg-gray-500' },
    { label: '100 XP', value: 100, color: 'bg-purple-500' },
    { label: '15 XP', value: 15, color: 'bg-red-500' },
  ];

  const spin = () => {
    if (!canSpin || isSpinning) return;
    
    setIsSpinning(true);
    const spinAmount = 1440 + Math.random() * 1440; // 4-8 full rotations
    const newRotation = rotation + spinAmount;
    setRotation(newRotation);
    
    setTimeout(() => {
      const segmentSize = 360 / rewards.length;
      const normalizedRotation = (360 - (newRotation % 360)) % 360;
      const winningIndex = Math.floor(normalizedRotation / segmentSize);
      const reward = rewards[winningIndex];
      
      dispatch({ type: 'ADD_XP', payload: reward.value });
      toast({
        title: "Wheel Spin Complete!",
        description: `You won ${reward.label}!`,
      });
      
      setIsSpinning(false);
      setCanSpin(false);
      
      // Allow spinning again after 24 hours (simplified to 10 seconds for demo)
      setTimeout(() => setCanSpin(true), 10000);
    }, 3000);
  };

  return (
    <Card className="bg-gradient-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RotateCcw className="h-5 w-5 text-accent" />
          Daily Spin Wheel
        </CardTitle>
        <CardDescription>Spin once per day for bonus XP!</CardDescription>
      </CardHeader>
      
      <CardContent className="text-center">
        <div className="relative w-48 h-48 mx-auto mb-4">
          <div 
            className={`w-full h-full rounded-full border-4 border-border transition-transform duration-3000 ${
              isSpinning ? 'ease-out' : 'ease-in-out'
            }`}
            style={{ 
              transform: `rotate(${rotation}deg)`,
              background: `conic-gradient(
                ${rewards.map((reward, i) => 
                  `${reward.color} ${i * 60}deg ${(i + 1) * 60}deg`
                ).join(', ')}
              )`
            }}
          >
            {rewards.map((reward, i) => (
              <div
                key={i}
                className="absolute text-white font-bold text-sm"
                style={{
                  transform: `rotate(${i * 60 + 30}deg) translateY(-70px)`,
                  transformOrigin: '50% 96px',
                }}
              >
                {reward.label}
              </div>
            ))}
          </div>
          
          {/* Pointer */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
            <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-accent"></div>
          </div>
        </div>
        
        <Button 
          onClick={spin}
          disabled={!canSpin || isSpinning}
          className="bg-gradient-primary hover:shadow-glow"
        >
          {isSpinning ? 'Spinning...' : canSpin ? 'Spin the Wheel!' : 'Come back tomorrow'}
        </Button>
      </CardContent>
    </Card>
  );
};

export const QuickQuiz = () => {
  const { dispatch } = useGame();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);

  const questions: QuizQuestion[] = [
    {
      id: '1',
      question: 'What is the most important characteristic of a strong password?',
      options: ['Length', 'Complexity', 'Both length and complexity', 'Memorability'],
      correctAnswer: 2,
      explanation: 'Strong passwords need both length (12+ characters) and complexity (mix of characters).'
    },
    {
      id: '2',
      question: 'Which of these is a common phishing red flag?',
      options: ['Urgent language', 'Generic greetings', 'Suspicious links', 'All of the above'],
      correctAnswer: 3,
      explanation: 'Phishing emails often use urgent language, generic greetings, and suspicious links.'
    },
    {
      id: '3',
      question: 'How often should you update your software?',
      options: ['Monthly', 'When updates are available', 'Yearly', 'Only when problems occur'],
      correctAnswer: 1,
      explanation: 'Software should be updated as soon as updates become available for security.'
    }
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameStarted && !gameEnded && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 || currentQuestion >= questions.length) {
      endGame();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameStarted, gameEnded, currentQuestion]);

  const startGame = () => {
    setGameStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setTimeLeft(30);
    setGameEnded(false);
    setSelectedAnswer(null);
  };

  const selectAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    
    setTimeout(() => {
      if (answerIndex === questions[currentQuestion].correctAnswer) {
        setScore(score + 1);
      }
      
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setTimeLeft(30);
      } else {
        endGame();
      }
    }, 1500);
  };

  const endGame = () => {
    setGameEnded(true);
    const finalScore = selectedAnswer === questions[currentQuestion]?.correctAnswer ? score + 1 : score;
    const xpEarned = finalScore * 20;
    
    if (xpEarned > 0) {
      dispatch({ type: 'ADD_XP', payload: xpEarned });
      toast({
        title: "Quiz Complete!",
        description: `You scored ${finalScore}/${questions.length} and earned ${xpEarned} XP!`,
      });
    }
  };

  if (!gameStarted) {
    return (
      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-accent" />
            Quick Quiz Challenge
          </CardTitle>
          <CardDescription>
            Test your cybersecurity knowledge in this timed quiz!
          </CardDescription>
        </CardHeader>
        
        <CardContent className="text-center">
          <div className="space-y-4">
            <div className="text-muted-foreground">
              <p>• {questions.length} questions</p>
              <p>• 30 seconds per question</p>
              <p>• 20 XP per correct answer</p>
            </div>
            <Button onClick={startGame} className="bg-gradient-primary hover:shadow-glow">
              <Gamepad2 className="h-4 w-4 mr-2" />
              Start Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (gameEnded) {
    const finalScore = selectedAnswer === questions[currentQuestion]?.correctAnswer ? score + 1 : score;
    return (
      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-success" />
            Quiz Complete!
          </CardTitle>
        </CardHeader>
        
        <CardContent className="text-center space-y-4">
          <div>
            <div className="text-4xl font-bold text-foreground mb-2">
              {finalScore}/{questions.length}
            </div>
            <p className="text-muted-foreground">Questions Correct</p>
          </div>
          
          <Badge className="bg-success text-success-foreground">
            +{finalScore * 20} XP Earned
          </Badge>
          
          <Button onClick={startGame} variant="outline" className="mt-4">
            Play Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  const question = questions[currentQuestion];
  
  return (
    <Card className="bg-gradient-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-accent" />
            Question {currentQuestion + 1}/{questions.length}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Timer className="h-4 w-4 text-warning" />
            <Badge variant={timeLeft <= 5 ? "destructive" : "secondary"}>
              {timeLeft}s
            </Badge>
          </div>
        </div>
        <Progress value={(currentQuestion / questions.length) * 100} className="mt-2" />
      </CardHeader>
      
      <CardContent className="space-y-4">
        <h3 className="text-lg font-semibold">{question.question}</h3>
        
        <div className="space-y-2">
          {question.options.map((option, index) => (
            <Button
              key={index}
              onClick={() => selectAnswer(index)}
              variant="outline"
              className={`w-full text-left justify-start h-auto p-4 ${
                selectedAnswer === index
                  ? index === question.correctAnswer
                    ? 'bg-success/20 border-success text-success'
                    : 'bg-destructive/20 border-destructive text-destructive'
                  : ''
              } ${
                selectedAnswer !== null && index === question.correctAnswer
                  ? 'bg-success/20 border-success text-success'
                  : ''
              }`}
              disabled={selectedAnswer !== null}
            >
              {option}
            </Button>
          ))}
        </div>
        
        {selectedAnswer !== null && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-sm">{question.explanation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};