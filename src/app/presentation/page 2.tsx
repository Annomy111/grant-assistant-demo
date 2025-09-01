'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Presentation, Users, Globe, Rocket, Target, TrendingUp, ArrowRight } from 'lucide-react';
import { brandConfig } from '@/lib/brand-config';

export default function PresentationPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const slides = [
    // Slide 1: Title & Vision
    {
      id: 'title',
      content: (
        <div className="flex flex-col items-center justify-center h-full text-center px-12">
          <div className="mb-8">
            <div className="inline-flex items-center gap-4 mb-6">
              <div 
                className="text-7xl font-bold leading-none"
                style={{ 
                  color: brandConfig.colors.primaryOpacity60,
                  fontFamily: brandConfig.typography.headerFont,
                  letterSpacing: brandConfig.typography.headerSpacing
                }}
              >
                DUB
              </div>
              <div className="h-20 w-px bg-gray-300"></div>
              <div>
                <h2 className="text-2xl font-bold text-gray-700" style={{ fontFamily: brandConfig.typography.headerFont }}>
                  DEUTSCH-UKRAINISCHES BÜRO
                </h2>
                <p className="text-lg text-gray-600 mt-1">Analytics • Advocacy • Solutions</p>
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold mb-6" style={{ color: brandConfig.colors.primary }}>
            Technische Innovation für Capacity Building
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-4xl">
            KI-gestützte Plattform ermöglicht Menschen ohne Vorerfahrung die professionelle Erstellung von EU-Förderanträgen
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 max-w-3xl">
            <p className="text-lg font-semibold text-blue-900">
              Für Engagement Global e.V.:
            </p>
            <p className="text-lg text-blue-800 mt-2">
              Eine skalierbare Technologie zur Demokratisierung des Zugangs zu Fördermitteln
            </p>
          </div>
          
          <div className="flex gap-12 mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: brandConfig.colors.primary }}>90%</div>
              <div className="text-sm text-gray-600 mt-2">Weniger Zeitaufwand</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: brandConfig.colors.primary }}>0</div>
              <div className="text-sm text-gray-600 mt-2">Vorkenntnisse nötig</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: brandConfig.colors.primary }}>100%</div>
              <div className="text-sm text-gray-600 mt-2">Übertragbar</div>
            </div>
          </div>
        </div>
      ),
    },
    
    // Slide 2: The Problem
    {
      id: 'problem',
      content: (
        <div className="flex flex-col justify-center h-full px-12">
          <h2 className="text-4xl font-bold mb-12" style={{ color: brandConfig.colors.primary }}>
            The Challenge: EU Grant Complexity
          </h2>
          
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg">
                <h3 className="font-bold text-xl mb-2 text-red-900">Language Barriers</h3>
                <p className="text-gray-700">Complex requirements in multiple languages create accessibility issues for Ukrainian organizations</p>
              </div>
              
              <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg">
                <h3 className="font-bold text-xl mb-2 text-red-900">Technical Complexity</h3>
                <p className="text-gray-700">EU portal systems require extensive technical knowledge and experience</p>
              </div>
              
              <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg">
                <h3 className="font-bold text-xl mb-2 text-red-900">Partnership Building</h3>
                <p className="text-gray-700">Finding qualified consortium partners across borders is time-consuming</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg">
                <h3 className="font-bold text-xl mb-2 text-amber-900">Time Constraints</h3>
                <p className="text-gray-700">Short deadlines (Sept 2025) require rapid proposal development</p>
              </div>
              
              <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg">
                <h3 className="font-bold text-xl mb-2 text-amber-900">Compliance Requirements</h3>
                <p className="text-gray-700">Strict formatting and regulatory requirements lead to rejections</p>
              </div>
              
              <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg">
                <h3 className="font-bold text-xl mb-2 text-amber-900">Resource Intensity</h3>
                <p className="text-gray-700">Small organizations lack dedicated grant writing resources</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    
    // Slide 3: Our Solution
    {
      id: 'solution',
      content: (
        <div className="flex flex-col justify-center h-full px-12">
          <h2 className="text-4xl font-bold mb-12" style={{ color: brandConfig.colors.primary }}>
            The Solution: AI-Powered Grant Assistant
          </h2>
          
          <div className="grid grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center rounded-full" style={{ backgroundColor: `${brandConfig.colors.primary}20` }}>
                <Globe className="w-10 h-10" style={{ color: brandConfig.colors.primary }} />
              </div>
              <h3 className="font-bold text-xl mb-2">Multilingual Support</h3>
              <p className="text-gray-600">Seamless DE/UK/EN translation with context-aware AI assistance</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center rounded-full" style={{ backgroundColor: `${brandConfig.colors.primary}20` }}>
                <Rocket className="w-10 h-10" style={{ color: brandConfig.colors.primary }} />
              </div>
              <h3 className="font-bold text-xl mb-2">Guided Workflow</h3>
              <p className="text-gray-600">Step-by-step process from idea to submission</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center rounded-full" style={{ backgroundColor: `${brandConfig.colors.primary}20` }}>
                <Users className="w-10 h-10" style={{ color: brandConfig.colors.primary }} />
              </div>
              <h3 className="font-bold text-xl mb-2">Partner Network</h3>
              <p className="text-gray-600">Access to qualified DE-UA consortium partners</p>
            </div>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-4 text-green-900">Unique Value Proposition</h3>
            <ul className="space-y-3 text-lg">
              <li className="flex items-start gap-3">
                <span className="text-green-600 mt-1">✓</span>
                <span>DeepSeek AI integration for intelligent proposal writing</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 mt-1">✓</span>
                <span>Real-time validation against EU requirements</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 mt-1">✓</span>
                <span>Template library for all Horizon Europe calls</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 mt-1">✓</span>
                <span>Export to Word/PDF in EU-compliant format</span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    
    // Slide 4: Technical Architecture
    {
      id: 'architecture',
      content: (
        <div className="flex flex-col justify-center h-full px-12">
          <h2 className="text-4xl font-bold mb-12" style={{ color: brandConfig.colors.primary }}>
            Technical Architecture
          </h2>
          
          <div className="grid grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6">Frontend Stack</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: brandConfig.colors.primary }}></div>
                  <div>
                    <strong>Next.js 15.5</strong> - React framework with SSR
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: brandConfig.colors.primary }}></div>
                  <div>
                    <strong>TypeScript</strong> - Type-safe development
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: brandConfig.colors.primary }}></div>
                  <div>
                    <strong>Tailwind CSS</strong> - Responsive UI design
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: brandConfig.colors.primary }}></div>
                  <div>
                    <strong>React Context</strong> - State management
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold mb-6">Backend & Infrastructure</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: brandConfig.colors.primary }}></div>
                  <div>
                    <strong>DeepSeek API</strong> - AI text generation
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: brandConfig.colors.primary }}></div>
                  <div>
                    <strong>PostgreSQL/Neon</strong> - Cloud database
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: brandConfig.colors.primary }}></div>
                  <div>
                    <strong>Prisma ORM</strong> - Database abstraction
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: brandConfig.colors.primary }}></div>
                  <div>
                    <strong>Netlify</strong> - Deployment & hosting
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-bold text-lg mb-2">Security & Compliance</h4>
            <p className="text-gray-700">GDPR-compliant data handling • Session-based validation • Secure API endpoints • No data persistence without consent</p>
          </div>
        </div>
      ),
    },
    
    // Slide 5: Key Features
    {
      id: 'features',
      content: (
        <div className="flex flex-col justify-center h-full px-12">
          <h2 className="text-4xl font-bold mb-12" style={{ color: brandConfig.colors.primary }}>
            Platform Features
          </h2>
          
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex gap-4">
                <Target className="w-8 h-8 flex-shrink-0 mt-1" style={{ color: brandConfig.colors.primary }} />
                <div>
                  <h3 className="font-bold text-xl mb-2">Smart Form Guidance</h3>
                  <p className="text-gray-600">AI-powered suggestions for each section based on call requirements</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Target className="w-8 h-8 flex-shrink-0 mt-1" style={{ color: brandConfig.colors.primary }} />
                <div>
                  <h3 className="font-bold text-xl mb-2">Real-time Validation</h3>
                  <p className="text-gray-600">Automatic checking of inputs against EU requirements</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Target className="w-8 h-8 flex-shrink-0 mt-1" style={{ color: brandConfig.colors.primary }} />
                <div>
                  <h3 className="font-bold text-xl mb-2">Template Library</h3>
                  <p className="text-gray-600">Pre-filled templates for all 2025 calls including Cluster 2 & CERV</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <Target className="w-8 h-8 flex-shrink-0 mt-1" style={{ color: brandConfig.colors.primary }} />
                <div>
                  <h3 className="font-bold text-xl mb-2">Multi-format Export</h3>
                  <p className="text-gray-600">Generate Word, PDF, and EU portal-ready formats</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Target className="w-8 h-8 flex-shrink-0 mt-1" style={{ color: brandConfig.colors.primary }} />
                <div>
                  <h3 className="font-bold text-xl mb-2">Progress Tracking</h3>
                  <p className="text-gray-600">Visual indicators for application completeness</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Target className="w-8 h-8 flex-shrink-0 mt-1" style={{ color: brandConfig.colors.primary }} />
                <div>
                  <h3 className="font-bold text-xl mb-2">Deadline Reminders</h3>
                  <p className="text-gray-600">Automated alerts for upcoming submission dates</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-12 grid grid-cols-3 gap-6 text-center">
            <div className="p-6 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold mb-2" style={{ color: brandConfig.colors.primary }}>5</div>
              <div className="text-sm text-gray-600">Step Process</div>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold mb-2" style={{ color: brandConfig.colors.primary }}>3</div>
              <div className="text-sm text-gray-600">Languages</div>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold mb-2" style={{ color: brandConfig.colors.primary }}>24/7</div>
              <div className="text-sm text-gray-600">Availability</div>
            </div>
          </div>
        </div>
      ),
    },
    
    // Slide 6: Impact & Benefits
    {
      id: 'impact',
      content: (
        <div className="flex flex-col justify-center h-full px-12">
          <h2 className="text-4xl font-bold mb-12" style={{ color: brandConfig.colors.primary }}>
            Expected Impact
          </h2>
          
          <div className="grid grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6">For Organizations</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: brandConfig.colors.primary }} />
                  <div>
                    <strong className="block">70% Time Reduction</strong>
                    <span className="text-gray-600">Faster proposal development with AI assistance</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: brandConfig.colors.primary }} />
                  <div>
                    <strong className="block">Higher Success Rate</strong>
                    <span className="text-gray-600">Better compliance with EU requirements</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: brandConfig.colors.primary }} />
                  <div>
                    <strong className="block">Cost Efficiency</strong>
                    <span className="text-gray-600">Reduced need for external consultants</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold mb-6">For DE-UA Cooperation</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Globe className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: brandConfig.colors.primary }} />
                  <div>
                    <strong className="block">Enhanced Collaboration</strong>
                    <span className="text-gray-600">Breaking down language & technical barriers</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Globe className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: brandConfig.colors.primary }} />
                  <div>
                    <strong className="block">More UA Participation</strong>
                    <span className="text-gray-600">Easier access to EU funding opportunities</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Globe className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: brandConfig.colors.primary }} />
                  <div>
                    <strong className="block">Knowledge Transfer</strong>
                    <span className="text-gray-600">Building grant-writing capacity</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-12 p-8 rounded-lg" style={{ backgroundColor: `${brandConfig.colors.primary}10` }}>
            <h3 className="text-xl font-bold mb-4">2025 Target Metrics</h3>
            <div className="grid grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold" style={{ color: brandConfig.colors.primary }}>100+</div>
                <div className="text-sm text-gray-600 mt-1">Organizations Supported</div>
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ color: brandConfig.colors.primary }}>50+</div>
                <div className="text-sm text-gray-600 mt-1">Proposals Submitted</div>
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ color: brandConfig.colors.primary }}>€10M+</div>
                <div className="text-sm text-gray-600 mt-1">Funding Applied For</div>
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ color: brandConfig.colors.primary }}>20+</div>
                <div className="text-sm text-gray-600 mt-1">DE-UA Partnerships</div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    
    // Slide 7: Call to Action
    {
      id: 'cta',
      content: (
        <div className="flex flex-col items-center justify-center h-full text-center px-12">
          <div className="mb-8">
            <div 
              className="text-6xl font-bold leading-none mb-4"
              style={{ 
                color: brandConfig.colors.primaryOpacity60,
                fontFamily: brandConfig.typography.headerFont,
                letterSpacing: brandConfig.typography.headerSpacing
              }}
            >
              DUB
            </div>
          </div>
          
          <h2 className="text-4xl font-bold mb-6" style={{ color: brandConfig.colors.primary }}>
            Ready to Transform EU Grant Applications?
          </h2>
          
          <p className="text-xl text-gray-600 mb-12 max-w-3xl">
            Join the German-Ukrainian Bureau in revolutionizing how organizations access EU funding opportunities
          </p>
          
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-lg border border-gray-200 mb-12">
            <h3 className="text-2xl font-bold mb-6">Next Steps</h3>
            <div className="space-y-4 text-left max-w-2xl mx-auto">
              <div className="flex items-center gap-3">
                <ArrowRight className="w-5 h-5" style={{ color: brandConfig.colors.primary }} />
                <span className="text-lg">Launch beta platform (March 2025)</span>
              </div>
              <div className="flex items-center gap-3">
                <ArrowRight className="w-5 h-5" style={{ color: brandConfig.colors.primary }} />
                <span className="text-lg">Partner onboarding for Cluster 2 calls (May 2025)</span>
              </div>
              <div className="flex items-center gap-3">
                <ArrowRight className="w-5 h-5" style={{ color: brandConfig.colors.primary }} />
                <span className="text-lg">Full deployment before September deadline</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-6 mb-8">
            <button 
              className="px-8 py-4 text-white font-bold rounded-lg text-lg hover:opacity-90 transition-opacity"
              style={{ backgroundColor: brandConfig.colors.primary }}
            >
              Request Demo
            </button>
            <button className="px-8 py-4 border-2 border-gray-300 font-bold rounded-lg text-lg hover:bg-gray-50 transition-colors">
              Learn More
            </button>
          </div>
          
          <div className="text-gray-500 mt-8">
            <p>Contact: info@dub-grant-assistant.eu</p>
            <p className="mt-2">© 2025 Deutsch-Ukrainisches Büro</p>
          </div>
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

  return (
    <div className={`${isFullscreen ? 'fixed inset-0' : 'min-h-screen'} bg-white flex flex-col`}>
      {/* Header */}
      {!isFullscreen && (
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Presentation className="w-6 h-6" style={{ color: brandConfig.colors.primary }} />
            <h1 className="text-xl font-bold">DUB Grant Assistant - Marketing Presentation</h1>
          </div>
          <button
            onClick={toggleFullscreen}
            className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Press F for Fullscreen
          </button>
        </div>
      )}

      {/* Slide Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-7xl">
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
          Previous
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
          Next
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