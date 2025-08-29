import { NextRequest, NextResponse } from 'next/server';
import { grantAssistant } from '@/lib/ai/grant-assistant';
import { templateManager } from '@/lib/templates/template-manager';
import { TemplateContext } from '@/lib/templates/template-types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const language = searchParams.get('language') || undefined;
    const programType = searchParams.get('programType') || undefined;
    const templateId = searchParams.get('id') || undefined;

    if (templateId) {
      // Get specific template
      const template = templateManager.getTemplate(templateId);
      if (!template) {
        return NextResponse.json(
          { error: 'Template not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ template });
    }

    // Get all templates or filter by criteria
    let templates = grantAssistant.getAvailableTemplates(language);
    
    if (programType) {
      templates = templates.filter(t => t.programType === programType);
    }

    return NextResponse.json({ 
      templates,
      count: templates.length 
    });
  } catch (error) {
    console.error('Templates API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'select': {
        // Select best template for context
        const { context } = body;
        const template = await grantAssistant.selectTemplate(context);
        
        if (!template) {
          return NextResponse.json(
            { error: 'No suitable template found' },
            { status: 404 }
          );
        }

        return NextResponse.json({ 
          template,
          message: `Selected template: ${template.name}`
        });
      }

      case 'populate': {
        // Populate template with context
        const { templateId, context } = body;
        
        if (!templateId || !context) {
          return NextResponse.json(
            { error: 'Missing templateId or context' },
            { status: 400 }
          );
        }

        const sections = templateManager.populateTemplate(templateId, context as TemplateContext);
        const template = templateManager.getTemplate(templateId);
        
        if (!template) {
          return NextResponse.json(
            { error: 'Template not found' },
            { status: 404 }
          );
        }

        const validation = templateManager.validateTemplate(sections, template);

        return NextResponse.json({
          templateId,
          sections,
          validation,
          completeness: validation.completeness
        });
      }

      case 'generate': {
        // Generate content with AI for specific section
        const { templateId, sectionId, subsectionId, context, userInput } = body;
        
        if (!templateId || !sectionId || !subsectionId || !context) {
          return NextResponse.json(
            { error: 'Missing required parameters' },
            { status: 400 }
          );
        }

        const content = await grantAssistant.generateWithTemplate(
          templateId,
          sectionId,
          subsectionId,
          context as TemplateContext,
          userInput
        );

        return NextResponse.json({
          templateId,
          sectionId,
          subsectionId,
          content,
          wordCount: content.split(/\s+/).length
        });
      }

      case 'validate': {
        // Validate populated template
        const { templateId, sections } = body;
        
        if (!templateId || !sections) {
          return NextResponse.json(
            { error: 'Missing templateId or sections' },
            { status: 400 }
          );
        }

        const validation = await grantAssistant.validateProposal(templateId, sections);

        return NextResponse.json({
          templateId,
          validation,
          isReady: validation.isValid && validation.completeness >= 80
        });
      }

      case 'full-proposal': {
        // Generate full proposal from context
        const { context, language = 'en' } = body;
        
        if (!context) {
          return NextResponse.json(
            { error: 'Missing context' },
            { status: 400 }
          );
        }

        const proposal = await grantAssistant.generateFullProposal(
          context as TemplateContext,
          language
        );

        return NextResponse.json({
          success: true,
          proposal,
          message: `Generated ${proposal.template.name} proposal with ${proposal.sections.length} sections`
        });
      }

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Templates API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process template request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}