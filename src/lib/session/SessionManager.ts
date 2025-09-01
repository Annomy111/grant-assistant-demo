/**
 * SessionManager - Automated session management with data validation
 * Handles session lifecycle, data validation, and storage
 */

import { ApplicationContext } from '../context/ApplicationContextManager';
import { InputValidator } from '../validation/InputValidator';
import { StorageAdapter, LocalStorageAdapter } from '../storage/StorageAdapter';
import { IndexedDBAdapter } from '../storage/IndexedDBAdapter';

export interface Session {
  id: string;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  version: number;
  context: ApplicationContext;
  metadata: {
    userAgent?: string;
    language?: string;
    invalidAttempts?: number;
  };
}

export interface SessionConfig {
  sessionDuration?: number; // in hours, default 24
  maxInvalidAttempts?: number; // default 10
  autoCleanup?: boolean; // default true
  storageAdapter?: StorageAdapter;
}

export class SessionManager {
  private static instance: SessionManager;
  private currentSession: Session | null = null;
  private validator: InputValidator;
  private storage: StorageAdapter;
  private config: Required<SessionConfig>;
  private listeners: ((session: Session | null) => void)[] = [];
  
  private readonly SESSION_VERSION = 1;
  private readonly SESSION_KEY_PREFIX = 'grant_session_';
  
  private constructor(config?: SessionConfig) {
    this.config = {
      sessionDuration: config?.sessionDuration || 24,
      maxInvalidAttempts: config?.maxInvalidAttempts || 10,
      autoCleanup: config?.autoCleanup !== false,
      storageAdapter: config?.storageAdapter || this.getDefaultStorageAdapter()
    };
    
    this.validator = InputValidator.getInstance();
    this.storage = this.config.storageAdapter;
    
    // Only initialize in browser environment
    if (typeof window !== 'undefined') {
      this.initialize();
    }
  }
  
  private getDefaultStorageAdapter(): StorageAdapter {
    // Use LocalStorageAdapter as default to avoid SSR issues and IndexedDB initialization issues
    if (typeof window !== 'undefined') {
      // For now, just use LocalStorageAdapter to avoid the IndexedDB initialization issue
      return new LocalStorageAdapter();
    }
    // Return a mock adapter for SSR
    return new LocalStorageAdapter();
  }
  
  public static getInstance(config?: SessionConfig): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager(config);
    }
    return SessionManager.instance;
  }
  
  /**
   * Initialize session manager
   */
  private async initialize(): Promise<void> {
    // Initialize storage
    await this.storage.initialize();
    
    // Load existing session or create new one
    await this.loadOrCreateSession();
    
    // Set up auto-cleanup if enabled
    if (this.config.autoCleanup) {
      this.scheduleCleanup();
    }
    
    // Migrate old localStorage data if exists
    await this.migrateOldData();
  }
  
  /**
   * Create a new session
   */
  public async createSession(): Promise<string> {
    const sessionId = this.generateSessionId();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + this.config.sessionDuration * 60 * 60 * 1000);
    
    this.currentSession = {
      id: sessionId,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      version: this.SESSION_VERSION,
      context: {},
      metadata: {
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
        language: typeof navigator !== 'undefined' ? navigator.language : undefined,
        invalidAttempts: 0
      }
    };
    
    await this.saveSession();
    this.notifyListeners();
    
    return sessionId;
  }
  
  /**
   * Ensure initialized (for client-side calls)
   */
  private async ensureInitialized(): Promise<void> {
    if (typeof window === 'undefined') return;
    
    if (!this.storage) {
      this.storage = this.getDefaultStorageAdapter();
      await this.initialize();
    }
  }
  
  /**
   * Validate and store a context field
   */
  public async validateAndStore(field: string, value: any): Promise<boolean> {
    await this.ensureInitialized();
    
    if (!this.currentSession) {
      await this.createSession();
    }
    
    // Check if we've exceeded invalid attempts
    if ((this.currentSession!.metadata.invalidAttempts || 0) >= this.config.maxInvalidAttempts) {
      await this.createSession();
    }
    
    // Validate the input
    const validation = this.validator.validate(field, value);
    
    if (!validation.isValid) {
      // Increment invalid attempts
      if (this.currentSession) {
        this.currentSession.metadata.invalidAttempts = 
          (this.currentSession.metadata.invalidAttempts || 0) + 1;
        await this.saveSession();
      }
      
      return false;
    }
    
    // Store the validated value
    if (this.currentSession) {
      this.currentSession.context = {
        ...this.currentSession.context,
        [field]: validation.sanitizedValue || value
      };
      this.currentSession.updatedAt = new Date().toISOString();
      
      // Reset invalid attempts on successful validation
      this.currentSession.metadata.invalidAttempts = 0;
      
      await this.saveSession();
      this.notifyListeners();
    }
    
    return true;
  }
  
  /**
   * Get validated context
   */
  public getValidatedContext(): ApplicationContext {
    if (!this.currentSession) {
      return {};
    }
    
    // Re-validate all fields before returning
    const validatedContext: ApplicationContext = {};
    
    for (const [field, value] of Object.entries(this.currentSession.context)) {
      const validation = this.validator.validate(field, value);
      if (validation.isValid) {
        validatedContext[field as keyof ApplicationContext] = validation.sanitizedValue || value;
      }
    }
    
    return validatedContext;
  }
  
  /**
   * Clear invalid data from session
   */
  public async clearInvalidData(): Promise<void> {
    if (!this.currentSession) return;
    
    const validatedContext: ApplicationContext = {};
    let hasInvalid = false;
    
    for (const [field, value] of Object.entries(this.currentSession.context)) {
      const validation = this.validator.validate(field, value);
      if (validation.isValid) {
        validatedContext[field as keyof ApplicationContext] = validation.sanitizedValue || value;
      } else {
        hasInvalid = true;
      }
    }
    
    if (hasInvalid) {
      this.currentSession.context = validatedContext;
      this.currentSession.updatedAt = new Date().toISOString();
      await this.saveSession();
      this.notifyListeners();
    }
  }
  
  /**
   * Export session for debugging
   */
  public exportSession(): string {
    if (!this.currentSession) {
      return JSON.stringify({ error: 'No active session' });
    }
    
    return JSON.stringify(this.currentSession, null, 2);
  }
  
  /**
   * Import session (for testing/debugging)
   */
  public async importSession(data: string): Promise<boolean> {
    try {
      const session = JSON.parse(data) as Session;
      
      // Validate session structure
      if (!session.id || !session.version || !session.context) {
        throw new Error('Invalid session structure');
      }
      
      // Validate all context fields
      const validatedContext: ApplicationContext = {};
      for (const [field, value] of Object.entries(session.context)) {
        const validation = this.validator.validate(field, value);
        if (validation.isValid) {
          validatedContext[field as keyof ApplicationContext] = validation.sanitizedValue || value;
        }
      }
      
      session.context = validatedContext;
      session.updatedAt = new Date().toISOString();
      
      this.currentSession = session;
      await this.saveSession();
      this.notifyListeners();
      
      return true;
    } catch (error) {
      return false;
    }
  }
  
  /**
   * Clear current session
   */
  public async clearSession(): Promise<void> {
    if (this.currentSession) {
      await this.storage.remove(this.SESSION_KEY_PREFIX + this.currentSession.id);
    }
    this.currentSession = null;
    this.notifyListeners();
  }
  
  /**
   * Get current session
   */
  public getCurrentSession(): Session | null {
    return this.currentSession;
  }
  
  /**
   * Subscribe to session changes
   */
  public subscribe(listener: (session: Session | null) => void): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
  
  // Private helper methods
  
  private generateSessionId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  private async saveSession(): Promise<void> {
    if (!this.currentSession) return;
    
    await this.storage.set(
      this.SESSION_KEY_PREFIX + this.currentSession.id,
      this.currentSession
    );
  }
  
  private async loadOrCreateSession(): Promise<void> {
    // Try to load the most recent valid session
    const sessions = await this.storage.getAll<Session>(this.SESSION_KEY_PREFIX);
    
    if (sessions.length > 0) {
      // Sort by updated date and find the most recent valid session
      const validSessions = sessions
        .filter(s => new Date(s.expiresAt) > new Date())
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      
      if (validSessions.length > 0) {
        this.currentSession = validSessions[0];
        
        // Clear invalid data on load
        await this.clearInvalidData();
        
        return;
      }
    }
    
    // No valid session found, create new one
    await this.createSession();
  }
  
  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      listener(this.currentSession);
    });
  }
  
  private scheduleCleanup(): void {
    // Run cleanup every hour
    setInterval(async () => {
      await this.cleanupExpiredSessions();
    }, 60 * 60 * 1000);
    
    // Run initial cleanup
    this.cleanupExpiredSessions();
  }
  
  private async cleanupExpiredSessions(): Promise<void> {
    const sessions = await this.storage.getAll<Session>(this.SESSION_KEY_PREFIX);
    const now = new Date();
    
    for (const session of sessions) {
      if (new Date(session.expiresAt) < now) {
        await this.storage.remove(this.SESSION_KEY_PREFIX + session.id);
      }
    }
  }
  
  private async migrateOldData(): Promise<void> {
    if (typeof window === 'undefined') return;
    
    // Check for old localStorage data
    const oldContext = localStorage.getItem('grant-application-context');
    const oldState = localStorage.getItem('grant-assistant-state');
    
    if (oldContext || oldState) {
      try {
        if (oldContext) {
          const context = JSON.parse(oldContext);
          
          // Validate and store each field
          for (const [field, value] of Object.entries(context)) {
            await this.validateAndStore(field, value);
          }
          
          // Remove old data after successful migration
          localStorage.removeItem('grant-application-context');
        }
        
        if (oldState) {
          // We don't need to migrate the full state, just mark it as migrated
          localStorage.removeItem('grant-assistant-state');
        }
        
        console.log('[SessionManager] Migration completed successfully');
      } catch (error) {
        console.error('[SessionManager] Migration failed:', error);
      }
    }
  }
}