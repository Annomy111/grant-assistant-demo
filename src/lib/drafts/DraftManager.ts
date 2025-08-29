/**
 * DraftManager - Handles saving, loading, and versioning of application drafts
 */

import { ApplicationContext } from '../context/ApplicationContextManager';

export interface Draft {
  id: string;
  name: string;
  version: number;
  context: ApplicationContext;
  messages?: any[];
  populatedSections?: any[];
  createdAt: string;
  updatedAt: string;
  autoSave?: boolean;
  templateId?: string;
  metadata?: {
    wordCount?: number;
    completionPercentage?: number;
    lastSection?: string;
    lastSubSection?: string;
  };
}

export interface DraftList {
  drafts: Draft[];
  currentDraftId?: string;
}

export class DraftManager {
  private static instance: DraftManager;
  private currentDraftId?: string;
  private autoSaveInterval?: NodeJS.Timeout;
  private autoSaveEnabled: boolean = true;
  private readonly STORAGE_KEY = 'grant-assistant-drafts';
  private readonly MAX_DRAFTS = 10;
  private readonly AUTO_SAVE_INTERVAL = 30000; // 30 seconds
  
  private constructor() {
    this.loadDrafts();
    this.startAutoSave();
  }
  
  public static getInstance(): DraftManager {
    if (!DraftManager.instance) {
      DraftManager.instance = new DraftManager();
    }
    return DraftManager.instance;
  }
  
  /**
   * Save a new draft or update existing one
   */
  public saveDraft(
    name: string,
    context: ApplicationContext,
    messages?: any[],
    populatedSections?: any[],
    metadata?: Draft['metadata']
  ): Draft {
    const drafts = this.getAllDrafts();
    const timestamp = new Date().toISOString();
    
    // Check if we're updating an existing draft
    let draft: Draft;
    if (this.currentDraftId) {
      const existingIndex = drafts.findIndex(d => d.id === this.currentDraftId);
      if (existingIndex !== -1) {
        // Update existing draft
        draft = {
          ...drafts[existingIndex],
          context,
          messages,
          populatedSections,
          updatedAt: timestamp,
          version: drafts[existingIndex].version + 1,
          metadata: {
            ...drafts[existingIndex].metadata,
            ...metadata
          }
        };
        drafts[existingIndex] = draft;
      } else {
        // Create new draft
        draft = this.createNewDraft(name, context, messages, populatedSections, metadata);
        drafts.unshift(draft);
      }
    } else {
      // Create new draft
      draft = this.createNewDraft(name, context, messages, populatedSections, metadata);
      drafts.unshift(draft);
      this.currentDraftId = draft.id;
    }
    
    // Keep only MAX_DRAFTS most recent drafts
    const trimmedDrafts = drafts.slice(0, this.MAX_DRAFTS);
    
    this.saveDraftsToStorage(trimmedDrafts);
    
    return draft;
  }
  
  /**
   * Auto-save current draft
   */
  public autoSave(
    context: ApplicationContext,
    messages?: any[],
    populatedSections?: any[],
    metadata?: Draft['metadata']
  ): void {
    if (!this.autoSaveEnabled) return;
    
    const draftName = this.currentDraftId 
      ? `Autosave - ${new Date().toLocaleString('de-DE')}`
      : `Autosave - ${context.projectTitle || 'Unbenannt'}`;
    
    this.saveDraft(draftName, context, messages, populatedSections, {
      ...metadata,
      lastSection: metadata?.lastSection
    });
  }
  
  /**
   * Load a specific draft
   */
  public loadDraft(draftId: string): Draft | null {
    const drafts = this.getAllDrafts();
    const draft = drafts.find(d => d.id === draftId);
    
    if (draft) {
      this.currentDraftId = draftId;
      return draft;
    }
    
    return null;
  }
  
  /**
   * Get all saved drafts
   */
  public getAllDrafts(): Draft[] {
    if (typeof window === 'undefined') return [];
    
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const draftList: DraftList = JSON.parse(stored);
        return draftList.drafts || [];
      } catch (error) {
        console.error('Failed to load drafts:', error);
        return [];
      }
    }
    
    return [];
  }
  
  /**
   * Delete a draft
   */
  public deleteDraft(draftId: string): boolean {
    const drafts = this.getAllDrafts();
    const filteredDrafts = drafts.filter(d => d.id !== draftId);
    
    if (filteredDrafts.length < drafts.length) {
      this.saveDraftsToStorage(filteredDrafts);
      
      if (this.currentDraftId === draftId) {
        this.currentDraftId = undefined;
      }
      
      return true;
    }
    
    return false;
  }
  
  /**
   * Export draft as JSON
   */
  public exportDraft(draftId: string): string | null {
    const draft = this.loadDraft(draftId);
    if (draft) {
      return JSON.stringify(draft, null, 2);
    }
    return null;
  }
  
  /**
   * Import draft from JSON
   */
  public importDraft(jsonString: string): Draft | null {
    try {
      const importedDraft = JSON.parse(jsonString);
      
      // Validate draft structure
      if (!importedDraft.context || !importedDraft.id) {
        throw new Error('Invalid draft format');
      }
      
      // Generate new ID to avoid conflicts
      const newDraft: Draft = {
        ...importedDraft,
        id: this.generateId(),
        name: `Imported - ${importedDraft.name}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1
      };
      
      const drafts = this.getAllDrafts();
      drafts.unshift(newDraft);
      this.saveDraftsToStorage(drafts.slice(0, this.MAX_DRAFTS));
      
      return newDraft;
    } catch (error) {
      console.error('Failed to import draft:', error);
      return null;
    }
  }
  
  /**
   * Clear all drafts
   */
  public clearAllDrafts(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.STORAGE_KEY);
      this.currentDraftId = undefined;
    }
  }
  
  /**
   * Get current draft ID
   */
  public getCurrentDraftId(): string | undefined {
    return this.currentDraftId;
  }
  
  /**
   * Set current draft ID
   */
  public setCurrentDraftId(draftId?: string): void {
    this.currentDraftId = draftId;
  }
  
  /**
   * Enable/disable auto-save
   */
  public setAutoSave(enabled: boolean): void {
    this.autoSaveEnabled = enabled;
    if (enabled) {
      this.startAutoSave();
    } else {
      this.stopAutoSave();
    }
  }
  
  /**
   * Get draft statistics
   */
  public getDraftStats(): {
    totalDrafts: number;
    totalWords: number;
    averageCompletion: number;
    lastSaved?: string;
  } {
    const drafts = this.getAllDrafts();
    
    if (drafts.length === 0) {
      return {
        totalDrafts: 0,
        totalWords: 0,
        averageCompletion: 0
      };
    }
    
    const totalWords = drafts.reduce((sum, d) => sum + (d.metadata?.wordCount || 0), 0);
    const totalCompletion = drafts.reduce((sum, d) => sum + (d.metadata?.completionPercentage || 0), 0);
    
    return {
      totalDrafts: drafts.length,
      totalWords,
      averageCompletion: Math.round(totalCompletion / drafts.length),
      lastSaved: drafts[0]?.updatedAt
    };
  }
  
  // Private helper methods
  
  private createNewDraft(
    name: string,
    context: ApplicationContext,
    messages?: any[],
    populatedSections?: any[],
    metadata?: Draft['metadata']
  ): Draft {
    const timestamp = new Date().toISOString();
    
    return {
      id: this.generateId(),
      name,
      version: 1,
      context,
      messages,
      populatedSections,
      createdAt: timestamp,
      updatedAt: timestamp,
      autoSave: false,
      templateId: context.templateId,
      metadata
    };
  }
  
  private saveDraftsToStorage(drafts: Draft[]): void {
    if (typeof window === 'undefined') return;
    
    const draftList: DraftList = {
      drafts,
      currentDraftId: this.currentDraftId
    };
    
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(draftList));
    } catch (error) {
      console.error('Failed to save drafts:', error);
      
      // If storage is full, remove oldest drafts
      if (error instanceof DOMException && error.code === 22) {
        const reducedDrafts = drafts.slice(0, Math.floor(this.MAX_DRAFTS / 2));
        try {
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
            drafts: reducedDrafts,
            currentDraftId: this.currentDraftId
          }));
        } catch (retryError) {
          console.error('Failed to save reduced drafts:', retryError);
        }
      }
    }
  }
  
  private loadDrafts(): void {
    if (typeof window === 'undefined') return;
    
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const draftList: DraftList = JSON.parse(stored);
        this.currentDraftId = draftList.currentDraftId;
      } catch (error) {
        console.error('Failed to load draft list:', error);
      }
    }
  }
  
  private generateId(): string {
    return `draft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  private startAutoSave(): void {
    if (typeof window === 'undefined') return;
    
    this.stopAutoSave();
    
    if (this.autoSaveEnabled) {
      this.autoSaveInterval = setInterval(() => {
        // Auto-save will be triggered by the component using the manager
        window.dispatchEvent(new CustomEvent('draft-autosave'));
      }, this.AUTO_SAVE_INTERVAL);
    }
  }
  
  private stopAutoSave(): void {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
      this.autoSaveInterval = undefined;
    }
  }
}

// Export singleton instance
export const draftManager = DraftManager.getInstance();