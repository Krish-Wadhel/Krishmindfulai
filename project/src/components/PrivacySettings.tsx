import React, { useState } from 'react';
import { Shield, Eye, EyeOff, Download, Trash2, Lock, Globe, Server } from 'lucide-react';
import { UserData } from '../types';
import { clearUserData } from '../utils/storage';

interface PrivacySettingsProps {
  userData: UserData | null;
  onUpdateUserData: (updates: Partial<UserData>) => void;
}

const PrivacySettings: React.FC<PrivacySettingsProps> = ({ userData, onUpdateUserData }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!userData) return null;

  const { preferences } = userData;

  const updatePreference = (key: keyof typeof preferences, value: any) => {
    onUpdateUserData({
      preferences: {
        ...preferences,
        [key]: value
      }
    });
  };

  const exportData = () => {
    const dataToExport = {
      ...userData,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mindfulai-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const deleteAllData = () => {
    clearUserData();
    window.location.reload();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-blue-200/50 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Privacy & Security</h2>
            <p className="text-gray-600">Manage your data and privacy preferences</p>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Lock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-blue-900 mb-1">Your Data is Secure</h3>
              <p className="text-blue-800 text-sm leading-relaxed">
                All your conversations and personal data are stored locally on your device. 
                We never send your personal information to external servers without your explicit consent.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-blue-200/50 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Privacy Preferences</h3>
        
        <div className="space-y-6">
          {/* Anonymous Mode */}
          <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                {preferences.anonymousMode ? <EyeOff className="w-5 h-5 text-purple-600" /> : <Eye className="w-5 h-5 text-purple-600" />}
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Anonymous Mode</h4>
                <p className="text-gray-600 text-sm">
                  Hide your name and personal identifiers from the interface. Your data remains secure either way.
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.anonymousMode}
                onChange={(e) => updatePreference('anonymousMode', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Data Sharing */}
          <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Server className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Anonymous Analytics</h4>
                <p className="text-gray-600 text-sm">
                  Share anonymous usage statistics to help improve MindfulAI. No personal data is included.
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.dataSharing}
                onChange={(e) => updatePreference('dataSharing', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Voice Input */}
          <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Globe className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Voice Input</h4>
                <p className="text-gray-600 text-sm">
                  Enable voice-to-text functionality. Voice data is processed locally by your browser.
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.voiceInput}
                onChange={(e) => updatePreference('voiceInput', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white rounded-xl shadow-sm border border-blue-200/50 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Data Management</h3>
        
        <div className="space-y-4">
          {/* Export Data */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Download className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Export Your Data</h4>
                <p className="text-gray-600 text-sm">Download all your data in JSON format</p>
              </div>
            </div>
            <button
              onClick={exportData}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Export
            </button>
          </div>

          {/* Delete Data */}
          <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h4 className="font-medium text-red-900">Delete All Data</h4>
                <p className="text-red-700 text-sm">Permanently remove all your data from this device</p>
              </div>
            </div>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Data Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-blue-200/50 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Your Data Summary</h3>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-1">Chat Messages</h4>
            <p className="text-2xl font-bold text-blue-700">{userData.messages.length}</p>
          </div>
          
          <div className="bg-emerald-50 rounded-lg p-4">
            <h4 className="font-medium text-emerald-900 mb-1">Mood Entries</h4>
            <p className="text-2xl font-bold text-emerald-700">{userData.moodEntries.length}</p>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <h4 className="font-medium text-purple-900 mb-1">CBT Exercises</h4>
            <p className="text-2xl font-bold text-purple-700">{userData.cbtExercises.length}</p>
          </div>
          
          <div className="bg-amber-50 rounded-lg p-4">
            <h4 className="font-medium text-amber-900 mb-1">Mindfulness Sessions</h4>
            <p className="text-2xl font-bold text-amber-700">{userData.mindfulnessSessions.length}</p>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete All Data?</h3>
              <p className="text-gray-600">
                This action cannot be undone. All your conversations, mood entries, exercises, and progress will be permanently deleted.
              </p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={deleteAllData}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrivacySettings;