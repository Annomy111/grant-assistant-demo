/**
 * Blacklist - Contains generic phrases and validation rules
 * Used by InputValidator to prevent invalid data from being stored
 */

import { FieldValidationRule } from './InputValidator';

/**
 * Generic phrases that should not be stored as context values
 */
export const BLACKLISTED_PHRASES = {
  // German generic prompts
  phrases: {
    german: [
      'legen wir los',
      'los gehts',
      'los geht\'s',
      'los',
      'weiter',
      'weitermachen',
      'machen wir weiter',
      'ok',
      'okay',
      'gut',
      'sehr gut',
      'prima',
      'super',
      'ja',
      'nein',
      'vielleicht',
      'bitte',
      'danke',
      'gerne',
      'verstanden',
      'verstehe',
      'alles klar',
      'klar',
      'natürlich',
      'sicher',
      'genau',
      'richtig',
      'falsch',
      'stimmt',
      'passt',
      'geht klar',
      'machen wir',
      'machen wir so',
      'einverstanden',
      'perfekt',
      'starten',
      'beginnen',
      'anfangen',
      'start',
      'fortfahren',
      'fortsetzen',
      'nächster schritt',
      'nächste frage',
      'weiter zur nächsten',
      'test',
      'teste',
      'testen',
      'check',
      'checken',
      'prüfen',
      'überprüfen',
      'kontrolle',
      'kontrollieren',
      'hilfe',
      'help',
      'was nun',
      'was jetzt',
      'wie weiter',
      'und jetzt',
      'fertig',
      'ende',
      'stopp',
      'stop',
      'halt',
      'warte',
      'moment',
      'einen moment',
      'sekunde',
      'pause',
      'lass uns',
      'lasst uns',
      'lass mich',
      'zeig mir',
      'zeige mir',
      'gib mir',
      'gebe mir',
      'sage mir',
      'sag mir',
      'erkläre',
      'erklären',
      'keine ahnung',
      'weiß nicht',
      'bin unsicher',
      'nicht sicher',
      'vielleicht später',
      'später',
      'nachher',
      'morgen',
      'heute',
      'jetzt',
      'sofort',
      'gleich',
      'bald',
      'irgendwann',
      'niemals',
      'immer',
      'manchmal',
      'ab und zu',
      'gelegentlich',
      'oft',
      'selten',
      'nie',
      'warum',
      'wieso',
      'weshalb',
      'wozu',
      'wofür',
      'was',
      'wer',
      'wie',
      'wo',
      'wann',
      'welche',
      'welcher',
      'welches',
      'yes',
      'no',
      'ahh das stimmt ha auch nicht',
      'das stimmt nicht',
      'falsch',
      'fehler',
      'korrigiere',
      'korrektur',
      'ändern',
      'anpassen',
      'bearbeiten',
      'zurück',
      'nochmal',
      'wiederholen',
      'wiederhole',
      'erneut',
      'noch einmal',
      'von vorne',
      'neustart',
      'reset',
      'löschen',
      'entfernen',
      'abbrechen',
      'beenden',
      'schließen',
      'exit'
    ],
    english: [
      'continue',
      'next',
      'proceed',
      'go on',
      'go ahead',
      'keep going',
      'carry on',
      'move on',
      'move forward',
      'advance',
      'progress',
      'ok',
      'okay',
      'alright',
      'fine',
      'good',
      'great',
      'excellent',
      'perfect',
      'wonderful',
      'awesome',
      'cool',
      'nice',
      'yes',
      'no',
      'maybe',
      'perhaps',
      'possibly',
      'please',
      'thanks',
      'thank you',
      'cheers',
      'understood',
      'got it',
      'i see',
      'i understand',
      'sure',
      'certainly',
      'definitely',
      'absolutely',
      'exactly',
      'right',
      'correct',
      'wrong',
      'incorrect',
      'agreed',
      'agree',
      'disagree',
      'start',
      'begin',
      'commence',
      'initiate',
      'launch',
      'test',
      'testing',
      'check',
      'checking',
      'verify',
      'validate',
      'confirm',
      'help',
      'assist',
      'support',
      'aid',
      'guide',
      'what now',
      'what next',
      'now what',
      'then what',
      'done',
      'finished',
      'complete',
      'ready',
      'stop',
      'halt',
      'pause',
      'wait',
      'hold on',
      'one moment',
      'just a moment',
      'second',
      'minute',
      'let us',
      'lets',
      'let me',
      'show me',
      'tell me',
      'give me',
      'explain',
      'describe',
      'i dont know',
      'not sure',
      'unsure',
      'uncertain',
      'maybe later',
      'later',
      'after',
      'tomorrow',
      'today',
      'now',
      'immediately',
      'soon',
      'eventually',
      'never',
      'always',
      'sometimes',
      'occasionally',
      'often',
      'rarely',
      'why',
      'how',
      'what',
      'when',
      'where',
      'who',
      'which',
      'whose',
      'that works',
      'sounds good',
      'looks good',
      'seems fine',
      'appears correct',
      'back',
      'return',
      'previous',
      'undo',
      'redo',
      'retry',
      'try again',
      'repeat',
      'do over',
      'restart',
      'reset',
      'clear',
      'delete',
      'remove',
      'cancel',
      'abort',
      'quit',
      'exit',
      'close',
      'leave',
      'skip',
      'pass',
      'ignore',
      'omit',
      'bypass'
    ],
    ukrainian: [
      'так',
      'ні',
      'добре',
      'гаразд',
      'дякую',
      'будь ласка',
      'далі',
      'продовжити',
      'почати',
      'зрозуміло',
      'згоден',
      'не згоден',
      'можливо',
      'звичайно',
      'допоможіть',
      'перевірити',
      'тест',
      'стоп',
      'чекати',
      'готово',
      'завершено',
      'скасувати',
      'видалити',
      'повторити',
      'назад',
      'вперед',
      'початок',
      'кінець',
      'чому',
      'як',
      'що',
      'коли',
      'де',
      'хто'
    ]
  },
  
  // Patterns that indicate generic input
  patterns: [
    // Single characters or very short responses
    /^[a-z]$/i,
    /^[0-9]$/,
    /^\.+$/,
    /^-+$/,
    /^_+$/,
    /^\?+$/,
    /^!+$/,
    /^#+$/,
    /^\*+$/,
    /^\/+$/,
    /^\\+$/,
    
    // Common keyboard mashing
    /^[asd]+$/i,
    /^qwe+$/i,
    /^aaa+$/i,
    /^xxx+$/i,
    /^zzz+$/i,
    /^111+$/,
    /^000+$/,
    /^123+$/,
    
    // Test inputs
    /^test\d*$/i,
    /^demo\d*$/i,
    /^example\d*$/i,
    /^sample\d*$/i,
    /^dummy\d*$/i,
    /^fake\d*$/i,
    /^temp\d*$/i,
    /^tmp\d*$/i,
    /^foo$/i,
    /^bar$/i,
    /^baz$/i,
    /^lorem ipsum/i,
    
    // Common placeholders
    /^\[.*\]$/,
    /^{.*}$/,
    /^<.*>$/,
    /^TODO/i,
    /^TBD/i,
    /^TBA/i,
    /^N\/A/i,
    /^NA$/i,
    /^null$/i,
    /^undefined$/i,
    /^none$/i,
    /^nothing$/i,
    /^empty$/i,
    /^blank$/i,
    
    // URLs and technical strings
    /^https?:\/\//,
    /^www\./,
    /^@/,
    /^#/,
    
    // Single emoji
    /^[\u{1F300}-\u{1F9FF}]$/u,
    /^[\u{2600}-\u{26FF}]$/u,
    /^[\u{2700}-\u{27BF}]$/u
  ]
};

/**
 * Field-specific validation rules
 */
export const VALIDATION_RULES: Record<string, FieldValidationRule> = {
  organizationName: {
    minLength: 3,
    maxLength: 200,
    required: true,
    pattern: /^[a-zA-ZäöüÄÖÜßàâéèêëïîôùûçÀÂÉÈÊËÏÎÔÙÛÇ\s\-\.\,\&\(\)0-9]+$/,
    custom: (value: string) => {
      // Must contain at least one letter
      return /[a-zA-Z]/.test(value);
    }
  },
  
  projectTitle: {
    minLength: 5,
    maxLength: 300,
    required: true,
    custom: (value: string) => {
      // Must contain at least 2 words
      const words = value.trim().split(/\s+/);
      return words.length >= 2 && words.every(w => w.length > 0);
    }
  },
  
  call: {
    minLength: 5,
    maxLength: 100,
    required: true,
    pattern: /^[A-Z0-9\-\._\/\s]+$/i,
    custom: (value: string) => {
      // Must contain at least one number or dash (typical for call IDs)
      return /[\d\-]/.test(value);
    }
  },
  
  callIdentifier: {
    minLength: 5,
    maxLength: 100,
    pattern: /^[A-Z0-9\-\._\/]+$/i
  },
  
  projectAcronym: {
    minLength: 2,
    maxLength: 20,
    pattern: /^[A-Z0-9\-]+$/i
  },
  
  projectDescription: {
    minLength: 50,
    maxLength: 5000,
    custom: (value: string) => {
      // Must contain at least 10 words
      const words = value.trim().split(/\s+/);
      return words.length >= 10;
    }
  },
  
  abstract: {
    minLength: 100,
    maxLength: 2000,
    custom: (value: string) => {
      // Must contain at least 20 words
      const words = value.trim().split(/\s+/);
      return words.length >= 20;
    }
  },
  
  keywords: {
    custom: (value: any) => {
      if (!Array.isArray(value)) return false;
      // Must have 3-10 keywords
      if (value.length < 3 || value.length > 10) return false;
      // Each keyword must be 2-50 characters
      return value.every(k => 
        typeof k === 'string' && 
        k.length >= 2 && 
        k.length <= 50
      );
    }
  },
  
  picNumber: {
    pattern: /^\d{9}$/,
    custom: (value: string) => {
      // PIC numbers are exactly 9 digits
      return /^\d{9}$/.test(value);
    }
  },
  
  estimatedBudget: {
    pattern: /^[\d\.\,\s€$]+$/,
    custom: (value: string) => {
      // Extract numeric value
      const numStr = value.replace(/[^\d.]/g, '');
      const num = parseFloat(numStr);
      // Must be a reasonable budget (100 - 100M)
      return !isNaN(num) && num >= 100 && num <= 100000000;
    }
  },
  
  duration: {
    custom: (value: any) => {
      const num = typeof value === 'string' ? parseInt(value) : value;
      // Project duration typically 6-60 months
      return !isNaN(num) && num >= 6 && num <= 60;
    }
  },
  
  trlStart: {
    custom: (value: any) => {
      const num = typeof value === 'string' ? parseInt(value) : value;
      // TRL levels are 1-9
      return !isNaN(num) && num >= 1 && num <= 9;
    }
  },
  
  trlEnd: {
    custom: (value: any) => {
      const num = typeof value === 'string' ? parseInt(value) : value;
      // TRL levels are 1-9
      return !isNaN(num) && num >= 1 && num <= 9;
    }
  },
  
  fundingRate: {
    custom: (value: any) => {
      const num = typeof value === 'string' ? parseFloat(value) : value;
      // Funding rate is typically 50-100%
      return !isNaN(num) && num >= 50 && num <= 100;
    }
  },
  
  totalBudget: {
    custom: (value: any) => {
      const num = typeof value === 'string' ? parseFloat(value) : value;
      // Budget should be reasonable
      return !isNaN(num) && num >= 1000 && num <= 100000000;
    }
  },
  
  requestedFunding: {
    custom: (value: any) => {
      const num = typeof value === 'string' ? parseFloat(value) : value;
      // Requested funding should be reasonable
      return !isNaN(num) && num >= 1000 && num <= 100000000;
    }
  }
};

/**
 * Special fields that should never be auto-populated with generic content
 */
export const PROTECTED_FIELDS = [
  'organizationName',
  'projectTitle',
  'call',
  'callIdentifier',
  'projectAcronym',
  'picNumber'
];

/**
 * Fields that can be cleared without user confirmation
 */
export const SAFE_TO_CLEAR_FIELDS = [
  'lastUpdated',
  'applicationId',
  'sectionProgress'
];