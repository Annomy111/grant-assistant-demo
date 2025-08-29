/**
 * StorageAdapter - Abstract storage interface
 * Allows switching between different storage mechanisms
 */

export interface StorageAdapter {
  /**
   * Initialize the storage adapter
   */
  initialize(): Promise<void>;
  
  /**
   * Get a value from storage
   */
  get<T>(key: string): Promise<T | null>;
  
  /**
   * Set a value in storage
   */
  set(key: string, value: any): Promise<void>;
  
  /**
   * Remove a value from storage
   */
  remove(key: string): Promise<void>;
  
  /**
   * Get all values with a key prefix
   */
  getAll<T>(prefix: string): Promise<T[]>;
  
  /**
   * Clear all values with a key prefix
   */
  clearAll(prefix: string): Promise<void>;
  
  /**
   * Check if a key exists
   */
  exists(key: string): Promise<boolean>;
  
  /**
   * Get storage size in bytes
   */
  getSize(): Promise<number>;
  
  /**
   * Clear all storage
   */
  clear(): Promise<void>;
}

/**
 * LocalStorage adapter for simple storage needs
 */
export class LocalStorageAdapter implements StorageAdapter {
  async initialize(): Promise<void> {
    // LocalStorage is always available in browser
    if (typeof window === 'undefined') {
      throw new Error('LocalStorage is not available in this environment');
    }
  }
  
  async get<T>(key: string): Promise<T | null> {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return null;
      return JSON.parse(item);
    } catch (error) {
      console.error(`Failed to get ${key} from localStorage:`, error);
      return null;
    }
  }
  
  async set(key: string, value: any): Promise<void> {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Failed to set ${key} in localStorage:`, error);
      throw error;
    }
  }
  
  async remove(key: string): Promise<void> {
    localStorage.removeItem(key);
  }
  
  async getAll<T>(prefix: string): Promise<T[]> {
    const results: T[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        const value = await this.get<T>(key);
        if (value) results.push(value);
      }
    }
    
    return results;
  }
  
  async clearAll(prefix: string): Promise<void> {
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
  }
  
  async exists(key: string): Promise<boolean> {
    return localStorage.getItem(key) !== null;
  }
  
  async getSize(): Promise<number> {
    let size = 0;
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (value) {
          size += key.length + value.length;
        }
      }
    }
    
    // Approximate size in bytes (characters * 2 for UTF-16)
    return size * 2;
  }
  
  async clear(): Promise<void> {
    localStorage.clear();
  }
}

/**
 * SessionStorage adapter for temporary storage
 */
export class SessionStorageAdapter implements StorageAdapter {
  async initialize(): Promise<void> {
    if (typeof window === 'undefined') {
      throw new Error('SessionStorage is not available in this environment');
    }
  }
  
  async get<T>(key: string): Promise<T | null> {
    try {
      const item = sessionStorage.getItem(key);
      if (item === null) return null;
      return JSON.parse(item);
    } catch (error) {
      console.error(`Failed to get ${key} from sessionStorage:`, error);
      return null;
    }
  }
  
  async set(key: string, value: any): Promise<void> {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Failed to set ${key} in sessionStorage:`, error);
      throw error;
    }
  }
  
  async remove(key: string): Promise<void> {
    sessionStorage.removeItem(key);
  }
  
  async getAll<T>(prefix: string): Promise<T[]> {
    const results: T[] = [];
    
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith(prefix)) {
        const value = await this.get<T>(key);
        if (value) results.push(value);
      }
    }
    
    return results;
  }
  
  async clearAll(prefix: string): Promise<void> {
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith(prefix)) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => sessionStorage.removeItem(key));
  }
  
  async exists(key: string): Promise<boolean> {
    return sessionStorage.getItem(key) !== null;
  }
  
  async getSize(): Promise<number> {
    let size = 0;
    
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key) {
        const value = sessionStorage.getItem(key);
        if (value) {
          size += key.length + value.length;
        }
      }
    }
    
    return size * 2;
  }
  
  async clear(): Promise<void> {
    sessionStorage.clear();
  }
}