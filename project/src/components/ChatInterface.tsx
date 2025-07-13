import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, AlertCircle, Brain, Heart, Sparkles, Loader, Wifi, WifiOff } from 'lucide-react';
import { Message, UserData } from '../types';
import { generateGeminiResponse, generateWelcomeMessage, analyzeSentiment, testGeminiConnection } from '../utils/geminiService';

interface ChatInterfaceProps {
  userData: UserData | null;
  onCrisisDetected: () => void;
  onUpdateUserData: (updates: Partial<UserData>) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  userData, 
  onCrisisDetected, 
  onUpdateUserData 
}) => {
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiConnected, setApiConnected] = useState<boolean | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const messages = userData?.messages || [];

  useEffect(() => {
    // Test API connection on component mount
    const checkConnection = async () => {
      const connected = await testGeminiConnection();
      setApiConnected(connected);
    };
    
    checkConnection();
    
    // Initialize with welcome message if no messages exist
    if (messages.length === 0) {
      const welcomeMessage = generateWelcomeMessage(userData?.name);
      onUpdateUserData({
        messages: [welcomeMessage]
      });
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message.trim(),
      sender: 'user',
      timestamp: new Date(),
      sentiment: analyzeSentiment(message.trim())
    };

    // Check for crisis keywords
    if (userMessage.sentiment === 'crisis') {
      onCrisisDetected();
    }

    const updatedMessages = [...messages, userMessage];
    onUpdateUserData({ messages: updatedMessages });

    setMessage('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      console.log('Generating AI response...');
      
      // Generate AI response using Gemini
      const aiResponse = await generateGeminiResponse(
        userMessage.content, 
        messages,
        userData?.name
      );
      
      console.log('AI response generated successfully');
      
      const finalMessages = [...updatedMessages, aiResponse];
      
      onUpdateUserData({ 
        messages: finalMessages,
        stats: {
          ...userData?.stats,
          totalSessions: (userData?.stats?.totalSessions || 0) + 1
        } as any
      });
      
    } catch (error) {
      console.error('Error generating AI response:', error);
      
      // Fallback message if AI fails
      const fallbackMessage: Message = {
        id: Date.now().toString(),
        content: "I apologize, but I'm having trouble connecting to my AI services right now. Please try again in a moment. If you're in crisis, please contact 988 (Suicide & Crisis Lifeline) or emergency services immediately.\n\nIn the meantime, remember that you're not alone, and reaching out for help is a sign of strength.",
        sender: 'ai',
        timestamp: new Date(),
        sentiment: 'neutral',
        type: 'text'
      };
      
      const finalMessages = [...updatedMessages, fallbackMessage];
      onUpdateUserData({ messages: finalMessages });
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      if (!isListening) {
        recognition.start();
        setIsListening(true);
        
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setMessage(transcript);
          setIsListening(false);
        };
        
        recognition.onerror = () => {
          setIsListening(false);
        };
        
        recognition.onend = () => {
          setIsListening(false);
        };
      } else {
        recognition.stop();
        setIsListening(false);
      }
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-emerald-100 border-emerald-200';
      case 'negative': return 'bg-red-100 border-red-200';
      case 'crisis': return 'bg-red-200 border-red-400';
      default: return 'bg-blue-100 border-blue-200';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <Heart className="w-3 h-3 text-emerald-600" />;
      case 'negative': return <AlertCircle className="w-3 h-3 text-red-600" />;
      case 'crisis': return <AlertCircle className="w-3 h-3 text-red-700" />;
      default: return <Brain className="w-3 h-3 text-blue-600" />;
    }
  };

  const getConnectionStatus = () => {
    if (apiConnected === null) return { icon: Loader, color: 'text-gray-500', text: 'Checking...' };
    if (apiConnected) return { icon: Wifi, color: 'text-emerald-500', text: 'AI Connected' };
    return { icon: WifiOff, color: 'text-red-500', text: 'AI Offline' };
  };

  const connectionStatus = getConnectionStatus();
  const ConnectionIcon = connectionStatus.icon;

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Chat Header */}
      <div className="bg-white rounded-xl shadow-sm border border-blue-200/50 p-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg md:text-xl font-semibold text-gray-900">Chat with MindfulAI</h2>
            <p className="text-sm text-gray-600">Your compassionate AI mental health companion</p>
          </div>
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <ConnectionIcon className={`w-4 h-4 ${connectionStatus.color} ${apiConnected === null ? 'animate-spin' : ''}`} />
            <div className={`w-2 h-2 rounded-full animate-pulse ${
              isLoading ? 'bg-yellow-500' : 
              apiConnected ? 'bg-emerald-500' : 'bg-red-500'
            }`}></div>
            <span className={connectionStatus.color}>
              {isLoading ? 'AI Thinking...' : connectionStatus.text}
            </span>
          </div>
        </div>
        
        {/* Connection Warning */}
        {apiConnected === false && (
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span className="text-sm text-amber-800">
                AI services are currently unavailable. You can still use the app, but responses will be limited.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Messages Container */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-blue-200/50 overflow-hidden flex flex-col min-h-[400px] md:min-h-[500px]">
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs md:max-w-sm lg:max-w-md ${
                msg.sender === 'user' ? 'order-2' : 'order-1'
              }`}>
                <div className={`rounded-2xl px-4 py-3 ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white'
                    : `bg-gray-50 text-gray-900 border-2 ${msg.sentiment ? getSentimentColor(msg.sentiment) : 'border-gray-200'}`
                }`}>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {msg.content}
                  </div>
                  
                  {msg.sender === 'ai' && msg.sentiment && (
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
                      <div className="flex items-center space-x-1">
                        {getSentimentIcon(msg.sentiment)}
                        <span className="text-xs text-gray-500 capitalize">
                          {msg.sentiment} tone detected
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className={`text-xs text-gray-500 mt-1 ${
                  msg.sender === 'user' ? 'text-right' : 'text-left'
                }`}>
                  {formatTime(msg.timestamp)}
                </div>
              </div>
            </div>
          ))}
          
          {(isTyping || isLoading) && (
            <div className="flex justify-start">
              <div className="bg-gray-50 rounded-2xl px-4 py-3 border-2 border-gray-200">
                <div className="flex items-center space-x-2">
                  {isLoading ? (
                    <Loader className="w-4 h-4 text-blue-500 animate-spin" />
                  ) : (
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  )}
                  <span className="text-xs text-gray-500">
                    {isLoading ? 'AI is thinking...' : 'MindfulAI is typing...'}
                  </span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-end space-x-2 md:space-x-3">
            <div className="flex-1 relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Share what's on your mind... I'm here to listen."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm md:text-base"
                rows={2}
                disabled={isLoading}
              />
            </div>
            
            <div className="flex flex-col space-y-2">
              {('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) && (
                <button
                  onClick={toggleVoiceInput}
                  disabled={isLoading}
                  className={`p-2 md:p-3 rounded-xl transition-colors ${
                    isListening
                      ? 'bg-red-500 text-white'
                      : isLoading
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title="Voice input"
                >
                  {isListening ? <MicOff className="w-4 h-4 md:w-5 md:h-5" /> : <Mic className="w-4 h-4 md:w-5 md:h-5" />}
                </button>
              )}
              
              <button
                onClick={handleSendMessage}
                disabled={!message.trim() || isLoading}
                className={`p-2 md:p-3 rounded-xl transition-colors ${
                  message.trim() && !isLoading
                    ? 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white hover:from-blue-600 hover:to-emerald-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <Loader className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 md:w-5 md:h-5" />
                )}
              </button>
            </div>
          </div>
          
          <div className="mt-2 text-xs text-gray-500 text-center">
            Press Enter to send • Shift+Enter for new line
            {isLoading && (
              <span className="block mt-1 text-blue-600">
                🤖 {apiConnected ? 'AI is generating a personalized response...' : 'Using fallback response system...'}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;