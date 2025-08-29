import { translationsUk } from './translations-uk';
import { translationsEn } from './translations-en';

export const translations = {
  de: {
    common: {
      welcome: 'Willkommen',
      next: 'Weiter',
      back: 'Zurück',
      save: 'Speichern',
      cancel: 'Abbrechen',
      submit: 'Einreichen',
      loading: 'Lädt...',
      error: 'Fehler',
      success: 'Erfolgreich',
    },
    landing: {
      title: 'DEUTSCH-UKRAINISCHES BÜRO',
      subtitle: 'Analytics • Advocacy • Solutions',
      heroTitle: 'Ihr Wegweiser zu EU-Förderungen',
      heroSubtitle: 'Professionelle Unterstützung für deutsche und ukrainische Organisationen bei EU-Anträgen',
      startButton: 'Jetzt starten',
      learnMore: 'Mehr erfahren',
    },
    horizonInfo: {
      title: 'Horizon Europe 2025 – Das weltweit größte Forschungsprogramm',
      budget: {
        value: '€438 Mio',
        description: 'Cluster 2 Budget 2025 (+34% vs 2024)',
      },
      funding: {
        value: '100%',
        description: 'Förderquote für Forschung',
      },
      typical: {
        value: '€2-5 Mio',
        description: 'Typische Projektförderung',
      },
      pillar1: {
        title: 'Pillar I: Excellent Science',
        description: 'European Research Council (ERC), Marie Skłodowska-Curie Actions, Research Infrastructures',
      },
      pillar2: {
        title: 'Pillar II: Global Challenges',
        description: 'Health, Culture, Civil Security, Digital, Climate, Energy, Mobility, Food & Natural Resources',
      },
      pillar3: {
        title: 'Pillar III: Innovative Europe',
        description: 'European Innovation Council, European Innovation Ecosystems, European Institute of Innovation',
      },
    },
    process: {
      title: 'Unser Prozess',
      step1: {
        title: 'Projektanalyse & Beratung',
        description: 'Evaluation Ihrer Projektidee, Identifikation passender Förderprogramme und Calls, Machbarkeitsanalyse und strategische Beratung.',
      },
      step2: {
        title: 'Konsortiumsbildung',
        description: 'Partnersuche in Deutschland und Ukraine, Netzwerkzugang zu Forschungseinrichtungen, NGOs und Unternehmen, Koordination der Zusammenarbeit.',
      },
      step3: {
        title: 'Antragsstellung',
        description: 'KI-gestützte Formulierungshilfen, Budgetplanung und Work Package Strukturierung, Impact Assessment und Dissemination Strategy.',
      },
      step4: {
        title: 'Review & Einreichung',
        description: 'Qualitätskontrolle durch Experten, Compliance Check, technische Unterstützung bei der Einreichung über das EU Portal.',
      },
    },
    ukraine: {
      title: 'Ukraine-Spezifische Möglichkeiten',
      horizon: {
        title: 'Horizon Europe für Ukraine',
        item1: '<strong>Volle Assoziierung seit 09.06.2022:</strong> Gleichberechtigte Teilnahme, keine Finanzbeiträge erforderlich',
        item2: '<strong>Horizon Europe Office Kyiv:</strong> Eröffnet Dezember 2023 für technische Unterstützung',
        item3: '<strong>Verpflichtende UA-Teilnahme 2025:</strong> Spezifische Topics in Cluster 3 & 4',
      },
      msca: {
        title: 'MSCA4Ukraine Status 2025',
        item1: '<strong>176 Forschende unterstützt:</strong> In 24 Gastländern (Stand: Q1 2025)',
        item2: '<strong>Management-Call offen:</strong> Bis 16.09.2025 für Verwaltungsorganisation',
        item3: '<strong>Keine weiteren Fellowship-Calls:</strong> Aktuell keine neuen Ausschreibungen geplant',
      },
      historicalSuccess: '<strong>Historischer Erfolg:</strong> Unter Horizon 2020 war Ukraine an 230 Projekten mit 323 Teilnehmern beteiligt (€45.5M Förderung) - besonders stark in MSCA, Energie und Klima.',
    },
    cerv: {
      title: 'CERV Programme – Ukraine seit 09.01.2024 assoziiert',
      description: '<strong>NEU:</strong> Ukraine nimmt seit Januar 2024 am CERV-Programm teil. Zugang zu allen Bereichen außer "Union Values". Besonderer Fokus auf Kinder aus der Ukraine in der CERV-2025-CHILD Ausschreibung (29.04.2025 Deadline).',
      area1: {
        title: 'Gleichheit & Rechte',
        description: 'Anti-Diskriminierung und Gleichstellung',
      },
      area2: {
        title: 'Bürgerbeteiligung',
        description: 'Demokratische Partizipation',
      },
      area3: {
        title: 'Daphne',
        description: 'Gewaltprävention und Opferschutz',
      },
      area4: {
        title: 'EU-Werte',
        description: 'Förderung gemeinsamer Werte',
      },
    },
    expertise: {
      title: 'Unsere Expertise',
      cooperation: {
        title: 'EU-Ukraine Kooperation',
        description: 'Als Deutsch-Ukrainisches Büro verfügen wir über einzigartige Expertise in der Förderung bilateraler Kooperationen. Wir kennen die regulatorischen Rahmenbedingungen beider Länder und unterstützen Sie bei:',
        item1: 'Associated Country Status der Ukraine in Horizon Europe',
        item2: 'Civil Society Facility Programme',
        item3: 'ERASMUS+ Capacity Building',
      },
      thematic: {
        title: 'Thematische Schwerpunkte',
        description: 'Unsere Expertise erstreckt sich über verschiedene Horizon Europe Cluster mit besonderem Fokus auf:',
        cluster2: 'Cluster 2: Culture, Creativity & Inclusive Society',
        cluster3: 'Cluster 3: Civil Security for Society',
        cluster6: 'Cluster 6: Food, Bioeconomy & Natural Resources',
      },
    },
    deadlines: {
      title: 'Aktuelle Ausschreibungen 2025',
      important: 'Wichtige Termine 2025',
      date1: '15. Mai 2025: Cluster 2 Calls öffnen & Info Day',
      date2: '16. Mai 2025: Brokerage Event für Konsortiumsbildung',
      date3: '16. September 2025: Deadline für alle Cluster 2 Calls (First Stage)',
      date4: '17. März 2026: Second Stage Deadline für zweistufige Calls',
      date5: 'November 2025: Erwartete Cluster 3 Calls mit UA-Verpflichtung',
      deadline: 'Deadline',
      expected: 'Erwartet',
      call1: {
        description: 'Counter disinformation & FIMI (€3-3.5M per project)',
      },
      call2: {
        description: 'Understanding autocratic appeal (€10.5M total, nature & drivers research)',
      },
      call3: {
        description: 'Cultural Heritage topics (€82.5M total budget, €2.5-4M per project)',
      },
      call4: {
        description: 'Organization to manage next phase (No new fellowships planned)',
      },
      call5: {
        description: "Children's rights incl. Ukrainian refugees (Deadline: 29.04.2025)",
      },
    },
    features: {
      title: 'Plattform Features',
      templates: {
        title: 'Template Library',
        description: 'Vorgefertigte Templates für alle Horizon Europe Antragstypen',
      },
      partners: {
        title: 'Partner Matching',
        description: 'Zugang zu unserem Netzwerk qualifizierter Projektpartner',
      },
      multilingual: {
        title: 'Multilingual',
        description: 'Verfügbar in Deutsch, Ukrainisch und Englisch',
      },
      gdpr: {
        title: 'GDPR Compliant',
        description: 'Vollständige Datenschutz-Compliance nach EU-Standards',
      },
    },
    cta: {
      title: 'Bereit für Ihren EU-Antrag?',
      subtitle: 'Nutzen Sie unsere KI-gestützte Plattform und die Expertise des Deutsch-Ukrainischen Büros für Ihren erfolgreichen EU-Förderantrag.',
      button: 'Jetzt Starten',
      disclaimer: 'Keine Registrierung erforderlich • Kostenlose Erstberatung',
    },
    navigation: {
      back: 'Zurück zur Übersicht',
    },
    chat: {
      welcome: `Willkommen beim KI-Antragsassistenten! 🎯

Ich helfe Ihnen bei der Erstellung Ihres EU Horizon Europe Antrags. Der Prozess ist in übersichtliche Schritte unterteilt:

1. **Grundlegende Informationen** - Organisation und Projektübersicht
2. **Excellence** - Ziele und Methodik
3. **Impact** - Erwartete Wirkung und Verbreitung
4. **Implementation** - Arbeitsplan und Ressourcen

Lassen Sie uns mit den grundlegenden Informationen beginnen. Wie heißt Ihre Organisation?`,
      validationError: 'Validierungsfehler',
      errorMessage: 'Entschuldigung, es gab einen Fehler. Bitte versuchen Sie es erneut.',
      inputPlaceholder: 'Schreiben Sie Ihre Nachricht...',
      attachFile: 'Datei anhängen',
      voiceInput: 'Spracheingabe',
      quickActions: {
        cluster2Prompt: 'Welche Cluster 2 Calls öffnen im Mai 2025 und was sind die Schwerpunkte?',
        cervUkrainePrompt: 'Welche CERV-Möglichkeiten gibt es für ukrainische Organisationen 2025?',
        uaMandatoryPrompt: 'Bei welchen Topics ist die Ukraine-Teilnahme verpflichtend?',
        twoStagePrompt: 'Wie funktioniert das zweistufige Antragsverfahren mit Deadlines 2025/2026?',
      },
    },
    quickActions: {
      templates: 'Templates',
      cluster2: 'Cluster 2 (Mai 2025)',
      cervUkraine: 'CERV für Ukraine',
      uaMandatory: 'UA-Pflicht Topics',
      twoStage: '2-Stage Prozess',
    },
    steps: {
      introduction: {
        title: 'Grundlagen',
        description: 'Organisation & Projekt',
      },
      excellence: {
        title: 'Excellence',
        description: 'Ziele & Methodik',
      },
      impact: {
        title: 'Impact',
        description: 'Wirkung & Verbreitung',
      },
      implementation: {
        title: 'Implementation',
        description: 'Arbeitsplan & Ressourcen',
      },
      review: {
        title: 'Überprüfung',
        description: 'Finale Kontrolle',
      },
    },
  },
  uk: translationsUk,
  en: translationsEn,
};

export type Language = keyof typeof translations;
export type TranslationKey = string;

export function getTranslation(lang: Language, key: string): string {
  const keys = key.split('.');
  let value: any = translations[lang];
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  return value || key;
}

export function interpolate(text: string, params: Record<string, any>): string {
  return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return params[key] !== undefined ? String(params[key]) : match;
  });
}

export function getAvailableLanguages(): Language[] {
  return Object.keys(translations) as Language[];
}

export function getLanguageName(lang: Language): string {
  const names = {
    de: 'Deutsch',
    uk: 'Українська',
    en: 'English',
  };
  return names[lang] || lang;
}

export function getLanguageFlag(lang: Language): string {
  const flags = {
    de: '🇩🇪',
    uk: '🇺🇦',
    en: '🇬🇧',
  };
  return flags[lang] || '🌐';
}