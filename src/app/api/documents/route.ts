import { NextRequest, NextResponse } from 'next/server';
import { enhancedDocumentGenerator } from '@/lib/export/enhanced-document-generator';
import { templateManager } from '@/lib/templates/template-manager';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      templateId,
      context,
      populatedSections,
      format,
      language,
      includeAnnexes = false,
      includeToc = true,
      includeCoverPage = true
    } = body;

    // Validate required fields
    if (!templateId || !context || !format) {
      return NextResponse.json(
        { error: 'Missing required fields: templateId, context, or format' },
        { status: 400 }
      );
    }

    // Validate template exists
    const template = templateManager.getTemplate(templateId);
    if (!template) {
      return NextResponse.json(
        { error: `Template ${templateId} not found` },
        { status: 404 }
      );
    }

    // Validate format
    if (!['pdf', 'word', 'html'].includes(format)) {
      return NextResponse.json(
        { error: 'Invalid format. Must be pdf, word, or html' },
        { status: 400 }
      );
    }

    // Generate the document
    const blob = await enhancedDocumentGenerator.generateDocument({
      templateId,
      context,
      populatedSections: populatedSections || [],
      format,
      language: language || 'en',
      includeAnnexes,
      includeToc,
      includeCoverPage
    });

    // Convert blob to buffer
    const buffer = await blob.arrayBuffer();

    // Set appropriate headers based on format
    const headers: Record<string, string> = {
      'Content-Length': buffer.byteLength.toString(),
    };

    if (format === 'pdf') {
      headers['Content-Type'] = 'application/pdf';
      headers['Content-Disposition'] = `attachment; filename="${context.projectAcronym || 'grant-application'}.pdf"`;
    } else if (format === 'word') {
      headers['Content-Type'] = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      headers['Content-Disposition'] = `attachment; filename="${context.projectAcronym || 'grant-application'}.docx"`;
    } else if (format === 'html') {
      headers['Content-Type'] = 'text/html';
      headers['Content-Disposition'] = `attachment; filename="${context.projectAcronym || 'grant-application'}.html"`;
    }

    // Return the document
    return new NextResponse(buffer, { status: 200, headers });
  } catch (error) {
    console.error('Document generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate document', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve available templates
export async function GET(request: NextRequest) {
  try {
    const templates = templateManager.getAllTemplates();
    
    const templateSummaries = templates.map(t => ({
      id: t.id,
      name: t.name,
      description: t.description,
      programType: t.programType,
      ukraineSpecific: t.metadata.ukraineSpecific,
      deadline: t.metadata.deadlineInfo
    }));

    return NextResponse.json({ templates: templateSummaries });
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    );
  }
}