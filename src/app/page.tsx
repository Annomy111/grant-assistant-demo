'use client';

import { useState } from 'react';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { FileText, Users, Globe, Shield, ArrowRight, CheckCircle, Target, Award, Briefcase, Calendar } from 'lucide-react';
import { brandConfig } from '@/lib/brand-config';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Home() {
  const [showChat, setShowChat] = useState(false);
  const [currentStep, setCurrentStep] = useState('introduction');
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="min-h-screen bg-white">
      {!showChat ? (
        <div>
          {/* German-Ukrainian Bureau Header Bar */}
          <header className="w-full py-4 px-8 bg-brand">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              {/* Logo on the left - much bigger and prominent */}
              <div className="flex-shrink-0">
                <img 
                  src="/dub-logo.jpg" 
                  alt="German-Ukrainian Bureau Logo" 
                  className="h-24 w-auto object-contain min-w-[320px] [filter:brightness(1.2)_contrast(1.1)_saturate(1.1)]"
                />
              </div>
              
              {/* Title in center */}
              <div className="flex-1 text-center px-8">
                <h1 className="text-white font-bold tracking-wider font-sans text-[1.875rem] tracking-[0.15em] mb-1">
                  {t('landing.title')}
                </h1>
                <p className="text-white font-body text-[1.125rem] tracking-[0.05em] opacity-95">
                  {t('landing.subtitle')}
                </p>
              </div>
              
              {/* Language Switcher on the right */}
              <div className="flex-shrink-0 flex gap-2">
                <button
                  onClick={() => setLanguage('de')}
                  className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                    language === 'de' 
                      ? 'bg-white text-gray-800' 
                      : 'bg-transparent text-white border border-white hover:bg-white hover:bg-opacity-10'
                  }`}
                >
                  DE
                </button>
                <button
                  onClick={() => setLanguage('uk')}
                  className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                    language === 'uk' 
                      ? 'bg-white text-gray-800' 
                      : 'bg-transparent text-white border border-white hover:bg-white hover:bg-opacity-10'
                  }`}
                >
                  UK
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                    language === 'en' 
                      ? 'bg-white text-gray-800' 
                      : 'bg-transparent text-white border border-white hover:bg-white hover:bg-opacity-10'
                  }`}
                >
                  EN
                </button>
              </div>
            </div>
          </header>
          
          <div className="max-w-6xl mx-auto px-6 py-16">
            {/* Hero Section */}
            <div className="mb-20">
              <h2 className="text-4xl font-light mb-6 text-brand">
                {t('landing.heroTitle')}
              </h2>
              <p className="text-xl font-light leading-relaxed max-w-3xl text-gray-600">
                {t('landing.heroSubtitle')}
              </p>
              <div className="mt-8 flex gap-4">
                <button
                  onClick={() => {
                    setShowChat(true);
                  }}
                  className="px-8 py-3 text-white font-medium rounded-sm hover:opacity-90 transition-opacity bg-brand"
                >
                  {t('landing.startButton')}
                </button>
                <button className="px-8 py-3 border font-medium rounded-sm hover:bg-gray-50 transition-colors border-brand text-brand">
                  {t('landing.learnMore')}
                </button>
              </div>
            </div>

            {/* Horizon Europe Information */}
            <div className="mb-20">
              <h3 className="text-2xl font-light mb-8 text-brand">
                {t('horizonInfo.title')}
              </h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <p className="text-3xl font-light mb-2 text-brand">€438 Mio</p>
                  <p className="text-sm text-gray-600">{t('horizonInfo.budget.description')}</p>
                </div>
                <div>
                  <p className="text-3xl font-light mb-2 text-brand">100%</p>
                  <p className="text-sm text-gray-600">{t('horizonInfo.funding.description')}</p>
                </div>
                <div>
                  <p className="text-3xl font-light mb-2 text-brand">€2-5 Mio</p>
                  <p className="text-sm text-gray-600">{t('horizonInfo.typical.description')}</p>
                </div>
              </div>
              
              <div className="mt-12 space-y-6">
                <div className="flex items-start gap-4">
                  <Target className="w-5 h-5 mt-1 flex-shrink-0 text-brand" />
                  <div>
                    <h4 className="font-medium mb-1">{t('horizonInfo.pillar1.title')}</h4>
                    <p className="text-sm text-gray-600">
                      {t('horizonInfo.pillar1.description')}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Globe className="w-5 h-5 mt-1 flex-shrink-0 text-brand" />
                  <div>
                    <h4 className="font-medium mb-1">{t('horizonInfo.pillar2.title')}</h4>
                    <p className="text-sm text-gray-600">
                      {t('horizonInfo.pillar2.description')}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Award className="w-5 h-5 mt-1 flex-shrink-0 text-brand" />
                  <div>
                    <h4 className="font-medium mb-1">{t('horizonInfo.pillar3.title')}</h4>
                    <p className="text-sm text-gray-600">
                      {t('horizonInfo.pillar3.description')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* How We Help Section */}
            <div className="mb-20">
              <h3 className="text-2xl font-light mb-8 text-brand">
                {t('process.title')}
              </h3>
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center bg-brand/10">
                    <span className="font-semibold text-brand">1</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-2">{t('process.step1.title')}</h4>
                    <p className="text-sm text-gray-600">
                      {t('process.step1.description')}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center bg-brand/10">
                    <span className="font-semibold text-brand">2</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-2">{t('process.step2.title')}</h4>
                    <p className="text-sm text-gray-600">
                      {t('process.step2.description')}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center bg-brand/10">
                    <span className="font-semibold text-brand">3</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-2">{t('process.step3.title')}</h4>
                    <p className="text-sm text-gray-600">
                      {t('process.step3.description')}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center bg-brand/10">
                    <span className="font-semibold text-brand">4</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-2">{t('process.step4.title')}</h4>
                    <p className="text-sm text-gray-600">
                      {t('process.step4.description')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Ukraine-Specific Opportunities */}
            <div className="mb-20 p-8 rounded bg-brand/5">
              <h3 className="text-2xl font-light mb-8 text-brand">
                🇺🇦 {t('ukraine.title')}
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-medium mb-3">{t('ukraine.horizon.title')}</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-brand" />
                      <span>{t('ukraine.horizon.item1')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-brand" />
                      <span>{t('ukraine.horizon.item2')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-brand" />
                      <span>{t('ukraine.horizon.item3')}</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-3">MSCA4Ukraine Status 2025</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <Award className="w-4 h-4 mt-0.5 flex-shrink-0 text-brand" />
                      <span><strong>176 Forschende unterstützt:</strong> In 24 Gastländern (Stand: Q1 2025)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Award className="w-4 h-4 mt-0.5 flex-shrink-0 text-brand" />
                      <span><strong>Management-Call offen:</strong> Bis 16.09.2025 für Verwaltungsorganisation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Award className="w-4 h-4 mt-0.5 flex-shrink-0 text-brand" />
                      <span><strong>Keine weiteren Fellowship-Calls:</strong> Aktuell keine neuen Ausschreibungen geplant</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-white rounded">
                <p className="text-sm">
                  <strong>Historischer Erfolg:</strong> Unter Horizon 2020 war Ukraine an 230 Projekten mit 
                  323 Teilnehmern beteiligt (€45.5M Förderung) - besonders stark in MSCA, Energie und Klima.
                </p>
              </div>
            </div>

            {/* CERV Programme */}
            <div className="mb-20">
              <h3 className="text-2xl font-light mb-8 text-brand">
                CERV Programme – Ukraine seit 09.01.2024 assoziiert
              </h3>
              <p className="text-gray-600 mb-6">
                <strong>NEU:</strong> Ukraine nimmt seit Januar 2024 am CERV-Programm teil. 
                Zugang zu allen Bereichen außer "Union Values". Besonderer Fokus auf Kinder 
                aus der Ukraine in der CERV-2025-CHILD Ausschreibung (29.04.2025 Deadline).
              </p>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center bg-brand/10">
                    <span className="text-lg">⚖️</span>
                  </div>
                  <h4 className="font-medium text-sm mb-1">Gleichheit & Rechte</h4>
                  <p className="text-xs text-gray-600">Anti-Diskriminierung und Gleichstellung</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center bg-brand/10">
                    <span className="text-lg">🤝</span>
                  </div>
                  <h4 className="font-medium text-sm mb-1">Bürgerbeteiligung</h4>
                  <p className="text-xs text-gray-600">Demokratische Partizipation</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center bg-brand/10">
                    <span className="text-lg">🛡️</span>
                  </div>
                  <h4 className="font-medium text-sm mb-1">Daphne</h4>
                  <p className="text-xs text-gray-600">Gewaltprävention und Opferschutz</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center bg-brand/10">
                    <span className="text-lg">🌟</span>
                  </div>
                  <h4 className="font-medium text-sm mb-1">EU-Werte</h4>
                  <p className="text-xs text-gray-600">Förderung gemeinsamer Werte</p>
                </div>
              </div>
            </div>

            {/* Expertise Section */}
            <div className="mb-20">
              <h3 className="text-2xl font-light mb-8 text-brand">
                Unsere Expertise
              </h3>
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h4 className="font-medium mb-4">EU-Ukraine Kooperation</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Als Deutsch-Ukrainisches Büro verfügen wir über einzigartige Expertise in der 
                    Förderung bilateraler Kooperationen. Wir kennen die regulatorischen Rahmenbedingungen 
                    beider Länder und unterstützen Sie bei:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-brand" />
                      <span className="text-sm text-gray-600">Associated Country Status der Ukraine in Horizon Europe</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-brand" />
                      <span className="text-sm text-gray-600">Civil Society Facility Programme</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-brand" />
                      <span className="text-sm text-gray-600">ERASMUS+ Capacity Building</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-4">Thematische Schwerpunkte</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Unsere Expertise erstreckt sich über verschiedene Horizon Europe Cluster 
                    mit besonderem Fokus auf:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-brand" />
                      <span className="text-sm text-gray-600">Cluster 2: Culture, Creativity & Inclusive Society</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-brand" />
                      <span className="text-sm text-gray-600">Cluster 3: Civil Security for Society</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-brand" />
                      <span className="text-sm text-gray-600">Cluster 6: Food, Bioeconomy & Natural Resources</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>


            {/* Upcoming Deadlines */}
            <div className="mb-20">
              <h3 className="text-2xl font-light mb-8 text-brand">
                Aktuelle Ausschreibungen 2025
              </h3>
              
              <div className="mb-6 p-4 rounded bg-brand/5">
                <p className="text-sm mb-2">
                  <strong>Wichtige Termine 2025:</strong>
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 15. Mai 2025: Cluster 2 Calls öffnen & Info Day</li>
                  <li>• 16. Mai 2025: Brokerage Event für Konsortiumsbildung</li>
                  <li>• 16. September 2025: Deadline für alle Cluster 2 Calls (First Stage)</li>
                  <li>• 17. März 2026: Second Stage Deadline für zweistufige Calls</li>
                  <li>• November 2025: Erwartete Cluster 3 Calls mit UA-Verpflichtung</li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex items-center gap-4">
                    <Calendar className="w-5 h-5 text-brand" />
                    <div>
                      <p className="font-medium">HORIZON-CL2-2025-DEMOCRACY-01</p>
                      <p className="text-sm text-gray-600">Counter disinformation & FIMI (€3-3.5M per project)</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-brand">
                    Deadline: 16.09.2025
                  </span>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex items-center gap-4">
                    <Calendar className="w-5 h-5 text-brand" />
                    <div>
                      <p className="font-medium">HORIZON-CL2-2025-DEMOCRACY-AUTOCRACY</p>
                      <p className="text-sm text-gray-600">Understanding autocratic appeal (€10.5M total, nature & drivers research)</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-brand">
                    Deadline: 16.09.2025
                  </span>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex items-center gap-4">
                    <Calendar className="w-5 h-5 text-brand" />
                    <div>
                      <p className="font-medium">HORIZON-CL2-2025-HERITAGE</p>
                      <p className="text-sm text-gray-600">Cultural Heritage topics (€82.5M total budget, €2.5-4M per project)</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-brand">
                    Deadline: 16.09.2025
                  </span>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex items-center gap-4">
                    <Calendar className="w-5 h-5 text-brand" />
                    <div>
                      <p className="font-medium">MSCA4Ukraine Management Call</p>
                      <p className="text-sm text-gray-600">Organization to manage next phase (No new fellowships planned)</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-brand">
                    Deadline: 16.09.2025
                  </span>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex items-center gap-4">
                    <Calendar className="w-5 h-5 text-brand" />
                    <div>
                      <p className="font-medium">CERV-2025-CHILD</p>
                      <p className="text-sm text-gray-600">Children's rights incl. Ukrainian refugees (Deadline: 29.04.2025)</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-brand">
                    Expected: Nov 2025
                  </span>
                </div>
              </div>
            </div>

            {/* Features - Minimalist */}
            <div className="mb-20">
              <h3 className="text-2xl font-light mb-8 text-brand">
                Plattform Features
              </h3>
              <div className="grid md:grid-cols-4 gap-8">
                <div className="text-center">
                  <FileText className="w-8 h-8 mx-auto mb-3 text-brand" />
                  <h4 className="font-medium mb-2 text-sm">Template Library</h4>
                  <p className="text-xs text-gray-600">
                    Vorgefertigte Templates für alle Horizon Europe Antragstypen
                  </p>
                </div>
                <div className="text-center">
                  <Users className="w-8 h-8 mx-auto mb-3 text-brand" />
                  <h4 className="font-medium mb-2 text-sm">Partner Matching</h4>
                  <p className="text-xs text-gray-600">
                    Zugang zu unserem Netzwerk qualifizierter Projektpartner
                  </p>
                </div>
                <div className="text-center">
                  <Globe className="w-8 h-8 mx-auto mb-3 text-brand" />
                  <h4 className="font-medium mb-2 text-sm">Multilingual</h4>
                  <p className="text-xs text-gray-600">
                    Verfügbar in Deutsch, Ukrainisch und Englisch
                  </p>
                </div>
                <div className="text-center">
                  <Shield className="w-8 h-8 mx-auto mb-3 text-brand" />
                  <h4 className="font-medium mb-2 text-sm">GDPR Compliant</h4>
                  <p className="text-xs text-gray-600">
                    Vollständige Datenschutz-Compliance nach EU-Standards
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center py-12">
              <h3 className="text-2xl font-light mb-6 text-brand">
                Bereit für Ihren EU-Antrag?
              </h3>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Nutzen Sie unsere KI-gestützte Plattform und die Expertise des Deutsch-Ukrainischen Büros 
                für Ihren erfolgreichen EU-Förderantrag.
              </p>
              <button
                onClick={() => {
                  setShowChat(true);
                }}
                className="px-12 py-4 text-white font-medium rounded-sm hover:opacity-90 transition-opacity inline-flex items-center gap-2 bg-brand"
              >
                Jetzt Starten
                <ArrowRight className="w-5 h-5" />
              </button>
              <p className="mt-4 text-sm text-gray-500">
                Keine Registrierung erforderlich • Kostenlose Erstberatung
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-screen flex flex-col">
          <header className="w-full py-5 px-6" style={{ backgroundColor: '#304945' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img 
                  src="/dub-logo.jpg" 
                  alt="German-Ukrainian Bureau Logo" 
                  width={100} 
                  height={125}
                  style={{ objectFit: 'contain' }}
                />
                <div className="ml-6">
                  <h1 className="text-white font-bold" style={{ 
                    fontFamily: 'Open Sans, sans-serif',
                    fontSize: '1.5rem',
                    letterSpacing: '0.1em'
                  }}>
                    {t('landing.title')}
                  </h1>
                  <p className="text-white opacity-90" style={{ fontSize: '0.95rem' }}>Grant Assistant</p>
                </div>
              </div>
              <button
                onClick={() => setShowChat(false)}
                className="text-white hover:opacity-80 transition-opacity px-4 py-2 border border-white rounded"
              >
                Zurück zur Übersicht
              </button>
            </div>
          </header>
          <div className="flex-1 overflow-hidden">
            <ChatInterface 
              currentStep={currentStep}
              onStepChange={setCurrentStep}
            />
          </div>
        </div>
      )}
    </div>
  );
}