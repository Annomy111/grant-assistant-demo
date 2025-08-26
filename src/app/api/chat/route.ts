import { NextRequest, NextResponse } from 'next/server';
import { grantAssistant, EU_HORIZON_TEMPLATE } from '@/lib/ai/grant-assistant';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, applicationId, currentStep, history } = body;
    
    // Determine which section we're working on
    const section = EU_HORIZON_TEMPLATE.sections.find(s => s.id === currentStep);
    
    // Determine context from history
    const context = extractContextFromHistory(history);
    
    // Generate appropriate response based on current step
    let response: string;
    let nextStep: string | null = null;
    
    if (currentStep === 'introduction') {
      // Handle introduction phase - collect basic info
      response = await handleIntroductionStep(message, context);
      
      // Check if we have enough info to move to next step
      if (context.organizationName && context.projectTitle) {
        nextStep = 'excellence';
        response += '\n\nGroßartig! Wir haben die Grundinformationen. Lassen Sie uns nun mit dem Abschnitt "Excellence" beginnen. Hier geht es um die Ziele und die Methodik Ihres Projekts.';
      }
    } else if (section) {
      // Generate content for specific section
      response = await grantAssistant.generateSectionContent(
        section,
        message,
        context,
        'de'
      );
      
      // Check if section is complete
      const sectionIndex = EU_HORIZON_TEMPLATE.sections.findIndex(s => s.id === currentStep);
      if (sectionIndex < EU_HORIZON_TEMPLATE.sections.length - 1) {
        nextStep = EU_HORIZON_TEMPLATE.sections[sectionIndex + 1].id;
      }
    } else {
      // General question answering
      response = await grantAssistant.answerQuestion(message, context, 'de');
    }
    
    return NextResponse.json({
      response,
      nextStep,
      context,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Fehler bei der Verarbeitung Ihrer Anfrage' },
      { status: 500 }
    );
  }
}

function extractContextFromHistory(history: any[]): Record<string, any> {
  const context: Record<string, any> = {};
  
  // Extract information from chat history
  history?.forEach((msg: any) => {
    if (msg.role === 'user') {
      const content = msg.content.toLowerCase();
      
      // Simple extraction logic - in production, use more sophisticated NLP
      if (content.includes('organisation') || content.includes('name')) {
        // Extract organization name
        const words = msg.content.split(' ');
        if (words.length > 0) {
          context.organizationName = msg.content;
        }
      }
      
      if (content.includes('projekt') || content.includes('title')) {
        context.projectTitle = msg.content;
      }
      
      if (content.includes('deutschland') || content.includes('ukraine')) {
        context.country = content.includes('deutschland') ? 'DE' : 'UA';
      }
    }
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