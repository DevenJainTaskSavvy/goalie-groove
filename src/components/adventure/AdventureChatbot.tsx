
import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, ChevronDown, ChevronUp, Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import GlassCard from '@/components/ui/GlassCard';

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
}

// Sample bot responses
const botResponses = [
  "Sheesh! You're crushing it with your financial goals! 🔥",
  "No cap, investing early is key to building wealth! 💰",
  "Bestie, your savings game is looking strong this month! ✨",
  "That budget strategy? Absolute fire! Keep it up! 🚀",
  "Big flex: compound interest is literally free money! 💸",
  "Living below your means? We stan a financially responsible icon! 👑",
  "This investment portfolio? Chef's kiss! 😘👌",
  "Your financial journey is giving main character energy! 💅",
  "We're so here for this savings milestone! Slay! 💯",
  "That's on period, bestie! Your debt repayment is goals! 🙌"
];

// Get random response
const getRandomResponse = () => {
  return botResponses[Math.floor(Math.random() * botResponses.length)];
};

const AdventureChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hey bestie! I'm your Finance Bestie! 💅 Here to help you slay your money goals! What's on your mind today?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isBot: false,
      timestamp: new Date()
    };
    
    setMessages([...messages, userMessage]);
    setInput('');
    
    // Simulate bot response after a short delay
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: getRandomResponse(),
        isBot: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };
  
  return (
    <>
      {/* Chat toggle button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 rounded-full shadow-lg w-14 h-14 p-0"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
      </Button>
      
      {/* Chat window */}
      <div 
        className={cn(
          "fixed bottom-24 right-6 z-40 w-80 sm:w-96 transition-all duration-300 transform",
          isOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0 pointer-events-none"
        )}
      >
        <GlassCard className="flex flex-col h-96 p-0 shadow-xl border border-white/10" variant="dark">
          {/* Chat header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Finance Bestie</h3>
                <p className="text-xs text-muted-foreground">Here to hype your finances 💅</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)}>
              <ChevronDown className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
            </button>
          </div>
          
          {/* Messages container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-none">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={cn(
                  "flex",
                  message.isBot ? "justify-start" : "justify-end"
                )}
              >
                <div 
                  className={cn(
                    "max-w-[80%] p-3 rounded-lg",
                    message.isBot 
                      ? "bg-secondary/30 rounded-tl-none" 
                      : "bg-primary/20 rounded-tr-none"
                  )}
                >
                  <p className="text-sm">{message.content}</p>
                  <div className="flex justify-end mt-1">
                    <span className="text-xs text-muted-foreground">
                      {message.timestamp.toLocaleTimeString(undefined, { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input area */}
          <form onSubmit={handleSubmit} className="border-t border-white/10 p-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Ask me anything..."
                  className="w-full bg-secondary/20 border border-white/10 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <button 
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Sparkles className="h-4 w-4" />
                </button>
              </div>
              <Button 
                type="submit" 
                size="icon"
                disabled={!input.trim()}
                className="rounded-full"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </GlassCard>
      </div>
    </>
  );
};

export default AdventureChatbot;
