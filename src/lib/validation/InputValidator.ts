/**
 * InputValidator - Validates and sanitizes user input
 * Prevents generic phrases and invalid data from being stored
 */

import { BLACKLISTED_PHRASES, VALIDATION_RULES } from './blacklist';

export interface ValidationResult {
  isValid: boolean;
  reason?: string;
  sanitizedValue?: any;
  suggestions?: string[];
}

export interface FieldValidationRule {
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  required?: boolean;
  custom?: (value: any) => boolean;
  sanitize?: (value: any) => any;
}

export class InputValidator {
  private static instance: InputValidator;
  
  private constructor() {}
  
  public static getInstance(): InputValidator {
    if (!InputValidator.instance) {
      InputValidator.instance = new InputValidator();
    }
    return InputValidator.instance;
  }
  
  /**
   * Validate a field value
   */
  public validate(field: string, value: any): ValidationResult {
    // Check if field has specific validation rules
    const rule = VALIDATION_RULES[field];
    
    if (!rule) {
      // No specific rule, apply general validation
      return this.generalValidation(field, value);
    }
    
    // Apply field-specific validation
    return this.applyFieldValidation(field, value, rule);
  }
  
  /**
   * Check if a value is a generic phrase
   */
  public isGenericPhrase(value: string): boolean {
    if (!value || typeof value !== 'string') return false;
    
    const normalized = value.toLowerCase().trim();
    
    // Check against all language blacklists
    for (const phrases of Object.values(BLACKLISTED_PHRASES.phrases)) {
      if (phrases.includes(normalized)) {
        return true;
      }
    }
    
    // Check against patterns
    for (const pattern of BLACKLISTED_PHRASES.patterns) {
      if (pattern.test(normalized)) {
        return true;
      }
    }
    
    // Check if it's just whitespace or special characters
    if (/^[\s\W]*$/.test(value)) {
      return true;
    }
    
    return false;
  }
  
  /**
   * Sanitize a value
   */
  public sanitize(value: any): any {
    if (typeof value === 'string') {
      // Trim whitespace
      let sanitized = value.trim();
      
      // Remove excessive whitespace
      sanitized = sanitized.replace(/\s+/g, ' ');
      
      // Remove potentially harmful characters (for security)
      sanitized = sanitized.replace(/[<>]/g, '');
      
      return sanitized;
    }
    
    if (Array.isArray(value)) {
      return value.map(v => this.sanitize(v)).filter(Boolean);
    }
    
    return value;
  }
  
  /**
   * Apply field-specific validation
   */
  private applyFieldValidation(
    field: string, 
    value: any, 
    rule: FieldValidationRule
  ): ValidationResult {
    // First sanitize the value
    const sanitized = rule.sanitize ? rule.sanitize(value) : this.sanitize(value);
    
    // Check if required
    if (rule.required && !sanitized) {
      return {
        isValid: false,
        reason: `${field} is required`
      };
    }
    
    // If not required and empty, it's valid
    if (!rule.required && !sanitized) {
      return { isValid: true };
    }
    
    // Check string-specific rules
    if (typeof sanitized === 'string') {
      // Check if it's a generic phrase
      if (this.isGenericPhrase(sanitized)) {
        return {
          isValid: false,
          reason: `${field} contains a generic phrase`,
          suggestions: this.getSuggestions(field)
        };
      }
      
      // Check min length
      if (rule.minLength && sanitized.length < rule.minLength) {
        return {
          isValid: false,
          reason: `${field} must be at least ${rule.minLength} characters`
        };
      }
      
      // Check max length
      if (rule.maxLength && sanitized.length > rule.maxLength) {
        return {
          isValid: false,
          reason: `${field} must be at most ${rule.maxLength} characters`
        };
      }
      
      // Check pattern
      if (rule.pattern && !rule.pattern.test(sanitized)) {
        return {
          isValid: false,
          reason: `${field} format is invalid`
        };
      }
    }
    
    // Apply custom validation
    if (rule.custom && !rule.custom(sanitized)) {
      return {
        isValid: false,
        reason: `${field} validation failed`
      };
    }
    
    return {
      isValid: true,
      sanitizedValue: sanitized
    };
  }
  
  /**
   * General validation for fields without specific rules
   */
  private generalValidation(field: string, value: any): ValidationResult {
    const sanitized = this.sanitize(value);
    
    if (typeof sanitized === 'string' && this.isGenericPhrase(sanitized)) {
      return {
        isValid: false,
        reason: 'Value contains a generic phrase',
        suggestions: this.getSuggestions(field)
      };
    }
    
    return {
      isValid: true,
      sanitizedValue: sanitized
    };
  }
  
  /**
   * Get suggestions for a field
   */
  private getSuggestions(field: string): string[] {
    const suggestions: Record<string, string[]> = {
      organizationName: [
        'Enter your organization\'s official name',
        'Example: "Max Planck Institute for Innovation"',
        'Example: "Technical University of Munich"'
      ],
      projectTitle: [
        'Enter a descriptive project title',
        'Example: "AI-Enhanced Climate Monitoring System"',
        'Example: "Sustainable Urban Mobility Platform"'
      ],
      call: [
        'Enter the full call identifier',
        'Example: "HORIZON-CL2-2025-DEMOCRACY-01"',
        'Example: "CERV-2025-CITIZENS-01"'
      ]
    };
    
    return suggestions[field] || ['Please enter a valid value'];
  }
  
  /**
   * Batch validate multiple fields
   */
  public validateBatch(fields: Record<string, any>): Record<string, ValidationResult> {
    const results: Record<string, ValidationResult> = {};
    
    for (const [field, value] of Object.entries(fields)) {
      results[field] = this.validate(field, value);
    }
    
    return results;
  }
  
  /**
   * Check if a context is valid
   */
  public isContextValid(context: Record<string, any>): boolean {
    const requiredFields = ['organizationName', 'projectTitle', 'call'];
    
    for (const field of requiredFields) {
      const validation = this.validate(field, context[field]);
      if (!validation.isValid) {
        return false;
      }
    }
    
    return true;
  }
}