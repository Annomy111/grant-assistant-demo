'use client';

import { useState, useEffect } from 'react';
import { Check, X, AlertCircle, ChevronRight } from 'lucide-react';
import { useApplicationContext } from '@/hooks/useApplicationContext';

interface ValidationRule {
  field: string;
  label: string;
  required: boolean;
  validator?: (value: any) => boolean;
  errorMessage?: string;
}

interface SectionValidationRules {
  [section: string]: ValidationRule[];
}

const validationRules: SectionValidationRules = {
  introduction: [
    {
      field: 'organizationName',
      label: 'Organisation Name',
      required: true,
      validator: (value) => value && value.length > 2,
      errorMessage: 'Organization name must be at least 3 characters'
    },
    {
      field: 'projectTitle',
      label: 'Project Title',
      required: true,
      validator: (value) => value && value.length > 5,
      errorMessage: 'Project title must be at least 6 characters'
    },
    {
      field: 'call',
      label: 'Call Identifier',
      required: true,
      validator: (value) => value && (value.includes('HORIZON') || value.includes('CERV') || value.includes('ERASMUS')),
      errorMessage: 'Must be a valid call identifier (e.g., HORIZON-CL2-2025-...)'
    },
    {
      field: 'organizationType',
      label: 'Organization Type',
      required: false
    },
    {
      field: 'estimatedBudget',
      label: 'Estimated Budget',
      required: false
    }
  ],
  excellence: [
    {
      field: 'abstract',
      label: 'Project Abstract',
      required: true,
      validator: (value) => value && value.split(' ').length >= 50,
      errorMessage: 'Abstract should be at least 50 words'
    },
    {
      field: 'keywords',
      label: 'Keywords',
      required: true,
      validator: (value) => Array.isArray(value) && value.length >= 3,
      errorMessage: 'At least 3 keywords required'
    },
    {
      field: 'projectDescription',
      label: 'Detailed Description',
      required: true,
      validator: (value) => value && value.split(' ').length >= 100,
      errorMessage: 'Description should be at least 100 words'
    }
  ],
  impact: [
    {
      field: 'abstract',
      label: 'Impact Statement',
      required: true,
      validator: (value) => value && value.length > 0,
      errorMessage: 'Impact statement is required'
    }
  ],
  implementation: [
    {
      field: 'duration',
      label: 'Project Duration',
      required: true,
      validator: (value) => value && value >= 12 && value <= 60,
      errorMessage: 'Duration must be between 12 and 60 months'
    },
    {
      field: 'totalBudget',
      label: 'Total Budget',
      required: true,
      validator: (value) => value && value > 0,
      errorMessage: 'Budget must be specified'
    },
    {
      field: 'consortium',
      label: 'Consortium Partners',
      required: false,
      validator: (value) => !value || (Array.isArray(value) && value.length >= 0),
      errorMessage: 'Invalid consortium data'
    }
  ]
};

interface SectionValidatorProps {
  currentSection: string;
  onValidationChange?: (isValid: boolean, errors: string[]) => void;
  showDetails?: boolean;
}

export function SectionValidator({ 
  currentSection, 
  onValidationChange,
  showDetails = true 
}: SectionValidatorProps) {
  const { context, validateStep } = useApplicationContext();
  const [validationState, setValidationState] = useState<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
    completedFields: string[];
    missingFields: string[];
    percentage: number;
  }>({
    isValid: false,
    errors: [],
    warnings: [],
    completedFields: [],
    missingFields: [],
    percentage: 0
  });
  
  useEffect(() => {
    validateSection();
  }, [context, currentSection]);
  
  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(validationState.isValid, validationState.errors);
    }
  }, [validationState]);
  
  const validateSection = () => {
    const rules = validationRules[currentSection] || [];
    const errors: string[] = [];
    const warnings: string[] = [];
    const completedFields: string[] = [];
    const missingFields: string[] = [];
    
    let requiredCount = 0;
    let completedRequiredCount = 0;
    
    rules.forEach(rule => {
      const value = getNestedValue(context, rule.field);
      const hasValue = value !== undefined && value !== null && value !== '' && 
                      (!Array.isArray(value) || value.length > 0);
      
      if (rule.required) {
        requiredCount++;
        
        if (!hasValue) {
          missingFields.push(rule.label);
          errors.push(`${rule.label} is required`);
        } else {
          if (rule.validator && !rule.validator(value)) {
            errors.push(rule.errorMessage || `${rule.label} is invalid`);
          } else {
            completedRequiredCount++;
            completedFields.push(rule.label);
          }
        }
      } else {
        if (hasValue) {
          if (rule.validator && !rule.validator(value)) {
            warnings.push(rule.errorMessage || `${rule.label} may have issues`);
          } else {
            completedFields.push(rule.label);
          }
        }
      }
    });
    
    const percentage = requiredCount > 0 
      ? Math.round((completedRequiredCount / requiredCount) * 100)
      : 100;
    
    setValidationState({
      isValid: errors.length === 0 && requiredCount === completedRequiredCount,
      errors,
      warnings,
      completedFields,
      missingFields,
      percentage
    });
  };
  
  const getNestedValue = (obj: any, path: string): any => {
    const keys = path.split('.');
    let value = obj;
    
    for (const key of keys) {
      value = value?.[key];
      if (value === undefined) {
        return undefined;
      }
    }
    
    return value;
  };
  
  if (!showDetails) {
    return (
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <div className={`p-1.5 rounded-lg ${
            validationState.percentage === 100 ? 'bg-green-100' : 
            validationState.percentage > 50 ? 'bg-yellow-100' : 'bg-gray-100'
          }`}>
            {validationState.percentage === 100 ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-yellow-600" />
            )}
          </div>
          <div>
            <span className="text-sm font-semibold text-gray-800">
              Section Progress
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    validationState.percentage === 100 ? 'bg-green-500' :
                    validationState.percentage > 50 ? 'bg-yellow-500' : 'bg-gray-400'
                  }`}
                  style={{ width: `${validationState.percentage}%` }}
                />
              </div>
              <span className="text-xs font-bold text-gray-600">
                {validationState.percentage}%
              </span>
            </div>
          </div>
        </div>
        {validationState.missingFields.length > 0 && (
          <span className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full border">
            {validationState.missingFields.length} fields remaining
          </span>
        )}
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg border p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-sm text-gray-700">Section Validation</h4>
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium">
            {validationState.percentage}%
          </div>
          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${validationState.percentage}%`,
                backgroundColor: validationState.percentage === 100 
                  ? '#10b981' 
                  : validationState.percentage >= 50 
                    ? '#f59e0b' 
                    : '#ef4444'
              }}
            />
          </div>
        </div>
      </div>
      
      {validationState.missingFields.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs font-medium text-gray-600">Required Fields:</p>
          <div className="space-y-1">
            {validationRules[currentSection]?.filter(r => r.required).map(rule => {
              const isCompleted = validationState.completedFields.includes(rule.label);
              const hasError = validationState.errors.some(e => e.includes(rule.label));
              
              return (
                <div key={rule.field} className="flex items-center gap-2 text-xs">
                  {isCompleted && !hasError ? (
                    <Check className="w-3 h-3 text-green-600" />
                  ) : hasError ? (
                    <X className="w-3 h-3 text-red-600" />
                  ) : (
                    <div className="w-3 h-3 rounded-full border border-gray-300" />
                  )}
                  <span className={
                    isCompleted && !hasError
                      ? 'text-green-700' 
                      : hasError
                        ? 'text-red-700'
                        : 'text-gray-500'
                  }>
                    {rule.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {validationState.errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded p-2 space-y-1">
          <p className="text-xs font-medium text-red-800">Issues to resolve:</p>
          {validationState.errors.map((error, index) => (
            <p key={index} className="text-xs text-red-700 flex items-start gap-1">
              <ChevronRight className="w-3 h-3 mt-0.5 flex-shrink-0" />
              {error}
            </p>
          ))}
        </div>
      )}
      
      {validationState.warnings.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-2 space-y-1">
          <p className="text-xs font-medium text-yellow-800">Warnings:</p>
          {validationState.warnings.map((warning, index) => (
            <p key={index} className="text-xs text-yellow-700 flex items-start gap-1">
              <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
              {warning}
            </p>
          ))}
        </div>
      )}
      
      {validationState.isValid && (
        <div className="bg-green-50 border border-green-200 rounded p-2">
          <p className="text-xs text-green-800 flex items-center gap-1">
            <Check className="w-3 h-3" />
            Section requirements met. Ready to proceed!
          </p>
        </div>
      )}
    </div>
  );
}