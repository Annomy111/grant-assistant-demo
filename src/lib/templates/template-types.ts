export interface TemplateField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'date' | 'array';
  required: boolean;
  placeholder?: string;
  helpText?: string;
  maxLength?: number;
  minLength?: number;
  options?: string[];
  validation?: string;
  defaultValue?: any;
}

export interface TemplateSubSection {
  id: string;
  title: string;
  description: string;
  fields: TemplateField[];
  wordLimit?: number;
  evaluationCriteria?: string[];
  tips?: string[];
  examples?: string[];
  requiredAttachments?: string[];
  templateContent?: string; // Pre-written template text with placeholders
}

export interface TemplateSection {
  id: string;
  title: string;
  description: string;
  weight: number; // Evaluation weight percentage
  subsections: TemplateSubSection[];
  totalWordLimit?: number;
  pageLimit?: number;
  evaluationCriteria?: string[];
  mandatoryElements?: string[];
}

export interface GrantTemplate {
  id: string;
  programType: 'EU_HORIZON' | 'CERV' | 'ERASMUS_PLUS' | 'CREATIVE_EUROPE' | 'LIFE' | 'DIGITAL_EUROPE' | 
               'MSCA4UKRAINE' | 'RECONSTRUCTION' | 'BILATERAL_DE_UA' | 'EMERGENCY' | 'CIVIL_SECURITY';
  actionType: 'RIA' | 'IA' | 'CSA' | 'MSCA' | 'ERC' | 'EIC' | 'FELLOWSHIP' | 'CAPACITY_BUILDING' | 
              'HUMANITARIAN' | 'INFRASTRUCTURE' | 'COOPERATION'; // Extended action types
  name: string;
  description: string;
  language: 'de' | 'en' | 'uk';
  sections: TemplateSection[];
  metadata: {
    fundingRate: number;
    typicalDuration: string;
    typicalBudget: string;
    consortiumRequirements?: string[];
    trlRange?: string;
    deadlineInfo?: string;
    ukraineSpecific?: boolean;
    emergencyProcedure?: boolean;
    simplifiedAdmin?: boolean;
  };
  keywords: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TemplateContext {
  organizationName: string;
  organizationType: 'NGO' | 'University' | 'SME' | 'Large Enterprise' | 'Research Institute' | 'Public Body' | 'Foundation' | 'Other';
  projectTitle: string;
  projectAcronym: string;
  country?: string;
  callIdentifier: string;
  duration: number; // months
  totalBudget: number;
  requestedFunding: number;
  consortium: ConsortiumPartner[];
  abstract: string;
  keywords: string[];
  trlStart?: number;
  trlEnd?: number;
}

export interface ConsortiumPartner {
  name: string;
  country: string;
  type: string;
  role: 'Coordinator' | 'Partner' | 'Associated Partner' | 'Third Party';
  picNumber?: string;
  budget?: number;
}

export interface TemplatePopulationResult {
  sectionId: string;
  subsectionId: string;
  content: string;
  fields: Record<string, any>;
  completeness: number; // 0-100
  missingRequirements?: string[];
}

export interface TemplateValidation {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  completeness: number;
}

export interface ValidationError {
  sectionId: string;
  subsectionId?: string;
  fieldId?: string;
  message: string;
  severity: 'error' | 'critical';
}

export interface ValidationWarning {
  sectionId: string;
  subsectionId?: string;
  fieldId?: string;
  message: string;
  suggestion?: string;
}