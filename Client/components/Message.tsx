"use client"

import { User, Bot } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css"

interface ChatMessage {
  content: string;
  role: 'user' | 'assistant';
}

interface MessageProps {
  message: ChatMessage;
}

const stripTopMarkdown = (content: string) => {
  // Split by lines
  const lines = content.split("\n");

  // Find first code block or first subheader to start showing content
  const startIndex = lines.findIndex(line => line.startsWith("```") || line.startsWith("##") === false);

  return lines.slice(startIndex).join("\n");
};

export const Message = ({ message }: MessageProps) => {
  const isUser = message.role === 'user';
  const { data: session } = useSession();

  return (
    <div className={`flex gap-1 md:gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 text-primary" />
        </div>
      )}
      
      <div
        className={`max-w-[90%] sm:max-w-[100%] rounded-2xl px-4 py-3 transition-smooth ${
          isUser
            ? 'gradient-primary shadow-elegant border border-border shadow-card'
            : 'bg-chat-assistant text-primary border border-border shadow-card'
        }`}
      >
        <div className="text-sm leading-relaxed whitespace-pre-wrap break-words overflow-x-hidden prose prose-invert max-w-full">
          <ReactMarkdown 
           remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          >
              {stripTopMarkdown(message.content)}
          </ReactMarkdown>
        </div>

      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full  flex items-center justify-center flex-shrink-0  bg-primary/20">
          {session?.user?.image ? (
                      <Image
                        src={session?.user?.image}
                        width={30}
                        height={20}
                        alt="UserLogo"
                        className="rounded-full object-contain"
                      />
                    ) : (
                      <User className="w-4 h-4 text-primary" />
                    )}
        </div>
      )}
    </div>
  );
};