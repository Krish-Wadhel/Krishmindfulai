import React, { useState, useEffect } from 'react';
import { Brain, MessageCircle, TrendingUp, Heart, Settings, Shield, Home, LogOut, Menu, X } from 'lucide-react';
import ChatInterface from './components/ChatInterface';
import MoodTracker from './components/MoodTracker';
import CBTExercises from './components/CBTExercises';
import MindfulnessHub from './components/MindfulnessHub';
import ProgressDashboard from './components/ProgressDashboard';
import PrivacySettings from './components/PrivacySettings';
import CrisisSupport from './components/CrisisSupport';
import WelcomeScreen from './components/WelcomeScreen';
import HomePage from './components/HomePage';
import Breadcrumb from './components/Breadcrumb';
import { UserData, saveUserData, loadUserData } from './utils/storage';

type ActiveTab = 'welcome' | 'home' | 'chat' | 'mood' | 'cbt' | 'mindfulness' | 'progress' | 'privacy';

function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('welcome');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showCrisisSupport, setShowCrisisSupport] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const data = loadUserData();
    setUserData(data);
    if (data.hasCompletedWelcome) {
      setActiveTab('home');
      setIsLoggedIn(true);
    }
  }, []);

  const handleWelcomeComplete = (name: string) => {
    const newUserData = { ...userData, name, hasCompletedWelcome: true };
    setUserData(newUserData);
    saveUserData(newUserData);
    setActiveTab('home');
    setIsLoggedIn(true);
  };

  const updateUserData = (updates: Partial<UserData>) => {
    const newUserData = { ...userData, ...updates };
    setUserData(newUserData);
    saveUserData(newUserData);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveTab('welcome');
    setIsMobileMenuOpen(false);
  };

  const handleLogoClick = () => {
    if (isLoggedIn) {
      setActiveTab('home');
      setIsMobileMenuOpen(false);
    }
  };

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  const navigationItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    { id: 'mood', label: 'Mood', icon: Heart },
    { id: 'cbt', label: 'CBT', icon: Brain },
    { id: 'mindfulness', label: 'Mindfulness', icon: TrendingUp },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'privacy', label: 'Privacy', icon: Shield },
  ];

  const getPageTitle = () => {
    switch (activeTab) {
      case 'home': return 'Home';
      case 'chat': return 'Chat';
      case 'mood': return 'Mood Tracker';
      case 'cbt': return 'CBT Exercises';
      case 'mindfulness': return 'Mindfulness Hub';
      case 'progress': return 'Progress Dashboard';
      case 'privacy': return 'Privacy Settings';
      default: return 'Home';
    }
  };

  if (activeTab === 'welcome' && !userData?.hasCompletedWelcome) {
    return <WelcomeScreen onComplete={handleWelcomeComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      {/* Crisis Support Overlay */}
      {showCrisisSupport && (
        <CrisisSupport onClose={() => setShowCrisisSupport(false)} />
      )}

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div 
              className="flex items-center space-x-3 cursor-pointer"
              onClick={handleLogoClick}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                  MindfulAI
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">Your Mental Health Companion</p>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Desktop header actions */}
            <div className="hidden md:flex items-center space-x-2">
              <button
                onClick={() => setShowCrisisSupport(true)}
                className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
              >
                Crisis Support
              </button>
              {userData?.name && (
                <div className="text-sm text-gray-600">
                  Hello, {userData.name}
                </div>
              )}
              {isLoggedIn && (
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Logout</span>
                </button>
              )}
            </div>
          </div>

          {/* Mobile menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <div className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabChange(item.id as ActiveTab)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        activeTab === item.id
                          ? 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white shadow-lg'
                          : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
                <div className="border-t pt-4 mt-4">
                  <button
                    onClick={() => setShowCrisisSupport(true)}
                    className="w-full px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium mb-2"
                  >
                    Crisis Support
                  </button>
                  {userData?.name && (
                    <div className="px-4 py-2 text-sm text-gray-600 mb-2">
                      Hello, {userData.name}
                    </div>
                  )}
                  {isLoggedIn && (
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center space-x-1 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">Logout</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto">
        {/* Desktop Navigation Sidebar */}
        <nav className="hidden md:block w-64 bg-white/70 backdrop-blur-sm border-r border-blue-200/50 min-h-screen p-4">
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as ActiveTab)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    activeTab === item.id
                      ? 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Disclaimer */}
          <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex items-start space-x-2">
              <Shield className="w-4 h-4 text-amber-600 mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs text-amber-800 font-medium mb-1">Important Notice</p>
                <p className="text-xs text-amber-700 leading-relaxed">
                  MindfulAI is not a replacement for professional therapy. If you're experiencing a crisis, please contact emergency services or use our Crisis Support.
                </p>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6">
          {/* Breadcrumb */}
          {activeTab !== 'home' && (
            <Breadcrumb 
              currentPage={getPageTitle()} 
              onHomeClick={() => setActiveTab('home')} 
            />
          )}

          {activeTab === 'home' && (
            <HomePage 
              userData={userData} 
              onNavigate={setActiveTab}
              onUpdateUserData={updateUserData}
            />
          )}
          {activeTab === 'chat' && (
            <ChatInterface 
              userData={userData} 
              onCrisisDetected={() => setShowCrisisSupport(true)}
              onUpdateUserData={updateUserData}
            />
          )}
          {activeTab === 'mood' && (
            <MoodTracker userData={userData} onUpdateUserData={updateUserData} />
          )}
          {activeTab === 'cbt' && (
            <CBTExercises userData={userData} onUpdateUserData={updateUserData} />
          )}
          {activeTab === 'mindfulness' && (
            <MindfulnessHub userData={userData} onUpdateUserData={updateUserData} />
          )}
          {activeTab === 'progress' && (
            <ProgressDashboard userData={userData} />
          )}
          {activeTab === 'privacy' && (
            <PrivacySettings userData={userData} onUpdateUserData={updateUserData} />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;