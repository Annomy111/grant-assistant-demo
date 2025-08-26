import { deepseek } from './deepseek';

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
  private systemPrompts = {
    de: `Du bist ein Experte für EU-Förderanträge und unterstützt zivilgesellschaftliche Organisationen bei der Erstellung von Förderanträgen.
    
    Deine Aufgaben:
    1. Führe den Nutzer Schritt für Schritt durch den Antragsprozess
    2. Stelle gezielte Fragen, um alle notwendigen Informationen zu sammeln
    3. Formuliere professionelle und überzeugende Antragstexte
    4. Achte auf die spezifischen Anforderungen des jeweiligen Förderprogramms
    5. Verwende eine klare, präzise und fachgerechte Sprache
    
    Wichtige Prinzipien:
    - Sei unterstützend und ermutigend
    - Erkläre komplexe Anforderungen verständlich
    - Biete konkrete Beispiele und Formulierungsvorschläge
    - Weise auf wichtige Fristen und Dokumente hin`,
    
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
    const messages = [
      {
        role: 'system' as const,
        content: this.systemPrompts[language as keyof typeof this.systemPrompts] || this.systemPrompts.en,
      },
      {
        role: 'user' as const,
        content: `Erstelle einen professionellen Text für den Abschnitt "${section.title}" eines EU Horizon Europe Antrags.
        
        Beschreibung des Abschnitts: ${section.description}
        Maximale Wortanzahl: ${section.maxWords || 'keine Begrenzung'}
        
        Kontext der Organisation:
        - Name: ${context.organizationName}
        - Typ: ${context.organizationType}
        - Land: ${context.country}
        
        Projektinformationen:
        ${userInput}
        
        Bitte erstelle einen strukturierten und überzeugenden Text, der alle relevanten Aspekte abdeckt.`,
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
    const messages = [
      {
        role: 'system' as const,
        content: this.systemPrompts[language as keyof typeof this.systemPrompts] || this.systemPrompts.en,
      },
      {
        role: 'user' as const,
        content: question,
      },
    ];

    return await deepseek.generateCompletion(messages, 'deepseek-chat', 0.7, 1000);
  }
}

export const grantAssistant = new GrantAssistant();