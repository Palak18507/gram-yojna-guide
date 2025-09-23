import { User, Bot, Lightbulb } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Scheme } from '../types/chatbot';

interface Message {
  id: string;
  type: 'user' | 'bot' | 'suggestion';
  content: string;
  schemes?: Scheme[];
  timestamp: Date;
}

interface MessageBubbleProps {
  message: Message;
}

const getSchemeBadgeClass = (category: string) => {
  const categoryMap: Record<string, string> = {
    agriculture: 'scheme-agriculture',
    health: 'scheme-health',
    employment: 'scheme-employment',
    housing: 'scheme-housing',
    education: 'scheme-education',
    forest: 'scheme-agriculture', // Use agriculture color for forest schemes
    digital: 'scheme-employment',
    pension: 'scheme-health',
    water: 'scheme-health',
    infrastructure: 'scheme-employment',
    sanitation: 'scheme-health',
    energy: 'scheme-housing'
  };
  
  return categoryMap[category] || 'scheme-agriculture';
};

const getCategoryIcon = (category: string) => {
  const iconMap: Record<string, string> = {
    agriculture: '🌱',
    health: '🏥',
    employment: '💼',
    housing: '🏠',
    education: '📚',
    forest: '🌲',
    digital: '💻',
    pension: '👴',
    water: '💧',
    infrastructure: '🛣️',
    sanitation: '🚰',
    energy: '⚡'
  };
  
  return iconMap[category] || '📋';
};

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isUser = message.type === 'user';
  const isSuggestion = message.type === 'suggestion';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      <div className={`flex items-start gap-3 max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser 
            ? 'bg-chat-user text-chat-user-foreground' 
            : isSuggestion
            ? 'bg-chat-suggestion text-chat-suggestion-foreground'
            : 'bg-chat-bot text-chat-bot-foreground'
        }`}>
          {isUser ? <User size={16} /> : isSuggestion ? <Lightbulb size={16} /> : <Bot size={16} />}
        </div>

        {/* Message Content */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`chat-bubble ${
            isUser 
              ? 'chat-bubble-user' 
              : isSuggestion
              ? 'chat-bubble-suggestion'
              : 'chat-bubble-bot'
          }`}>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
            
            {/* Schemes Display */}
            {message.schemes && message.schemes.length > 0 && (
              <div className="mt-3 space-y-3">
                {message.schemes.map(scheme => (
                  <Card key={scheme.id} className="p-3 bg-card/50 border-l-4 border-primary">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getCategoryIcon(scheme.category)}</span>
                        <h4 className="font-medium text-sm">{scheme.name}</h4>
                      </div>
                      <Badge className={`scheme-badge ${getSchemeBadgeClass(scheme.category)}`}>
                        {scheme.category}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-2">{scheme.fullName}</p>
                    <p className="text-xs leading-relaxed">{scheme.description}</p>
                    
                    {scheme.benefits && (
                      <div className="mt-2">
                        <p className="text-xs font-medium text-primary mb-1">Key Benefits:</p>
                        <ul className="text-xs space-y-1">
                          {scheme.benefits.slice(0, 2).map((benefit, index) => (
                            <li key={index} className="flex items-start gap-1">
                              <span className="text-primary">•</span>
                              <span className="text-muted-foreground">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
          
          <span className="text-xs text-muted-foreground mt-1">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;