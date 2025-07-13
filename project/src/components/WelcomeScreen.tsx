import React, { useState } from 'react';
import { Brain, Heart, Shield, Users, TrendingUp, MessageCircle } from 'lucide-react';

interface WelcomeScreenProps {
  onComplete: (name: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const steps = [
    {
      title: "Welcome to MindfulAI",
      content: (
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Mental Health Companion</h2>
            <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
              MindfulAI is designed to support your mental wellness journey through AI-powered conversations, 
              evidence-based techniques, and personalized insights. Let's get started on this path together.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "How MindfulAI Helps You",
      content: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-xl">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Compassionate Conversations</h3>
                <p className="text-gray-600 text-sm">
                  Engage in supportive, judgment-free conversations with our AI companion trained in empathetic communication.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-4 bg-emerald-50 rounded-xl">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Brain className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">CBT Techniques</h3>
                <p className="text-gray-600 text-sm">
                  Learn and practice cognitive behavioral therapy exercises to challenge negative thought patterns.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-4 bg-purple-50 rounded-xl">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Heart className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Mood Tracking</h3>
                <p className="text-gray-600 text-sm">
                  Monitor your emotional patterns and identify triggers to better understand your mental health.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-4 bg-amber-50 rounded-xl">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Progress Insights</h3>
                <p className="text-gray-600 text-sm">
                  Visualize your journey with personalized analytics and celebrate your growth over time.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Your Privacy & Safety",
      content: (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-blue-900">Privacy First</h3>
            </div>
            <ul className="space-y-3 text-blue-800">
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>All conversations are stored locally on your device</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>You can enable anonymous mode for extra privacy</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Your data is never shared without your explicit consent</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Heart className="w-6 h-6 text-red-600" />
              <h3 className="text-lg font-semibold text-red-900">Crisis Support</h3>
            </div>
            <p className="text-red-800 mb-4">
              MindfulAI includes built-in crisis detection and emergency resources. If you're experiencing thoughts of self-harm or suicide, we'll immediately connect you with professional help.
            </p>
            <div className="bg-red-100 rounded-lg p-3">
              <p className="text-red-900 text-sm font-medium">
                Emergency: Call 988 (Suicide & Crisis Lifeline) or 911
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Let's Personalize Your Experience",
      content: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">What should we call you?</h3>
            <p className="text-gray-600">
              This helps me personalize our conversations. You can always change this later or use anonymous mode.
            </p>
          </div>
          
          <div className="max-w-md mx-auto">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Your preferred name (optional)
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name or leave blank for anonymous"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
          
          <div className="max-w-md mx-auto">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 leading-relaxed">
                I understand that MindfulAI is not a replacement for professional therapy and agree to use crisis support resources if needed.
              </span>
            </label>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else if (agreedToTerms) {
      onComplete(name.trim() || 'Friend');
    }
  };

  const handlePrevious = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="bg-white rounded-2xl shadow-2xl border border-blue-200/50 overflow-hidden">
          {/* Progress bar */}
          <div className="bg-blue-50 px-8 py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-700">
                Step {step + 1} of {steps.length}
              </span>
              <span className="text-sm text-blue-600">
                {Math.round(((step + 1) / steps.length) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${((step + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>
          
          {/* Content */}
          <div className="px-8 py-12">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {steps[step].title}
              </h1>
            </div>
            
            <div className="mb-12">
              {steps[step].content}
            </div>
            
            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={handlePrevious}
                disabled={step === 0}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  step === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Previous
              </button>
              
              <div className="flex space-x-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === step
                        ? 'bg-blue-500 w-8'
                        : index < step
                        ? 'bg-emerald-500'
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              
              <button
                onClick={handleNext}
                disabled={step === steps.length - 1 && !agreedToTerms}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  (step === steps.length - 1 && !agreedToTerms)
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white hover:from-blue-600 hover:to-emerald-600 shadow-lg'
                }`}
              >
                {step === steps.length - 1 ? 'Get Started' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;