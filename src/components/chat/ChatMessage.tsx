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
  const isSystem = message.role === 'system';
  
  if (isSystem) {
    return (
      <div className="flex justify-center py-2">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2 text-sm text-yellow-800 max-w-md text-center">
          {message.content}
        </div>
      </div>
    );
  }
  
  return (
    <div
      className={cn(
        'flex gap-4 p-5 rounded-xl transition-all hover:shadow-md',
        isUser ? 'bg-gradient-to-r from-blue-50 to-indigo-50 ml-8' : 'bg-white border border-gray-200 shadow-sm mr-8'
      )}
    >
      <div className="flex-shrink-0">
        <div
          className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center shadow-md',
            isUser ? 'bg-gradient-to-br from-blue-500 to-indigo-600' : 'bg-gradient-to-br from-green-500 to-teal-600'
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
        <div className="flex items-center gap-3">
          <span className="font-semibold text-sm text-gray-900">
            {isUser ? 'Sie' : 'KI-Assistent'}
          </span>
          <span className="text-xs text-gray-400 font-medium">
            {new Date(message.timestamp).toLocaleTimeString('de-DE')}
          </span>
        </div>
        
        <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}