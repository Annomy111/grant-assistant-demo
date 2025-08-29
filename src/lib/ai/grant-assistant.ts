import { deepseek } from './deepseek';
import { templateManager } from '../templates/template-manager';
import { 
  TemplateContext, 
  GrantTemplate as NewGrantTemplate,
  TemplatePopulationResult 
} from '../templates/template-types';

export interface GrantSection {
  id: string;
  title: string;
  description: string;
  required: boolean;
  maxWords?: number;
  tips?: string[];
  examples?: string[];
}

export interface GrantTemplate {
  programType: string;
  name: string;
  sections: GrantSection[];
  language: string;
}

export const EU_HORIZON_TEMPLATE: GrantTemplate = {
  programType: 'EU_HORIZON',
  name: 'EU Horizon Europe',
  language: 'de',
  sections: [
    {
      id: 'excellence',
      title: 'Excellence',
      description: 'Objectives and ambition, methodology',
      required: true,
      maxWords: 15000,
      tips: [
        'Clearly articulate the project objectives',
        'Explain the innovative aspects',
        'Describe the methodology in detail',
      ],
      examples: [
        'The project aims to develop innovative solutions for...',
        'Our approach combines cutting-edge research with...',
      ],
    },
    {
      id: 'impact',
      title: 'Impact',
      description: 'Expected outcomes, dissemination and exploitation',
      required: true,
      maxWords: 10000,
      tips: [
        'Describe expected outcomes and impacts',
        'Explain dissemination and exploitation strategies',
        'Include measures to maximize impact',
      ],
    },
    {
      id: 'implementation',
      title: 'Implementation',
      description: 'Work plan, resources, consortium',
      required: true,
      maxWords: 10000,
      tips: [
        'Provide detailed work packages',
        'Justify resource allocation',
        'Demonstrate consortium competence',
      ],
    },
  ],
};

export class GrantAssistant {
  private getSystemPrompt(language: string, templateType?: string): string {
    const basePrompt = {
      de: `Du bist ein EU-Förderexperte des Deutsch-Ukrainischen Büros und unterstützt NGOs bei EU-Förderanträgen.`,
      en: `You are an EU funding expert from the German-Ukrainian Bureau supporting NGOs with EU grant applications.`,
      uk: `Ви експерт з грантових заявок ЄС з Німецько-Українського Бюро і допомагаєте НУО з заявками на фінансування ЄС.`
    };

    // Template-specific prompts
    const templatePrompts: Record<string, string> = {
      'HORIZON': `
      HORIZON EUROPE 2025 SPEZIFIKA:
      - Cluster 2 Budget: €438M (+34% vs 2024)
      - Förderquote: 100% für Forschung (RIA), 60-70% für Innovation (IA)
      - Ukraine: Vollständig assoziiert seit 09.06.2022
      - Deadlines: 16. Sept 2025 (First Stage), 17. März 2026 (Second Stage)
      - Struktur: Excellence (50%) → Impact (30%) → Implementation (20%)
      - Verwende Horizon Terminologie: Work Packages, Deliverables, TRL-Levels`,
      
      'CERV': `
      CERV PROGRAMM 2025 SPEZIFIKA:
      - Ukraine assoziiert seit 09.01.2024
      - Förderquote: 90% für alle Aktivitäten
      - Budget: €1-3 Million typisch pro Projekt
      - Schwerpunkte: Demokratie, Gleichheit, Rechte, Daphne
      - CERV-2025-CHILD: Deadline 29. April 2025 (Ukraine-Fokus)
      - Struktur: Relevance → Quality → Impact → Dissemination
      - Betone: Zivilgesellschaft, EU-Werte, Ukraine-Unterstützung`,
      
      'ERASMUS': `
      ERASMUS+ CAPACITY BUILDING UKRAINE:
      - Förderquote: 80-100% je nach Aktivität
      - Budget: €500k-1M für CBHE Projekte
      - Dauer: 24-36 Monate
      - Fokus: Hochschulbildung, Modernisierung, Kapazitätsaufbau
      - Ukraine: Prioritätsland für 2025-2027
      - Betone: Bildungskooperation, Institutional Development, Student Mobility`,
      
      'DAAD': `
      DAAD DEUTSCH-UKRAINISCHE NETZWERKE:
      - Förderung: bis €200k pro Jahr
      - Dauer: bis 4 Jahre
      - Fokus: Hochschulpartnerschaften DE-UA
      - Aktivitäten: Austausch, gemeinsame Lehre, Forschungskooperation
      - Betone: Nachhaltige Partnerschaften, Wiederaufbau Ukraine, Brain Gain`,
      
      'UKRAINE_FACILITY': `
      UKRAINE FACILITY - CIVIL SOCIETY:
      - Budget: €50M für Zivilgesellschaft 2025-2027
      - Förderquote: 95-100%
      - Fokus: Demokratischer Wiederaufbau, Governance, Rule of Law
      - Schnellverfahren für Notfallhilfe
      - Betone: Resilienz, lokale Ownership, EU-Integration`,
      
      'MSCA': `
      MSCA4UKRAINE:
      - Fellowship-Programm für ukrainische Forschende
      - €26k Lebenshaltung + €1k Mobilität/Monat
      - Dauer: 6-24 Monate
      - Host: EU/Assoziierte Länder
      - Aktuell: Nur Management-Call, keine neuen Fellowships 2025`
    };

    let prompt = basePrompt[language as keyof typeof basePrompt] || basePrompt.en;
    
    // Add template-specific context
    if (templateType) {
      const specificPrompt = Object.entries(templatePrompts).find(([key]) => 
        templateType.toUpperCase().includes(key)
      )?.[1];
      
      if (specificPrompt) {
        prompt += '\n\n' + specificPrompt;
      }
    }
    
    prompt += `
    
    DEINE AUFGABE:
    1. Antworte IMMER programmspezifisch
    2. Verwende die korrekte Terminologie des jeweiligen Förderprogramms
    3. Betone EU-Ukraine Kooperation wo relevant
    4. Gib konkrete, umsetzbare Tipps
    
    ANTWORT-STIL:
    - Kurz und präzise (max 3-4 Sätze pro Punkt)
    - Verwende Bullet Points für Übersichtlichkeit
    - Sei spezifisch mit Anforderungen und Deadlines
    - Motivierend aber realistisch`;
    
    return prompt;
  }

  private systemPrompts = {
    de: this.getSystemPrompt('de', 'HORIZON'),
    
    uk: `Ви експерт з грантових заявок ЄС і допомагаєте організаціям громадянського суспільства у створенні заявок на фінансування.
    
    Ваші завдання:
    1. Проводьте користувача крок за кроком через процес подання заявки
    2. Ставте цільові питання для збору всієї необхідної інформації
    3. Формулюйте професійні та переконливі тексти заявок
    4. Звертайте увагу на конкретні вимоги відповідної програми фінансування
    5. Використовуйте чітку, точну та професійну мову`,
    
    en: `You are an expert in EU grant applications and support civil society organizations in creating funding applications.
    
    Your tasks:
    1. Guide the user step by step through the application process
    2. Ask targeted questions to gather all necessary information
    3. Formulate professional and convincing application texts
    4. Pay attention to the specific requirements of the funding program
    5. Use clear, precise and professional language`,
  };

  async generateSectionContent(
    section: GrantSection,
    userInput: string,
    context: Record<string, any>,
    language: string = 'de'
  ): Promise<string> {
    // Determine template type from context
    const templateType = context.templateId || context.programType || 'HORIZON';
    
    const messages = [
      {
        role: 'system' as const,
        content: this.getSystemPrompt(language, templateType),
      },
      {
        role: 'user' as const,
        content: `${templateType.includes('CERV') ? 'CERV PROGRAMME' : 
                   templateType.includes('ERASMUS') ? 'ERASMUS+' :
                   templateType.includes('DAAD') ? 'DAAD' :
                   templateType.includes('FACILITY') ? 'UKRAINE FACILITY' :
                   templateType.includes('MSCA') ? 'MSCA4UKRAINE' :
                   'HORIZON EUROPE'} ${section.title.toUpperCase()} SECTION:
        
        ${section.title === 'Excellence' ? `
        EVALUATIONSKRITERIEN (Gewichtung 50%):
        • Objectives & Ambition: Klarheit, Relevanz zu 2025 Work Programme
        • Methodology: Soundness, TRL advancement (typisch TRL 3-6)
        • Beyond State-of-Art: Innovation, interdisciplinary approach
        
        2025 FOKUS:
        - Cultural Heritage: €82.5M Budget
        - Democracy & Autocracy Research: €10.5M für autocratic appeal
        - Ukraine-Kooperation: Verpflichtend in bestimmten Topics
        
        STRUKTUR:
        1.1 Objectives (link to Cluster 2 2025 expected outcomes)
        1.2 Relation to work programme 
        1.3 Methodology (work plan, TRL levels)
        1.4 Ambition & Innovation
        ` : ''}
        
        ${section.title === 'Impact' ? `
        EVALUATIONSKRITERIEN (Gewichtung 30%):
        • Project's pathways to impact
        • Measures to maximize impact
        • Communication, dissemination, exploitation
        
        STRUKTUR:
        2.1 Expected impacts (short/medium/long-term)
        2.2 Dissemination & exploitation measures
        2.3 Communication activities
        ` : ''}
        
        ${section.title === 'Implementation' ? `
        EVALUATIONSKRITERIEN (Gewichtung 20%):
        • Work plan quality & effectiveness
        • Consortium capability
        • Resources appropriateness
        
        STRUKTUR:
        3.1 Work packages & deliverables
        3.2 Consortium composition
        3.3 Resources & budget
        ` : ''}
        
        ORGANISATION: ${context.organizationName || 'Nicht angegeben'}
        PROJEKT-INPUT: ${userInput}
        
        Erstelle einen HORIZON EUROPE konformen Text. 
        Nutze offizielle Terminologie und achte auf Evaluationskriterien!`,
      },
    ];

    return await deepseek.generateCompletion(messages, 'deepseek-chat', 0.7, 2000);
  }

  async reviewContent(
    content: string,
    section: GrantSection,
    language: string = 'de'
  ): Promise<string> {
    const messages = [
      {
        role: 'system' as const,
        content: this.systemPrompts[language as keyof typeof this.systemPrompts] || this.systemPrompts.en,
      },
      {
        role: 'user' as const,
        content: `Bitte überprüfe und verbessere den folgenden Antragstext für den Abschnitt "${section.title}":
        
        ${content}
        
        Prüfe auf:
        1. Vollständigkeit und Relevanz
        2. Klarheit und Struktur
        3. Übereinstimmung mit Förderkriterien
        4. Sprachliche Qualität
        
        Gib konkrete Verbesserungsvorschläge.`,
      },
    ];

    return await deepseek.generateCompletion(messages, 'deepseek-chat', 0.5, 1500);
  }

  async suggestNextSteps(
    currentStep: string,
    completedSections: string[],
    language: string = 'de'
  ): Promise<string> {
    const messages = [
      {
        role: 'system' as const,
        content: this.systemPrompts[language as keyof typeof this.systemPrompts] || this.systemPrompts.en,
      },
      {
        role: 'user' as const,
        content: `Der Nutzer ist beim Schritt "${currentStep}" im Antragsprozess.
        
        Bereits abgeschlossene Abschnitte: ${completedSections.join(', ') || 'keine'}
        
        Was sind die nächsten empfohlenen Schritte? Gib eine kurze, klare Anleitung.`,
      },
    ];

    return await deepseek.generateCompletion(messages, 'deepseek-chat', 0.5, 500);
  }

  async answerQuestion(
    question: string,
    context: Record<string, any>,
    language: string = 'de'
  ): Promise<string> {
    // Determine template type from context
    const templateType = context.templateId || context.programType || 'HORIZON';
    
    const messages = [
      {
        role: 'system' as const,
        content: this.getSystemPrompt(language, templateType),
      },
      {
        role: 'user' as const,
        content: question,
      },
    ];

    return await deepseek.generateCompletion(messages, 'deepseek-chat', 0.7, 1000);
  }

  /**
   * Generate content using templates
   */
  async generateWithTemplate(
    templateId: string,
    sectionId: string,
    subsectionId: string,
    context: TemplateContext,
    userInput?: string
  ): Promise<string> {
    // Get the AI prompt from template manager
    const prompt = templateManager.generateAIPrompt(
      templateId,
      sectionId,
      subsectionId,
      context
    );

    // Add user input if provided
    const fullPrompt = userInput 
      ? `${prompt}\n\nUSER INPUT TO INCORPORATE:\n${userInput}`
      : prompt;

    const messages = [
      {
        role: 'system' as const,
        content: `You are a Horizon Europe grant writing expert. Generate high-quality, specific content for grant proposals.
        
        IMPORTANT INSTRUCTIONS:
        1. Use formal, professional academic writing style
        2. Be specific with numbers, dates, and measurable outcomes
        3. Reference actual Horizon Europe terminology and requirements
        4. Emphasize innovation, EU added value, and impact
        5. Include Ukraine cooperation benefits where applicable
        6. Avoid generic statements - be concrete and project-specific`,
      },
      {
        role: 'user' as const,
        content: fullPrompt,
      },
    ];

    const aiContent = await deepseek.generateCompletion(messages, 'deepseek-chat', 0.7, 3000);

    // Get template results
    const templateResults = templateManager.populateTemplate(templateId, context);
    const relevantResult = templateResults.find(
      r => r.sectionId === sectionId && r.subsectionId === subsectionId
    );

    if (relevantResult) {
      // Merge AI content with template
      const merged = templateManager.mergeAIContent(relevantResult, aiContent);
      return merged.content;
    }

    return aiContent;
  }

  /**
   * Select best template for a project
   */
  async selectTemplate(context: Partial<TemplateContext>): Promise<NewGrantTemplate | null> {
    return templateManager.selectTemplate(context);
  }

  /**
   * Get all available templates
   */
  getAvailableTemplates(language?: string): NewGrantTemplate[] {
    const allTemplates = templateManager.getAllTemplates();
    if (language) {
      return allTemplates.filter(t => t.language === language);
    }
    return allTemplates;
  }

  /**
   * Validate grant proposal using template
   */
  async validateProposal(
    templateId: string,
    content: TemplatePopulationResult[]
  ): Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
    completeness: number;
  }> {
    const template = templateManager.getTemplate(templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    const validation = templateManager.validateTemplate(content, template);
    
    return {
      isValid: validation.isValid,
      errors: validation.errors.map(e => e.message),
      warnings: validation.warnings.map(w => `${w.message} - ${w.suggestion || ''}`),
      completeness: validation.completeness
    };
  }

  /**
   * Generate full proposal structure from template
   */
  async generateFullProposal(
    context: TemplateContext,
    language: string = 'en'
  ): Promise<{
    template: NewGrantTemplate;
    sections: TemplatePopulationResult[];
    validation: any;
  }> {
    // Select appropriate template
    const template = templateManager.selectTemplate(context);
    if (!template) {
      throw new Error('No suitable template found for the given context');
    }

    // Populate template with context
    const sections = templateManager.populateTemplate(template.id, context);

    // Validate the populated template
    const validation = templateManager.validateTemplate(sections, template);

    return {
      template,
      sections,
      validation
    };
  }
}

export const grantAssistant = new GrantAssistant();