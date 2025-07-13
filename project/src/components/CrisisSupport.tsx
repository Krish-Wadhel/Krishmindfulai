import React from 'react';
import { Phone, MessageCircle, Globe, X, AlertTriangle, Heart } from 'lucide-react';

interface CrisisSupportProps {
  onClose: () => void;
}

const CrisisSupport: React.FC<CrisisSupportProps> = ({ onClose }) => {
  const emergencyContacts = [
    {
      name: '988 Suicide & Crisis Lifeline',
      number: '988',
      description: '24/7 free and confidential support for people in distress',
      type: 'call'
    },
    {
      name: 'Crisis Text Line',
      number: 'Text HOME to 741741',
      description: '24/7 crisis support via text message',
      type: 'text'
    },
    {
      name: 'Emergency Services',
      number: '911',
      description: 'For immediate life-threatening emergencies',
      type: 'emergency'
    }
  ];

  const internationalResources = [
    { country: 'United Kingdom', number: '116 123 (Samaritans)' },
    { country: 'Canada', number: '1-833-456-4566' },
    { country: 'Australia', number: '13 11 14 (Lifeline)' },
    { country: 'Germany', number: '0800 111 0 111' },
    { country: 'France', number: '3114' },
    { country: 'Japan', number: '03-5774-0992' }
  ];

  const onlineResources = [
    {
      name: 'National Suicide Prevention Lifeline',
      url: 'https://suicidepreventionlifeline.org',
      description: 'Comprehensive crisis resources and chat support'
    },
    {
      name: 'Crisis Text Line',
      url: 'https://crisistextline.org',
      description: 'Text-based crisis support and resources'
    },
    {
      name: 'NAMI (National Alliance on Mental Illness)',
      url: 'https://nami.org',
      description: 'Mental health resources and support groups'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-red-50 border-b border-red-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-red-900">Crisis Support</h2>
                <p className="text-red-700">You are not alone. Help is available 24/7.</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-red-500 hover:text-red-700 p-2"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Immediate Help */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <h3 className="text-xl font-bold text-red-900">If You're in Immediate Danger</h3>
            </div>
            <p className="text-red-800 mb-4 leading-relaxed">
              If you are having thoughts of suicide or self-harm, or if you're in immediate danger, 
              please contact emergency services or a crisis helpline right now. Your life matters, 
              and there are people who want to help.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              {emergencyContacts.map((contact, index) => (
                <div key={index} className="bg-white border border-red-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    {contact.type === 'call' && <Phone className="w-5 h-5 text-red-600" />}
                    {contact.type === 'text' && <MessageCircle className="w-5 h-5 text-red-600" />}
                    {contact.type === 'emergency' && <AlertTriangle className="w-5 h-5 text-red-600" />}
                    <h4 className="font-semibold text-red-900">{contact.name}</h4>
                  </div>
                  <p className="text-lg font-bold text-red-700 mb-2">{contact.number}</p>
                  <p className="text-red-600 text-sm">{contact.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* You Are Not Alone */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-xl font-bold text-blue-900 mb-4">You Are Not Alone</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-blue-800 mb-2">Remember:</h4>
                <ul className="space-y-2 text-blue-700">
                  <li className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Crisis feelings are temporary, even when they feel overwhelming</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Many people have felt this way and found help</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Professional help is available and effective</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Your life has value and meaning</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-blue-800 mb-2">Right Now You Can:</h4>
                <ul className="space-y-2 text-blue-700">
                  <li className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Call or text a crisis helpline</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Reach out to a trusted friend or family member</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Go to your nearest emergency room</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Stay with someone you trust</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* International Resources */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Globe className="w-6 h-6 text-emerald-600" />
              <h3 className="text-xl font-bold text-emerald-900">International Crisis Lines</h3>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {internationalResources.map((resource, index) => (
                <div key={index} className="bg-white border border-emerald-200 rounded-lg p-3">
                  <h4 className="font-semibold text-emerald-900">{resource.country}</h4>
                  <p className="text-emerald-700 font-medium">{resource.number}</p>
                </div>
              ))}
            </div>
            <p className="text-emerald-700 text-sm mt-4">
              For more international resources, visit{' '}
              <a href="https://findahelpline.com" target="_blank" rel="noopener noreferrer" className="underline">
                findahelpline.com
              </a>
            </p>
          </div>

          {/* Online Resources */}
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
            <h3 className="text-xl font-bold text-purple-900 mb-4">Online Resources & Support</h3>
            <div className="space-y-4">
              {onlineResources.map((resource, index) => (
                <div key={index} className="bg-white border border-purple-200 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900 mb-1">{resource.name}</h4>
                  <p className="text-purple-700 text-sm mb-2">{resource.description}</p>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:text-purple-800 underline text-sm"
                  >
                    Visit Website →
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Safety Planning */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
            <h3 className="text-xl font-bold text-amber-900 mb-4">Create a Safety Plan</h3>
            <p className="text-amber-800 mb-4">
              A safety plan can help you stay safe during difficult times. Consider writing down:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white border border-amber-200 rounded-lg p-4">
                <h4 className="font-semibold text-amber-900 mb-2">Warning Signs</h4>
                <p className="text-amber-700 text-sm">
                  Thoughts, feelings, or situations that might lead to a crisis
                </p>
              </div>
              <div className="bg-white border border-amber-200 rounded-lg p-4">
                <h4 className="font-semibold text-amber-900 mb-2">Coping Strategies</h4>
                <p className="text-amber-700 text-sm">
                  Things you can do on your own to feel better
                </p>
              </div>
              <div className="bg-white border border-amber-200 rounded-lg p-4">
                <h4 className="font-semibold text-amber-900 mb-2">Support People</h4>
                <p className="text-amber-700 text-sm">
                  Friends, family, or professionals you can contact
                </p>
              </div>
              <div className="bg-white border border-amber-200 rounded-lg p-4">
                <h4 className="font-semibold text-amber-900 mb-2">Safe Environment</h4>
                <p className="text-amber-700 text-sm">
                  Remove or secure items that could be used for self-harm
                </p>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <div className="text-center">
            <button
              onClick={onClose}
              className="px-8 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-medium"
            >
              Return to MindfulAI
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrisisSupport;