import React, { useState } from 'react';
import { Calendar, TrendingUp, Heart, Plus, BookOpen, X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MoodEntry, UserData } from '../types';

interface MoodTrackerProps {
  userData: UserData | null;
  onUpdateUserData: (updates: Partial<UserData>) => void;
}

const emotions = [
  'Happy', 'Sad', 'Anxious', 'Calm', 'Excited', 'Frustrated', 
  'Grateful', 'Lonely', 'Confident', 'Overwhelmed', 'Peaceful', 'Angry'
];

const emotionTriggers = {
  'Happy': ['Good news', 'Achievement', 'Time with loved ones', 'Beautiful weather', 'Accomplishing goals', 'Acts of kindness'],
  'Sad': ['Loss', 'Disappointment', 'Loneliness', 'Bad news', 'Rejection', 'Memories'],
  'Anxious': ['Work stress', 'Uncertainty', 'Social situations', 'Health concerns', 'Financial worries', 'Future planning'],
  'Calm': ['Meditation', 'Nature', 'Quiet time', 'Deep breathing', 'Peaceful environment', 'Relaxation'],
  'Excited': ['New opportunities', 'Upcoming events', 'Adventures', 'Achievements', 'Surprises', 'Good news'],
  'Frustrated': ['Obstacles', 'Delays', 'Misunderstandings', 'Technical issues', 'Unmet expectations', 'Traffic'],
  'Grateful': ['Blessings', 'Support from others', 'Good health', 'Opportunities', 'Small pleasures', 'Acts of kindness'],
  'Lonely': ['Isolation', 'Distance from loved ones', 'Social rejection', 'Being misunderstood', 'Lack of connection', 'Quiet evenings'],
  'Confident': ['Success', 'Positive feedback', 'Preparation', 'Self-care', 'Achievements', 'Support from others'],
  'Overwhelmed': ['Too many tasks', 'Time pressure', 'Multiple responsibilities', 'Information overload', 'Lack of control', 'High expectations'],
  'Peaceful': ['Meditation', 'Nature', 'Quiet moments', 'Resolution', 'Acceptance', 'Spiritual practices'],
  'Angry': ['Injustice', 'Betrayal', 'Frustration', 'Disrespect', 'Unmet needs', 'Boundary violations']
};

const copingStrategies = [
  'Deep breathing', 'Meditation', 'Exercise', 'Talking to friends',
  'Journaling', 'Listening to music', 'Taking a walk', 'Reading',
  'Creative activities', 'Professional help', 'Self-care routine', 'Prayer/Spirituality'
];

const MoodTracker: React.FC<MoodTrackerProps> = ({ userData, onUpdateUserData }) => {
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [newEntry, setNewEntry] = useState({
    mood: 5,
    emotions: [] as string[],
    notes: '',
    triggers: [] as string[],
    copingStrategies: [] as string[]
  });

  const moodEntries = userData?.moodEntries || [];

  const handleAddEntry = () => {
    // Validation: require mood selection and at least one emotion
    if (newEntry.mood === 5 && newEntry.emotions.length === 0) {
      alert('Please select your mood level and at least one emotion before saving.');
      return;
    }

    const entry: MoodEntry = {
      id: Date.now().toString(),
      date: new Date(),
      mood: newEntry.mood,
      emotions: newEntry.emotions,
      notes: newEntry.notes,
      triggers: newEntry.triggers,
      copingStrategies: newEntry.copingStrategies
    };

    const updatedEntries = [...moodEntries, entry];
    const averageMood = updatedEntries.reduce((sum, e) => sum + e.mood, 0) / updatedEntries.length;

    onUpdateUserData({
      moodEntries: updatedEntries,
      stats: {
        ...userData?.stats,
        averageMood: Math.round(averageMood * 10) / 10
      } as any
    });

    setNewEntry({
      mood: 5,
      emotions: [],
      notes: '',
      triggers: [],
      copingStrategies: []
    });
    setShowAddEntry(false);
  };

  const toggleArrayItem = (array: string[], item: string, setter: (items: string[]) => void) => {
    if (array.includes(item)) {
      setter(array.filter(i => i !== item));
    } else {
      setter([...array, item]);
    }
  };

  const getMoodColor = (mood: number) => {
    if (mood >= 8) return 'text-emerald-600 bg-emerald-100';
    if (mood >= 6) return 'text-blue-600 bg-blue-100';
    if (mood >= 4) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getMoodEmoji = (mood: number) => {
    if (mood >= 9) return '😄';
    if (mood >= 7) return '😊';
    if (mood >= 5) return '😐';
    if (mood >= 3) return '😔';
    return '😢';
  };

  const getEmotionEmoji = (emotion: string) => {
    const emojiMap: { [key: string]: string } = {
      'Happy': '😄', 'Sad': '😢', 'Anxious': '😰', 'Calm': '😌',
      'Excited': '🤩', 'Frustrated': '😤', 'Grateful': '🙏', 'Lonely': '😔',
      'Confident': '😎', 'Overwhelmed': '😵', 'Peaceful': '☮️', 'Angry': '😠'
    };
    return emojiMap[emotion] || '😐';
  };

  const getAvailableTriggers = () => {
    if (newEntry.emotions.length === 0) return [];
    
    const allTriggers = new Set<string>();
    newEntry.emotions.forEach(emotion => {
      if (emotionTriggers[emotion as keyof typeof emotionTriggers]) {
        emotionTriggers[emotion as keyof typeof emotionTriggers].forEach(trigger => {
          allTriggers.add(trigger);
        });
      }
    });
    
    return Array.from(allTriggers);
  };

  const chartData = moodEntries
    .slice(-30)
    .map(entry => ({
      date: entry.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      mood: entry.mood,
      fullDate: entry.date.toISOString()
    }));

  const averageMood = userData?.stats?.averageMood || 0;
  const recentTrend = moodEntries.length >= 2 
    ? moodEntries[moodEntries.length - 1].mood - moodEntries[moodEntries.length - 2].mood
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-blue-200/50 p-4 md:p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Mood Tracker</h2>
            <p className="text-gray-600">Monitor your emotional patterns and identify trends</p>
          </div>
          
          <button
            onClick={() => setShowAddEntry(true)}
            className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white px-4 md:px-6 py-2 md:py-3 rounded-xl hover:from-blue-600 hover:to-emerald-600 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4 md:w-5 md:h-5" />
            <span className="text-sm md:text-base">Add Entry</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-blue-200/50 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Average Mood</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900">
                {averageMood.toFixed(1)}/10
              </p>
            </div>
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center ${getMoodColor(averageMood)}`}>
              <Heart className="w-5 h-5 md:w-6 md:h-6" />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Based on {moodEntries.length} entries
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-blue-200/50 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Recent Trend</p>
              <p className={`text-xl md:text-2xl font-bold ${recentTrend > 0 ? 'text-emerald-600' : recentTrend < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                {recentTrend > 0 ? '↗' : recentTrend < 0 ? '↘' : '→'} {Math.abs(recentTrend).toFixed(1)}
              </p>
            </div>
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center ${
              recentTrend > 0 ? 'text-emerald-600 bg-emerald-100' : 
              recentTrend < 0 ? 'text-red-600 bg-red-100' : 
              'text-gray-600 bg-gray-100'
            }`}>
              <TrendingUp className="w-5 h-5 md:w-6 md:h-6" />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {recentTrend > 0 ? 'Improving' : recentTrend < 0 ? 'Declining' : 'Stable'}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-blue-200/50 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Entries</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900">{moodEntries.length}</p>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
              <Calendar className="w-5 h-5 md:w-6 md:h-6" />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Keep tracking daily!
          </div>
        </div>
      </div>

      {/* Mood Chart */}
      {chartData.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-blue-200/50 p-4 md:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Mood Trends</h3>
          <div className="h-48 md:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="date" className="text-xs" />
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
                  stroke="url(#gradient)"
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#10B981' }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#10B981" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Recent Entries */}
      <div className="bg-white rounded-xl shadow-sm border border-blue-200/50 p-4 md:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Entries</h3>
        
        {moodEntries.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No mood entries yet. Start tracking your emotional patterns!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {moodEntries.slice(-5).reverse().map((entry) => (
              <div key={entry.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                    <div>
                      <span className={`px-2 py-1 rounded-full text-sm font-medium ${getMoodColor(entry.mood)}`}>
                        {entry.mood}/10
                      </span>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {entry.date.toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                
                {entry.emotions.length > 0 && (
                  <div className="mb-2">
                    <p className="text-sm text-gray-600 mb-1">Emotions:</p>
                    <div className="flex flex-wrap gap-1">
                      {entry.emotions.map((emotion) => (
                        <span key={emotion} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs flex items-center space-x-1">
                          <span>{getEmotionEmoji(emotion)}</span>
                          <span>{emotion}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {entry.notes && (
                  <div className="mb-2">
                    <p className="text-sm text-gray-600 mb-1">Notes:</p>
                    <p className="text-sm text-gray-800">{entry.notes}</p>
                  </div>
                )}
                
                {entry.triggers && entry.triggers.length > 0 && (
                  <div className="mb-2">
                    <p className="text-sm text-gray-600 mb-1">Triggers:</p>
                    <div className="flex flex-wrap gap-1">
                      {entry.triggers.map((trigger) => (
                        <span key={trigger} className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                          {trigger}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Entry Modal */}
      {showAddEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 md:p-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Add Mood Entry</h3>
              <button
                onClick={() => setShowAddEntry(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Close"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-4 md:p-6">
              {/* Mood Slider */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How are you feeling? ({newEntry.mood}/10) *
                </label>
                <div className="flex items-center space-x-4">
                  <span className="text-2xl">{getMoodEmoji(newEntry.mood)}</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={newEntry.mood}
                    onChange={(e) => setNewEntry({ ...newEntry, mood: parseInt(e.target.value) })}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMoodColor(newEntry.mood)}`}>
                    {newEntry.mood}
                  </span>
                </div>
              </div>

              {/* Emotions */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What emotions are you experiencing? *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {emotions.map((emotion) => (
                    <button
                      key={emotion}
                      onClick={() => toggleArrayItem(newEntry.emotions, emotion, (emotions) => 
                        setNewEntry({ ...newEntry, emotions })
                      )}
                      className={`px-3 py-2 text-sm rounded-lg border transition-colors flex items-center space-x-2 ${
                        newEntry.emotions.includes(emotion)
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <span>{getEmotionEmoji(emotion)}</span>
                      <span>{emotion}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (optional)
                </label>
                <textarea
                  value={newEntry.notes}
                  onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                  placeholder="Describe what happened, how you felt, or any insights..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>

              {/* Triggers */}
              {getAvailableTriggers().length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What might have triggered these feelings?
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {getAvailableTriggers().map((trigger) => (
                      <button
                        key={trigger}
                        onClick={() => toggleArrayItem(newEntry.triggers, trigger, (triggers) => 
                          setNewEntry({ ...newEntry, triggers })
                        )}
                        className={`px-3 py-2 text-sm rounded-lg border transition-colors text-left ${
                          newEntry.triggers.includes(trigger)
                            ? 'bg-red-500 text-white border-red-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {trigger}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Coping Strategies */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What coping strategies did you use or plan to use?
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {copingStrategies.map((strategy) => (
                    <button
                      key={strategy}
                      onClick={() => toggleArrayItem(newEntry.copingStrategies, strategy, (strategies) => 
                        setNewEntry({ ...newEntry, copingStrategies: strategies })
                      )}
                      className={`px-3 py-2 text-sm rounded-lg border transition-colors text-left ${
                        newEntry.copingStrategies.includes(strategy)
                          ? 'bg-emerald-500 text-white border-emerald-500'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {strategy}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowAddEntry(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddEntry}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-lg hover:from-blue-600 hover:to-emerald-600 transition-colors"
                >
                  Save Entry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodTracker;