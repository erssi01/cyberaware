import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Types
export interface User {
  id: string;
  nickname: string;
  role: string;
  password?: string; // For registered users
  isGuest: boolean;
  xp: number;
  level: number;
  streakDays: number;
  completedModules: string[];
  badges: string[];
  lastActivity: Date;
  hasCompletedAssessment: boolean;
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
  registeredUsers: User[]; // Store registered users
}

// Actions
type GameAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'REGISTER_USER'; payload: User }
  | { type: 'LOGIN_USER'; payload: { nickname: string; password: string } }
  | { type: 'ADD_XP'; payload: number }
  | { type: 'COMPLETE_CHALLENGE'; payload: Attempt }
  | { type: 'UNLOCK_BADGE'; payload: string }
  | { type: 'SET_MODULE'; payload: string }
  | { type: 'COMPLETE_ASSESSMENT' }
  | { type: 'RESET_GAME' }
  | { type: 'LOGOUT' };

// Initial state
const initialState: GameState = {
  user: null,
  currentModule: null,
  attempts: [],
  isAssessmentComplete: false,
  registeredUsers: [],
};

// Reducer
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    
    case 'REGISTER_USER':
      return { 
        ...state, 
        user: action.payload,
        registeredUsers: [...state.registeredUsers, action.payload]
      };
    
    case 'LOGIN_USER': {
      const existingUser = state.registeredUsers.find(
        u => u.nickname === action.payload.nickname && u.password === action.payload.password
      );
      if (existingUser) {
        return { ...state, user: existingUser, isAssessmentComplete: existingUser.hasCompletedAssessment };
      }
      return state;
    }
    
    case 'ADD_XP': {
      if (!state.user) return state;
      const newXp = state.user.xp + action.payload;
      const newLevel = Math.floor(newXp / 200) + 1;
      const updatedUser = {
        ...state.user,
        xp: newXp,
        level: newLevel,
        lastActivity: new Date(),
      };
      
      // Update in registered users if not guest
      const updatedRegisteredUsers = state.user.isGuest 
        ? state.registeredUsers
        : state.registeredUsers.map(u => u.id === state.user!.id ? updatedUser : u);
      
      return {
        ...state,
        user: updatedUser,
        registeredUsers: updatedRegisteredUsers,
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
    
    case 'COMPLETE_ASSESSMENT': {
      if (!state.user) return state;
      const updatedUser = { ...state.user, hasCompletedAssessment: true };
      const updatedRegisteredUsers = state.user.isGuest 
        ? state.registeredUsers
        : state.registeredUsers.map(u => u.id === state.user!.id ? updatedUser : u);
        
      return { 
        ...state, 
        isAssessmentComplete: true,
        user: updatedUser,
        registeredUsers: updatedRegisteredUsers,
      };
    }
    
    case 'RESET_GAME':
      return initialState;
    
    case 'LOGOUT':
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