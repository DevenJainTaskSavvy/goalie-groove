
import React, { useState, useRef, useEffect } from 'react';
import { 
  Card,
  CardContent
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Image, Smile, PaperclipIcon } from 'lucide-react';
import { CircleMember } from '@/types/community';

interface CircleChatProps {
  members: CircleMember[];
  circleName: string;
}

interface ChatMessage {
  id: string;
  sender: string;
  senderId: string;
  content: string;
  timestamp: Date;
}

const CircleChat: React.FC<CircleChatProps> = ({ members, circleName }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: members[0]?.name || 'You',
      senderId: members[0]?.id || '1',
      content: `Welcome to the ${circleName} chat! Let's discuss our investment plans.`,
      timestamp: new Date(Date.now() - 86400000) // 24 hours ago
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current;
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        sender: 'You',
        senderId: '1', // Current user
        content: newMessage,
        timestamp: new Date()
      };
      
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const formatMessageDate = (date: Date) => {
    if (isToday(date)) {
      return 'Today';
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  // Group messages by date
  const groupedMessages: { [key: string]: ChatMessage[] } = {};
  messages.forEach(message => {
    const dateKey = formatMessageDate(message.timestamp);
    if (!groupedMessages[dateKey]) {
      groupedMessages[dateKey] = [];
    }
    groupedMessages[dateKey].push(message);
  });

  return (
    <div className="flex flex-col h-[600px]">
      <div className="flex-1 overflow-hidden flex flex-col">
        <ScrollArea className="flex-1 px-4" ref={scrollAreaRef}>
          {Object.keys(groupedMessages).map(dateKey => (
            <div key={dateKey} className="mb-6">
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-muted"></div>
                <span className="flex-shrink mx-4 text-xs text-muted-foreground">{dateKey}</span>
                <div className="flex-grow border-t border-muted"></div>
              </div>
              
              {groupedMessages[dateKey].map(message => (
                <div 
                  key={message.id} 
                  className={`flex mb-4 ${message.sender === 'You' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.sender !== 'You' && (
                    <div className="flex items-end">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                        {message.sender.charAt(0)}
                      </div>
                    </div>
                  )}
                  
                  <div 
                    className={`max-w-[70%] rounded-lg px-4 py-2 ${
                      message.sender === 'You' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-accent'
                    }`}
                  >
                    {message.sender !== 'You' && (
                      <p className="text-sm font-medium mb-1">{message.sender}</p>
                    )}
                    <p className="text-sm break-words">{message.content}</p>
                    <p className="text-xs opacity-70 text-right mt-1">
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </ScrollArea>
      </div>
      
      <div className="p-4 border-t bg-background/80 backdrop-blur-sm">
        <div className="flex items-end gap-2">
          <Textarea 
            placeholder="Type your message..." 
            className="min-h-[80px]"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="flex flex-col gap-2">
            <Button 
              size="icon" 
              variant="ghost" 
              className="rounded-full"
              type="button"
            >
              <PaperclipIcon className="h-4 w-4" />
            </Button>
            <Button 
              size="icon" 
              variant="ghost" 
              className="rounded-full"
              type="button"
            >
              <Image className="h-4 w-4" />
            </Button>
            <Button 
              variant="default" 
              size="icon" 
              className="rounded-full"
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CircleChat;
