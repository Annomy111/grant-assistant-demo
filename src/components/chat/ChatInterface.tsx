'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { StepIndicator } from './StepIndicator';
import { QuickActions } from './QuickActions';
import { TemplateSelector } from '../templates/TemplateSelector';
import { DocumentExportButton } from '../DocumentExportButton';
import { SectionValidator } from './SectionValidator';
import { SectionSidebar } from '../navigation/SectionSidebar';
import { Loader2, FileText, AlertCircle } from 'lucide-react';
import { useApplicationContext } from '@/hooks/useApplicationContext';
import { useSession } from '@/hooks/useSession';
import { useLanguage } from '@/contexts/LanguageContext';
import { parseUserInput, ParsingContext } from '@/lib/context/InputParser';
import { ResetConfirmationDialog } from './ResetConfirmationDialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/Dialog';

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
  const { 
    context, 
    updateContext, 
    validateStep, 
    canAdvanceToStep,
    updateSectionProgress,
    getAIContextSummary
  } = useApplicationContext();
  const { t } = useLanguage();
  
  // Add session validation
  const session = useSession({
    autoValidate: true,
    syncWithContext: true,
    onValidationError: (field, reason) => {
      console.warn(`[ChatInterface] Validation error for ${field}:`, reason);
      // Show validation error to user
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'system',
        content: `⚠️ ${t('chat.validationError')}: ${reason}`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  });
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(context.templateId || null);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [populatedSections, setPopulatedSections] = useState<any[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [currentSubSection, setCurrentSubSection] = useState<string | undefined>();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: t('chat.welcome'),
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
  
  // Load from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('grant-assistant-state');
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        
        // Restore all saved state
        if (state.messages) setMessages(state.messages.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        })));
        if (state.selectedTemplateId) setSelectedTemplateId(state.selectedTemplateId);
        if (state.populatedSections) setPopulatedSections(state.populatedSections);
        if (state.currentStep && onStepChange) onStepChange(state.currentStep);
        
        // Note: Context is now managed by ApplicationContextManager and loaded separately
      } catch (error) {
        console.error('Failed to restore saved state:', error);
      }
    }
  }, []);
  
  // Save to localStorage whenever state changes (except context which is handled by manager)
  useEffect(() => {
    const state = {
      messages,
      selectedTemplateId,
      populatedSections,
      currentStep,
      savedAt: new Date().toISOString()
    };
    
    localStorage.setItem('grant-assistant-state', JSON.stringify(state));
  }, [messages, selectedTemplateId, populatedSections, currentStep]);
  
  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    // Update project context from user messages with validation
    const contextResult = await getUpdatedContext(content, currentStep);
    const { validatedFields, ...updatedContext } = contextResult;
    
    // Update the application context manager with validated data
    if (updatedContext && Object.keys(updatedContext).length > 0) {
      updateContext(updatedContext);
    }
    
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
          history: [...messages, userMessage], // Include the new message in history
          useTemplate: selectedTemplateId !== null,
          templateId: selectedTemplateId,
          context: context, // Pass full context from manager
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
      
      // Update context from API response
      if (data.context) {
        updateContext({
          ...data.context,
          templateId: selectedTemplateId // Keep template ID
        });
      }
      
      // Update populated sections if provided
      if (data.populatedSections) {
        setPopulatedSections(prev => [...prev, ...data.populatedSections]);
      }
      
      if (data.nextStep && onStepChange) {
        // Check if we can advance
        const advanceCheck = canAdvanceToStep(currentStep, data.nextStep);
        if (advanceCheck.canAdvance) {
          onStepChange(data.nextStep);
          // Update section progress
          updateSectionProgress(currentStep, {
            status: 'completed',
            completionPercentage: 100
          });
          updateSectionProgress(data.nextStep, {
            status: 'in_progress',
            completionPercentage: 0
          });
        } else {
          // Add a system message explaining why we can't advance
          const systemMessage: Message = {
            id: (Date.now() + 2).toString(),
            role: 'system',
            content: `⚠️ ${advanceCheck.reason}`,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, systemMessage]);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: t('chat.errorMessage'),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleQuickAction = (action: string) => {
    const quickMessages: Record<string, string> = {
      cluster2_may: t('chat.quickActions.cluster2Prompt'),
      cerv_ukraine: t('chat.quickActions.cervUkrainePrompt'),
      ua_mandatory: t('chat.quickActions.uaMandatoryPrompt'),
      two_stage: t('chat.quickActions.twoStagePrompt'),
      use_template: 'TEMPLATE_SELECT', // Special action for template selection
    };
    
    if (action === 'use_template') {
      setShowTemplateSelector(true);
    } else if (quickMessages[action]) {
      handleSendMessage(quickMessages[action]);
    }
  };
  
  const handleTemplateSelection = (templateId: string) => {
    setSelectedTemplateId(templateId);
    setShowTemplateSelector(false);
    
    // Update context with template ID
    updateContext({
      templateId: templateId
    });
    
    // Add system message about template selection
    const systemMessage: Message = {
      id: Date.now().toString(),
      role: 'system',
      content: `✅ Template ausgewählt! Die KI wird nun strukturierte Vorlagen verwenden, um Ihren Antrag zu erstellen.`,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, systemMessage]);
  };
  
  const getUpdatedContext = async (content: string, step?: string) => {
    const lastAssistantMsg = messages.filter(m => m.role === 'assistant').pop();

    const parsingContext: ParsingContext = {
      currentStep: step || currentStep,
      lastAssistantMessage: lastAssistantMsg?.content,
      existingContext: context,
      sessionHandler: session,
    };

    const { updates, validatedFields } = await parseUserInput(content, parsingContext);
    
    return { ...updates, validatedFields };
  };
  
  
  const handleSectionChange = (sectionId: string, subSectionId?: string) => {
    // Update current step
    if (onStepChange) {
      onStepChange(sectionId);
    }
    setCurrentSubSection(subSectionId);
    
    // Add a system message about the section change
    const systemMessage: Message = {
      id: Date.now().toString(),
      role: 'system',
      content: `📍 Navigiert zu: ${sectionId}${subSectionId ? ` - ${subSectionId}` : ''}`,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, systemMessage]);
    
    // Update section progress
    updateSectionProgress(sectionId, {
      status: 'in_progress'
    });
  };
  
  const executeReset = () => {
    // Clear all state
    setMessages([{
      id: '1',
      role: 'assistant',
      content: t('chat.welcome'),
      timestamp: new Date(),
    }]);
    updateContext({});  // Clear context using manager
    setSelectedTemplateId(null);
    setPopulatedSections([]);
    if (onStepChange) onStepChange('introduction');

    // Clear localStorage
    localStorage.removeItem('grant-assistant-state');
    localStorage.removeItem('grant-application-context');
  };

  const handleReset = () => {
    setIsResetDialogOpen(true);
  };
  
  return (
    <>
      <ResetConfirmationDialog
        isOpen={isResetDialogOpen}
        onClose={() => setIsResetDialogOpen(false)}
        onConfirm={executeReset}
      />
      <div className="flex h-full">
        {/* Sidebar Navigation */}
      <SectionSidebar
        currentSection={currentStep}
        currentSubSection={currentSubSection}
        onSectionChange={handleSectionChange}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      {/* Main Content Area */}
      <div className="flex flex-col flex-1 bg-gray-50">
        <StepIndicator currentStep={currentStep} />
        
        {/* Section Validation Status */}
        <div className="px-6 py-3 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <SectionValidator 
            currentSection={currentStep} 
            showDetails={false}
          />
        </div>
        
        {/* Template Selection and Export Buttons */}
        <div className="px-6 py-3 bg-white border-b shadow-sm flex gap-3">
          <Dialog open={showTemplateSelector} onOpenChange={setShowTemplateSelector}>
            <DialogTrigger asChild>
              <button
                onClick={() => setShowTemplateSelector(true)}
                className="flex-1 flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg hover:from-blue-100 hover:to-indigo-100 transition-all shadow-sm hover:shadow"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {selectedTemplateId
                      ? '✅ Template aktiv - Strukturierte Vorlagen werden verwendet'
                      : '📋 Template auswählen für strukturierte Anträge'}
                  </span>
                </div>
                <span className="text-xs text-blue-600">
                  {selectedTemplateId ? 'Ändern' : 'Auswählen'}
                </span>
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Template auswählen</DialogTitle>
              </DialogHeader>
              <div className="p-4 max-h-[70vh] overflow-y-auto">
                <TemplateSelector
                  onSelectTemplate={handleTemplateSelection}
                  projectContext={context}
                />
              </div>
            </DialogContent>
          </Dialog>
          
          <DocumentExportButton
            templateId={selectedTemplateId || undefined}
            context={context}
            populatedSections={populatedSections}
          />
          
          <button
            onClick={handleReset}
            className="px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition-all hover:shadow-sm"
            title="Neu starten"
          >
            🔄 Neu
          </button>
        </div>
      
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 bg-white">
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
      
      <div className="border-t bg-gradient-to-t from-gray-50 to-white px-6 py-4 space-y-3 shadow-lg">
        <QuickActions onAction={handleQuickAction} />
        <ChatInput onSend={handleSendMessage} disabled={isLoading} />
      </div>
    </div>
  </div>
  );
}