'use client';

import { useState, KeyboardEvent } from 'react';
import { Send, Paperclip, Mic } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ 
  onSend, 
  disabled = false,
  placeholder
}: ChatInputProps) {
  const { t } = useLanguage();
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
          placeholder={placeholder || t('chat.inputPlaceholder')}
          disabled={disabled}
          rows={1}
          className={cn(
            'w-full px-4 py-3 pr-12 rounded-lg border resize-none',
            'focus:outline-none focus:ring-2',
            'placeholder-gray-400',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          onFocus={(e) => {
            e.currentTarget.style.boxShadow = '0 0 0 2px rgba(48, 73, 69, 0.5)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.boxShadow = 'none';
          }}
          style={{
            minHeight: '48px',
            maxHeight: '120px',
          }}
        />
        
        <button
          type="button"
          className="absolute right-2 bottom-3 p-1 text-gray-400 hover:text-gray-600"
          title={t('chat.attachFile')}
        >
          <Paperclip className="w-5 h-5" />
        </button>
      </div>
      
      <button
        onClick={handleSend}
        disabled={disabled || !input.trim()}
        className={cn(
          'p-3 rounded-lg transition-colors text-white',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
        style={{ 
          backgroundColor: disabled || !input.trim() ? 'rgba(48, 73, 69, 0.4)' : '#304945'
        }}
        onMouseEnter={(e) => {
          if (!disabled && input.trim()) {
            e.currentTarget.style.backgroundColor = 'rgba(48, 73, 69, 0.85)';
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled && input.trim()) {
            e.currentTarget.style.backgroundColor = '#304945';
          }
        }}
      >
        <Send className="w-5 h-5" />
      </button>
      
      <button
        className={cn(
          'p-3 rounded-lg transition-colors',
          'bg-gray-100 text-gray-600',
          'hover:bg-gray-200'
        )}
        title={t('chat.voiceInput')}
      >
        <Mic className="w-5 h-5" />
      </button>
    </div>
  );
}