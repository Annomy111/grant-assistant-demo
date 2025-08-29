import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, PageBreak, Table, TableRow, TableCell, WidthType, BorderStyle, Header, Footer, PageNumber, NumberFormat } from 'docx';
import { GrantTemplate, TemplatePopulationResult, TemplateContext } from '../templates/template-types';
import { templateManager } from '../templates/template-manager';
import jsPDF from 'jspdf';

export interface DocumentGenerationOptions {
  templateId: string;
  context: TemplateContext;
  populatedSections: TemplatePopulationResult[];
  format: 'pdf' | 'word' | 'html';
  language: 'en' | 'de' | 'uk';
  includeAnnexes?: boolean;
  includeToc?: boolean;
  includeCoverPage?: boolean;
}

export class EnhancedDocumentGenerator {
  /**
   * Generate a complete grant application document
   */
  async generateDocument(options: DocumentGenerationOptions): Promise<Blob> {
    const template = templateManager.getTemplate(options.templateId);
    if (!template) {
      throw new Error(`Template ${options.templateId} not found`);
    }

    switch (options.format) {
      case 'word':
        return this.generateWordDocument(template, options);
      case 'pdf':
        return this.generatePDFDocument(template, options);
      case 'html':
        return this.generateHTMLDocument(template, options);
      default:
        throw new Error(`Unsupported format: ${options.format}`);
    }
  }

  /**
   * Generate a Word document using docx library
   */
  private async generateWordDocument(
    template: GrantTemplate,
    options: DocumentGenerationOptions
  ): Promise<Blob> {
    const sections = [];

    // Add cover page if requested
    if (options.includeCoverPage) {
      sections.push(this.createCoverPageSection(template, options));
    }

    // Add table of contents if requested
    if (options.includeToc) {
      sections.push(this.createTocSection(template, options));
    }

    // Add main content sections
    sections.push(this.createMainContentSection(template, options));

    // Create the document
    const doc = new Document({
      sections: sections as any,
      creator: 'EU Grant Assistant',
      title: options.context.projectTitle,
      subject: `${template.name} Application`,
      keywords: template.keywords.join(', '),
      numbering: {
        config: [
          {
            reference: 'main-numbering',
            levels: [
              {
                level: 0,
                format: NumberFormat.DECIMAL,
                text: '%1.',
                alignment: AlignmentType.LEFT,
              },
              {
                level: 1,
                format: NumberFormat.DECIMAL,
                text: '%1.%2',
                alignment: AlignmentType.LEFT,
              },
              {
                level: 2,
                format: NumberFormat.DECIMAL,
                text: '%1.%2.%3',
                alignment: AlignmentType.LEFT,
              },
            ],
          },
        ],
      },
    });

    // Generate the document blob
    const blob = await Packer.toBlob(doc);
    return blob;
  }

  /**
   * Create cover page section
   */
  private createCoverPageSection(template: GrantTemplate, options: DocumentGenerationOptions) {
    const { context } = options;
    
    return {
      properties: {
        page: {
          margin: {
            top: 1440,
            bottom: 1440,
            left: 1440,
            right: 1440,
          },
        },
      },
      children: [
        new Paragraph({
          text: template.name,
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER,
          spacing: { after: 600 },
        }),
        new Paragraph({
          text: '',
          spacing: { after: 1200 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: 'Call Identifier: ',
              bold: true,
              size: 28,
            }),
            new TextRun({
              text: context.callIdentifier,
              size: 28,
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        }),
        new Paragraph({
          text: '',
          spacing: { after: 1200 },
        }),
        new Paragraph({
          text: context.projectTitle,
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        }),
        new Paragraph({
          text: context.projectAcronym,
          heading: HeadingLevel.HEADING_2,
          alignment: AlignmentType.CENTER,
          spacing: { after: 1200 },
        }),
        new Paragraph({
          text: '',
          spacing: { after: 2400 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: 'Lead Organization: ',
              bold: true,
            }),
            new TextRun({
              text: context.organizationName,
            }),
          ],
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: 'Duration: ',
              bold: true,
            }),
            new TextRun({
              text: `${context.duration} months`,
            }),
          ],
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: 'Total Budget: ',
              bold: true,
            }),
            new TextRun({
              text: `€${context.totalBudget.toLocaleString()}`,
            }),
          ],
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: 'EU Funding Requested: ',
              bold: true,
            }),
            new TextRun({
              text: `€${context.requestedFunding.toLocaleString()}`,
            }),
          ],
          alignment: AlignmentType.CENTER,
        }),
        new PageBreak(),
      ],
    };
  }

  /**
   * Create table of contents section
   */
  private createTocSection(template: GrantTemplate, options: DocumentGenerationOptions) {
    const tocItems = [];

    tocItems.push(
      new Paragraph({
        text: 'TABLE OF CONTENTS',
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { after: 600 },
      })
    );

    // Add sections from template
    template.sections.forEach((section, sectionIndex) => {
      tocItems.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${sectionIndex + 1}. ${section.title}`,
              bold: true,
            }),
            new TextRun({
              text: `\t\t${sectionIndex + 2}`, // Page number placeholder
            }),
          ],
          spacing: { after: 200 },
        })
      );

      section.subsections.forEach((subsection, subsectionIndex) => {
        tocItems.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `\t${sectionIndex + 1}.${subsectionIndex + 1} ${subsection.title}`,
              }),
              new TextRun({
                text: `\t\t${sectionIndex + 2}`, // Page number placeholder
              }),
            ],
            spacing: { after: 100 },
          })
        );
      });
    });

    tocItems.push(new PageBreak());

    return {
      properties: {},
      children: tocItems,
    };
  }

  /**
   * Create main content section with all template sections
   */
  private createMainContentSection(template: GrantTemplate, options: DocumentGenerationOptions) {
    const content = [];
    const { populatedSections } = options;

    // Add header and footer
    const header = new Header({
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: `${options.context.projectAcronym} - ${template.name}`,
              size: 20,
            }),
          ],
          alignment: AlignmentType.RIGHT,
        }),
      ],
    });

    const footer = new Footer({
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: 'Page ',
              size: 20,
            }),
            new TextRun({
              text: '1',
              size: 20,
            }),
          ],
          alignment: AlignmentType.CENTER,
        }),
      ],
    });

    // Process each template section
    template.sections.forEach((section, sectionIndex) => {
      // Section heading
      content.push(
        new Paragraph({
          text: `${sectionIndex + 1}. ${section.title}`,
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 600, after: 400 },
          numbering: {
            reference: 'main-numbering',
            level: 0,
          },
        })
      );

      // Section description
      if (section.description) {
        content.push(
          new Paragraph({
            text: section.description,
            style: 'italic',
            spacing: { after: 400 },
          })
        );
      }

      // Process subsections
      section.subsections.forEach((subsection, subsectionIndex) => {
        // Find populated content for this subsection
        const populatedContent = populatedSections.find(
          ps => ps.sectionId === section.id && ps.subsectionId === subsection.id
        );

        // Subsection heading
        content.push(
          new Paragraph({
            text: subsection.title,
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 300 },
            numbering: {
              reference: 'main-numbering',
              level: 1,
            },
          })
        );

        // Add content
        if (populatedContent?.content) {
          const contentParagraphs = this.parseContent(populatedContent.content);
          content.push(...contentParagraphs);
        } else if (subsection.templateContent) {
          // Use template content as fallback
          const contentParagraphs = this.parseContent(subsection.templateContent);
          content.push(...contentParagraphs);
        }

        // Add word count if specified
        if (subsection.wordLimit) {
          const wordCount = populatedContent?.content 
            ? populatedContent.content.split(/\s+/).length 
            : 0;
            
          content.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `[Word count: ${wordCount}/${subsection.wordLimit}]`,
                  italics: true,
                  size: 18,
                  color: '666666',
                }),
              ],
              alignment: AlignmentType.RIGHT,
              spacing: { before: 200, after: 400 },
            })
          );
        }
      });

      // Add page break after each major section (except last)
      if (sectionIndex < template.sections.length - 1) {
        content.push(new PageBreak());
      }
    });

    // Add consortium table if available
    if (options.context.consortium && options.context.consortium.length > 0) {
      content.push(new PageBreak());
      content.push(
        new Paragraph({
          text: 'Consortium Partners',
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 600, after: 400 },
        })
      );
      content.push(this.createConsortiumTable(options.context.consortium));
    }

    return {
      properties: {
        page: {
          margin: {
            top: 1440,
            bottom: 1440,
            left: 1440,
            right: 1440,
          },
        },
      },
      headers: { default: header },
      footers: { default: footer },
      children: content,
    };
  }

  /**
   * Parse markdown-style content into Word paragraphs
   */
  private parseContent(content: string): Paragraph[] {
    const paragraphs: Paragraph[] = [];
    const lines = content.split('\n');

    lines.forEach(line => {
      if (!line.trim()) {
        paragraphs.push(new Paragraph({ text: '', spacing: { after: 200 } }));
        return;
      }

      // Handle headings
      if (line.startsWith('###')) {
        paragraphs.push(
          new Paragraph({
            text: line.replace(/^###\s*/, ''),
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 300, after: 200 },
          })
        );
      } else if (line.startsWith('##')) {
        paragraphs.push(
          new Paragraph({
            text: line.replace(/^##\s*/, ''),
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 300 },
          })
        );
      } else if (line.startsWith('#')) {
        paragraphs.push(
          new Paragraph({
            text: line.replace(/^#\s*/, ''),
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 600, after: 400 },
          })
        );
      }
      // Handle bullet points
      else if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
        paragraphs.push(
          new Paragraph({
            text: line.replace(/^[•\-\*]\s*/, ''),
            bullet: { level: 0 },
            spacing: { after: 100 },
          })
        );
      }
      // Handle numbered lists
      else if (/^\d+\.\s/.test(line)) {
        paragraphs.push(
          new Paragraph({
            text: line.replace(/^\d+\.\s*/, ''),
            numbering: {
              reference: 'main-numbering',
              level: 0,
            },
            spacing: { after: 100 },
          })
        );
      }
      // Handle bold text (simple implementation)
      else if (line.includes('**')) {
        const parts = line.split('**');
        const children: TextRun[] = [];
        
        parts.forEach((part, index) => {
          if (index % 2 === 0) {
            children.push(new TextRun({ text: part }));
          } else {
            children.push(new TextRun({ text: part, bold: true }));
          }
        });
        
        paragraphs.push(
          new Paragraph({
            children,
            spacing: { after: 200 },
          })
        );
      }
      // Regular paragraph
      else {
        paragraphs.push(
          new Paragraph({
            text: line,
            spacing: { after: 200 },
          })
        );
      }
    });

    return paragraphs;
  }

  /**
   * Create consortium partners table
   */
  private createConsortiumTable(consortium: any[]) {
    const rows = [
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ 
              children: [new TextRun({ text: 'Partner', bold: true })] 
            })],
            shading: { fill: 'E0E0E0' },
          }),
          new TableCell({
            children: [new Paragraph({ 
              children: [new TextRun({ text: 'Country', bold: true })] 
            })],
            shading: { fill: 'E0E0E0' },
          }),
          new TableCell({
            children: [new Paragraph({ 
              children: [new TextRun({ text: 'Type', bold: true })] 
            })],
            shading: { fill: 'E0E0E0' },
          }),
          new TableCell({
            children: [new Paragraph({ 
              children: [new TextRun({ text: 'Role', bold: true })] 
            })],
            shading: { fill: 'E0E0E0' },
          }),
        ],
      }),
    ];

    consortium.forEach(partner => {
      rows.push(
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ text: partner.name || '' })] }),
            new TableCell({ children: [new Paragraph({ text: partner.country || '' })] }),
            new TableCell({ children: [new Paragraph({ text: partner.type || '' })] }),
            new TableCell({ children: [new Paragraph({ text: partner.role || '' })] }),
          ],
        })
      );
    });

    return new Table({
      rows,
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
      },
    });
  }

  /**
   * Generate PDF document
   */
  private async generatePDFDocument(
    template: GrantTemplate,
    options: DocumentGenerationOptions
  ): Promise<Blob> {
    const pdf = new jsPDF();
    let yPosition = 20;
    const pageHeight = pdf.internal.pageSize.height;
    const lineHeight = 7;
    const margin = 20;
    const pageWidth = pdf.internal.pageSize.width;

    // Helper function to add text with page break handling
    const addText = (text: string, fontSize: number = 12, bold: boolean = false) => {
      pdf.setFontSize(fontSize);
      if (bold) {
        pdf.setFont('helvetica', 'bold');
      } else {
        pdf.setFont('helvetica', 'normal');
      }

      const lines = pdf.splitTextToSize(text, pageWidth - 2 * margin);
      
      lines.forEach((line: string) => {
        if (yPosition + lineHeight > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }
        pdf.text(line, margin, yPosition);
        yPosition += lineHeight;
      });
    };

    // Add cover page
    if (options.includeCoverPage) {
      pdf.setFontSize(20);
      pdf.text(template.name, pageWidth / 2, 40, { align: 'center' });
      
      pdf.setFontSize(14);
      pdf.text(`Call: ${options.context.callIdentifier}`, pageWidth / 2, 60, { align: 'center' });
      
      pdf.setFontSize(18);
      pdf.text(options.context.projectTitle, pageWidth / 2, 100, { align: 'center' });
      
      pdf.setFontSize(16);
      pdf.text(options.context.projectAcronym, pageWidth / 2, 120, { align: 'center' });
      
      pdf.setFontSize(12);
      pdf.text(`Lead: ${options.context.organizationName}`, pageWidth / 2, 160, { align: 'center' });
      pdf.text(`Duration: ${options.context.duration} months`, pageWidth / 2, 170, { align: 'center' });
      pdf.text(`Budget: €${options.context.totalBudget.toLocaleString()}`, pageWidth / 2, 180, { align: 'center' });
      
      pdf.addPage();
      yPosition = margin;
    }

    // Add content sections
    template.sections.forEach((section, sectionIndex) => {
      addText(`${sectionIndex + 1}. ${section.title}`, 16, true);
      yPosition += 5;

      if (section.description) {
        addText(section.description, 10, false);
        yPosition += 3;
      }

      section.subsections.forEach((subsection, subsectionIndex) => {
        const populatedContent = options.populatedSections.find(
          ps => ps.sectionId === section.id && ps.subsectionId === subsection.id
        );

        addText(`${sectionIndex + 1}.${subsectionIndex + 1} ${subsection.title}`, 14, true);
        yPosition += 3;

        const content = populatedContent?.content || subsection.templateContent || '';
        
        // Clean and add content
        const cleanContent = content
          .replace(/#{1,3}\s*/g, '')
          .replace(/\*\*/g, '')
          .replace(/[•\-\*]\s*/g, '• ')
          .replace(/\[.*?\]/g, '');
        
        addText(cleanContent, 11, false);
        yPosition += 5;

        if (subsection.wordLimit && populatedContent?.content) {
          const wordCount = populatedContent.content.split(/\s+/).length;
          pdf.setFontSize(9);
          pdf.setTextColor(100, 100, 100);
          pdf.text(`[Word count: ${wordCount}/${subsection.wordLimit}]`, pageWidth - margin - 50, yPosition);
          pdf.setTextColor(0, 0, 0);
          yPosition += 5;
        }
      });

      // Add page break after each section except the last
      if (sectionIndex < template.sections.length - 1) {
        pdf.addPage();
        yPosition = margin;
      }
    });

    // Return as blob
    return pdf.output('blob');
  }

  /**
   * Generate HTML document
   */
  private async generateHTMLDocument(
    template: GrantTemplate,
    options: DocumentGenerationOptions
  ): Promise<Blob> {
    const { context, populatedSections } = options;
    
    let html = `
<!DOCTYPE html>
<html lang="${options.language}">
<head>
    <meta charset="UTF-8">
    <title>${context.projectTitle} - ${template.name}</title>
    <style>
        @page { 
            size: A4; 
            margin: 2cm;
        }
        body {
            font-family: 'Times New Roman', serif;
            font-size: 12pt;
            line-height: 1.6;
            color: #000;
            max-width: 210mm;
            margin: 0 auto;
            padding: 20mm;
        }
        h1 {
            font-size: 16pt;
            font-weight: bold;
            margin-top: 24pt;
            margin-bottom: 12pt;
            page-break-after: avoid;
        }
        h2 {
            font-size: 14pt;
            font-weight: bold;
            margin-top: 18pt;
            margin-bottom: 12pt;
            page-break-after: avoid;
        }
        h3 {
            font-size: 12pt;
            font-weight: bold;
            margin-top: 12pt;
            margin-bottom: 6pt;
            page-break-after: avoid;
        }
        p {
            margin-bottom: 12pt;
            text-align: justify;
        }
        .cover-page {
            text-align: center;
            page-break-after: always;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        .toc {
            page-break-after: always;
        }
        .toc-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 6pt;
        }
        .toc-title { flex-grow: 1; }
        .toc-dots { 
            flex-grow: 0; 
            border-bottom: 1px dotted #000;
            margin: 0 5px;
            min-width: 50px;
        }
        .toc-page { flex-shrink: 0; }
        .section {
            page-break-before: always;
        }
        .word-count {
            text-align: right;
            font-style: italic;
            color: #666;
            font-size: 10pt;
            margin-top: 6pt;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 12pt 0;
        }
        th, td {
            border: 1px solid #000;
            padding: 6pt;
            text-align: left;
        }
        th {
            background-color: #f0f0f0;
            font-weight: bold;
        }
        @media print {
            .section { page-break-before: always; }
            .cover-page { page-break-after: always; }
            .toc { page-break-after: always; }
        }
    </style>
</head>
<body>`;

    // Add cover page
    if (options.includeCoverPage) {
      html += `
    <div class="cover-page">
        <h1 style="font-size: 24pt;">${template.name}</h1>
        <p style="font-size: 14pt; margin-top: 20pt;">
            <strong>Call Identifier:</strong> ${context.callIdentifier}
        </p>
        <h2 style="font-size: 20pt; margin-top: 40pt;">${context.projectTitle}</h2>
        <h3 style="font-size: 18pt;">${context.projectAcronym}</h3>
        <div style="margin-top: 60pt;">
            <p><strong>Lead Organization:</strong> ${context.organizationName}</p>
            <p><strong>Duration:</strong> ${context.duration} months</p>
            <p><strong>Total Budget:</strong> €${context.totalBudget.toLocaleString()}</p>
            <p><strong>EU Funding Requested:</strong> €${context.requestedFunding.toLocaleString()}</p>
        </div>
    </div>`;
    }

    // Add table of contents
    if (options.includeToc) {
      html += `
    <div class="toc">
        <h1>Table of Contents</h1>`;
      
      let pageNum = 3; // Start after cover and TOC
      template.sections.forEach((section, sIdx) => {
        html += `
        <div class="toc-item">
            <span class="toc-title"><strong>${sIdx + 1}. ${section.title}</strong></span>
            <span class="toc-dots"></span>
            <span class="toc-page">${pageNum++}</span>
        </div>`;
        
        section.subsections.forEach((subsection, ssIdx) => {
          html += `
        <div class="toc-item" style="margin-left: 20pt;">
            <span class="toc-title">${sIdx + 1}.${ssIdx + 1} ${subsection.title}</span>
            <span class="toc-dots"></span>
            <span class="toc-page">${pageNum++}</span>
        </div>`;
        });
      });
      
      html += `</div>`;
    }

    // Add main content
    template.sections.forEach((section, sectionIndex) => {
      const isFirstSection = sectionIndex === 0;
      html += `
    <div class="${!isFirstSection ? 'section' : ''}">
        <h1>${sectionIndex + 1}. ${section.title}</h1>`;
      
      if (section.description) {
        html += `<p><em>${section.description}</em></p>`;
      }

      section.subsections.forEach((subsection, subsectionIndex) => {
        const populatedContent = populatedSections.find(
          ps => ps.sectionId === section.id && ps.subsectionId === subsection.id
        );

        html += `
        <h2>${sectionIndex + 1}.${subsectionIndex + 1} ${subsection.title}</h2>`;

        const content = populatedContent?.content || subsection.templateContent || '';
        
        // Convert markdown-style content to HTML
        const htmlContent = content
          .replace(/### (.*)/g, '<h3>$1</h3>')
          .replace(/## (.*)/g, '<h3>$1</h3>')
          .replace(/# (.*)/g, '<h3>$1</h3>')
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/• (.*)/g, '<li>$1</li>')
          .replace(/\n\n/g, '</p><p>')
          .replace(/\n/g, '<br>');
        
        html += `<p>${htmlContent}</p>`;

        if (subsection.wordLimit && populatedContent?.content) {
          const wordCount = populatedContent.content.split(/\s+/).length;
          html += `<p class="word-count">[Word count: ${wordCount}/${subsection.wordLimit}]</p>`;
        }
      });

      html += `</div>`;
    });

    // Add consortium table
    if (context.consortium && context.consortium.length > 0) {
      html += `
    <div class="section">
        <h1>Consortium Partners</h1>
        <table>
            <thead>
                <tr>
                    <th>Partner</th>
                    <th>Country</th>
                    <th>Type</th>
                    <th>Role</th>
                </tr>
            </thead>
            <tbody>`;
      
      context.consortium.forEach(partner => {
        html += `
                <tr>
                    <td>${partner.name || ''}</td>
                    <td>${partner.country || ''}</td>
                    <td>${partner.type || ''}</td>
                    <td>${partner.role || ''}</td>
                </tr>`;
      });
      
      html += `
            </tbody>
        </table>
    </div>`;
    }

    html += `
    <footer style="margin-top: 50pt; padding-top: 20pt; border-top: 1px solid #ccc;">
        <p style="font-size: 10pt; color: #666; text-align: center;">
            Generated by EU Grant Assistant - ${new Date().toLocaleDateString()}
        </p>
    </footer>
</body>
</html>`;

    return new Blob([html], { type: 'text/html' });
  }
}

export const enhancedDocumentGenerator = new EnhancedDocumentGenerator();