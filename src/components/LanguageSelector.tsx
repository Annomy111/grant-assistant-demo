'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Language } from '@/lib/i18n/translations';
import { Globe } from 'lucide-react';

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  
  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'uk', label: 'Українська', flag: '🇺🇦' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
  ];
  
  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border transition-colors"
        style={{ borderColor: 'rgba(48, 73, 69, 0.2)' }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(48, 73, 69, 0.05)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white'; }}>
        <Globe className="w-4 h-4" style={{ color: '#304945' }} />
        <span className="text-sm font-medium">
          {languages.find(l => l.code === language)?.flag} {language.toUpperCase()}
        </span>
      </button>
      
      <div className="absolute top-full right-0 mt-1 hidden group-hover:block bg-white border rounded-lg shadow-lg z-10">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className="flex items-center gap-3 w-full px-4 py-2 text-left transition-colors"
            style={{ 
              backgroundColor: language === lang.code ? 'rgba(48, 73, 69, 0.1)' : 'transparent',
              color: language === lang.code ? '#304945' : 'inherit'
            }}
            onMouseEnter={(e) => { 
              if (language !== lang.code) e.currentTarget.style.backgroundColor = 'rgba(48, 73, 69, 0.05)';
            }}
            onMouseLeave={(e) => { 
              if (language !== lang.code) e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <span className="text-xl">{lang.flag}</span>
            <span className="text-sm">{lang.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}