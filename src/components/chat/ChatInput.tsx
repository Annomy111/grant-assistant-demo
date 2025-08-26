'use client';

import { useState, KeyboardEvent } from 'react';
import { Send, Paperclip, Mic } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ 
  onSend, 
  disabled = false,
  placeholder = 'Schreiben Sie Ihre Nachricht...'
}: ChatInputProps) {
  const [input, setInput] = useState('');
  
  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };
  
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  return (
    <div className="flex items-end gap-2">
      <div className="flex-1 relative">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className={cn(
            'w-full px-4 py-3 pr-12 rounded-lg border resize-none',
            'focus:outline-none focus:ring-2 focus:ring-blue-500',
            'placeholder-gray-400',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          style={{
            minHeight: '48px',
            maxHeight: '120px',
          }}
        />
        
        <button
          type="button"
          className="absolute right-2 bottom-3 p-1 text-gray-400 hover:text-gray-600"
          title="Datei anhängen"
        >
          <Paperclip className="w-5 h-5" />
        </button>
      </div>
      
      <button
        onClick={handleSend}
        disabled={disabled || !input.trim()}
        className={cn(
          'p-3 rounded-lg transition-colors',
          'bg-blue-500 text-white',
          'hover:bg-blue-600',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
      >
        <Send className="w-5 h-5" />
      </button>
      
      <button
        className={cn(
          'p-3 rounded-lg transition-colors',
          'bg-gray-100 text-gray-600',
          'hover:bg-gray-200'
        )}
        title="Spracheingabe"
      >
        <Mic className="w-5 h-5" />
      </button>
    </div>
  );
}