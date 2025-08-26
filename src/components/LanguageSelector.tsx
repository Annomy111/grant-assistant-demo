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
      <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border hover:bg-gray-50 transition-colors">
        <Globe className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium">
          {languages.find(l => l.code === language)?.flag} {language.toUpperCase()}
        </span>
      </button>
      
      <div className="absolute top-full right-0 mt-1 hidden group-hover:block bg-white border rounded-lg shadow-lg z-10">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`
              flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-gray-50
              ${language === lang.code ? 'bg-blue-50 text-blue-600' : ''}
            `}
          >
            <span className="text-xl">{lang.flag}</span>
            <span className="text-sm">{lang.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}