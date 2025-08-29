/**
 * ApplicationContextManager - Centralized context management for grant applications
 * Ensures consistent data handling throughout the application workflow
 */

export interface ApplicationContext {
  // Basic Information
  organizationName?: string;
  organizationType?: 'NGO' | 'University' | 'SME' | 'Large Enterprise' | 'Research Institute' | 'Public Body' | 'Foundation' | 'Other';
  organizationCountry?: 'DE' | 'UA' | 'EU' | 'Other';
  picNumber?: string;
  
  // Project Information
  projectTitle?: string;
  projectAcronym?: string;
  projectDescription?: string;
  abstract?: string;
  keywords?: string[];
  
  // Grant Details
  programType?: 'HORIZON' | 'CERV' | 'ERASMUS' | 'CREATIVE' | 'DAAD' | 'FACILITY' | 'MSCA';
  call?: string;
  callIdentifier?: string;
  templateId?: string;
  
  // Technical Details
  trlStart?: number;
  trlEnd?: number;
  duration?: number; // in months
  estimatedBudget?: string;
  totalBudget?: number;
  requestedFunding?: number;
  fundingRate?: number;
  
  // Consortium
  consortium?: Array<{
    name: string;
    type: string;
    country: string;
    role: 'Coordinator' | 'Partner' | 'Associated Partner' | 'Third Party';
    picNumber?: string;
    budget?: number;
  }>;
  isCoordinator?: boolean;
  
  // Section Progress
  sectionProgress?: {
    [key: string]: SectionProgress;
  };
  
  // Metadata
  lastUpdated?: string;
  applicationId?: string;
  language?: 'de' | 'en' | 'uk';
}

export interface SectionProgress {
  status: 'not_started' | 'in_progress' | 'completed' | 'validated';
  completionPercentage: number;
  requiredFields: string[];
  completedFields: string[];
  content?: string;
  wordCount?: number;
  maxWords?: number;
  lastModified?: string;
  validationErrors?: string[];
}

export class ApplicationContextManager {
  private static instance: ApplicationContextManager;
  private context: ApplicationContext = {};
  private listeners: Array<(context: ApplicationContext) => void> = [];
  
  private constructor() {
    // Load from localStorage if available
    this.loadFromStorage();
  }
  
  public static getInstance(): ApplicationContextManager {
    if (!ApplicationContextManager.instance) {
      ApplicationContextManager.instance = new ApplicationContextManager();
    }
    return ApplicationContextManager.instance;
  }
  
  /**
   * Update context with partial data
   */
  public updateContext(updates: Partial<ApplicationContext>): void {
    this.context = {
      ...this.context,
      ...updates,
      lastUpdated: new Date().toISOString()
    };
    
    this.saveToStorage();
    this.notifyListeners();
  }
  
  /**
   * Get current context
   */
  public getContext(): ApplicationContext {
    return { ...this.context };
  }
  
  /**
   * Clear context
   */
  public clearContext(): void {
    this.context = {};
    this.saveToStorage();
    this.notifyListeners();
  }
  
  /**
   * Subscribe to context changes
   */
  public subscribe(listener: (context: ApplicationContext) => void): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
  
  /**
   * Validate if minimum required fields are present for a step
   */
  public validateStepRequirements(step: string): {
    isValid: boolean;
    missingFields: string[];
    completionPercentage: number;
  } {
    const requirements: Record<string, string[]> = {
      introduction: ['organizationName', 'projectTitle', 'call'],
      excellence: ['projectDescription', 'abstract', 'keywords'],
      impact: ['abstract'], // Minimum requirement
      implementation: ['duration', 'estimatedBudget'],
      review: [] // No specific requirements for review
    };
    
    const requiredFields = requirements[step] || [];
    const missingFields: string[] = [];
    
    requiredFields.forEach(field => {
      const value = this.getNestedValue(this.context, field);
      if (!value || (Array.isArray(value) && value.length === 0)) {
        missingFields.push(field);
      }
    });
    
    const completionPercentage = requiredFields.length > 0 
      ? ((requiredFields.length - missingFields.length) / requiredFields.length) * 100
      : 100;
    
    return {
      isValid: missingFields.length === 0,
      missingFields,
      completionPercentage: Math.round(completionPercentage)
    };
  }
  
  /**
   * Update section progress
   */
  public updateSectionProgress(
    section: string, 
    progress: Partial<SectionProgress>
  ): void {
    const currentSectionProgress = this.context.sectionProgress || {};
    const currentSection = currentSectionProgress[section] || {
      status: 'not_started',
      completionPercentage: 0,
      requiredFields: [],
      completedFields: []
    };
    
    this.updateContext({
      sectionProgress: {
        ...currentSectionProgress,
        [section]: {
          ...currentSection,
          ...progress,
          lastModified: new Date().toISOString()
        }
      }
    });
  }
  
  /**
   * Get section completion status
   */
  public getSectionStatus(section: string): SectionProgress | undefined {
    return this.context.sectionProgress?.[section];
  }
  
  /**
   * Calculate overall application completion
   */
  public getOverallCompletion(): {
    percentage: number;
    completedSections: number;
    totalSections: number;
  } {
    const sections: string[] = [
      'introduction',
      'excellence',
      'impact',
      'implementation',
      'review'
    ];
    
    let completedSections = 0;
    let totalPercentage = 0;
    
    sections.forEach(section => {
      const progress = this.getSectionStatus(section);
      if (progress) {
        totalPercentage += progress.completionPercentage;
        if (progress.status === 'completed' || progress.status === 'validated') {
          completedSections++;
        }
      }
    });
    
    return {
      percentage: Math.round(totalPercentage / sections.length),
      completedSections,
      totalSections: sections.length
    };
  }
  
  /**
   * Check if ready to advance to next step
   */
  public canAdvanceToStep(fromStep: string, toStep: string): {
    canAdvance: boolean;
    reason?: string;
  } {
    const validation = this.validateStepRequirements(fromStep);
    
    if (!validation.isValid) {
      return {
        canAdvance: false,
        reason: `Missing required fields: ${validation.missingFields.join(', ')}`
      };
    }
    
    // Additional business logic checks
    if (fromStep === 'introduction' && toStep === 'excellence') {
      if (!this.context.templateId && !this.context.programType) {
        return {
          canAdvance: false,
          reason: 'Please select a grant program or template'
        };
      }
    }
    
    return { canAdvance: true };
  }
  
  /**
   * Generate context summary for AI
   */
  public getAIContextSummary(): string {
    const parts: string[] = [];
    
    if (this.context.organizationName) {
      parts.push(`Organization: ${this.context.organizationName}`);
    }
    if (this.context.projectTitle) {
      parts.push(`Project: ${this.context.projectTitle}`);
    }
    if (this.context.call) {
      parts.push(`Call: ${this.context.call}`);
    }
    if (this.context.programType) {
      parts.push(`Program: ${this.context.programType}`);
    }
    if (this.context.estimatedBudget) {
      parts.push(`Budget: ${this.context.estimatedBudget}`);
    }
    if (this.context.duration) {
      parts.push(`Duration: ${this.context.duration} months`);
    }
    
    return parts.join(' | ');
  }
  
  // Private helper methods
  
  private loadFromStorage(): void {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('grant-application-context');
      if (stored) {
        try {
          this.context = JSON.parse(stored);
        } catch (error) {
          console.error('Failed to load context from storage:', error);
        }
      }
    }
  }
  
  private saveToStorage(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('grant-application-context', JSON.stringify(this.context));
      } catch (error) {
        console.error('Failed to save context to storage:', error);
      }
    }
  }
  
  private notifyListeners(): void {
    const contextCopy = this.getContext();
    this.listeners.forEach(listener => {
      try {
        listener(contextCopy);
      } catch (error) {
        console.error('Error in context listener:', error);
      }
    });
  }
  
  private getNestedValue(obj: any, path: string): any {
    const keys = path.split('.');
    let value = obj;
    
    for (const key of keys) {
      value = value?.[key];
      if (value === undefined) {
        return undefined;
      }
    }
    
    return value;
  }
}

// Export singleton instance
export const applicationContextManager = ApplicationContextManager.getInstance();