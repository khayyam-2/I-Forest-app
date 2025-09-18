import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  Bot, 
  MessageCircle, 
  FileText, 
  Brain,
  Lightbulb,
  PenTool,
  CheckCircle,
  Send,
  User
} from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  message: string;
  timestamp: Date;
}

export const AIAcademy: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState('chat');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      message: 'Hello! I\'m your AI learning assistant. How can I help you today? I can help with course questions, generate quizzes, create flashcards, or assist with Quran studies.',
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const features = [
    { id: 'chat', label: 'AI Tutor Chat', icon: MessageCircle, description: 'Get instant help with any topic' },
    { id: 'quiz', label: 'Quiz Generator', icon: Brain, description: 'Generate custom quizzes' },
    { id: 'flashcards', label: 'Flashcards', icon: Lightbulb, description: 'Create study flashcards' },
    { id: 'plagiarism', label: 'Plagiarism Check', icon: FileText, description: 'Check content originality' },
    { id: 'summary', label: 'Content Summary', icon: PenTool, description: 'Summarize long texts' },
  ];

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: newMessage,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        message: getAIResponse(newMessage),
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiResponse]);
      setLoading(false);
    }, 1500);
  };

  const getAIResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('react') || lowerMessage.includes('javascript')) {
      return 'Great question about React! React is a JavaScript library for building user interfaces. Here are some key concepts:\n\n1. **Components**: Building blocks of React apps\n2. **JSX**: Syntax extension for JavaScript\n3. **Props**: Way to pass data between components\n4. **State**: Component\'s internal data\n\nWould you like me to explain any of these concepts in more detail?';
    }
    
    if (lowerMessage.includes('quran') || lowerMessage.includes('islam')) {
      return 'I\'d be happy to help with Quran studies! I can assist with:\n\n📖 **Quran Recitation**: Proper pronunciation and Tajweed rules\n🔍 **Verse Search**: Find specific verses or topics\n📚 **Translation**: Multiple language translations\n🕌 **Islamic Studies**: Hadith, Fiqh, and Islamic history\n\nWhat specific aspect would you like to explore?';
    }
    
    if (lowerMessage.includes('quiz') || lowerMessage.includes('test')) {
      return 'I can generate custom quizzes for you! Just tell me:\n\n✅ **Topic**: What subject or course material\n✅ **Difficulty**: Beginner, intermediate, or advanced\n✅ **Question Count**: How many questions you want\n✅ **Format**: Multiple choice, true/false, or short answer\n\nWhat topic would you like a quiz on?';
    }
    
    return 'I understand you\'re asking about "' + message + '". As your AI learning assistant, I\'m here to help with:\n\n🎓 **Course Content**: Explanations and clarifications\n📝 **Study Materials**: Quizzes, flashcards, summaries\n📖 **Quran Studies**: Recitation, translation, Islamic knowledge\n🔍 **Research Help**: Finding reliable sources and information\n\nCould you be more specific about what you\'d like to learn or what help you need?';
  };

  const renderChatInterface = () => (
    <div className="flex flex-col h-96">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-start space-x-3 max-w-xs lg:max-w-md ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${message.type === 'user' ? 'bg-blue-500' : 'bg-green-500'}`}>
                {message.type === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>
              <div className={`rounded-lg p-3 ${message.type === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-900'}`}>
                <p className="text-sm whitespace-pre-line">{message.message}</p>
                <p className={`text-xs mt-2 ${message.type === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-500">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Message Input */}
      <div className="border-t p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask me anything about your studies..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <Button onClick={handleSendMessage} disabled={loading || !newMessage.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  const renderQuizGenerator = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
          <input
            type="text"
            placeholder="e.g., React Hooks, Islamic History"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Number of Questions</label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>5</option>
            <option>10</option>
            <option>15</option>
            <option>20</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Question Type</label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Multiple Choice</option>
            <option>True/False</option>
            <option>Short Answer</option>
          </select>
        </div>
      </div>
      <Button className="w-full">Generate Quiz</Button>
    </div>
  );

  const renderFeatureContent = () => {
    switch (activeFeature) {
      case 'chat':
        return renderChatInterface();
      case 'quiz':
        return renderQuizGenerator();
      case 'flashcards':
        return (
          <div className="text-center py-12">
            <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Flashcard Generator</h3>
            <p className="text-gray-600">Create custom flashcards from your course content</p>
            <Button className="mt-4">Create Flashcards</Button>
          </div>
        );
      case 'plagiarism':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paste your text to check for plagiarism
              </label>
              <textarea
                rows={6}
                placeholder="Enter or paste your text here..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button className="w-full">Check Plagiarism</Button>
          </div>
        );
      case 'summary':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Text to summarize
              </label>
              <textarea
                rows={6}
                placeholder="Enter the text you want to summarize..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button className="w-full">Generate Summary</Button>
          </div>
        );
      default:
        return renderChatInterface();
    }
  };

  return (
    <div className="space-y-6">
      {/* Feature Selection */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <button
                  key={feature.id}
                  onClick={() => setActiveFeature(feature.id)}
                  className={`p-4 rounded-lg border-2 text-center transition-all ${
                    activeFeature === feature.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-8 w-8 mx-auto mb-2" />
                  <h4 className="font-medium text-sm">{feature.label}</h4>
                  <p className="text-xs text-gray-500 mt-1">{feature.description}</p>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Main Feature Area */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <Bot className="h-5 w-5 text-blue-600" />
            <span>{features.find(f => f.id === activeFeature)?.label}</span>
          </h3>
        </CardHeader>
        <CardContent>
          {renderFeatureContent()}
        </CardContent>
      </Card>

      {/* AI Tips */}
      <Card>
        <CardContent className="p-6">
          <h4 className="font-semibold text-gray-900 mb-3">💡 AI Learning Tips</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <span>Ask specific questions for better responses</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <span>Use AI-generated quizzes to test knowledge</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <span>Create flashcards for efficient memorization</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <span>Check your work for originality before submission</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};