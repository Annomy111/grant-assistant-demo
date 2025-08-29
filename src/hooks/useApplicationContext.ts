'use client';

import { useEffect, useState, useCallback } from 'react';
import { 
  ApplicationContext, 
  SectionProgress,
  applicationContextManager 
} from '@/lib/context/ApplicationContextManager';

/**
 * React hook for using the ApplicationContextManager
 * Provides reactive updates when context changes
 */
export function useApplicationContext() {
  const [context, setContext] = useState<ApplicationContext>(
    applicationContextManager.getContext()
  );
  
  useEffect(() => {
    // Subscribe to context changes
    const unsubscribe = applicationContextManager.subscribe((newContext) => {
      setContext(newContext);
    });
    
    // Initial load
    setContext(applicationContextManager.getContext());
    
    return unsubscribe;
  }, []);
  
  const updateContext = useCallback((updates: Partial<ApplicationContext>) => {
    applicationContextManager.updateContext(updates);
  }, []);
  
  const clearContext = useCallback(() => {
    applicationContextManager.clearContext();
  }, []);
  
  const validateStep = useCallback((step: string) => {
    return applicationContextManager.validateStepRequirements(step);
  }, []);
  
  const canAdvanceToStep = useCallback((fromStep: string, toStep: string) => {
    return applicationContextManager.canAdvanceToStep(fromStep, toStep);
  }, []);
  
  const updateSectionProgress = useCallback(
    (section: string, progress: Partial<SectionProgress>) => {
      applicationContextManager.updateSectionProgress(section, progress);
    }, 
    []
  );
  
  const getSectionStatus = useCallback(
    (section: string) => {
      return applicationContextManager.getSectionStatus(section);
    },
    [context] // Re-compute when context changes
  );
  
  const getOverallCompletion = useCallback(() => {
    return applicationContextManager.getOverallCompletion();
  }, [context]);
  
  const getAIContextSummary = useCallback(() => {
    return applicationContextManager.getAIContextSummary();
  }, [context]);
  
  return {
    context,
    updateContext,
    clearContext,
    validateStep,
    canAdvanceToStep,
    updateSectionProgress,
    getSectionStatus,
    getOverallCompletion,
    getAIContextSummary
  };
}