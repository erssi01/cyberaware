import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Types
export interface User {
  id: string;
  nickname: string;
  role: string;
  xp: number;
  level: number;
  streakDays: number;
  completedModules: string[];
  badges: string[];
  lastActivity: Date;
}

export interface Challenge {
  id: string;
  moduleId: string;
  type: 'mcq' | 'simulation' | 'builder';
  title: string;
  prompt: string;
  options?: any[];
  answerKey: any;
  difficulty: 1 | 2 | 3;
  xpReward: number;
}

export interface Attempt {
  challengeId: string;
  correct: boolean;
  timeMs: number;
  timestamp: Date;
}

export interface GameState {
  user: User | null;
  currentModule: string | null;
  attempts: Attempt[];
  isAssessmentComplete: boolean;
}

// Actions
type GameAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'ADD_XP'; payload: number }
  | { type: 'COMPLETE_CHALLENGE'; payload: Attempt }
  | { type: 'UNLOCK_BADGE'; payload: string }
  | { type: 'SET_MODULE'; payload: string }
  | { type: 'COMPLETE_ASSESSMENT' }
  | { type: 'RESET_GAME' };

// Initial state
const initialState: GameState = {
  user: null,
  currentModule: null,
  attempts: [],
  isAssessmentComplete: false,
};

// Reducer
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    
    case 'ADD_XP': {
      if (!state.user) return state;
      const newXp = state.user.xp + action.payload;
      const newLevel = Math.floor(newXp / 200) + 1;
      return {
        ...state,
        user: {
          ...state.user,
          xp: newXp,
          level: newLevel,
          lastActivity: new Date(),
        },
      };
    }
    
    case 'COMPLETE_CHALLENGE':
      return {
        ...state,
        attempts: [...state.attempts, action.payload],
      };
    
    case 'UNLOCK_BADGE': {
      if (!state.user) return state;
      return {
        ...state,
        user: {
          ...state.user,
          badges: [...state.user.badges, action.payload],
        },
      };
    }
    
    case 'SET_MODULE':
      return { ...state, currentModule: action.payload };
    
    case 'COMPLETE_ASSESSMENT':
      return { ...state, isAssessmentComplete: true };
    
    case 'RESET_GAME':
      return initialState;
    
    default:
      return state;
  }
}

// Context
const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
} | null>(null);

// Provider
export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

// Hook
export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}