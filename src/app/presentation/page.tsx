'use client';

import { useState, useEffect } from 'react';
import { 
  ChevronLeft, ChevronRight, Presentation, Users, Globe, Rocket, Target, TrendingUp, ArrowRight,
  Brain, Lock, Clock, AlertCircle, CheckCircle, Sparkles, Zap, Shield, Database, Cloud,
  GitBranch, BarChart3, PieChart, Calendar, Trophy, Lightbulb, Building2, HandshakeIcon,
  Layers, Network, FileText, Download, MessageSquare, GraduationCap, HeartHandshake, FileDown
} from 'lucide-react';
import { brandConfig } from '@/lib/brand-config';
import Image from 'next/image';
import { jsPDF } from 'jspdf';

export default function PresentationPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Logo Footer Component (für alle Slides außer dem ersten)
  const LogoFooter = () => (
    <div className="absolute bottom-6 right-6">
      <Image 
        src="/dub-logo.jpg" 
        alt="DUB Logo" 
        width={200} 
        height={50}
        className="object-contain opacity-80"
      />
    </div>
  );

  // Consistent Header Component
  const SlideHeader = ({ children, icon: Icon }: { children: React.ReactNode, icon?: any }) => (
    <h2 className="absolute top-12 left-12 right-12 text-4xl font-bold flex items-center gap-3" style={{ color: brandConfig.colors.primary }}>
      {Icon && <Icon className="w-10 h-10" />}
      {children}
    </h2>
  );

  const slides = [
    // Slide 1: Title & Vision (ohne Footer-Logo)
    {
      id: 'title',
      content: (
        <div className="flex flex-col items-center justify-center h-full text-center px-12">
          <div className="mb-8">
            <div className="flex items-center justify-center mb-6">
              <Image 
                src="/dub-logo.jpg" 
                alt="German-Ukrainian Bureau Logo" 
                width={600} 
                height={150}
                className="object-contain"
                priority
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3 mb-6">
            <Brain className="w-10 h-10" style={{ color: brandConfig.colors.primary }} />
            <h1 className="text-4xl font-bold" style={{ color: brandConfig.colors.primary }}>
              Technische Innovation für Capacity Building
            </h1>
            <Sparkles className="w-10 h-10" style={{ color: brandConfig.colors.primary }} />
          </div>
          
          <p className="text-xl text-gray-600 mb-8 max-w-4xl">
            Eine skalierbare KI-Plattform, die komplexe Förderprozesse demokratisiert
          </p>
          
          <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-6 mb-8 max-w-3xl shadow-lg">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Building2 className="w-6 h-6 text-blue-700" />
              <p className="text-lg font-semibold text-blue-900">
                Für Engagement Global e.V.
              </p>
            </div>
            <p className="text-lg text-blue-800">
              Wir lösen das Zugangsproblem zu Fördermitteln durch Technologie
            </p>
          </div>
          
          <div className="flex gap-8 mt-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center mb-3">
                <Clock className="w-8 h-8" style={{ color: brandConfig.colors.primary }} />
              </div>
              <div className="text-3xl font-bold" style={{ color: brandConfig.colors.primary }}>30 Min</div>
              <div className="text-sm text-gray-600 mt-2">statt 3 Wochen</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center mb-3">
                <GraduationCap className="w-8 h-8" style={{ color: brandConfig.colors.primary }} />
              </div>
              <div className="text-3xl font-bold" style={{ color: brandConfig.colors.primary }}>0</div>
              <div className="text-sm text-gray-600 mt-2">Vorkenntnisse nötig</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center mb-3">
                <GitBranch className="w-8 h-8" style={{ color: brandConfig.colors.primary }} />
              </div>
              <div className="text-3xl font-bold" style={{ color: brandConfig.colors.primary }}>∞</div>
              <div className="text-sm text-gray-600 mt-2">Skalierbar</div>
            </div>
          </div>
        </div>
      ),
    },
    
    // Slide 2: Das Problem
    {
      id: 'problem',
      content: (
        <div className="relative h-full px-12 pt-32 pb-24">
          <SlideHeader icon={AlertCircle}>
            Die Herausforderung: 920 von 1000 NGOs scheitern
          </SlideHeader>
          
          <div className="flex items-center justify-between mb-8">
            <div className="flex-1 max-w-md">
              <div className="relative">
                {/* Trichter SVG */}
                <svg viewBox="0 0 400 300" className="w-full h-auto">
                  {/* Trichter-Form */}
                  <path d="M 50 50 L 350 50 L 250 250 L 150 250 Z" 
                    fill="none" 
                    stroke="#d1d5db" 
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  />
                  
                  {/* Ebenen */}
                  <rect x="50" y="50" width="300" height="40" fill="#dbeafe" rx="8"/>
                  <rect x="90" y="110" width="220" height="35" fill="#fef3c7" rx="8"/>
                  <rect x="130" y="165" width="140" height="35" fill="#fed7aa" rx="8"/>
                  <rect x="150" y="220" width="100" height="30" fill="#fecaca" rx="8"/>
                  
                  {/* Text */}
                  <text x="200" y="75" textAnchor="middle" className="font-bold text-sm">
                    1000 NGOs benötigen Förderung
                  </text>
                  <text x="200" y="132" textAnchor="middle" className="font-bold text-sm">
                    400 versuchen es
                  </text>
                  <text x="200" y="187" textAnchor="middle" className="font-bold text-sm">
                    200 reichen ein
                  </text>
                  <text x="200" y="240" textAnchor="middle" className="font-bold text-sm text-red-700">
                    80 erfolgreich
                  </text>
                </svg>
              </div>
            </div>
            
            <div className="flex-1 ml-12">
              <h3 className="text-xl font-bold mb-4">Die Barrieren:</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Lock className="w-6 h-6 text-red-500" />
                  <div>
                    <span className="font-semibold">Wissensmonopol:</span>
                    <p className="text-sm text-gray-600">Nur teure Berater kennen die Tricks</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-amber-500" />
                  <div>
                    <span className="font-semibold">Bürokratie-Dschungel:</span>
                    <p className="text-sm text-gray-600">100+ Seiten, unverständlicher Jargon</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-6 h-6 text-orange-500" />
                  <div>
                    <span className="font-semibold">Ressourcenmangel:</span>
                    <p className="text-sm text-gray-600">Kleine Teams, keine Zeit</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="w-6 h-6 text-blue-500" />
                  <div>
                    <span className="font-semibold">Sprachbarrieren:</span>
                    <p className="text-sm text-gray-600">Besonders für ukrainische Partner</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg">
            <div className="flex items-center justify-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <p className="text-lg font-bold text-red-900">
                Das Resultat: Millionen an Fördermitteln verfallen ungenutzt!
              </p>
            </div>
          </div>
          
          <LogoFooter />
        </div>
      ),
    },
    
    // Slide 3: Unsere Vision
    {
      id: 'solution',
      content: (
        <div className="relative h-full px-12 pt-32 pb-24">
          <SlideHeader icon={Lightbulb}>
            Unsere Vision: Förderanträge so einfach wie Online-Banking
          </SlideHeader>
          
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center gap-3">
              <Brain className="w-6 h-6 text-green-700" />
              <p className="text-xl font-medium text-green-900">
                KI als persönlicher Förderberater - 24/7 verfügbar, immer aktuell
              </p>
              <Sparkles className="w-6 h-6 text-green-700" />
            </div>
          </div>
          
          {/* Der Prozess */}
          <div className="mb-6">
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 text-center">
                <div className="bg-white p-4 rounded-lg shadow-md border-2 border-blue-200 hover:border-blue-400 transition-colors">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2" style={{ color: brandConfig.colors.primary }} />
                  <h4 className="font-bold text-sm">Dialog starten</h4>
                  <p className="text-xs text-gray-600 mt-1">In eigener Sprache</p>
                </div>
              </div>
              <ArrowRight className="w-6 h-6 text-gray-400" />
              <div className="flex-1 text-center">
                <div className="bg-white p-4 rounded-lg shadow-md border-2 border-green-200 hover:border-green-400 transition-colors">
                  <Brain className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <h4 className="font-bold text-sm">KI versteht</h4>
                  <p className="text-xs text-gray-600 mt-1">Stellt die richtigen Fragen</p>
                </div>
              </div>
              <ArrowRight className="w-6 h-6 text-gray-400" />
              <div className="flex-1 text-center">
                <div className="bg-white p-4 rounded-lg shadow-md border-2 border-purple-200 hover:border-purple-400 transition-colors">
                  <Zap className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <h4 className="font-bold text-sm">Antrag entsteht</h4>
                  <p className="text-xs text-gray-600 mt-1">Automatisch korrekt</p>
                </div>
              </div>
              <ArrowRight className="w-6 h-6 text-gray-400" />
              <div className="flex-1 text-center">
                <div className="bg-white p-4 rounded-lg shadow-md border-2 border-orange-200 hover:border-orange-400 transition-colors">
                  <Download className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                  <h4 className="font-bold text-sm">Fertig!</h4>
                  <p className="text-xs text-gray-600 mt-1">Einreichungsbereit</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gradient-to-b from-green-50 to-green-100 p-4 rounded-lg text-center">
              <GraduationCap className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <h4 className="font-bold text-sm mb-1">Lernt mit</h4>
              <p className="text-xs text-gray-600">Wird immer besser</p>
            </div>
            <div className="bg-gradient-to-b from-blue-50 to-blue-100 p-4 rounded-lg text-center">
              <Globe className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <h4 className="font-bold text-sm mb-1">Mehrsprachig</h4>
              <p className="text-xs text-gray-600">DE / UK / EN</p>
            </div>
            <div className="bg-gradient-to-b from-purple-50 to-purple-100 p-4 rounded-lg text-center">
              <Shield className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <h4 className="font-bold text-sm mb-1">Compliance</h4>
              <p className="text-xs text-gray-600">Immer konform</p>
            </div>
            <div className="bg-gradient-to-b from-orange-50 to-orange-100 p-4 rounded-lg text-center">
              <Trophy className="w-8 h-8 mx-auto mb-2 text-orange-600" />
              <h4 className="font-bold text-sm mb-1">Erfolgreich</h4>
              <p className="text-xs text-gray-600">Höhere Quote</p>
            </div>
          </div>
          
          <LogoFooter />
        </div>
      ),
    },
    
    // Slide 4: Live Demo
    {
      id: 'demo',
      content: (
        <div className="relative h-full px-12 pt-32 pb-24">
          <SlideHeader icon={Presentation}>
            Live: So funktioniert die Plattform
          </SlideHeader>
          
          {/* Browser Mockup mit besserem Screenshot */}
          <div className="bg-white rounded-lg shadow-2xl mb-6" style={{ height: '380px' }}>
            <div className="bg-gray-100 rounded-t-lg p-2 flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="flex-1 bg-white rounded px-3 py-1 text-xs text-gray-600">
                grant-assistant.engagement-global.de
              </div>
            </div>
            <div className="relative overflow-hidden" style={{ height: '340px' }}>
              <Image 
                src="/grant-assistant-chat-demo.jpg" 
                alt="Grant Assistant Live Demo" 
                fill
                className="object-cover object-top"
                sizes="(max-width: 1200px) 100vw"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <p className="text-white text-center font-semibold">
                  Der KI-Assistent führt Schritt für Schritt durch den Antragsprozess
                </p>
              </div>
            </div>
          </div>
          
          {/* Key Points */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-3 rounded-lg shadow-md text-center">
              <CheckCircle className="w-6 h-6 mx-auto mb-2 text-green-600" />
              <p className="text-sm font-semibold">Einfache Sprache</p>
              <p className="text-xs text-gray-600">Kein Fachjargon nötig</p>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-md text-center">
              <CheckCircle className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <p className="text-sm font-semibold">Fortschritt sichtbar</p>
              <p className="text-xs text-gray-600">Immer wissen, wo man steht</p>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-md text-center">
              <CheckCircle className="w-6 h-6 mx-auto mb-2 text-purple-600" />
              <p className="text-sm font-semibold">Sofort exportieren</p>
              <p className="text-xs text-gray-600">Word, PDF, direkt ins Portal</p>
            </div>
          </div>
          
          <LogoFooter />
        </div>
      ),
    },
    
    // Slide 5: Die Technologie
    {
      id: 'technology',
      content: (
        <div className="relative h-full px-12 pt-32 pb-24">
          <SlideHeader icon={Layers}>
            Das Produkt: Einmal entwickelt - vielfach einsetzbar
          </SlideHeader>
          
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center gap-3">
              <Network className="w-6 h-6 text-blue-700" />
              <p className="text-lg font-medium text-blue-900">
                Die gleiche Technologie funktioniert für ALLE Förderprogramme
              </p>
            </div>
          </div>
          
          {/* Architektur */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <Database className="w-5 h-5" style={{ color: brandConfig.colors.primary }} />
                Kern-Technologie
              </h3>
              <div className="bg-gradient-to-b from-blue-100 to-blue-50 rounded-lg p-4 space-y-2">
                <div className="bg-white p-2 rounded flex items-center gap-2">
                  <Brain className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-semibold">KI-Engine</span>
                </div>
                <div className="bg-white p-2 rounded flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-semibold">Dialog-System</span>
                </div>
                <div className="bg-white p-2 rounded flex items-center gap-2">
                  <Shield className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-semibold">Validierung</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <GitBranch className="w-5 h-5" style={{ color: brandConfig.colors.primary }} />
                Heute: EU-Programme
              </h3>
              <div className="space-y-2">
                <div className="bg-green-100 p-2 rounded-lg">
                  <span className="text-sm font-semibold">✓ Horizon Europe</span>
                </div>
                <div className="bg-green-100 p-2 rounded-lg">
                  <span className="text-sm font-semibold">✓ CERV</span>
                </div>
                <div className="bg-green-100 p-2 rounded-lg">
                  <span className="text-sm font-semibold">✓ Erasmus+</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <Rocket className="w-5 h-5" style={{ color: brandConfig.colors.primary }} />
                Morgen: Ihre Programme
              </h3>
              <div className="space-y-2">
                <div className="bg-blue-50 border border-blue-200 p-2 rounded-lg">
                  <span className="text-sm">weltwärts</span>
                </div>
                <div className="bg-blue-50 border border-blue-200 p-2 rounded-lg">
                  <span className="text-sm">ASA-Programm</span>
                </div>
                <div className="bg-blue-50 border border-blue-200 p-2 rounded-lg">
                  <span className="text-sm">ENSA</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-center font-medium">
              <span className="font-bold">Der Clou:</span> Jedes neue Programm macht die KI schlauer für alle anderen
            </p>
          </div>
          
          <LogoFooter />
        </div>
      ),
    },
    
    // Slide 6: Investment
    {
      id: 'investment',
      content: (
        <div className="relative h-full px-12 pt-32 pb-24">
          <SlideHeader icon={PieChart}>
            Die Investition: 100.000€ für unbegrenztes Potenzial
          </SlideHeader>
          
          <div className="grid grid-cols-3 gap-6 mb-6">
            {/* Kreisdiagramm */}
            <div className="col-span-1">
              <h3 className="text-lg font-bold mb-3">Kostenaufteilung</h3>
              <div className="relative w-48 h-48 mx-auto">
                <svg viewBox="0 0 100 100" className="transform -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="20" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="20" 
                    strokeDasharray="50 251" strokeDashoffset="0" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="20" 
                    strokeDasharray="70 251" strokeDashoffset="-50" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#f59e0b" strokeWidth="20" 
                    strokeDasharray="60 251" strokeDashoffset="-120" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#ef4444" strokeWidth="20" 
                    strokeDasharray="40 251" strokeDashoffset="-180" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#8b5cf6" strokeWidth="20" 
                    strokeDasharray="31 251" strokeDashoffset="-220" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-2xl font-bold">100K€</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span>Technologie (25K)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span>5 Programme (30K)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-amber-500 rounded"></div>
                  <span>Plattform (20K)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span>Testing (15K)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded"></div>
                  <span>Schulung (10K)</span>
                </div>
              </div>
            </div>
            
            {/* Phasen */}
            <div className="col-span-2">
              <h3 className="text-lg font-bold mb-3">Was Sie dafür bekommen:</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                  <Brain className="w-8 h-8 mb-2 text-blue-600" />
                  <h4 className="font-bold">Maßgeschneiderte KI</h4>
                  <p className="text-sm text-gray-600">Trainiert auf Ihre Programme</p>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                  <Users className="w-8 h-8 mb-2 text-green-600" />
                  <h4 className="font-bold">Unbegrenzte Nutzer</h4>
                  <p className="text-sm text-gray-600">Keine Lizenzkosten</p>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
                  <Rocket className="w-8 h-8 mb-2 text-purple-600" />
                  <h4 className="font-bold">Sofort einsatzbereit</h4>
                  <p className="text-sm text-gray-600">3 Monate bis Go-Live</p>
                </div>
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg">
                  <TrendingUp className="w-8 h-8 mb-2 text-orange-600" />
                  <h4 className="font-bold">Wachstumspotenzial</h4>
                  <p className="text-sm text-gray-600">+3K€ pro neuem Programm</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-center text-lg font-bold text-green-900">
              Nach 12 Monaten: Selbstfinanzierend durch eingesparte Beratungskosten
            </p>
          </div>
          
          <LogoFooter />
        </div>
      ),
    },
    
    // Slide 7: Roadmap & Next Steps
    {
      id: 'next-steps',
      content: (
        <div className="relative h-full px-12 pt-32 pb-24">
          <SlideHeader icon={Calendar}>
            Der Weg zur Partnerschaft
          </SlideHeader>
          
          {/* Timeline Roadmap - Start September 2025 */}
          <div className="w-full mb-6">
            <div className="relative">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-green-200 to-purple-200 transform -translate-y-1/2"></div>
              <div className="relative grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="bg-white p-3 rounded-lg shadow-lg border-2 border-blue-400">
                    <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-blue-100 flex items-center justify-center">
                      <Rocket className="w-6 h-6 text-blue-600" />
                    </div>
                    <h4 className="font-bold text-sm">Sept 2025</h4>
                    <p className="text-xs text-gray-600 mt-1">Projektstart</p>
                    <p className="text-xs text-blue-600 font-semibold mt-1">Kick-off Meeting</p>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="bg-white p-3 rounded-lg shadow-lg border-2 border-green-400">
                    <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-green-100 flex items-center justify-center">
                      <Users className="w-6 h-6 text-green-600" />
                    </div>
                    <h4 className="font-bold text-sm">Okt 2025</h4>
                    <p className="text-xs text-gray-600 mt-1">Pilotphase</p>
                    <p className="text-xs text-green-600 font-semibold mt-1">50 Test-NGOs</p>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="bg-white p-3 rounded-lg shadow-lg border-2 border-purple-400">
                    <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-purple-100 flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-purple-600" />
                    </div>
                    <h4 className="font-bold text-sm">Nov 2025</h4>
                    <p className="text-xs text-gray-600 mt-1">Optimierung</p>
                    <p className="text-xs text-purple-600 font-semibold mt-1">Feedback-Loop</p>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="bg-white p-3 rounded-lg shadow-lg border-2 border-orange-400">
                    <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-orange-100 flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-orange-600" />
                    </div>
                    <h4 className="font-bold text-sm">Jan 2026</h4>
                    <p className="text-xs text-gray-600 mt-1">Go-Live</p>
                    <p className="text-xs text-orange-600 font-semibold mt-1">Vollbetrieb</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg text-center">
              <Building2 className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <h4 className="font-bold text-sm mb-1">Ihr Beitrag</h4>
              <p className="text-xs text-gray-600">Expertise & Netzwerk</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg text-center">
              <HeartHandshake className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <h4 className="font-bold text-sm mb-1">Gemeinsam</h4>
              <p className="text-xs text-gray-600">Co-Creation Prozess</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg text-center">
              <Target className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <h4 className="font-bold text-sm mb-1">Das Ziel</h4>
              <p className="text-xs text-gray-600">1000+ erfolgreiche Anträge</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-gray-200">
            <h3 className="text-xl font-bold mb-4 text-center">Nächster Schritt:</h3>
            <div className="flex justify-center gap-6">
              <button 
                className="px-8 py-4 text-white font-bold rounded-lg text-lg hover:opacity-90 transition-opacity shadow-lg flex items-center gap-2"
                style={{ backgroundColor: brandConfig.colors.primary }}
              >
                <Calendar className="w-5 h-5" />
                Workshop vereinbaren
              </button>
              <button className="px-8 py-4 border-2 border-gray-300 font-bold rounded-lg text-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Presentation className="w-5 h-5" />
                Detailkonzept anfordern
              </button>
            </div>
          </div>
          
          <div className="absolute bottom-6 left-12 text-gray-500 text-sm">
            <p>© 2025 Deutsch-Ukrainisches Büro • info@dub-grant-assistant.eu</p>
          </div>
          
          <LogoFooter />
        </div>
      ),
    },
  ];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && currentSlide > 0) {
        setCurrentSlide(currentSlide - 1);
      } else if (e.key === 'ArrowRight' && currentSlide < slides.length - 1) {
        setCurrentSlide(currentSlide + 1);
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.key === 'Escape') {
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentSlide, slides.length]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // PDF Export Function
  const exportToPDF = async () => {
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // PDF Content für jeden Slide
    const slideContents = [
      // Slide 1
      {
        title: 'Technische Innovation für Capacity Building',
        subtitle: 'Eine skalierbare KI-Plattform, die komplexe Förderprozesse demokratisiert',
        points: [
          'Für Engagement Global e.V.',
          'Wir lösen das Zugangsproblem zu Fördermitteln durch Technologie',
          '30 Min statt 3 Wochen | 0 Vorkenntnisse nötig | Unbegrenzt skalierbar'
        ]
      },
      // Slide 2
      {
        title: 'Die Herausforderung: 920 von 1000 NGOs scheitern',
        subtitle: 'Trichter-Effekt bei Förderanträgen',
        points: [
          '1000 NGOs benötigen Förderung',
          '400 versuchen es',
          '200 reichen ein',
          'Nur 80 erfolgreich!',
          'Barrieren: Wissensmonopol, Bürokratie, Ressourcenmangel, Sprachbarrieren',
          'Resultat: Millionen an Fördermitteln verfallen ungenutzt!'
        ]
      },
      // Slide 3
      {
        title: 'Unsere Vision: Förderanträge so einfach wie Online-Banking',
        subtitle: 'KI als persönlicher Förderberater - 24/7 verfügbar',
        points: [
          'Prozess: Dialog starten → KI versteht → Antrag entsteht → Fertig!',
          'Lernt mit und wird immer besser',
          'Mehrsprachig: DE / UK / EN',
          'Immer compliant mit EU-Anforderungen',
          'Höhere Erfolgsquote garantiert'
        ]
      },
      // Slide 4
      {
        title: 'Live: So funktioniert die Plattform',
        subtitle: 'Der KI-Assistent führt Schritt für Schritt durch den Antragsprozess',
        points: [
          'Einfache Sprache - Kein Fachjargon nötig',
          'Fortschritt immer sichtbar',
          'Sofort exportieren: Word, PDF, direkt ins Portal',
          'Chat-Interface für intuitive Bedienung'
        ]
      },
      // Slide 5
      {
        title: 'Das Produkt: Einmal entwickelt - vielfach einsetzbar',
        subtitle: 'Die gleiche Technologie funktioniert für ALLE Förderprogramme',
        points: [
          'Kern-Technologie: KI-Engine, Dialog-System, Validierung',
          'Heute: EU-Programme (Horizon Europe, CERV, Erasmus+)',
          'Morgen: Ihre Programme (weltwärts, ASA, ENSA)',
          'Der Clou: Jedes neue Programm macht die KI schlauer'
        ]
      },
      // Slide 6
      {
        title: 'Die Investition: 100.000€ für unbegrenztes Potenzial',
        subtitle: 'Kostenaufteilung und Nutzen',
        points: [
          'Technologie: 25.000€ - Maßgeschneiderte KI',
          '5 Programme: 30.000€ - Trainiert auf Ihre Anforderungen',
          'Plattform: 20.000€ - Multi-Mandanten-fähig',
          'Testing: 15.000€ - Mit echten NGOs getestet',
          'Schulung: 10.000€ - Umfassende Einführung',
          'Unbegrenzte Nutzer | Keine Lizenzkosten | +3K€ pro neuem Programm',
          'Nach 12 Monaten selbstfinanzierend'
        ]
      },
      // Slide 7
      {
        title: 'Der Weg zur Partnerschaft',
        subtitle: 'Timeline für erfolgreiche Implementierung',
        points: [
          'Sept 2025: Projektstart - Kick-off Meeting',
          'Okt 2025: Pilotphase - 50 Test-NGOs',
          'Nov 2025: Optimierung - Feedback-Loop',
          'Jan 2026: Go-Live - Vollbetrieb',
          'Gemeinsames Ziel: 1000+ erfolgreiche Anträge',
          'Nächster Schritt: Workshop vereinbaren'
        ]
      }
    ];

    // Erstelle PDF-Seiten
    slideContents.forEach((slide, index) => {
      if (index > 0) pdf.addPage();
      
      // DUB Logo Text
      pdf.setFontSize(12);
      pdf.setTextColor(48, 73, 69);
      pdf.text('DEUTSCH-UKRAINISCHES BÜRO', 20, 20);
      pdf.setFontSize(10);
      pdf.text('Analytics • Advocacy • Solutions', 20, 26);
      
      // Slide Number
      pdf.setTextColor(128, 128, 128);
      pdf.text(`${index + 1} / 7`, 260, 20);
      
      // Title
      pdf.setFontSize(20);
      pdf.setTextColor(48, 73, 69);
      pdf.text(slide.title, 20, 50);
      
      // Subtitle
      pdf.setFontSize(14);
      pdf.setTextColor(64, 64, 64);
      pdf.text(slide.subtitle, 20, 65);
      
      // Points
      pdf.setFontSize(12);
      pdf.setTextColor(32, 32, 32);
      let yPos = 85;
      slide.points.forEach(point => {
        // Word wrap for long lines
        const lines = pdf.splitTextToSize(point, 250);
        lines.forEach(line => {
          pdf.text('• ' + line, 25, yPos);
          yPos += 8;
        });
      });
      
      // Footer
      pdf.setFontSize(10);
      pdf.setTextColor(128, 128, 128);
      pdf.text('© 2025 Deutsch-Ukrainisches Büro • info@dub-grant-assistant.eu', 20, 190);
    });

    // Save PDF
    pdf.save('DUB-Grant-Assistant-Präsentation.pdf');
  };

  return (
    <div className={`${isFullscreen ? 'fixed inset-0' : 'min-h-screen'} bg-white flex flex-col`}>
      {/* Header */}
      {!isFullscreen && (
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Presentation className="w-6 h-6" style={{ color: brandConfig.colors.primary }} />
            <h1 className="text-xl font-bold">DUB - Technische Innovation für Engagement Global e.V.</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={exportToPDF}
              className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              style={{ borderColor: brandConfig.colors.primary, color: brandConfig.colors.primary }}
            >
              <FileDown className="w-4 h-4" />
              Als PDF exportieren
            </button>
            <button
              onClick={toggleFullscreen}
              className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              F für Vollbild
            </button>
          </div>
        </div>
      )}

      {/* Slide Content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full h-full max-w-7xl">
          {slides[currentSlide].content}
        </div>
      </div>

      {/* Navigation */}
      <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
          disabled={currentSlide === 0}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
          Zurück
        </button>

        <div className="flex items-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlide 
                  ? 'w-8' 
                  : ''
              }`}
              style={{ 
                backgroundColor: index === currentSlide 
                  ? brandConfig.colors.primary 
                  : brandConfig.colors.gray[300] 
              }}
            />
          ))}
        </div>

        <button
          onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
          disabled={currentSlide === slides.length - 1}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Weiter
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Slide Counter */}
      <div className="absolute bottom-20 right-6 text-sm text-gray-500">
        {currentSlide + 1} / {slides.length}
      </div>
    </div>
  );
}