import { useState, useEffect, useRef } from 'react';
import { Send, Bot, MapPin, Lightbulb } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card } from './ui/card';
import MessageBubble from './MessageBubble';
import { processQuery, getVillageRecommendations } from '../utils/chatbotLogic';
import { Village, Scheme } from '../types/chatbot';

import schemesData from '../data/schemes.json';
import villagesData from '../data/villages.json';

interface Message {
  id: string;
  type: 'user' | 'bot' | 'suggestion';
  content: string;
  schemes?: Scheme[];
  timestamp: Date;
}

const defaultPrompts = [
  "Show me all schemes for my village",
  "I am a farmer, what schemes can I use?",
  "Tell me about health insurance schemes",
  "Which schemes are best for small businesses?",
  "What pension schemes are available?"
];

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [selectedVillage, setSelectedVillage] = useState<string>('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const villages: Village[] = villagesData.villages;
  const schemes: Scheme[] = schemesData.schemes;

  useEffect(() => {
    // Welcome message
    const welcomeMessage: Message = {
      id: 'welcome',
      type: 'bot',
      content: '🌿 Welcome to FRA DSS Assistant! I can help you learn about government schemes for rural and forest-dwelling communities. You can ask about specific schemes, villages, or get personalized recommendations.',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleVillageChange = (villageId: string) => {
    setSelectedVillage(villageId);
    const village = villages.find(v => v.id === villageId);
    
    if (village) {
      addMessage({
        type: 'user',
        content: `Selected village: ${village.name}`
      });

      setTimeout(() => {
        setIsTyping(true);
      }, 500);

      setTimeout(() => {
        setIsTyping(false);
        const recommendations = getVillageRecommendations(village, schemes);
        
        addMessage({
          type: 'suggestion',
          content: `💡 Based on ${village.name}'s profile (${village.tribalPopulation}% tribal population, ${village.forestDependency}% forest dependency), here are the recommended schemes:`,
          schemes: recommendations
        });

        addMessage({
          type: 'bot',
          content: `🌿 ${village.name} is located in ${village.district}, ${village.state} with ${village.population} residents. Main occupations include ${village.mainOccupation.join(', ')}. The village faces challenges like ${village.challenges.join(', ')}.`
        });
      }, 2000);
    }
  };

  const handleSubmit = (query?: string) => {
    const userQuery = query || input.trim();
    if (!userQuery) return;

    addMessage({
      type: 'user',
      content: userQuery
    });

    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const response = processQuery(userQuery, schemes, villages, selectedVillage);
      addMessage(response);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col h-[600px] max-w-4xl mx-auto bg-card rounded-xl shadow-[var(--shadow-card)] border">
      {/* Header */}
      <div className="bg-gradient-primary text-primary-foreground p-4 rounded-t-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-lg">
            <Bot size={24} />
          </div>
          <div>
            <h1 className="font-display text-xl">FRA DSS Assistant</h1>
            <p className="text-sm opacity-90">Your guide to government schemes</p>
          </div>
        </div>
      </div>

      {/* Village Selector */}
      <div className="p-4 border-b bg-muted/30">
        <div className="flex items-center gap-3">
          <MapPin size={16} className="text-primary" />
          <Select value={selectedVillage} onValueChange={handleVillageChange}>
            <SelectTrigger className="max-w-xs">
              <SelectValue placeholder="Select your village..." />
            </SelectTrigger>
            <SelectContent className="bg-card border z-50">
              {villages.map(village => (
                <SelectItem key={village.id} value={village.id} className="cursor-pointer hover:bg-muted">
                  <div className="flex flex-col">
                    <span className="font-medium">{village.name}</span>
                    <span className="text-xs text-muted-foreground">{village.district}, {village.state}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <MessageBubble key={message.id} message={message} />
        ))}
        
        {isTyping && (
          <div className="flex items-center gap-2 text-muted-foreground animate-fade-in">
            <Bot size={16} />
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Default Prompts */}
      {messages.length <= 1 && (
        <div className="p-4 border-t bg-muted/20">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb size={16} className="text-secondary" />
            <span className="text-sm font-medium text-muted-foreground">Try these:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {defaultPrompts.map((prompt, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleSubmit(prompt)}
                className="text-xs hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {prompt}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about schemes, villages, or get recommendations..."
            className="flex-1"
            disabled={isTyping}
          />
          <Button 
            onClick={() => handleSubmit()} 
            disabled={!input.trim() || isTyping}
            className="bg-primary hover:bg-primary-dark"
          >
            <Send size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;