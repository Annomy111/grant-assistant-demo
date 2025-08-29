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
        console.log('Restoring saved state:', state);
        
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
    console.log('State saved to localStorage');
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
    
    // Add detailed logging for debugging
    console.log('=== handleSendMessage called ===');
    console.log('Content:', content);
    console.log('Current step:', currentStep);
    console.log('Messages count before:', messages.length);
    
    // Update project context from user messages with validation
    const contextResult = await getUpdatedContext(content, currentStep);
    const { validatedFields, ...updatedContext } = contextResult;
    console.log('Updated context returned:', updatedContext);
    console.log('Validated fields:', validatedFields);
    
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
        console.log('Updating context from API:', data.context);
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
          console.log('Advancing to next step:', data.nextStep);
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
          console.log('Cannot advance:', advanceCheck.reason);
          // Add a system message explaining why we can't advance
          const systemMessage: Message = {
            id: (Date.now() + 2).toString(),
            role: 'system',
            content: `⚠️ ${advanceCheck.reason}`,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, systemMessage]);
        }
      } else {
        console.log('No step change. Current step remains:', currentStep);
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
    const contentLower = content.toLowerCase();
    
    // Get all messages including the current user message for better context
    const allMessages = [...messages];
    
    // Check what the last assistant message was asking for
    const lastAssistantMsg = allMessages.filter(m => m.role === 'assistant').pop();
    const lastAssistantContent = lastAssistantMsg?.content.toLowerCase() || '';
    
    // Count what we already have from user messages
    const userMessages = allMessages.filter(m => m.role === 'user').map(m => m.content);
    
    let newContext: any = {};
    let validatedFields: Record<string, boolean> = {};
    
    console.log('=== getUpdatedContext called ===');
    console.log('Input content:', content);
    console.log('Step parameter:', step);
    console.log('Last assistant message snippet:', lastAssistantContent.substring(0, 100));
    console.log('User messages count:', userMessages.length);
    console.log('Current context state:', {
      hasOrg: !!context.organizationName,
      orgValue: context.organizationName,
      hasProject: !!context.projectTitle,
      projectValue: context.projectTitle,
      hasCall: !!context.call,
      callValue: context.call
    });
    
    // Only update context if we're in the introduction phase and actively collecting info
    if (step === 'introduction' || !step) {
      console.log('Checking conditions:');
      console.log('  Has org?', !!context.organizationName);
      console.log('  Has project?', !!context.projectTitle);
      console.log('  Assistant asking for org?', lastAssistantContent.includes('organisation') || lastAssistantContent.includes('organization'));
      console.log('  Assistant asking for project?', lastAssistantContent.includes('projekt') || lastAssistantContent.includes('project') || lastAssistantContent.includes('titel'));
      console.log('  Content:', content);
      
      // Use session validation to check if it's generic
      const isGenericOrg = await session.validateAndStore('_test_generic', content);
      if (!isGenericOrg) {
        console.log('Content detected as generic by validator - skipping');
        return { validatedFields };
      }
      // Clean up test validation
      await session.validateAndStore('_test_generic', null);
      
      // Check for explicit mentions first (higher priority)
      // Check if the first line contains Open Society Foundations
      const firstLine = content.split('\n')[0];
      if (firstLine.includes('Open Society Foundation') || firstLine.includes('OSF')) {
        const orgName = 'Open Society Foundations';
        // Validate before storing
        const isValid = await session.validateAndStore('organizationName', orgName);
        if (isValid) {
          newContext.organizationName = orgName;
          validatedFields.organizationName = true;
          console.log('Detected and validated Open Society Foundations');
        }
        
        // Also check if project title is on the same line after colon
        if (firstLine.includes(':')) {
          const afterColon = firstLine.split(':')[1]?.trim();
          if (afterColon && !context.projectTitle) {
            const titleValid = await session.validateAndStore('projectTitle', afterColon);
            if (titleValid) {
              newContext.projectTitle = afterColon;
              validatedFields.projectTitle = true;
              console.log('Also captured and validated project title:', afterColon);
            }
          }
        }
      } 
      // Check if content looks like organization/project/call info
      else if (content.includes(':')) {
        // Parse structured input like "Organisation: X" or "• Call-Identifikation: X"
        const lines = content.split('\n');
        for (const line of lines) {
          // Remove bullet points and clean up
          const cleanLine = line.replace(/^[•\-*]\s*/, '').trim();
          
          if (cleanLine.toLowerCase().includes('organisation:') || cleanLine.toLowerCase().includes('organization:')) {
            const value = cleanLine.split(':')[1]?.trim();
            if (value && !context.organizationName) {
              const isValid = await session.validateAndStore('organizationName', value);
              if (isValid) {
                newContext.organizationName = value;
                validatedFields.organizationName = true;
                console.log('Parsed and validated organization:', value);
              }
            }
          }
          if (cleanLine.toLowerCase().includes('projekt:') || cleanLine.toLowerCase().includes('project:')) {
            const value = cleanLine.split(':')[1]?.trim();
            if (value && !context.projectTitle) {
              const isValid = await session.validateAndStore('projectTitle', value);
              if (isValid) {
                newContext.projectTitle = value;
                validatedFields.projectTitle = true;
                console.log('Parsed and validated project:', value);
              }
            }
          }
          if (cleanLine.toLowerCase().includes('call') && cleanLine.includes(':')) {
            const value = cleanLine.split(':')[1]?.trim();
            if (value && !context.call) {
              // Extract just the call ID if it's in a longer text
              const callMatch = value.match(/HORIZON-CL\d-\d{4}-[\w-]+/);
              const callValue = callMatch ? callMatch[0] : value;
              const isValid = await session.validateAndStore('call', callValue);
              if (isValid) {
                newContext.call = callValue;
                validatedFields.call = true;
                console.log('Parsed and validated call:', callValue);
              }
            }
          }
        }
      }
      // Smart detection: If we don't have an org name yet and assistant asked for it
      else if (!context.organizationName && 
            (lastAssistantContent.includes('organisation') || 
             lastAssistantContent.includes('organization') ||
             userMessages.length === 0) &&
            !content.includes('HORIZON-') && !content.includes('CERV-')) {
          const isValid = await session.validateAndStore('organizationName', content.trim());
          if (isValid) {
            newContext.organizationName = content.trim();
            validatedFields.organizationName = true;
            console.log('Set and validated organization name:', content.trim());
          }
      }
      // If we have org but no project title, assume the next message is the project title
      else if (!context.projectTitle && context.organizationName && 
                 !content.includes('HORIZON-') && !content.includes('CERV-') && !content.includes('-202')) {
        const isValid = await session.validateAndStore('projectTitle', content.trim());
        if (isValid) {
          newContext.projectTitle = content.trim();
          validatedFields.projectTitle = true;
          console.log('Set and validated project title (assumed from sequence):', content.trim());
        }
      }
      // Also check what assistant explicitly asked for
      else if (!context.organizationName && 
               (lastAssistantContent.includes('wie heißt ihre organisation') || 
                lastAssistantContent.includes('name ihrer organisation') ||
                lastAssistantContent.includes('organisation'))) {
        newContext.organizationName = content.trim();
        console.log('Updated organization name from prompt:', content.trim());
      }
      else if (!context.projectTitle && 
               (lastAssistantContent.includes('titel') || 
                lastAssistantContent.includes('projektname') ||
                lastAssistantContent.includes('project'))) {
        if (!content.includes('HORIZON-') && !content.includes('CERV-') && !content.includes('-202')) {
          newContext.projectTitle = content.trim();
          console.log('Updated project title from prompt:', content.trim());
        }
      }
    }
    
    // Check for call
    if (!context.call && 
        (lastAssistantContent.includes('welcher call') || 
         lastAssistantContent.includes('welche') ||
         lastAssistantContent.includes('cerv') ||
         lastAssistantContent.includes('horizon europe call'))) {
      // Check if this is actually a country response
      if (contentLower.includes('deutschland') || contentLower.includes('ukraine')) {
        newContext.organizationCountry = contentLower.includes('deutschland') ? 'DE' : 'UA';
        console.log('Updated country in context:', newContext.organizationCountry);
      } else {
        newContext.call = content.trim();
        newContext.callIdentifier = content.trim();
        console.log('Updated call in context:', content.trim());
      }
    }
    
    // Always check for explicit call identifiers
    if (content.includes('HORIZON-CL')) {
      const match = content.match(/HORIZON-CL\d-\d{4}-[\w-]+/);
      if (match) {
        newContext.call = match[0];
        newContext.callIdentifier = match[0];
        newContext.programType = 'HORIZON';
        console.log('Extracted HORIZON call from message:', match[0]);
      }
    }
    
    // Check for CERV calls
    if (content.includes('CERV-')) {
      const match = content.match(/CERV-\d{4}-[\w-]+/);
      if (match) {
        newContext.call = match[0];
        newContext.callIdentifier = match[0];
        newContext.programType = 'CERV';
        console.log('Extracted CERV call from message:', match[0]);
      }
    }
    
    console.log('=== Final context being returned ===');
    console.log('Organization:', newContext.organizationName);
    console.log('Project Title:', newContext.projectTitle);
    console.log('Call:', newContext.call);
    console.log('Validated fields:', validatedFields);
    console.log('Full context:', newContext);
    
    return { ...newContext, validatedFields };
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
  
  const handleReset = () => {
    if (confirm('Möchten Sie wirklich alle Daten löschen und neu beginnen?')) {
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
      console.log('State reset and localStorage cleared');
    }
  };
  
  return (
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
        {!showTemplateSelector && (
        <div className="px-6 py-3 bg-white border-b shadow-sm flex gap-3">
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
      )}
      
      {/* Template Selector Modal */}
      {showTemplateSelector && (
        <div className="absolute inset-0 z-50 bg-white overflow-y-auto">
          <div className="sticky top-0 bg-white border-b px-4 py-3 flex items-center justify-between">
            <h3 className="font-semibold text-lg">Template auswählen</h3>
            <button
              onClick={() => setShowTemplateSelector(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <div className="p-4">
            <TemplateSelector 
              onSelectTemplate={handleTemplateSelection}
              projectContext={context}
            />
          </div>
        </div>
      )}
      
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