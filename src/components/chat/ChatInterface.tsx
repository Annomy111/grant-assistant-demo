'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { StepIndicator } from './StepIndicator';
import { QuickActions } from './QuickActions';
import { Loader2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  applicationId?: string;
  currentStep?: string;
  onStepChange?: (step: string) => void;
}

export function ChatInterface({ 
  applicationId, 
  currentStep = 'introduction',
  onStepChange 
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Willkommen beim KI-Antragsassistenten! 🎯

Ich helfe Ihnen bei der Erstellung Ihres EU Horizon Europe Antrags. Der Prozess ist in übersichtliche Schritte unterteilt:

1. **Grundlegende Informationen** - Organisation und Projektübersicht
2. **Excellence** - Ziele und Methodik
3. **Impact** - Erwartete Wirkung und Verbreitung
4. **Implementation** - Arbeitsplan und Ressourcen

Lassen Sie uns mit den grundlegenden Informationen beginnen. Wie heißt Ihre Organisation?`,
      timestamp: new Date(),
    },
  ]);
  
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          applicationId,
          currentStep,
          history: messages,
        }),
      });
      
      if (!response.ok) throw new Error('Failed to get response');
      
      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      if (data.nextStep && onStepChange) {
        onStepChange(data.nextStep);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Entschuldigung, es gab einen Fehler. Bitte versuchen Sie es erneut.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleQuickAction = (action: string) => {
    const quickMessages: Record<string, string> = {
      help: 'Ich brauche Hilfe bei der aktuellen Frage.',
      example: 'Können Sie mir ein Beispiel zeigen?',
      skip: 'Können wir diesen Schritt überspringen?',
      review: 'Bitte überprüfen Sie meinen bisherigen Fortschritt.',
    };
    
    if (quickMessages[action]) {
      handleSendMessage(quickMessages[action]);
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <StepIndicator currentStep={currentStep} />
      
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        
        {isLoading && (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t bg-white p-4 space-y-3">
        <QuickActions onAction={handleQuickAction} />
        <ChatInput onSend={handleSendMessage} disabled={isLoading} />
      </div>
    </div>
  );
}