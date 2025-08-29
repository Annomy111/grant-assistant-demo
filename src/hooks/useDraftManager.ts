'use client';

import { useEffect, useState, useCallback } from 'react';
import { Draft, draftManager } from '@/lib/drafts/DraftManager';
import { ApplicationContext } from '@/lib/context/ApplicationContextManager';
import { useApplicationContext } from './useApplicationContext';

export function useDraftManager() {
  const { context, updateContext } = useApplicationContext();
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [currentDraftId, setCurrentDraftId] = useState<string | undefined>();
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [lastSaved, setLastSaved] = useState<string | undefined>();
  
  // Load drafts on mount
  useEffect(() => {
    refreshDrafts();
    setCurrentDraftId(draftManager.getCurrentDraftId());
  }, []);
  
  // Set up auto-save listener
  useEffect(() => {
    const handleAutoSave = () => {
      if (autoSaveEnabled) {
        autoSave();
      }
    };
    
    window.addEventListener('draft-autosave', handleAutoSave);
    
    return () => {
      window.removeEventListener('draft-autosave', handleAutoSave);
    };
  }, [autoSaveEnabled, context]);
  
  const refreshDrafts = useCallback(() => {
    const allDrafts = draftManager.getAllDrafts();
    setDrafts(allDrafts);
  }, []);
  
  const saveDraft = useCallback((
    name?: string,
    messages?: any[],
    populatedSections?: any[],
    metadata?: Draft['metadata']
  ) => {
    const draftName = name || `${context.projectTitle || 'Unbenannt'} - ${new Date().toLocaleString('de-DE')}`;
    const savedDraft = draftManager.saveDraft(
      draftName,
      context,
      messages,
      populatedSections,
      metadata
    );
    
    setLastSaved(new Date().toISOString());
    setCurrentDraftId(savedDraft.id);
    refreshDrafts();
    
    return savedDraft;
  }, [context, refreshDrafts]);
  
  const autoSave = useCallback((
    messages?: any[],
    populatedSections?: any[],
    metadata?: Draft['metadata']
  ) => {
    draftManager.autoSave(
      context,
      messages,
      populatedSections,
      metadata
    );
    
    setLastSaved(new Date().toISOString());
    refreshDrafts();
  }, [context, refreshDrafts]);
  
  const loadDraft = useCallback((draftId: string) => {
    const draft = draftManager.loadDraft(draftId);
    
    if (draft) {
      // Update application context with draft data
      updateContext(draft.context);
      setCurrentDraftId(draft.id);
      refreshDrafts();
      
      return draft;
    }
    
    return null;
  }, [updateContext, refreshDrafts]);
  
  const deleteDraft = useCallback((draftId: string) => {
    const success = draftManager.deleteDraft(draftId);
    
    if (success) {
      refreshDrafts();
      if (currentDraftId === draftId) {
        setCurrentDraftId(undefined);
      }
    }
    
    return success;
  }, [currentDraftId, refreshDrafts]);
  
  const exportDraft = useCallback((draftId: string) => {
    const jsonString = draftManager.exportDraft(draftId);
    
    if (jsonString) {
      // Create a download link
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `grant-draft-${draftId}-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      return true;
    }
    
    return false;
  }, []);
  
  const importDraft = useCallback((file: File) => {
    return new Promise<Draft | null>((resolve) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const importedDraft = draftManager.importDraft(content);
        
        if (importedDraft) {
          refreshDrafts();
          resolve(importedDraft);
        } else {
          resolve(null);
        }
      };
      
      reader.onerror = () => {
        console.error('Failed to read file');
        resolve(null);
      };
      
      reader.readAsText(file);
    });
  }, [refreshDrafts]);
  
  const clearAllDrafts = useCallback(() => {
    if (confirm('Sind Sie sicher, dass Sie alle Entwürfe löschen möchten?')) {
      draftManager.clearAllDrafts();
      setCurrentDraftId(undefined);
      refreshDrafts();
    }
  }, [refreshDrafts]);
  
  const toggleAutoSave = useCallback((enabled: boolean) => {
    draftManager.setAutoSave(enabled);
    setAutoSaveEnabled(enabled);
  }, []);
  
  const getDraftStats = useCallback(() => {
    return draftManager.getDraftStats();
  }, []);
  
  return {
    drafts,
    currentDraftId,
    autoSaveEnabled,
    lastSaved,
    saveDraft,
    autoSave,
    loadDraft,
    deleteDraft,
    exportDraft,
    importDraft,
    clearAllDrafts,
    toggleAutoSave,
    getDraftStats,
    refreshDrafts
  };
}