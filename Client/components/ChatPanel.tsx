"use client"

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, MessageSquare, Sparkles } from 'lucide-react';
import { Message } from '@/components/Message';
import axios from 'axios';
import UserInfo from './UserInfo';
import { useSession } from 'next-auth/react';


interface ChatMessage {
  content: string;
  role: 'user' | 'assistant';
}

export const ChatPanel = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      content: inputValue,
      role: 'user'
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    await getAIResponse(updatedMessages , userMessage.content);
    
  };


  const getAIResponse = async (currentMessage : ChatMessage[] , latestUserMsg :  string) => {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/chat`,{
      messages : currentMessage,
      userQuery : latestUserMsg,
      userCollectionName
    });

    setMessages(prev => [...prev, {role : 'assistant' , content : res.data.msg}]);
    setIsLoading(false);
    console.log(`AiResponse >> : ${res.data.msg}`);
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const userCollectionName = session?.user?.email?.split('@gmail.com').join('_') + "collection";
  

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border bg-card/50">
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          RAG Chat Assistant
          <div className='ml-auto'>
            <UserInfo />
          </div>
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Chat with your AI assistant about your content
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message , index) => (
          <Message key={index}  message={message} />
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-chat-assistant rounded-2xl px-4 py-3 max-w-[80%] animate-pulse  ">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-6 border-t border-border bg-card/30">
        <div className="flex gap-3 items-end">
          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about your content..."
            className="flex-1 min-h-[44px] max-h-32 bg-chat-input border-border text-foreground placeholder:text-muted-foreground transition-smooth focus:border-primary/50 focus:shadow-elegant resize-none"
            disabled={isLoading}
            rows={1}
            style={{
              height: 'auto',
              minHeight: '44px',
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = Math.min(target.scrollHeight, 128) + 'px';
            }}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            variant="outline"
            className="h-11 w-11 p-0 flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};