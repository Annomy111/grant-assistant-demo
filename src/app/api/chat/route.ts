import { NextRequest, NextResponse } from 'next/server';
import { grantAssistant, EU_HORIZON_TEMPLATE } from '@/lib/ai/grant-assistant';
import { TemplateContext } from '@/lib/templates/template-types';
import { InputValidator } from '@/lib/validation/InputValidator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, applicationId, currentStep, history, useTemplate, context: messageContext } = body;
    
    // Initialize validator for server-side validation
    const validator = InputValidator.getInstance();
    
    console.log('Chat API called with:', { 
      message: message.substring(0, 100), 
      currentStep, 
      historyLength: history?.length, 
      frontendContext: {
        org: messageContext?.organizationName,
        project: messageContext?.projectTitle,
        call: messageContext?.call
      }
    });
    
    // Determine which section we're working on
    const section = EU_HORIZON_TEMPLATE.sections.find(s => s.id === currentStep);
    
    // Determine context from history, including any context passed from frontend
    const rawContext = extractContextFromHistory(history, messageContext);
    
    // Validate context fields on server side
    const context = await validateContext(rawContext, validator);
    
    console.log('Validated context:', {
      org: context.organizationName,
      project: context.projectTitle,
      call: context.call,
      validationApplied: true
    });
    
    // Check if we should use templates
    let selectedTemplate = null;
    if (useTemplate || context.templateId) {
      // Convert context to TemplateContext format
      const templateContext: Partial<TemplateContext> = {
        organizationName: context.organizationName || '',
        organizationType: context.organizationType || 'NGO',
        projectTitle: context.projectTitle || '',
        projectAcronym: context.projectAcronym || '',
        callIdentifier: context.call || '',
        duration: context.duration || 36,
        totalBudget: context.estimatedBudget ? parseFloat(context.estimatedBudget.replace(/[^\d.]/g, '')) * 1000000 : 3000000,
        requestedFunding: context.estimatedBudget ? parseFloat(context.estimatedBudget.replace(/[^\d.]/g, '')) * 1000000 : 3000000,
        consortium: context.partners || [],
        abstract: context.abstract || '',
        keywords: context.keywords || [],
        trlStart: context.trlLevel || 4,
        trlEnd: context.trlTarget || 6
      };
      
      selectedTemplate = await grantAssistant.selectTemplate(templateContext);
      if (selectedTemplate) {
        context.templateId = selectedTemplate.id;
        console.log('Selected template:', selectedTemplate.name);
      }
    }
    
    // Generate appropriate response based on current step
    let response: string;
    let nextStep: string | null = null;
    
    if (currentStep === 'introduction') {
      // Check if we already have the required information
      const hasBasicInfo = context.organizationName && context.projectTitle && context.call;
      
      if (hasBasicInfo) {
        // We have all the info, move to excellence
        console.log('Already have all basic info, moving to excellence');
        nextStep = 'excellence';
        response = `Perfekt! Ich habe alle grundlegenden Informationen erfasst:

**Organisation:** ${context.organizationName}
**Projekt:** ${context.projectTitle || context.projectAcronym}
**Call:** ${context.call}

✅ **Bereit für EXCELLENCE Section!**
Wir beginnen nun mit dem wichtigsten Teil (50% Gewichtung). 

Lassen Sie uns mit den **Projektzielen** starten:
- Was ist das Hauptziel Ihres Projekts?
- Welche konkreten gesellschaftlichen Herausforderungen adressieren Sie?
- Wie trägt Ihr Projekt zur EU-Ukraine Kooperation bei?`;
      } else {
        // Use AI for introduction phase with Horizon Europe focus
        try {
          // Build context summary to avoid repetition
          let contextSummary = 'BEREITS ERFASST:\n';
          if (context.organizationName) contextSummary += `- Organisation: ${context.organizationName}\n`;
          if (context.projectTitle) contextSummary += `- Projekttitel: ${context.projectTitle}\n`;
          if (context.projectAcronym) contextSummary += `- Akronym: ${context.projectAcronym}\n`;
          if (context.call) contextSummary += `- Call: ${context.call}\n`;
          
          response = await grantAssistant.answerQuestion(
            `${message}
            
            ${contextSummary}
            
            KONTEXT: Einführungsphase für HORIZON EUROPE Antrag
            AUFGABE: Sammle nur die FEHLENDEN Informationen:
            ${!context.organizationName ? '1. Organisation (Name, Typ: NGO/Universität/KMU)' : ''}
            ${!context.projectTitle ? '2. Projektakronym und Titel' : ''}
            ${!context.call ? '3. Welcher HORIZON EUROPE Call?' : ''}
            
            WICHTIG: Frage NICHT nach Informationen die bereits erfasst sind!
            Stelle EINE gezielte Frage nach der nächsten fehlenden Information.`,
            context,
            'de'
          );
          
          // Check if we have enough info to move to next step
          console.log('Checking for next step. Has org:', !!context.organizationName, 'Has project:', !!context.projectTitle, 'Has call:', !!context.call);
          if (context.organizationName && context.projectTitle && context.call) {
            nextStep = 'excellence';
            console.log('Moving to EXCELLENCE step!');
            response += '\n\n✅ **Bereit für EXCELLENCE Section!**\nWir beginnen nun mit dem wichtigsten Teil (50% Gewichtung). Ich werde Sie durch Objectives, Methodology und Innovation führen.';
          } else {
            console.log('Not enough info yet for next step');
          }
        } catch (aiError) {
          console.error('AI error, falling back to simple response:', aiError);
          // Fallback to simple response if AI fails
          response = await handleIntroductionStep(message, context);
        }
      }
    } else if (section) {
      // Generate content for specific section
      response = await grantAssistant.generateSectionContent(
        section,
        message,
        context,
        'de'
      );
      
      // Create populated section entry
      const populatedSection = {
        sectionId: section.id,
        title: section.title,
        content: response,
        timestamp: new Date().toISOString()
      };
      
      // Check if section is complete
      const sectionIndex = EU_HORIZON_TEMPLATE.sections.findIndex(s => s.id === currentStep);
      if (sectionIndex < EU_HORIZON_TEMPLATE.sections.length - 1) {
        nextStep = EU_HORIZON_TEMPLATE.sections[sectionIndex + 1].id;
      }
      
      // Return populated section with response
      return NextResponse.json({
        response,
        nextStep,
        context,
        populatedSections: [populatedSection]
      });
    } else {
      // General question answering
      response = await grantAssistant.answerQuestion(message, context, 'de');
      
      console.log('Generated response:', response?.substring(0, 100));
      
      return NextResponse.json({
        response,
        nextStep,
        context,
      });
    }
    
    // This is only reached for introduction step
    console.log('Generated response:', response?.substring(0, 100));
    
    return NextResponse.json({
      response,
      nextStep,
      context,
    });
  } catch (error) {
    console.error('Chat API error details:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json(
      { 
        error: 'Fehler bei der Verarbeitung Ihrer Anfrage',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

async function validateContext(context: any, validator: InputValidator): Promise<any> {
  const validated: any = {};
  
  // Validate each field before including it
  for (const [field, value] of Object.entries(context)) {
    if (value !== undefined && value !== null && value !== '') {
      const validation = validator.validate(field, value);
      if (validation.isValid) {
        validated[field] = validation.sanitizedValue || value;
      } else {
        console.log(`Server validation rejected ${field}:`, validation.reason);
      }
    }
  }
  
  return validated;
}

function extractContextFromHistory(history: any[], messageContext?: any): Record<string, any> {
  // Start with message context as base (it has the most up-to-date info)
  const context: Record<string, any> = {
    horizonEurope: true,
    programme: 'Horizon Europe',
    year: 2025,
    ...messageContext // Include any context passed from the frontend
  };
  
  console.log('Extracting context from history. Frontend context:', {
    org: messageContext?.organizationName,
    project: messageContext?.projectTitle,
    call: messageContext?.call,
    allFields: Object.keys(messageContext || {})
  });
  
  // If we have complete frontend context, use it and extract additional info from history
  if (messageContext?.organizationName && messageContext?.projectTitle && messageContext?.call) {
    console.log('Complete frontend context available, using it');
    // Still parse history for additional information like project acronym, etc.
  }
  
  // Track what we're looking for
  let lookingFor: 'organization' | 'project' | 'call' | null = null;
  
  // Extract Horizon Europe specific information from chat history ONLY if not already in context
  history?.forEach((msg: any, index: number) => {
    if (msg.role === 'assistant') {
      const contentLower = msg.content.toLowerCase();
      // Check what the assistant is asking for
      if (contentLower.includes('wie heißt ihre organisation') || contentLower.includes('name ihrer organisation')) {
        lookingFor = 'organization';
      } else if (contentLower.includes('titel ihres projekts') || contentLower.includes('projektname')) {
        lookingFor = 'project';
      } else if (contentLower.includes('welcher call') || contentLower.includes('horizon europe call')) {
        lookingFor = 'call';
      }
    }
    
    if (msg.role === 'user') {
      const content = msg.content;
      const contentLower = content.toLowerCase();
      
      // Skip generic prompts
      const isGeneric = contentLower.includes('legen wir los') || 
                       contentLower.includes('weiter') || 
                       contentLower === 'ok' ||
                       contentLower === 'ja' ||
                       content.length < 5;
      
      if (!isGeneric) {
        // Check if this is likely an answer to what we were looking for
        if (lookingFor === 'organization' && !context.organizationName && index > 0) {
          // Previous message was asking for organization - but skip if it's a generic phrase
          if (!contentLower.includes('legen') && !contentLower.includes('los')) {
            context.organizationName = content.trim();
            console.log('Extracted organization name:', context.organizationName);
          }
          lookingFor = null;
        } else if (lookingFor === 'project' && !context.projectTitle && index > 0) {
          // Previous message was asking for project
          context.projectTitle = content.trim();
          console.log('Extracted project title:', context.projectTitle);
          lookingFor = null;
        } else if (lookingFor === 'call' && !context.call && index > 0) {
          context.call = content.trim();
          console.log('Extracted call:', context.call);
          lookingFor = null;
        }
      }
      
      // Also check for explicit mentions
      if (contentLower.includes('organisation:') || contentLower.includes('organization:')) {
        const match = content.match(/(?:organisation|organization):\s*(.+)/i);
        if (match) {
          context.organizationName = match[1].trim();
          console.log('Extracted organization from explicit mention:', context.organizationName);
        }
      }
      
      if (contentLower.includes('projekt:') || contentLower.includes('project:')) {
        const match = content.match(/(?:projekt|project):\s*(.+)/i);
        if (match) {
          context.projectTitle = match[1].trim();
          console.log('Extracted project from explicit mention:', context.projectTitle);
        }
      }
      
      // Extract organization types
      if (contentLower.includes('ngo') || contentLower.includes('verein')) {
        context.organizationType = 'NGO';
      } else if (contentLower.includes('universität') || contentLower.includes('university')) {
        context.organizationType = 'University';
      } else if (contentLower.includes('kmu') || contentLower.includes('sme')) {
        context.organizationType = 'SME';
      }
      
      // Extract call information
      if (content.includes('HORIZON-CL')) {
        const callMatch = content.match(/HORIZON-CL\d-\d{4}-[\w-]+/);
        if (callMatch) {
          context.call = callMatch[0];
          console.log('Extracted HORIZON call:', context.call);
        }
      } else if (content.includes('CERV')) {
        const cervMatch = content.match(/CERV-\d{4}-[\w-]+/);
        if (cervMatch) {
          context.call = cervMatch[0];
          console.log('Extracted CERV call:', context.call);
        }
      }
      
      // Extract cluster information
      if (contentLower.includes('cluster 2') || contentLower.includes('democracy')) {
        context.cluster = 'Cluster 2 - Culture, Creativity and Inclusive Society';
      } else if (contentLower.includes('cluster 3') || contentLower.includes('security')) {
        context.cluster = 'Cluster 3 - Civil Security';
      }
      
      // Extract project details
      if (contentLower.includes('trl')) {
        const trlMatch = content.match(/TRL\s*(\d)/i);
        if (trlMatch) context.trlLevel = parseInt(trlMatch[1]);
      }
      
      // Extract country
      if (contentLower.includes('deutschland') || contentLower.includes('germany')) {
        context.country = 'DE';
      } else if (contentLower.includes('ukraine') || contentLower.includes('україна')) {
        context.country = 'UA';
      }
      
      // Extract budget
      if (contentLower.includes('€') || contentLower.includes('million')) {
        const budgetMatch = content.match(/(\d+(?:\.\d+)?)\s*(?:million|mio|m€|€m)/i);
        if (budgetMatch) context.estimatedBudget = budgetMatch[1] + 'M EUR';
      }
    }
  });
  
  console.log('Final extracted context:', {
    organizationName: context.organizationName,
    projectTitle: context.projectTitle,
    call: context.call,
    hasRequiredInfo: !!(context.organizationName && context.projectTitle && context.call)
  });
  
  return context;
}

async function handleIntroductionStep(message: string, context: Record<string, any>): Promise<string> {
  // Structured conversation for collecting basic information
  const responses = {
    organizationName: 'Vielen Dank! Wie lautet der Titel Ihres Projekts?',
    projectTitle: 'Ausgezeichnet! In welchem Land ist Ihre Organisation registriert? (Deutschland/Ukraine)',
    country: 'Perfekt! Können Sie kurz beschreiben, worum es in Ihrem Projekt geht? (2-3 Sätze)',
    description: 'Sehr gut! Wer ist Ihre Zielgruppe und welche Partner sind beteiligt?',
  };
  
  // Determine what info we still need
  if (!context.organizationName) {
    return 'Bitte nennen Sie mir den Namen Ihrer Organisation.';
  } else if (!context.projectTitle) {
    return responses.organizationName;
  } else if (!context.country) {
    return responses.projectTitle;
  } else if (!context.description) {
    return responses.country;
  } else {
    return responses.description;
  }
}