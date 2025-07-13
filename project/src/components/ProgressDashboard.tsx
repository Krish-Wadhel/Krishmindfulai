import React from 'react';
import { TrendingUp, Calendar, Target, Award, Heart, Brain } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { UserData } from '../types';

interface ProgressDashboardProps {
  userData: UserData | null;
}

const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ userData }) => {
  if (!userData) return null;

  const { moodEntries, cbtExercises, mindfulnessSessions, stats } = userData;
  
  // Calculate streaks
  const calculateStreak = () => {
    if (moodEntries.length === 0) return 0;
    
    const sortedEntries = [...moodEntries].sort((a, b) => b.date.getTime() - a.date.getTime());
    const today = new Date();
    let streak = 0;
    
    for (let i = 0; i < sortedEntries.length; i++) {
      const entryDate = new Date(sortedEntries[i].date);
      const daysDiff = Math.floor((today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === streak) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const currentStreak = calculateStreak();

  // Weekly mood data
  const weeklyMoodData = (() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date;
    });

    return last7Days.map(date => {
      const dayEntries = moodEntries.filter(entry => 
        entry.date.toDateString() === date.toDateString()
      );
      
      const averageMood = dayEntries.length > 0 
        ? dayEntries.reduce((sum, entry) => sum + entry.mood, 0) / dayEntries.length
        : 0;

      return {
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        mood: averageMood,
        date: date.toISOString().split('T')[0]
      };
    });
  })();

  // Activity completion data
  const activityData = [
    { name: 'Mood Tracking', completed: moodEntries.length, target: 30 },
    { name: 'CBT Exercises', completed: cbtExercises.filter(e => e.completed).length, target: 10 },
    { name: 'Mindfulness', completed: mindfulnessSessions.filter(s => s.completed).length, target: 15 }
  ];

  // Recent achievements
  const achievements = [
    {
      id: 'first-mood',
      title: 'First Mood Entry',
      description: 'Logged your first mood entry',
      earned: moodEntries.length > 0,
      icon: Heart,
      color: 'text-pink-600 bg-pink-100'
    },
    {
      id: 'week-streak',
      title: 'Week Warrior',
      description: 'Tracked mood for 7 consecutive days',
      earned: currentStreak >= 7,
      icon: Calendar,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      id: 'cbt-starter',
      title: 'CBT Explorer',
      description: 'Completed your first CBT exercise',
      earned: cbtExercises.filter(e => e.completed).length > 0,
      icon: Brain,
      color: 'text-purple-600 bg-purple-100'
    },
    {
      id: 'mindful-minutes',
      title: 'Mindful Moments',
      description: 'Completed 100 minutes of mindfulness',
      earned: mindfulnessSessions.filter(s => s.completed).reduce((sum, s) => sum + s.duration, 0) >= 100,
      icon: Target,
      color: 'text-emerald-600 bg-emerald-100'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-blue-200/50 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Progress Dashboard</h2>
            <p className="text-gray-600">Track your mental health journey and celebrate your growth</p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-blue-200/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Current Streak</p>
              <p className="text-2xl font-bold text-gray-900">{currentStreak} days</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Keep it up!
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-blue-200/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Average Mood</p>
              <p className="text-2xl font-bold text-gray-900">{stats.averageMood.toFixed(1)}/10</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Last 30 days
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-blue-200/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Exercises Done</p>
              <p className="text-2xl font-bold text-gray-900">{stats.exercisesCompleted}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
              <Brain className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            CBT & Mindfulness
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-blue-200/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Sessions</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSessions}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            All time
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Mood Trend Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-blue-200/50 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Mood Trend</h3>
          {weeklyMoodData.some(d => d.mood > 0) ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyMoodData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="day" className="text-xs" />
                  <YAxis domain={[1, 10]} className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="mood"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#10B981' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <Heart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Start tracking your mood to see trends</p>
              </div>
            </div>
          )}
        </div>

        {/* Activity Progress Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-blue-200/50 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Progress</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="completed" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="target" fill="#e5e7eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-xl shadow-sm border border-blue-200/50 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Award className="w-6 h-6 text-amber-600" />
          <h3 className="text-lg font-semibold text-gray-900">Achievements</h3>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((achievement) => {
            const Icon = achievement.icon;
            return (
              <div 
                key={achievement.id}
                className={`p-4 rounded-xl border-2 transition-all ${
                  achievement.earned 
                    ? 'border-amber-200 bg-amber-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg ${
                    achievement.earned ? achievement.color : 'text-gray-400 bg-gray-100'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {achievement.earned && (
                    <div className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center">
                      <span className="text-xs">✓</span>
                    </div>
                  )}
                </div>
                
                <h4 className={`font-semibold mb-1 ${
                  achievement.earned ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {achievement.title}
                </h4>
                <p className={`text-sm ${
                  achievement.earned ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  {achievement.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Insights */}
      <div className="bg-white rounded-xl shadow-sm border border-blue-200/50 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Insights & Recommendations</h3>
        
        <div className="space-y-4">
          {moodEntries.length === 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Start Your Journey</h4>
              <p className="text-blue-800 text-sm">
                Begin tracking your mood daily to gain insights into your emotional patterns and identify what affects your well-being.
              </p>
            </div>
          )}
          
          {currentStreak >= 7 && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <h4 className="font-medium text-emerald-900 mb-2">Great Consistency! 🎉</h4>
              <p className="text-emerald-800 text-sm">
                You've been tracking your mood for {currentStreak} days straight. Consistency is key to understanding your mental health patterns.
              </p>
            </div>
          )}
          
          {stats.averageMood < 5 && moodEntries.length >= 5 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h4 className="font-medium text-amber-900 mb-2">Consider Professional Support</h4>
              <p className="text-amber-800 text-sm">
                Your recent mood entries suggest you might benefit from additional support. Consider reaching out to a mental health professional or using our crisis support resources.
              </p>
            </div>
          )}
          
          {cbtExercises.filter(e => e.completed).length === 0 && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="font-medium text-purple-900 mb-2">Try CBT Exercises</h4>
              <p className="text-purple-800 text-sm">
                Cognitive Behavioral Therapy exercises can help you identify and change negative thought patterns. Start with our "Challenging Negative Thoughts" exercise.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressDashboard;