'use client';

import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatMessageProps {
  message: {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
  };
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  
  return (
    <div
      className={cn(
        'flex gap-3 p-4 rounded-lg',
        isUser ? 'bg-blue-50' : 'bg-gray-50'
      )}
    >
      <div className="flex-shrink-0">
        <div
          className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center',
            isUser ? 'bg-blue-500' : 'bg-gray-600'
          )}
        >
          {isUser ? (
            <User className="w-5 h-5 text-white" />
          ) : (
            <Bot className="w-5 h-5 text-white" />
          )}
        </div>
      </div>
      
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">
            {isUser ? 'Sie' : 'KI-Assistent'}
          </span>
          <span className="text-xs text-gray-500">
            {new Date(message.timestamp).toLocaleTimeString('de-DE')}
          </span>
        </div>
        
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}