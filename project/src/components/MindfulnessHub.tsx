import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Compass, Wind, Heart, Brain } from 'lucide-react';
import { MindfulnessSession, UserData } from '../types';

interface MindfulnessHubProps {
  userData: UserData | null;
  onUpdateUserData: (updates: Partial<UserData>) => void;
}

const sessionTemplates = [
  {
    id: 'breathing-basic',
    title: '4-7-8 Breathing',
    type: 'breathing' as const,
    duration: 5,
    instructions: [
      'Sit comfortably with your back straight',
      'Place the tip of your tongue against the ridge behind your upper teeth',
      'Exhale completely through your mouth',
      'Close your mouth and inhale through your nose for 4 counts',
      'Hold your breath for 7 counts',
      'Exhale through your mouth for 8 counts',
      'Repeat this cycle 3-4 times'
    ]
  },
  {
    id: 'meditation-basic',
    title: 'Mindful Awareness',
    type: 'meditation' as const,
    duration: 10,
    instructions: [
      'Find a quiet, comfortable position',
      'Close your eyes or soften your gaze',
      'Notice your breath without changing it',
      'When thoughts arise, gently acknowledge them',
      'Return your attention to your breath',
      'Notice sensations in your body',
      'End by setting an intention for your day'
    ]
  },
  {
    id: 'grounding-54321',
    title: '5-4-3-2-1 Grounding',
    type: 'grounding' as const,
    duration: 7,
    instructions: [
      'Notice 5 things you can see around you',
      'Notice 4 things you can touch or feel',
      'Notice 3 things you can hear',
      'Notice 2 things you can smell',
      'Notice 1 thing you can taste',
      'Take three deep breaths',
      'Notice how you feel now compared to when you started'
    ]
  },
  {
    id: 'progressive-relaxation',
    title: 'Progressive Muscle Relaxation',
    type: 'progressive-relaxation' as const,
    duration: 15,
    instructions: [
      'Lie down or sit comfortably',
      'Start with your toes - tense for 5 seconds, then relax',
      'Move to your feet and calves - tense and relax',
      'Continue with your thighs and glutes',
      'Tense and relax your abdomen and chest',
      'Work through your hands, arms, and shoulders',
      'Finally, tense and relax your face and head',
      'Notice the difference between tension and relaxation'
    ]
  }
];

const MindfulnessHub: React.FC<MindfulnessHubProps> = ({ userData, onUpdateUserData }) => {
  const [activeSession, setActiveSession] = useState<MindfulnessSession | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [sessionTimer, setSessionTimer] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathingCount, setBreathingCount] = useState(4);
  const [showBreathingGuide, setShowBreathingGuide] = useState(false);

  const userSessions = userData?.mindfulnessSessions || [];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && activeSession) {
      interval = setInterval(() => {
        setSessionTimer(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, activeSession]);

  useEffect(() => {
    let breathingInterval: NodeJS.Timeout;
    
    if (showBreathingGuide && activeSession?.type === 'breathing') {
      breathingInterval = setInterval(() => {
        setBreathingCount(prev => {
          if (breathingPhase === 'inhale' && prev <= 1) {
            setBreathingPhase('hold');
            return 7;
          } else if (breathingPhase === 'hold' && prev <= 1) {
            setBreathingPhase('exhale');
            return 8;
          } else if (breathingPhase === 'exhale' && prev <= 1) {
            setBreathingPhase('inhale');
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (breathingInterval) clearInterval(breathingInterval);
    };
  }, [showBreathingGuide, breathingPhase, activeSession]);

  const startSession = (template: typeof sessionTemplates[0]) => {
    const session: MindfulnessSession = {
      ...template,
      completed: false
    };
    setActiveSession(session);
    setCurrentStep(0);
    setSessionTimer(0);
    setIsPlaying(false);
    
    if (session.type === 'breathing') {
      setShowBreathingGuide(true);
      setBreathingPhase('inhale');
      setBreathingCount(4);
    }
  };

  const toggleSession = () => {
    setIsPlaying(!isPlaying);
  };

  const resetSession = () => {
    setSessionTimer(0);
    setIsPlaying(false);
    setCurrentStep(0);
  };

  const completeSession = () => {
    if (!activeSession) return;

    const completedSession: MindfulnessSession = {
      ...activeSession,
      completed: true,
      completedAt: new Date()
    };

    const updatedSessions = [...userSessions, completedSession];
    onUpdateUserData({
      mindfulnessSessions: updatedSessions
    });

    setActiveSession(null);
    setShowBreathingGuide(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSessionIcon = (type: string) => {
    switch (type) {
      case 'breathing': return <Wind className="w-5 h-5" />;
      case 'meditation': return <Brain className="w-5 h-5" />;
      case 'grounding': return <Compass className="w-5 h-5" />;
      case 'progressive-relaxation': return <Heart className="w-5 h-5" />;
      default: return <Heart className="w-5 h-5" />;
    }
  };

  const getSessionColor = (type: string) => {
    switch (type) {
      case 'breathing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'meditation': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'grounding': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'progressive-relaxation': return 'bg-pink-100 text-pink-700 border-pink-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (activeSession) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-blue-200/50 p-8">
          {/* Session Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className={`p-4 rounded-full ${getSessionColor(activeSession.type)}`}>
                {getSessionIcon(activeSession.type)}
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{activeSession.title}</h2>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
              <span>Duration: {activeSession.duration} min</span>
              <span>•</span>
              <span>Elapsed: {formatTime(sessionTimer)}</span>
            </div>
          </div>

          {/* Breathing Guide */}
          {showBreathingGuide && activeSession.type === 'breathing' && (
            <div className="text-center mb-8">
              <div className="relative w-32 h-32 mx-auto mb-6">
                <div className={`w-full h-full rounded-full border-4 transition-all duration-1000 ${
                  breathingPhase === 'inhale' ? 'border-blue-500 scale-110' :
                  breathingPhase === 'hold' ? 'border-yellow-500 scale-110' :
                  'border-emerald-500 scale-90'
                } bg-gradient-to-br from-blue-100 to-emerald-100 flex items-center justify-center`}>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{breathingCount}</div>
                    <div className="text-sm text-gray-600 capitalize">{breathingPhase}</div>
                  </div>
                </div>
              </div>
              
              <div className="text-lg font-medium text-gray-800 mb-2">
                {breathingPhase === 'inhale' && 'Breathe in slowly through your nose'}
                {breathingPhase === 'hold' && 'Hold your breath'}
                {breathingPhase === 'exhale' && 'Exhale slowly through your mouth'}
              </div>
            </div>
          )}

          {/* Session Instructions */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">Instructions:</h3>
            <div className="space-y-3">
              {activeSession.instructions.map((instruction, index) => (
                <div 
                  key={index}
                  className={`flex items-start space-x-3 p-3 rounded-lg transition-colors ${
                    index === currentStep ? 'bg-blue-100 border border-blue-200' : 'bg-white'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${
                    index === currentStep ? 'bg-blue-500 text-white' :
                    index < currentStep ? 'bg-emerald-500 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {index < currentStep ? '✓' : index + 1}
                  </div>
                  <span className={`text-sm ${
                    index === currentStep ? 'text-blue-900 font-medium' :
                    index < currentStep ? 'text-emerald-800' : 'text-gray-600'
                  }`}>
                    {instruction}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center space-x-4 mb-6">
            <button
              onClick={toggleSession}
              className={`px-6 py-3 rounded-xl font-medium transition-colors flex items-center space-x-2 ${
                isPlaying 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'bg-emerald-500 text-white hover:bg-emerald-600'
              }`}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              <span>{isPlaying ? 'Pause' : 'Start'}</span>
            </button>

            <button
              onClick={resetSession}
              className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center space-x-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Reset</span>
            </button>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentStep === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Previous Step
            </button>

            <div className="flex space-x-2">
              {activeSession.instructions.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentStep ? 'bg-blue-500 w-8' :
                    index < currentStep ? 'bg-emerald-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {currentStep < activeSession.instructions.length - 1 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-lg hover:from-blue-600 hover:to-emerald-600 transition-colors"
              >
                Next Step
              </button>
            ) : (
              <button
                onClick={completeSession}
                className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-lg hover:from-emerald-600 hover:to-blue-600 transition-colors"
              >
                Complete Session
              </button>
            )}
          </div>

          {/* Exit Button */}
          <div className="text-center mt-6">
            <button
              onClick={() => {
                setActiveSession(null);
                setShowBreathingGuide(false);
              }}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Exit Session
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-blue-200/50 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Mindfulness Hub</h2>
            <p className="text-gray-600">Guided exercises for relaxation and mental clarity</p>
          </div>
        </div>
        
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <p className="text-purple-800 text-sm leading-relaxed">
            Regular mindfulness practice can reduce stress, improve focus, and enhance emotional well-being. 
            Choose an exercise that feels right for your current state of mind.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-blue-200/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Sessions Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {userSessions.filter(s => s.completed).length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-blue-200/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Minutes</p>
              <p className="text-2xl font-bold text-gray-900">
                {userSessions.filter(s => s.completed).reduce((sum, s) => sum + s.duration, 0)}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
              <Brain className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-blue-200/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Available Sessions</p>
              <p className="text-2xl font-bold text-gray-900">{sessionTemplates.length}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
              <Compass className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Available Sessions */}
      <div className="bg-white rounded-xl shadow-sm border border-blue-200/50 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Sessions</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          {sessionTemplates.map((session) => (
            <div 
              key={session.id}
              className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${getSessionColor(session.type)}`}>
                  {getSessionIcon(session.type)}
                </div>
                <span className="text-sm text-gray-500">{session.duration} min</span>
              </div>
              
              <h4 className="font-semibold text-gray-900 mb-2">{session.title}</h4>
              <p className="text-gray-600 text-sm mb-4 capitalize">
                {session.type.replace('-', ' ')} exercise
              </p>
              
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">
                  {session.instructions.length} steps
                </p>
                <p className="text-xs text-gray-600">
                  {session.instructions[0]}...
                </p>
              </div>
              
              <button
                onClick={() => startSession(session)}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${getSessionColor(session.type)} hover:opacity-80`}
              >
                <Play className="w-4 h-4" />
                <span>Start Session</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Sessions */}
      {userSessions.filter(s => s.completed).length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-blue-200/50 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Sessions</h3>
          
          <div className="space-y-3">
            {userSessions.filter(s => s.completed).slice(-5).reverse().map((session) => (
              <div key={`${session.id}-${session.completedAt?.getTime()}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getSessionColor(session.type)}`}>
                    {getSessionIcon(session.type)}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{session.title}</h4>
                    <p className="text-sm text-gray-600">{session.duration} minutes</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {session.completedAt?.toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MindfulnessHub;