export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  sentiment?: 'positive' | 'neutral' | 'negative' | 'crisis';
  type?: 'text' | 'exercise' | 'resource';
}

export interface MoodEntry {
  id: string;
  date: Date;
  mood: number; // 1-10 scale
  emotions: string[];
  notes: string;
  triggers?: string[];
  copingStrategies?: string[];
}

export interface CBTExercise {
  id: string;
  title: string;
  description: string;
  type: 'thought-challenge' | 'behavioral-activation' | 'exposure' | 'mindfulness';
  steps: string[];
  completed: boolean;
  completedAt?: Date;
  userResponses?: { [key: string]: string };
}

export interface MindfulnessSession {
  id: string;
  title: string;
  type: 'breathing' | 'meditation' | 'grounding' | 'progressive-relaxation';
  duration: number; // in minutes
  instructions: string[];
  audioUrl?: string;
  completed: boolean;
  completedAt?: Date;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  targetDate: Date;
  completed: boolean;
  progress: number; // 0-100
  milestones: { id: string; title: string; completed: boolean }[];
}

export interface UserData {
  name?: string;
  hasCompletedWelcome: boolean;
  messages: Message[];
  moodEntries: MoodEntry[];
  cbtExercises: CBTExercise[];
  mindfulnessSessions: MindfulnessSession[];
  goals: Goal[];
  preferences: {
    anonymousMode: boolean;
    dataSharing: boolean;
    voiceInput: boolean;
    notifications: boolean;
    language: string;
  };
  stats: {
    totalSessions: number;
    streakDays: number;
    averageMood: number;
    exercisesCompleted: number;
  };
}