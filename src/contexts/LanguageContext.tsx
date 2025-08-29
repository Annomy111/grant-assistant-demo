'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, getTranslation, interpolate } from '@/lib/i18n/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, any>) => string;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'grant-assistant-language';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('de');
  const [isLoading, setIsLoading] = useState(true);
  
  // Load saved language preference on mount
  useEffect(() => {
    const loadLanguage = () => {
      try {
        // Check localStorage for saved preference
        const savedLang = localStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (savedLang && ['de', 'uk', 'en'].includes(savedLang)) {
          setLanguageState(savedLang as Language);
        } else {
          // Try to detect from browser language
          const browserLang = navigator.language.toLowerCase();
          if (browserLang.startsWith('uk')) {
            setLanguageState('uk');
          } else if (browserLang.startsWith('en')) {
            setLanguageState('en');
          } else if (browserLang.startsWith('de')) {
            setLanguageState('de');
          }
          // Default is already 'de'
        }
      } catch (error) {
        console.error('Failed to load language preference:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadLanguage();
  }, []);
  
  // Enhanced setLanguage that persists to localStorage
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      // Update HTML lang attribute
      document.documentElement.lang = lang;
    } catch (error) {
      console.error('Failed to save language preference:', error);
    }
  };
  
  // Enhanced translation function with interpolation
  const t = (key: string, params?: Record<string, any>) => {
    const translation = getTranslation(language, key);
    if (params) {
      return interpolate(translation, params);
    }
    return translation;
  };
  
  // Update HTML lang attribute when language changes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isLoading }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}