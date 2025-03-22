
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SendIcon, Bot, User } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import { cn } from '@/lib/utils';

interface Message {
  id: number;
  text: string;
  sender: 'bot' | 'user';
  options?: string[];
}

interface ChatInterfaceProps {
  onComplete: () => void;
}

const ChatInterface = ({ onComplete }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const chatSteps = [
    {
      message: "Hi there! I'm your financial planning assistant. I'll help you set up goals for your financial journey. What kind of goal would you like to set first?",
      options: ["Retirement", "Home Purchase", "Child's Education", "Emergency Fund", "Travel", "Custom Goal"]
    },
    {
      message: "Great choice! When do you plan to achieve this goal?",
      options: ["1-3 years", "3-5 years", "5-10 years", "10+ years"]
    },
    {
      message: "How much do you think you'll need for this goal?",
    },
    {
      message: "How would you describe your risk tolerance for this goal?",
      options: ["Conservative", "Moderate", "Aggressive"]
    },
    {
      message: "Perfect! I've set up your goal and created a personalized investment plan. Would you like to see your dashboard now?",
      options: ["Yes, show me my dashboard", "I'd like to set another goal"]
    }
  ];
  
  useEffect(() => {
    // Start the conversation
    if (messages.length === 0) {
      setMessages([{
        id: 1,
        text: chatSteps[0].message,
        sender: 'bot',
        options: chatSteps[0].options
      }]);
    }
  }, []);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = () => {
    if (input.trim() === '') return;
    
    const newUserMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: 'user'
    };
    
    setMessages([...messages, newUserMessage]);
    setInput('');
    
    setTimeout(() => {
      const nextStep = currentStep + 1;
      if (nextStep < chatSteps.length) {
        const newBotMessage: Message = {
          id: messages.length + 2,
          text: chatSteps[nextStep].message,
          sender: 'bot',
          options: chatSteps[nextStep].options
        };
        setMessages(prev => [...prev, newBotMessage]);
        setCurrentStep(nextStep);
      } else {
        // Conversation complete
        onComplete();
      }
    }, 1000);
  };
  
  const handleOptionSelect = (option: string) => {
    const newUserMessage: Message = {
      id: messages.length + 1,
      text: option,
      sender: 'user'
    };
    
    setMessages([...messages, newUserMessage]);
    
    setTimeout(() => {
      const nextStep = currentStep + 1;
      if (nextStep < chatSteps.length) {
        const newBotMessage: Message = {
          id: messages.length + 2,
          text: chatSteps[nextStep].message,
          sender: 'bot',
          options: chatSteps[nextStep].options
        };
        setMessages(prev => [...prev, newBotMessage]);
        setCurrentStep(nextStep);
      } else {
        // Last step
        if (option === "Yes, show me my dashboard") {
          onComplete();
        } else {
          // Reset to first step for another goal
          setCurrentStep(0);
          const newBotMessage: Message = {
            id: messages.length + 2,
            text: chatSteps[0].message,
            sender: 'bot',
            options: chatSteps[0].options
          };
          setMessages(prev => [...prev, newBotMessage]);
        }
      }
    }, 1000);
  };
  
  return (
    <GlassCard className="flex flex-col h-[500px]">
      <div className="p-4 border-b border-white/10">
        <h2 className="text-lg font-medium">Goal Planning Assistant</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.sender === 'user' ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[80%] rounded-2xl p-3",
                message.sender === 'user'
                  ? "bg-primary/20 rounded-tr-none ml-12"
                  : "bg-secondary rounded-tl-none mr-12"
              )}
            >
              <div className="flex items-start">
                {message.sender === 'bot' && (
                  <Bot className="h-5 w-5 mr-2 mt-0.5 text-primary" />
                )}
                <div>
                  <p className="text-sm">{message.text}</p>
                  
                  {message.options && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {message.options.map((option) => (
                        <button
                          key={option}
                          onClick={() => handleOptionSelect(option)}
                          className="text-xs py-1.5 px-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {message.sender === 'user' && (
                  <User className="h-5 w-5 ml-2 mt-0.5 text-primary" />
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t border-white/10">
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} size="icon">
            <SendIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </GlassCard>
  );
};

export default ChatInterface;
