/**
 * IndexedDBAdapter - Advanced storage using IndexedDB
 * Provides better performance and larger storage capacity
 */

import { StorageAdapter } from './StorageAdapter';

export class IndexedDBAdapter implements StorageAdapter {
  private dbName = 'GrantAssistantDB';
  private storeName = 'sessions';
  private db: IDBDatabase | null = null;
  private version = 1;
  
  async initialize(): Promise<void> {
    if (typeof window === 'undefined' || !window.indexedDB) {
      throw new Error('IndexedDB is not available in this environment');
    }
    
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => {
        reject(new Error('Failed to open IndexedDB'));
      };
      
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object store if it doesn't exist
        if (!db.objectStoreNames.contains(this.storeName)) {
          const objectStore = db.createObjectStore(this.storeName, { 
            keyPath: 'key' 
          });
          
          // Create indexes for efficient querying
          objectStore.createIndex('timestamp', 'timestamp', { unique: false });
          objectStore.createIndex('prefix', 'prefix', { unique: false });
        }
      };
    });
  }
  
  private ensureDb(): void {
    if (!this.db) {
      throw new Error('IndexedDB not initialized. Call initialize() first.');
    }
  }
  
  async get<T>(key: string): Promise<T | null> {
    this.ensureDb();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.get(key);
      
      request.onerror = () => {
        reject(new Error(`Failed to get ${key} from IndexedDB`));
      };
      
      request.onsuccess = () => {
        const result = request.result;
        if (result) {
          resolve(result.value as T);
        } else {
          resolve(null);
        }
      };
    });
  }
  
  async set(key: string, value: any): Promise<void> {
    this.ensureDb();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const objectStore = transaction.objectStore(this.storeName);
      
      // Extract prefix from key (everything before the last underscore)
      const lastUnderscoreIndex = key.lastIndexOf('_');
      const prefix = lastUnderscoreIndex > 0 ? key.substring(0, lastUnderscoreIndex + 1) : '';
      
      const data = {
        key,
        value,
        timestamp: new Date().toISOString(),
        prefix
      };
      
      const request = objectStore.put(data);
      
      request.onerror = () => {
        reject(new Error(`Failed to set ${key} in IndexedDB`));
      };
      
      request.onsuccess = () => {
        resolve();
      };
    });
  }
  
  async remove(key: string): Promise<void> {
    this.ensureDb();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.delete(key);
      
      request.onerror = () => {
        reject(new Error(`Failed to remove ${key} from IndexedDB`));
      };
      
      request.onsuccess = () => {
        resolve();
      };
    });
  }
  
  async getAll<T>(prefix: string): Promise<T[]> {
    this.ensureDb();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const objectStore = transaction.objectStore(this.storeName);
      const results: T[] = [];
      
      const request = objectStore.openCursor();
      
      request.onerror = () => {
        reject(new Error('Failed to iterate IndexedDB'));
      };
      
      request.onsuccess = () => {
        const cursor = request.result;
        
        if (cursor) {
          if (cursor.value.key.startsWith(prefix)) {
            results.push(cursor.value.value as T);
          }
          cursor.continue();
        } else {
          // No more entries
          resolve(results);
        }
      };
    });
  }
  
  async clearAll(prefix: string): Promise<void> {
    this.ensureDb();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const objectStore = transaction.objectStore(this.storeName);
      const keysToDelete: string[] = [];
      
      const request = objectStore.openCursor();
      
      request.onerror = () => {
        reject(new Error('Failed to iterate IndexedDB'));
      };
      
      request.onsuccess = () => {
        const cursor = request.result;
        
        if (cursor) {
          if (cursor.value.key.startsWith(prefix)) {
            keysToDelete.push(cursor.value.key);
          }
          cursor.continue();
        } else {
          // Delete all matching keys
          const deleteTransaction = this.db!.transaction([this.storeName], 'readwrite');
          const deleteStore = deleteTransaction.objectStore(this.storeName);
          
          let deleteCount = 0;
          keysToDelete.forEach(key => {
            deleteStore.delete(key).onsuccess = () => {
              deleteCount++;
              if (deleteCount === keysToDelete.length) {
                resolve();
              }
            };
          });
          
          if (keysToDelete.length === 0) {
            resolve();
          }
        }
      };
    });
  }
  
  async exists(key: string): Promise<boolean> {
    const value = await this.get(key);
    return value !== null;
  }
  
  async getSize(): Promise<number> {
    this.ensureDb();
    
    return new Promise((resolve, reject) => {
      // Use navigator.storage.estimate() for more accurate size
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        navigator.storage.estimate().then(estimate => {
          resolve(estimate.usage || 0);
        }).catch(() => {
          // Fallback to manual calculation
          this.calculateSizeManually().then(resolve).catch(reject);
        });
      } else {
        // Fallback to manual calculation
        this.calculateSizeManually().then(resolve).catch(reject);
      }
    });
  }
  
  private async calculateSizeManually(): Promise<number> {
    this.ensureDb();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const objectStore = transaction.objectStore(this.storeName);
      let totalSize = 0;
      
      const request = objectStore.openCursor();
      
      request.onerror = () => {
        reject(new Error('Failed to calculate size'));
      };
      
      request.onsuccess = () => {
        const cursor = request.result;
        
        if (cursor) {
          // Estimate size of the stored data
          const dataStr = JSON.stringify(cursor.value);
          totalSize += dataStr.length * 2; // UTF-16 encoding
          cursor.continue();
        } else {
          resolve(totalSize);
        }
      };
    });
  }
  
  async clear(): Promise<void> {
    this.ensureDb();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.clear();
      
      request.onerror = () => {
        reject(new Error('Failed to clear IndexedDB'));
      };
      
      request.onsuccess = () => {
        resolve();
      };
    });
  }
  
  /**
   * Close the database connection
   */
  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}

/**
 * Factory function to create the best available storage adapter
 */
export function createBestStorageAdapter(): StorageAdapter {
  if (typeof window === 'undefined') {
    // Server-side, return a mock adapter
    throw new Error('Storage adapters are only available in browser environment');
  }
  
  // Prefer IndexedDB for better performance and capacity
  if (window.indexedDB) {
    return new IndexedDBAdapter();
  }
  
  // Fallback to localStorage
  if (window.localStorage) {
    const { LocalStorageAdapter } = require('./StorageAdapter');
    return new LocalStorageAdapter();
  }
  
  throw new Error('No suitable storage adapter available');
}