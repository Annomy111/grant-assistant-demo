'use client';

/**
 * useSession - React hook for session management
 * Provides automatic validation and session handling
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SessionManager, Session } from '@/lib/session/SessionManager';
import { ApplicationContext } from '@/lib/context/ApplicationContextManager';

export interface UseSessionOptions {
  autoValidate?: boolean;
  syncWithContext?: boolean;
  onSessionChange?: (session: Session | null) => void;
  onValidationError?: (field: string, reason: string) => void;
}

export type SessionHandler = UseSessionReturn;

export interface UseSessionReturn {
  session: Session | null;
  context: ApplicationContext;
  isLoading: boolean;
  isValidating: boolean;
  error: string | null;
  
  // Actions
  validateAndStore: (field: string, value: any) => Promise<boolean>;
  updateContext: (updates: Partial<ApplicationContext>) => Promise<void>;
  clearInvalidData: () => Promise<void>;
  clearSession: () => Promise<void>;
  exportSession: () => string;
  importSession: (data: string) => Promise<boolean>;
  
  // Validation state
  validationErrors: Record<string, string>;
  invalidAttempts: number;
}

export function useSession(options: UseSessionOptions = {}): UseSessionReturn {
  const {
    autoValidate = true,
    syncWithContext = true,
    onSessionChange,
    onValidationError
  } = options;
  
  const [session, setSession] = useState<Session | null>(null);
  const [context, setContext] = useState<ApplicationContext>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [invalidAttempts, setInvalidAttempts] = useState(0);
  
  const sessionManagerRef = useRef<SessionManager | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  
  // Initialize session manager
  useEffect(() => {
    const initializeSession = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Get or create session manager instance
        const manager = SessionManager.getInstance({
          autoCleanup: true,
          maxInvalidAttempts: 10
        });
        
        sessionManagerRef.current = manager;
        
        // Subscribe to session changes
        unsubscribeRef.current = manager.subscribe((newSession) => {
          setSession(newSession);
          
          if (newSession) {
            setContext(manager.getValidatedContext());
            setInvalidAttempts(newSession.metadata.invalidAttempts || 0);
          } else {
            setContext({});
            setInvalidAttempts(0);
          }
          
          // Notify external listener
          if (onSessionChange) {
            onSessionChange(newSession);
          }
        });
        
        // Get initial session
        const currentSession = manager.getCurrentSession();
        if (currentSession) {
          setSession(currentSession);
          setContext(manager.getValidatedContext());
          setInvalidAttempts(currentSession.metadata.invalidAttempts || 0);
        }
        
        // If autoValidate is on, clean invalid data on mount
        if (autoValidate) {
          await manager.clearInvalidData();
        }
        
      } catch (err) {
        console.error('[useSession] Initialization error:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize session');
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeSession();
    
    // Cleanup on unmount
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [autoValidate, onSessionChange]);
  
  // Sync with ApplicationContextManager if enabled
  useEffect(() => {
    if (!syncWithContext || !sessionManagerRef.current) return;
    
    // Import context from ApplicationContextManager
    const importFromContextManager = async () => {
      try {
        // Dynamically import to avoid circular dependency
        const { applicationContextManager } = await import('@/lib/context/ApplicationContextManager');
        const currentContext = applicationContextManager.getContext();
        
        // Validate and store each field
        for (const [field, value] of Object.entries(currentContext)) {
          if (value !== undefined && value !== null) {
            await sessionManagerRef.current!.validateAndStore(field, value);
          }
        }
        
        // Subscribe to context changes
        const unsubscribe = applicationContextManager.subscribe(async (newContext) => {
          if (!sessionManagerRef.current) return;
          
          // Only update changed fields
          for (const [field, value] of Object.entries(newContext)) {
            const currentValue = context[field as keyof ApplicationContext];
            if (value !== currentValue) {
              await sessionManagerRef.current.validateAndStore(field, value);
            }
          }
        });
        
        // Store unsubscribe for cleanup
        return unsubscribe;
      } catch (err) {
        // This error is not critical to the user, but good for developers to know.
        // console.warn('[useSession] Failed to sync with ApplicationContextManager:', err);
      }
    };
    
    const unsubscribePromise = importFromContextManager();
    
    return () => {
      unsubscribePromise.then(unsubscribe => {
        if (unsubscribe) unsubscribe();
      });
    };
  }, [syncWithContext]);
  
  // Action: Validate and store a field
  const validateAndStore = useCallback(async (field: string, value: any): Promise<boolean> => {
    if (!sessionManagerRef.current) {
      return false;
    }
    
    setIsValidating(true);
    setValidationErrors(prev => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
    
    try {
      const success = await sessionManagerRef.current.validateAndStore(field, value);
      
      if (!success) {
        const errorMsg = `Invalid value for ${field}`;
        setValidationErrors(prev => ({
          ...prev,
          [field]: errorMsg
        }));
        
        if (onValidationError) {
          onValidationError(field, errorMsg);
        }
      }
      
      return success;
    } catch (err) {
      // The calling function will handle the error.
      return false;
    } finally {
      setIsValidating(false);
    }
  }, [onValidationError]);
  
  // Action: Update multiple context fields
  const updateContext = useCallback(async (updates: Partial<ApplicationContext>): Promise<void> => {
    if (!sessionManagerRef.current) {
      return;
    }
    
    setIsValidating(true);
    
    try {
      for (const [field, value] of Object.entries(updates)) {
        if (value !== undefined) {
          await validateAndStore(field, value);
        }
      }
    } finally {
      setIsValidating(false);
    }
  }, [validateAndStore]);
  
  // Action: Clear invalid data
  const clearInvalidData = useCallback(async (): Promise<void> => {
    if (!sessionManagerRef.current) return;
    
    try {
      await sessionManagerRef.current.clearInvalidData();
      setValidationErrors({});
    } catch (err) {
      // Error is not critical for user
    }
  }, []);
  
  // Action: Clear session
  const clearSession = useCallback(async (): Promise<void> => {
    if (!sessionManagerRef.current) return;
    
    try {
      await sessionManagerRef.current.clearSession();
      setContext({});
      setValidationErrors({});
      setInvalidAttempts(0);
    } catch (err) {
      // Error is not critical for user
    }
  }, []);
  
  // Action: Export session
  const exportSession = useCallback((): string => {
    if (!sessionManagerRef.current) {
      return JSON.stringify({ error: 'Session manager not initialized' });
    }
    
    return sessionManagerRef.current.exportSession();
  }, []);
  
  // Action: Import session
  const importSession = useCallback(async (data: string): Promise<boolean> => {
    if (!sessionManagerRef.current) {
      console.error('[useSession] Session manager not initialized');
      return false;
    }
    
    try {
      const success = await sessionManagerRef.current.importSession(data);
      if (success) {
        setValidationErrors({});
      }
      return success;
    } catch (err) {
      // Error is not critical for user
      return false;
    }
  }, []);
  
  return {
    session,
    context,
    isLoading,
    isValidating,
    error,
    validateAndStore,
    updateContext,
    clearInvalidData,
    clearSession,
    exportSession,
    importSession,
    validationErrors,
    invalidAttempts
  };
}

/**
 * Higher-order component to provide session validation
 */
export function withSessionValidation<P extends object>(
  Component: React.ComponentType<P & { session: UseSessionReturn }>
): React.FC<P> {
  return (props: P) => {
    const session = useSession({
      autoValidate: true,
      syncWithContext: true
    });
    
    if (session.isLoading) {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      );
    }
    
    if (session.error) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">Session Error: {session.error}</p>
        </div>
      );
    }
    
    return <Component {...props} session={session} />;
  };
}