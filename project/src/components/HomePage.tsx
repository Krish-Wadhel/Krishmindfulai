import React from 'react';
import { Brain, MessageCircle, Heart, TrendingUp, Calendar, Award, ArrowRight } from 'lucide-react';
import { UserData } from '../types';

interface HomePageProps {
  userData: UserData | null;
  onNavigate: (tab: string) => void;
  onUpdateUserData: (updates: Partial<UserData>) => void;
}

const HomePage: React.FC<HomePageProps> = ({ userData, onNavigate }) => {
  if (!userData) return null;

  const quickStats = {
    totalSessions: userData.stats?.totalSessions || 0,
    averageMood: userData.stats?.averageMood || 0,
    exercisesCompleted: userData.stats?.exercisesCompleted || 0,
    moodEntries: userData.moodEntries?.length || 0
  };

  const recentMoodEntry = userData.moodEntries?.[userData.moodEntries.length - 1];
  const recentExercise = userData.cbtExercises?.filter(e => e.completed)?.[0];

  const quickActions = [
    {
      title: 'Start a Chat',
      description: 'Talk with your AI companion',
      icon: MessageCircle,
      color: 'bg-blue-500',
      action: () => onNavigate('chat')
    },
    {
      title: 'Track Your Mood',
      description: 'Log how you\'re feeling today',
      icon: Heart,
      color: 'bg-pink-500',
      action: () => onNavigate('mood')
    },
    {
      title: 'CBT Exercise',
      description: 'Practice cognitive techniques',
      icon: Brain,
      color: 'bg-purple-500',
      action: () => onNavigate('cbt')
    },
    {
      title: 'Mindfulness',
      description: 'Guided meditation and breathing',
      icon: TrendingUp,
      color: 'bg-emerald-500',
      action: () => onNavigate('mindfulness')
    }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Welcome Section */}
      <div className="bg-white rounded-xl shadow-sm border border-blue-200/50 p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {userData.name || 'Friend'}! 👋
            </h1>
            <p className="text-gray-600 text-lg">
              How are you feeling today? Let's continue your mental wellness journey.
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>{new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-blue-200/50 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600 mb-1">Total Sessions</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900">{quickStats.totalSessions}</p>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-blue-200/50 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600 mb-1">Average Mood</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900">
                {quickStats.averageMood.toFixed(1)}/10
              </p>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center">
              <Heart className="w-5 h-5 md:w-6 md:h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-blue-200/50 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600 mb-1">Exercises Done</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900">{quickStats.exercisesCompleted}</p>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
              <Brain className="w-5 h-5 md:w-6 md:h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-blue-200/50 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600 mb-1">Mood Entries</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900">{quickStats.moodEntries}</p>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 md:w-6 md:h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-blue-200/50 p-6 md:p-8">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={action.action}
                className="group p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200 text-left"
              >
                <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{action.description}</p>
                <div className="flex items-center text-blue-600 text-sm font-medium">
                  <span>Get started</span>
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Mood */}
        <div className="bg-white rounded-xl shadow-sm border border-blue-200/50 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Mood</h3>
          {recentMoodEntry ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl">
                  {recentMoodEntry.mood >= 8 ? '😄' : 
                   recentMoodEntry.mood >= 6 ? '😊' : 
                   recentMoodEntry.mood >= 4 ? '😐' : 
                   recentMoodEntry.mood >= 2 ? '😔' : '😢'}
                </span>
                <span className="text-lg font-semibold text-gray-900">
                  {recentMoodEntry.mood}/10
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {recentMoodEntry.date.toLocaleDateString()}
              </p>
              {recentMoodEntry.emotions.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {recentMoodEntry.emotions.slice(0, 3).map((emotion) => (
                    <span key={emotion} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                      {emotion}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500 mb-3">No mood entries yet</p>
              <button
                onClick={() => onNavigate('mood')}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Track your first mood →
              </button>
            </div>
          )}
        </div>

        {/* Recent Achievement */}
        <div className="bg-white rounded-xl shadow-sm border border-blue-200/50 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Latest Achievement</h3>
          {recentExercise ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Award className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Exercise Completed!</p>
                  <p className="text-sm text-gray-600">{recentExercise.title}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500 mb-3">No exercises completed yet</p>
              <button
                onClick={() => onNavigate('cbt')}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Start your first exercise →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Motivational Quote */}
      <div className="bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl shadow-sm p-6 md:p-8 text-white">
        <div className="text-center">
          <h3 className="text-xl md:text-2xl font-bold mb-4">Daily Inspiration</h3>
          <blockquote className="text-lg md:text-xl italic mb-4">
            "The greatest revolution of our generation is the discovery that human beings, 
            by changing the inner attitudes of their minds, can change the outer aspects of their lives."
          </blockquote>
          <p className="text-blue-100">— William James</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;