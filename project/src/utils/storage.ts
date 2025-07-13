import { UserData } from '../types';

const STORAGE_KEY = 'mindfulai_user_data';

const defaultUserData: UserData = {
  hasCompletedWelcome: false,
  messages: [],
  moodEntries: [],
  cbtExercises: [],
  mindfulnessSessions: [],
  goals: [],
  preferences: {
    anonymousMode: false,
    dataSharing: false,
    voiceInput: false,
    notifications: true,
    language: 'en',
  },
  stats: {
    totalSessions: 0,
    streakDays: 0,
    averageMood: 5,
    exercisesCompleted: 0,
  },
};

export const saveUserData = (data: UserData): void => {
  try {
    const serializedData = JSON.stringify({
      ...data,
      messages: data.messages.map(msg => ({
        ...msg,
        timestamp: msg.timestamp.toISOString(),
      })),
      moodEntries: data.moodEntries.map(entry => ({
        ...entry,
        date: entry.date.toISOString(),
      })),
    });
    localStorage.setItem(STORAGE_KEY, serializedData);
  } catch (error) {
    console.error('Failed to save user data:', error);
  }
};

export const loadUserData = (): UserData => {
  try {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    if (!serializedData) return defaultUserData;

    const data = JSON.parse(serializedData);
    return {
      ...data,
      messages: data.messages?.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      })) || [],
      moodEntries: data.moodEntries?.map((entry: any) => ({
        ...entry,
        date: new Date(entry.date),
      })) || [],
    };
  } catch (error) {
    console.error('Failed to load user data:', error);
    return defaultUserData;
  }
};

export const clearUserData = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

export { defaultUserData };