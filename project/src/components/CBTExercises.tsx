import React, { useState } from 'react';
import { Brain, CheckCircle, Play, BookOpen, ArrowRight, Lightbulb, X } from 'lucide-react';
import { CBTExercise, UserData } from '../types';

interface CBTExercisesProps {
  userData: UserData | null;
  onUpdateUserData: (updates: Partial<UserData>) => void;
}

const exerciseTemplates = [
  {
    id: 'thought-challenge-1',
    title: 'Challenging Negative Thoughts',
    description: 'Learn to identify and challenge unhelpful thinking patterns',
    type: 'thought-challenge' as const,
    steps: [
      'Identify the negative thought you\'re having',
      'Rate how much you believe this thought (1-10)',
      'What evidence supports this thought?',
      'What evidence contradicts this thought?',
      'What would you tell a friend having this thought?',
      'Create a more balanced, realistic thought',
      'Rate how much you believe the original thought now (1-10)'
    ]
  },
  {
    id: 'behavioral-activation-1',
    title: 'Activity Scheduling',
    description: 'Plan enjoyable and meaningful activities to improve mood',
    type: 'behavioral-activation' as const,
    steps: [
      'List activities that used to bring you joy or satisfaction',
      'Rate each activity for pleasure (1-10) and mastery/accomplishment (1-10)',
      'Choose 2-3 activities to schedule this week',
      'Break down each activity into smaller, manageable steps',
      'Schedule specific times for these activities',
      'After completing each activity, rate your actual mood (1-10)',
      'Reflect on what you learned and plan your next activities'
    ]
  },
  {
    id: 'exposure-1',
    title: 'Gradual Exposure Planning',
    description: 'Gradually face fears and anxieties in a structured way',
    type: 'exposure' as const,
    steps: [
      'Identify the situation or object you\'re avoiding',
      'Rate your anxiety level when thinking about it (1-10)',
      'List situations from least to most anxiety-provoking',
      'Start with the least anxiety-provoking situation',
      'Plan how you\'ll approach this situation',
      'Practice relaxation techniques before exposure',
      'Reflect on the experience - what actually happened vs. what you feared?'
    ]
  },
  {
    id: 'mindfulness-cbt-1',
    title: 'Mindful Thought Observation',
    description: 'Practice observing thoughts without judgment',
    type: 'mindfulness' as const,
    steps: [
      'Find a quiet space and sit comfortably',
      'Close your eyes and focus on your breathing',
      'When thoughts arise, simply notice them without judgment',
      'Label thoughts as "thinking" and return attention to breath',
      'Notice if thoughts are about past, present, or future',
      'Observe how thoughts come and go naturally',
      'End by setting an intention for how you\'ll carry this awareness forward'
    ]
  }
];

const CBTExercises: React.FC<CBTExercisesProps> = ({ userData, onUpdateUserData }) => {
  const [activeExercise, setActiveExercise] = useState<CBTExercise | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<{ [key: string]: string }>({});

  const userExercises = userData?.cbtExercises || [];

  const startExercise = (template: typeof exerciseTemplates[0]) => {
    const exercise: CBTExercise = {
      ...template,
      completed: false,
      userResponses: {}
    };
    setActiveExercise(exercise);
    setCurrentStep(0);
    setResponses({});
  };

  const saveResponse = (stepIndex: number, response: string) => {
    setResponses(prev => ({
      ...prev,
      [stepIndex]: response
    }));
  };

  const canProceedToNext = () => {
    const currentResponse = responses[currentStep];
    return currentResponse && currentResponse.trim().length > 0;
  };

  const canCompleteExercise = () => {
    // Check if all steps have responses
    for (let i = 0; i < (activeExercise?.steps.length || 0); i++) {
      const response = responses[i];
      if (!response || response.trim().length === 0) {
        return false;
      }
    }
    return true;
  };

  const completeExercise = () => {
    if (!activeExercise || !canCompleteExercise()) {
      alert('Please complete all steps before finishing the exercise.');
      return;
    }

    const completedExercise: CBTExercise = {
      ...activeExercise,
      completed: true,
      completedAt: new Date(),
      userResponses: responses
    };

    const updatedExercises = [...userExercises, completedExercise];
    onUpdateUserData({
      cbtExercises: updatedExercises,
      stats: {
        ...userData?.stats,
        exercisesCompleted: (userData?.stats?.exercisesCompleted || 0) + 1
      } as any
    });

    setActiveExercise(null);
    setCurrentStep(0);
    setResponses({});
  };

  const getExerciseIcon = (type: string) => {
    switch (type) {
      case 'thought-challenge': return <Brain className="w-5 h-5" />;
      case 'behavioral-activation': return <Play className="w-5 h-5" />;
      case 'exposure': return <ArrowRight className="w-5 h-5" />;
      case 'mindfulness': return <Lightbulb className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  const getExerciseColor = (type: string) => {
    switch (type) {
      case 'thought-challenge': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'behavioral-activation': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'exposure': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'mindfulness': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (activeExercise) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-blue-200/50 p-4 md:p-6">
          {/* Exercise Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">{activeExercise.title}</h2>
              <button
                onClick={() => setActiveExercise(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Close exercise"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Step {currentStep + 1} of {activeExercise.steps.length}</span>
                <span>{Math.round(((currentStep + 1) / activeExercise.steps.length) * 100)}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / activeExercise.steps.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Current Step */}
          <div className="mb-8">
            <div className="bg-blue-50 rounded-lg p-4 md:p-6 mb-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                {activeExercise.steps[currentStep]}
              </h3>
              
              <textarea
                value={responses[currentStep] || ''}
                onChange={(e) => saveResponse(currentStep, e.target.value)}
                placeholder="Write your response here... (required)"
                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows={4}
              />
              
              {!canProceedToNext() && responses[currentStep] !== undefined && (
                <p className="text-red-600 text-sm mt-2">Please provide a response to continue.</p>
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              {currentStep > 0 ? (
                <button
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Previous
                </button>
              ) : (
                <div></div>
              )}

              {currentStep < activeExercise.steps.length - 1 ? (
                <button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={!canProceedToNext()}
                  className={`px-6 py-2 rounded-lg transition-colors ${
                    canProceedToNext()
                      ? 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white hover:from-blue-600 hover:to-emerald-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Next Step
                </button>
              ) : (
                <button
                  onClick={completeExercise}
                  disabled={!canCompleteExercise()}
                  className={`px-6 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                    canCompleteExercise()
                      ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white hover:from-emerald-600 hover:to-blue-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>Complete Exercise</span>
                </button>
              )}
            </div>
          </div>

          {/* All Steps Preview */}
          <div className="border-t pt-6">
            <h4 className="font-semibold text-gray-900 mb-3">Exercise Steps:</h4>
            <div className="space-y-2">
              {activeExercise.steps.map((step, index) => (
                <div 
                  key={index}
                  className={`flex items-center space-x-3 p-2 rounded-lg ${
                    index === currentStep ? 'bg-blue-50' : 
                    index < currentStep ? 'bg-emerald-50' : 'bg-gray-50'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                    index === currentStep ? 'bg-blue-500 text-white' :
                    index < currentStep ? 'bg-emerald-500 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {index < currentStep ? '✓' : index + 1}
                  </div>
                  <span className={`text-sm ${
                    index === currentStep ? 'text-blue-900 font-medium' :
                    index < currentStep ? 'text-emerald-900' : 'text-gray-600'
                  }`}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-blue-200/50 p-4 md:p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center">
            <Brain className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">CBT Exercises</h2>
            <p className="text-gray-600">Cognitive Behavioral Therapy techniques to improve your mental health</p>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 text-sm leading-relaxed">
            CBT exercises help you identify and change negative thought patterns and behaviors. 
            These evidence-based techniques are used by mental health professionals worldwide.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-blue-200/50 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Exercises Completed</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900">{userExercises.filter(e => e.completed).length}</p>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 md:w-6 md:h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-blue-200/50 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Available Exercises</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900">{exerciseTemplates.length}</p>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5 md:w-6 md:h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Available Exercises */}
      <div className="bg-white rounded-xl shadow-sm border border-blue-200/50 p-4 md:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Exercises</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {exerciseTemplates.map((exercise) => (
            <div 
              key={exercise.id}
              className="border border-gray-200 rounded-xl p-4 md:p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2 md:p-3 rounded-lg ${getExerciseColor(exercise.type)}`}>
                  {getExerciseIcon(exercise.type)}
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getExerciseColor(exercise.type)}`}>
                  {exercise.type.replace('-', ' ')}
                </span>
              </div>
              
              <h4 className="font-semibold text-gray-900 mb-2">{exercise.title}</h4>
              <p className="text-gray-600 text-sm mb-4">{exercise.description}</p>
              
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">{exercise.steps.length} steps</p>
                <div className="text-xs text-gray-600">
                  Estimated time: {exercise.steps.length * 2}-{exercise.steps.length * 3} minutes
                </div>
              </div>
              
              <button
                onClick={() => startExercise(exercise)}
                className="w-full bg-gradient-to-r from-blue-500 to-emerald-500 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-emerald-600 transition-colors flex items-center justify-center space-x-2"
              >
                <Play className="w-4 h-4" />
                <span>Start Exercise</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Completed Exercises */}
      {userExercises.filter(e => e.completed).length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-blue-200/50 p-4 md:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Completed Exercises</h3>
          
          <div className="space-y-4">
            {userExercises.filter(e => e.completed).slice(-5).map((exercise) => (
              <div key={exercise.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{exercise.title}</h4>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm text-gray-500">
                      {exercise.completedAt?.toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{exercise.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CBTExercises;