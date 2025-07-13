import { GoogleGenerativeAI } from '@google/generative-ai';
import { Message } from '../types';

// Initialize Gemini AI
let genAI: GoogleGenerativeAI | null = null;

try {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error('Gemini API key not found in environment variables');
  } else {
    genAI = new GoogleGenerativeAI(apiKey);
    console.log('Gemini AI client initialized successfully');
  }
} catch (error) {
  console.error('Failed to initialize Gemini AI client:', error);
}

const crisisKeywords = [
  'suicide', 'kill myself', 'end it all', 'hurt myself', 'self harm', 'die', 
  'hopeless', 'worthless', 'better off dead', 'cutting', 'overdose',
  'want to die', 'no point living', 'end my life', 'harm myself'
];

export const analyzeSentiment = (message: string): 'positive' | 'neutral' | 'negative' | 'crisis' => {
  const lowerMessage = message.toLowerCase();
  
  if (crisisKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'crisis';
  }
  
  // Use simple keyword analysis for quick sentiment detection
  const positiveWords = ['happy', 'good', 'great', 'wonderful', 'excited', 'grateful', 'thankful', 'accomplished', 'proud', 'calm', 'peaceful', 'loved', 'better', 'improving'];
  const negativeWords = ['sad', 'depressed', 'anxious', 'worried', 'stressed', 'overwhelmed', 'lonely', 'tired', 'exhausted', 'angry', 'frustrated', 'scared', 'upset', 'down'];
  
  const positiveCount = positiveWords.filter(word => lowerMessage.includes(word)).length;
  const negativeCount = negativeWords.filter(word => lowerMessage.includes(word)).length;
  
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
};

export const generateGeminiResponse = async (
  userMessage: string, 
  conversationHistory: Message[] = [],
  userName?: string
): Promise<Message> => {
  const sentiment = analyzeSentiment(userMessage);
  
  // If crisis detected, return immediate crisis response
  if (sentiment === 'crisis') {
    return {
      id: Date.now().toString(),
      content: "🚨 **I'm very concerned about what you're sharing.** Your safety is the most important thing right now.\n\n**Please reach out for immediate help:**\n\n🆘 **Crisis Resources:**\n• **988 Suicide & Crisis Lifeline**: Call or text 988\n• **Crisis Text Line**: Text HOME to 741741\n• **Emergency Services**: Call 911\n\n**You are not alone.** Professional counselors are available 24/7 to help you through this difficult time.\n\nWould you like me to provide more crisis support resources or help you find local emergency services?",
      sender: 'ai',
      timestamp: new Date(),
      sentiment: 'crisis',
      type: 'text'
    };
  }

  // Check if Gemini AI is available
  if (!genAI) {
    console.warn('Gemini AI client not available, using fallback response');
    return getFallbackResponse(userMessage, sentiment, userName);
  }

  try {
    console.log('Sending request to Gemini AI API...');
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
    
    // Build conversation context for Gemini
    const systemPrompt = `You are MindfulAI, a compassionate and empathetic mental health support chatbot. Your role is to:

1. Provide emotional support and active listening
2. Offer evidence-based coping strategies and techniques
3. Suggest mindfulness, CBT, and relaxation exercises when appropriate
4. Maintain a warm, non-judgmental, and professional tone
5. Encourage professional help when needed
6. NEVER provide medical diagnoses or replace professional therapy

Guidelines:
- Be empathetic and validate emotions
- Ask thoughtful follow-up questions
- Suggest practical coping strategies
- Offer mindfulness or breathing exercises for anxiety/stress
- Recommend CBT techniques for negative thought patterns
- Keep responses conversational but professional (2-3 paragraphs max)
- If someone mentions severe symptoms, gently suggest professional help
- Always remind users that you're a support tool, not a replacement for therapy

${userName ? `The user's name is ${userName}.` : 'The user prefers to remain anonymous.'}

Current conversation sentiment: ${sentiment}

Previous conversation context:
${conversationHistory.slice(-4).map(msg => `${msg.sender}: ${msg.content}`).join('\n')}

User's current message: ${userMessage}

Please respond as MindfulAI with empathy and helpful guidance:`;

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const aiResponse = response.text();
    
    if (!aiResponse) {
      throw new Error('No response received from Gemini AI');
    }

    console.log('Gemini AI response received successfully');

    return {
      id: Date.now().toString(),
      content: aiResponse,
      sender: 'ai',
      timestamp: new Date(),
      sentiment,
      type: 'text'
    };

  } catch (error: any) {
    console.error('Gemini AI API Error:', error);
    
    // Log specific error details
    if (error.response) {
      console.error('API Response Error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('API Request Error:', error.request);
    } else {
      console.error('Error Message:', error.message);
    }
    
    // Return fallback response
    return getFallbackResponse(userMessage, sentiment, userName);
  }
};

const getFallbackResponse = (userMessage: string, sentiment: string, userName?: string): Message => {
  const name = userName ? `, ${userName}` : '';
  
  const fallbackResponses = {
    crisis: `I'm very concerned about what you're sharing${name}. Please reach out to crisis support immediately:\n\n🆘 **Call 988** (Suicide & Crisis Lifeline)\n🆘 **Text HOME to 741741** (Crisis Text Line)\n🆘 **Call 911** for emergencies\n\nYour safety matters most. Professional help is available 24/7.`,
    
    negative: `I hear that you're going through a difficult time${name}. It takes courage to reach out and share these feelings. While I'm having trouble connecting to my full AI capabilities right now, I want you to know that what you're experiencing is valid.\n\nWould you like to try some breathing exercises, or would it help to talk more about what's weighing on your mind?`,
    
    positive: `It's wonderful to hear some positivity from you${name}! Even though I'm having some technical difficulties right now, I can sense the good energy in your message. What's been contributing to these positive feelings?\n\nI'd love to hear more about what's going well for you today.`,
    
    neutral: `Thank you for reaching out${name}. I'm here to listen and support you, though I'm experiencing some technical difficulties with my full AI capabilities right now.\n\nWhat would be most helpful for you to talk about today? I'm here to listen and provide what support I can.`
  };

  return {
    id: Date.now().toString(),
    content: fallbackResponses[sentiment as keyof typeof fallbackResponses] || fallbackResponses.neutral,
    sender: 'ai',
    timestamp: new Date(),
    sentiment,
    type: 'text'
  };
};

export const generateWelcomeMessage = (name?: string): Message => {
  const greeting = name ? `Hello ${name}!` : "Hello!";
  return {
    id: Date.now().toString(),
    content: `${greeting} I'm MindfulAI, your compassionate mental health companion. I'm here to listen, support, and help you explore your thoughts and feelings in a safe, judgment-free space.

🤖 **I can help you with:**
• 💬 Processing emotions through empathetic conversation
• 🧘 Mindfulness and relaxation techniques  
• 🧠 Cognitive behavioral therapy (CBT) exercises
• 📊 Mood tracking and pattern identification
• 🛠️ Personalized coping strategies
• 💪 Emotional support and encouragement

I'm powered by advanced AI to understand your emotional state and provide personalized, contextual responses. The more we talk, the better I can support your unique needs.

**Important:** While I'm here to support you, I'm not a replacement for professional therapy. If you're experiencing a crisis, please use the Crisis Support button or contact emergency services.

How are you feeling today? What would you like to talk about?`,
    sender: 'ai',
    timestamp: new Date(),
    sentiment: 'positive',
    type: 'text'
  };
};

// Test function to verify API connection
export const testGeminiConnection = async (): Promise<boolean> => {
  if (!genAI) {
    console.error('Gemini AI client not initialized');
    return false;
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
    const result = await model.generateContent("Hello");
    const response = await result.response;
    
    console.log('Gemini AI connection test successful');
    return true;
  } catch (error) {
    console.error('Gemini AI connection test failed:', error);
    return false;
  }
};