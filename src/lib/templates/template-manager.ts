import {
  GrantTemplate,
  TemplateContext,
  TemplatePopulationResult,
  TemplateValidation,
  ValidationError,
  ValidationWarning,
  TemplateSection,
  TemplateSubSection
} from './template-types';
import { HORIZON_TEMPLATES, getTemplateById } from './horizon-europe-templates';
import { UKRAINE_SPECIFIC_TEMPLATES } from './ukraine-templates';
import { CERV_UKRAINE_TEMPLATE } from './cerv-template';

export class TemplateManager {
  private templates: Map<string, GrantTemplate>;

  constructor() {
    this.templates = new Map();
    // Load Horizon Europe templates
    HORIZON_TEMPLATES.forEach(template => {
      this.templates.set(template.id, template);
    });
    // Load Ukraine-specific templates
    UKRAINE_SPECIFIC_TEMPLATES.forEach(template => {
      this.templates.set(template.id, template);
    });
    // Load CERV template
    this.templates.set(CERV_UKRAINE_TEMPLATE.id, CERV_UKRAINE_TEMPLATE);
  }

  /**
   * Select the most appropriate template based on context
   */
  selectTemplate(context: Partial<TemplateContext>): GrantTemplate | null {
    // Priority criteria for template selection
    const candidates = Array.from(this.templates.values()).filter(template => {
      // Filter by program type if specified
      if (context.callIdentifier) {
        if (context.callIdentifier.includes('HORIZON') && template.programType !== 'EU_HORIZON') {
          return false;
        }
      }

      // Filter by budget range
      if (context.totalBudget) {
        const budgetRange = template.metadata.typicalBudget;
        // Parse budget range (e.g., "€2-5 million")
        const matches = budgetRange.match(/€(\d+)-(\d+)/);
        if (matches) {
          const [, min, max] = matches;
          const budgetInMillions = context.totalBudget / 1000000;
          if (budgetInMillions < parseInt(min) || budgetInMillions > parseInt(max)) {
            return false;
          }
        }
      }

      // Filter by TRL if applicable
      if (context.trlStart && context.trlEnd && template.metadata.trlRange) {
        const trlMatches = template.metadata.trlRange.match(/TRL (\d)-(\d)/);
        if (trlMatches) {
          const [, trlMin, trlMax] = trlMatches;
          if (context.trlStart < parseInt(trlMin) || context.trlEnd > parseInt(trlMax)) {
            return false;
          }
        }
      }

      return true;
    });

    // Score candidates based on match quality
    const scored = candidates.map(template => {
      let score = 0;

      // Exact call match
      if (context.callIdentifier?.includes(template.actionType)) {
        score += 10;
      }

      // Organization type match
      if (context.organizationType === 'University' && template.actionType === 'RIA') {
        score += 5;
      } else if (context.organizationType === 'SME' && template.actionType === 'IA') {
        score += 5;
      }

      // Consortium size match
      if (context.consortium) {
        const partnerCount = context.consortium.length;
        if (partnerCount >= 3 && partnerCount <= 10) {
          score += 3;
        }
      }

      // Ukraine involvement - higher priority
      if (context.consortium?.some(p => p.country === 'UA')) {
        score += 5; // Higher bonus for Ukraine cooperation
        
        // Extra bonus for Ukraine-specific templates
        if (template.metadata.ukraineSpecific) {
          score += 10;
        }
      }
      
      // Prefer Ukraine-specific programs for Ukrainian organizations
      if (context.organizationType && context.organizationName?.includes('Ukraine')) {
        if (template.programType === 'MSCA4UKRAINE' || 
            template.programType === 'RECONSTRUCTION' ||
            template.programType === 'BILATERAL_DE_UA') {
          score += 8;
        }
      }

      return { template, score };
    });

    // Return highest scoring template
    scored.sort((a, b) => b.score - a.score);
    return scored[0]?.template || null;
  }

  /**
   * Populate template with context data
   */
  populateTemplate(
    templateId: string,
    context: TemplateContext
  ): TemplatePopulationResult[] {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    const results: TemplatePopulationResult[] = [];

    template.sections.forEach(section => {
      section.subsections.forEach(subsection => {
        const populatedContent = this.populateSubsection(subsection, context);
        
        results.push({
          sectionId: section.id,
          subsectionId: subsection.id,
          content: populatedContent.content,
          fields: populatedContent.fields,
          completeness: this.calculateCompleteness(populatedContent.content, subsection),
          missingRequirements: this.identifyMissingRequirements(populatedContent.content, subsection)
        });
      });
    });

    return results;
  }

  /**
   * Populate a subsection with context data
   */
  private populateSubsection(
    subsection: TemplateSubSection,
    context: TemplateContext
  ): { content: string; fields: Record<string, any> } {
    let content = subsection.templateContent || '';
    const fields: Record<string, any> = {};

    // Replace placeholders with context data
    const replacements: Record<string, string> = {
      '[PROJECT_ACRONYM]': context.projectAcronym,
      '[PROJECT_TITLE]': context.projectTitle,
      '[ORGANIZATION_NAME]': context.organizationName,
      '[CALL_IDENTIFIER]': context.callIdentifier,
      '[CALL_TOPIC]': context.callIdentifier,
      '[DURATION]': context.duration.toString(),
      '[TOTAL_BUDGET]': this.formatBudget(context.totalBudget),
      '[EU_FUNDING]': this.formatBudget(context.requestedFunding),
      '[NUMBER]': context.consortium.length.toString(),
      '[COORDINATOR_NAME]': context.consortium.find(p => p.role === 'Coordinator')?.name || context.organizationName,
      '[COUNTRIES]': [...new Set(context.consortium.map(p => p.country))].join(', '),
      '[TRL_START]': context.trlStart?.toString() || 'TBD',
      '[TRL_TARGET]': context.trlEnd?.toString() || 'TBD',
      '[ABSTRACT]': context.abstract,
      '[KEYWORDS]': context.keywords.join(', ')
    };

    // Perform replacements
    Object.entries(replacements).forEach(([placeholder, value]) => {
      content = content.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), value);
    });

    // Handle consortium-specific replacements
    if (context.consortium.length > 0) {
      const partnerList = context.consortium
        .map((p, i) => `P${i + 1}: ${p.name} (${p.country}) - ${p.type}`)
        .join('\n');
      content = content.replace(/\[PARTNER_LIST\]/g, partnerList);
    }

    // Handle Ukrainian partner specific content
    const ukrainianPartner = context.consortium.find(p => p.country === 'UA');
    if (ukrainianPartner) {
      content = content.replace(/\[UKRAINIAN_PARTNER\]/g, ukrainianPartner.name);
      content = content.replace(/\[UKRAINIAN_SPECIFIC_CONTRIBUTION\]/g, 
        `Expertise in Eastern European markets, access to Ukrainian research infrastructure, contribution to EU-Ukraine cooperation`);
    } else {
      // Remove Ukrainian-specific sections if no Ukrainian partner
      content = content.replace(/.*Ukrainian partner.*\n?/g, '');
    }

    // Populate field values
    subsection.fields?.forEach(field => {
      switch (field.id) {
        case 'main_goal':
          fields[field.id] = context.abstract.split('.')[0];
          break;
        case 'num_partners':
          fields[field.id] = context.consortium.length;
          break;
        case 'total_budget':
          fields[field.id] = context.totalBudget;
          break;
        case 'project_duration':
          fields[field.id] = context.duration;
          break;
        default:
          fields[field.id] = null;
      }
    });

    return { content, fields };
  }

  /**
   * Validate populated template
   */
  validateTemplate(
    results: TemplatePopulationResult[],
    template: GrantTemplate
  ): TemplateValidation {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    let totalCompleteness = 0;
    let sectionCount = 0;

    template.sections.forEach(section => {
      section.subsections.forEach(subsection => {
        const result = results.find(
          r => r.sectionId === section.id && r.subsectionId === subsection.id
        );

        if (!result) {
          errors.push({
            sectionId: section.id,
            subsectionId: subsection.id,
            message: `Subsection ${subsection.title} is missing`,
            severity: 'critical'
          });
          return;
        }

        // Check word count
        const wordCount = this.countWords(result.content);
        if (subsection.wordLimit && wordCount > subsection.wordLimit) {
          errors.push({
            sectionId: section.id,
            subsectionId: subsection.id,
            message: `Exceeds word limit (${wordCount}/${subsection.wordLimit})`,
            severity: 'error'
          });
        } else if (subsection.wordLimit && wordCount < subsection.wordLimit * 0.5) {
          warnings.push({
            sectionId: section.id,
            subsectionId: subsection.id,
            message: `Content seems short (${wordCount}/${subsection.wordLimit})`,
            suggestion: 'Consider expanding with more details'
          });
        }

        // Check for remaining placeholders
        const placeholders = result.content.match(/\[[A-Z_]+\]/g);
        if (placeholders && placeholders.length > 0) {
          errors.push({
            sectionId: section.id,
            subsectionId: subsection.id,
            message: `Unfilled placeholders: ${placeholders.join(', ')}`,
            severity: 'error'
          });
        }

        // Check required fields
        subsection.fields?.forEach(field => {
          if (field.required && !result.fields[field.id]) {
            errors.push({
              sectionId: section.id,
              subsectionId: subsection.id,
              fieldId: field.id,
              message: `Required field "${field.label}" is missing`,
              severity: 'error'
            });
          }
        });

        totalCompleteness += result.completeness;
        sectionCount++;
      });
    });

    // Overall validation
    const avgCompleteness = sectionCount > 0 ? totalCompleteness / sectionCount : 0;

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      completeness: avgCompleteness
    };
  }

  /**
   * Generate AI prompts for specific sections
   */
  generateAIPrompt(
    templateId: string,
    sectionId: string,
    subsectionId: string,
    context: TemplateContext
  ): string {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    const section = template.sections.find(s => s.id === sectionId);
    const subsection = section?.subsections.find(s => s.id === subsectionId);

    if (!section || !subsection) {
      throw new Error(`Section/subsection not found`);
    }

    let prompt = `Generate content for Horizon Europe ${template.actionType} proposal:
    
Section: ${section.title} (${section.weight}% evaluation weight)
Subsection: ${subsection.title}

CONTEXT:
- Project: ${context.projectTitle} (${context.projectAcronym})
- Call: ${context.callIdentifier}
- Duration: ${context.duration} months
- Budget: €${context.totalBudget}
- Consortium: ${context.consortium.length} partners from ${[...new Set(context.consortium.map(p => p.country))].join(', ')}
${context.consortium.some(p => p.country === 'UA') ? '- Ukrainian partner included for EU-Ukraine cooperation' : ''}

REQUIREMENTS:
`;

    // Add evaluation criteria
    if (subsection.evaluationCriteria && subsection.evaluationCriteria.length > 0) {
      prompt += `\nEVALUATION CRITERIA:\n`;
      subsection.evaluationCriteria.forEach(criterion => {
        prompt += `• ${criterion}\n`;
      });
    }

    // Add tips
    if (subsection.tips && subsection.tips.length > 0) {
      prompt += `\nKEY POINTS TO ADDRESS:\n`;
      subsection.tips.forEach(tip => {
        prompt += `• ${tip}\n`;
      });
    }

    // Add template structure
    if (subsection.templateContent) {
      prompt += `\nUSE THIS STRUCTURE AS GUIDE:\n${subsection.templateContent.substring(0, 500)}...\n`;
    }

    // Add word limit
    if (subsection.wordLimit) {
      prompt += `\nWORD LIMIT: ${subsection.wordLimit} words\n`;
    }

    prompt += `\nGenerate professional, specific content that:
1. Directly addresses all evaluation criteria
2. Uses Horizon Europe terminology
3. Includes specific, measurable targets
4. Highlights innovation and EU added value
5. Emphasizes Ukraine cooperation benefits if applicable`;

    return prompt;
  }

  /**
   * Merge AI-generated content with template
   */
  mergeAIContent(
    templateResult: TemplatePopulationResult,
    aiContent: string
  ): TemplatePopulationResult {
    // Smart merge: Keep template structure but enhance with AI content
    let mergedContent = templateResult.content;

    // Replace generic placeholders with AI-generated specifics
    const aiParagraphs = aiContent.split('\n\n');
    const templateParagraphs = mergedContent.split('\n\n');

    templateParagraphs.forEach((para, index) => {
      // If paragraph contains many placeholders, replace with AI content
      const placeholderCount = (para.match(/\[[A-Z_]+\]/g) || []).length;
      if (placeholderCount > 3 && aiParagraphs[index]) {
        templateParagraphs[index] = aiParagraphs[index];
      }
    });

    mergedContent = templateParagraphs.join('\n\n');

    return {
      ...templateResult,
      content: mergedContent,
      completeness: this.calculateCompleteness(mergedContent, null)
    };
  }

  // Helper methods
  private formatBudget(amount: number): string {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)}k`;
    }
    return amount.toString();
  }

  private countWords(text: string): number {
    return text.split(/\s+/).filter(word => word.length > 0).length;
  }

  private calculateCompleteness(content: string, subsection: TemplateSubSection | null): number {
    if (!content) return 0;

    let score = 0;
    let maxScore = 100;

    // Check for placeholders (negative score)
    const placeholders = content.match(/\[[A-Z_]+\]/g) || [];
    score -= placeholders.length * 5;

    // Check word count
    const wordCount = this.countWords(content);
    if (subsection?.wordLimit) {
      const ratio = wordCount / subsection.wordLimit;
      if (ratio >= 0.8) score += 30;
      else if (ratio >= 0.6) score += 20;
      else if (ratio >= 0.4) score += 10;
    } else {
      if (wordCount > 100) score += 20;
    }

    // Check for key sections
    if (content.includes('Objective')) score += 10;
    if (content.includes('Method')) score += 10;
    if (content.includes('Impact')) score += 10;
    if (content.includes('Innovation')) score += 10;
    if (content.includes('Ukraine') || content.includes('Ukrainian')) score += 10;

    // Check for structured content
    if (content.includes('•') || content.includes('1.') || content.includes('-')) score += 10;
    if (content.includes('**') || content.includes('##')) score += 10;

    return Math.max(0, Math.min(100, score));
  }

  private identifyMissingRequirements(
    content: string,
    subsection: TemplateSubSection
  ): string[] {
    const missing: string[] = [];

    // Check for evaluation criteria coverage
    subsection.evaluationCriteria?.forEach(criterion => {
      const keywords = criterion.toLowerCase().split(' ').filter(w => w.length > 4);
      const found = keywords.some(keyword => content.toLowerCase().includes(keyword));
      if (!found) {
        missing.push(`Missing: ${criterion}`);
      }
    });

    // Check for mandatory elements
    if (subsection.requiredAttachments) {
      subsection.requiredAttachments.forEach(attachment => {
        if (!content.includes(attachment)) {
          missing.push(`Required attachment reference: ${attachment}`);
        }
      });
    }

    return missing;
  }

  // Public methods for template management
  addTemplate(template: GrantTemplate): void {
    this.templates.set(template.id, template);
  }

  getTemplate(id: string): GrantTemplate | undefined {
    return this.templates.get(id);
  }

  getAllTemplates(): GrantTemplate[] {
    return Array.from(this.templates.values());
  }

  getTemplatesByProgram(programType: string): GrantTemplate[] {
    return Array.from(this.templates.values()).filter(t => t.programType === programType);
  }
}

// Export singleton instance
export const templateManager = new TemplateManager();