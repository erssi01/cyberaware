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
  // Enhanced gamification fields
  dailyLoginStreak: number;
  lastLoginDate: string;
  weeklyXP: number;
  monthlyXP: number;
  totalChallengesCompleted: number;
  perfectScoreCount: number;
  fastestCompletionTime: number;
  achievements: Achievement[];
  preferences: UserPreferences;
  stats: UserStats;
}

export interface Achievement {
  id: string;
  type: 'xp' | 'streak' | 'badge' | 'level' | 'challenge' | 'speed';
  title: string;
  description: string;
  value?: number;
  timestamp: Date;
}

export interface UserPreferences {
  difficulty: 'easy' | 'medium' | 'hard';
  reminders: boolean;
  soundEnabled: boolean;
  animationsEnabled: boolean;
}

export interface UserStats {
  averageScore: number;
  strongestModule: string;
  weakestModule: string;
  studyTimeMinutes: number;
  favoriteTimeOfDay: string;
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
  // Enhanced gamification state
  dailyQuests: Quest[];
  weeklyQuests: Quest[];
  leaderboard: LeaderboardEntry[];
  globalStats: GlobalStats;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'special';
  progress: number;
  maxProgress: number;
  xpReward: number;
  isCompleted: boolean;
  expiresAt: Date;
}

export interface LeaderboardEntry {
  userId: string;
  nickname: string;
  xp: number;
  level: number;
  badges: number;
  streakDays: number;
}

export interface GlobalStats {
  totalUsers: number;
  totalXPEarned: number;
  totalChallengesCompleted: number;
  averageLevel: number;
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
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_DAILY_STREAK' }
  | { type: 'COMPLETE_QUEST'; payload: string }
  | { type: 'ADD_ACHIEVEMENT'; payload: Achievement }
  | { type: 'UPDATE_PREFERENCES'; payload: Partial<UserPreferences> }
  | { type: 'UPDATE_LEADERBOARD'; payload: LeaderboardEntry[] };

// Load registered users from localStorage
const loadRegisteredUsers = (): User[] => {
  try {
    const stored = localStorage.getItem('cyberaware_registered_users');
    if (stored) {
      const users = JSON.parse(stored);
      // Convert lastActivity strings back to Date objects
      return users.map((user: any) => ({
        ...user,
        lastActivity: new Date(user.lastActivity)
      }));
    }
    return [];
  } catch {
    return [];
  }
};

// Save registered users to localStorage
const saveRegisteredUsers = (users: User[]) => {
  try {
    localStorage.setItem('cyberaware_registered_users', JSON.stringify(users));
  } catch {
    // Handle localStorage errors silently
  }
};

// Initial state
const initialState: GameState = {
  user: null,
  currentModule: null,
  attempts: [],
  isAssessmentComplete: false,
  registeredUsers: loadRegisteredUsers(),
  dailyQuests: [],
  weeklyQuests: [],
  leaderboard: [],
  globalStats: {
    totalUsers: 0,
    totalXPEarned: 0,
    totalChallengesCompleted: 0,
    averageLevel: 1,
  },
};

// Reducer
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    
    case 'REGISTER_USER': {
      const updatedRegisteredUsers = [...state.registeredUsers, action.payload];
      saveRegisteredUsers(updatedRegisteredUsers);
      return { 
        ...state, 
        user: action.payload,
        registeredUsers: updatedRegisteredUsers
      };
    }
    
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
      
      // Save to localStorage if user is registered
      if (!state.user.isGuest) {
        saveRegisteredUsers(updatedRegisteredUsers);
      }
      
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
      
      // Save to localStorage if user is registered
      if (!state.user.isGuest) {
        saveRegisteredUsers(updatedRegisteredUsers);
      }
        
      return { 
        ...state, 
        isAssessmentComplete: true,
        user: updatedUser,
        registeredUsers: updatedRegisteredUsers,
      };
    }
    
    case 'RESET_GAME':
      return initialState;
    
    case 'UPDATE_DAILY_STREAK': {
      if (!state.user) return state;
      const today = new Date().toDateString();
      const lastLogin = new Date(state.user.lastLoginDate);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      let newStreak = state.user.dailyLoginStreak;
      
      // If last login was yesterday, increment streak
      if (lastLogin.toDateString() === yesterday.toDateString()) {
        newStreak += 1;
      } else if (lastLogin.toDateString() !== today) {
        // If more than a day gap, reset streak to 1
        newStreak = 1;
      }
      
      const updatedUser = {
        ...state.user,
        dailyLoginStreak: newStreak,
        lastLoginDate: today,
        lastActivity: new Date(),
      };
      
      const updatedRegisteredUsers = state.user.isGuest 
        ? state.registeredUsers
        : state.registeredUsers.map(u => u.id === state.user!.id ? updatedUser : u);
      
      if (!state.user.isGuest) {
        saveRegisteredUsers(updatedRegisteredUsers);
      }
      
      return {
        ...state,
        user: updatedUser,
        registeredUsers: updatedRegisteredUsers,
      };
    }
    
    case 'COMPLETE_QUEST': {
      const updatedDailyQuests = state.dailyQuests.map(quest =>
        quest.id === action.payload ? { ...quest, isCompleted: true } : quest
      );
      const updatedWeeklyQuests = state.weeklyQuests.map(quest =>
        quest.id === action.payload ? { ...quest, isCompleted: true } : quest
      );
      
      return {
        ...state,
        dailyQuests: updatedDailyQuests,
        weeklyQuests: updatedWeeklyQuests,
      };
    }
    
    case 'ADD_ACHIEVEMENT': {
      if (!state.user) return state;
      const updatedUser = {
        ...state.user,
        achievements: [...state.user.achievements, action.payload],
      };
      
      const updatedRegisteredUsers = state.user.isGuest 
        ? state.registeredUsers
        : state.registeredUsers.map(u => u.id === state.user!.id ? updatedUser : u);
      
      if (!state.user.isGuest) {
        saveRegisteredUsers(updatedRegisteredUsers);
      }
      
      return {
        ...state,
        user: updatedUser,
        registeredUsers: updatedRegisteredUsers,
      };
    }
    
    case 'UPDATE_PREFERENCES': {
      if (!state.user) return state;
      const updatedUser = {
        ...state.user,
        preferences: { ...state.user.preferences, ...action.payload },
      };
      
      const updatedRegisteredUsers = state.user.isGuest 
        ? state.registeredUsers
        : state.registeredUsers.map(u => u.id === state.user!.id ? updatedUser : u);
      
      if (!state.user.isGuest) {
        saveRegisteredUsers(updatedRegisteredUsers);
      }
      
      return {
        ...state,
        user: updatedUser,
        registeredUsers: updatedRegisteredUsers,
      };
    }
    
    case 'LOGOUT':
      return { 
        ...state,
        user: null,
        currentModule: null,
        attempts: [],
        isAssessmentComplete: false,
        // Preserve registered users on logout  
        registeredUsers: state.registeredUsers
      };
    
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