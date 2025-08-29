'use client';

import { useState } from 'react';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { FileText, Users, Globe, Shield } from 'lucide-react';

export default function Home() {
  const [showChat, setShowChat] = useState(false);
  const [currentStep, setCurrentStep] = useState('introduction');

  return (
    <div className="min-h-screen bg-gray-50">
      {!showChat ? (
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              KI-Antragsassistent
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Unterstützung für zivilgesellschaftliche Organisationen in Deutschland und der Ukraine bei der Erstellung von EU-Förderanträgen
            </p>
          </header>

          {/* Features */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <FeatureCard
              icon={<FileText className="w-8 h-8" />}
              title="EU Horizon Europe"
              description="Schritt-für-Schritt Anleitung für Horizon Europe Anträge"
            />
            <FeatureCard
              icon={<Users className="w-8 h-8" />}
              title="KI-Unterstützung"
              description="Intelligente Vorschläge und Formulierungshilfen"
            />
            <FeatureCard
              icon={<Globe className="w-8 h-8" />}
              title="Mehrsprachig"
              description="Verfügbar in Deutsch, Ukrainisch und Englisch"
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8" />}
              title="Datenschutz"
              description="Ihre Daten bleiben sicher und vertraulich"
            />
          </div>

          {/* Sample Project Walk-through */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Beispielhafter EU Horizon Antrag
            </h2>
            <div className="prose max-w-none text-gray-600">
              <h3 className="text-lg font-semibold mt-4 mb-2">
                Projekt: "Digital Bridges for Civil Society"
              </h3>
              <p className="mb-4">
                Ein Kooperationsprojekt zwischen deutschen und ukrainischen NGOs zur Entwicklung 
                digitaler Werkzeuge für zivilgesellschaftliches Engagement.
              </p>
              
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                <h4 className="font-semibold mb-2">Excellence (Exzellenz)</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Innovative digitale Plattform für grenzüberschreitende Zusammenarbeit</li>
                  <li>Neue Methoden für virtuelle Partizipation und Engagement</li>
                  <li>Integration von KI für automatische Übersetzung und kulturelle Anpassung</li>
                </ul>
              </div>

              <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
                <h4 className="font-semibold mb-2">Impact (Wirkung)</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Stärkung von 50+ Organisationen in beiden Ländern</li>
                  <li>Erreichen von 10.000+ Bürgern durch digitale Teilhabe</li>
                  <li>Nachhaltige Partnerschaften und Wissenstransfer</li>
                </ul>
              </div>

              <div className="bg-purple-50 border-l-4 border-purple-500 p-4 mb-4">
                <h4 className="font-semibold mb-2">Implementation (Umsetzung)</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>24 Monate Projektlaufzeit mit 6 Arbeitspaketen</li>
                  <li>Konsortium aus 5 Partnern (3 DE, 2 UA)</li>
                  <li>Budget: 1,5 Millionen EUR</li>
                </ul>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <button
              onClick={() => setShowChat(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold px-8 py-4 rounded-lg shadow-lg transition-colors"
            >
              Jetzt Antrag erstellen
            </button>
            <p className="mt-4 text-gray-600">
              Keine Registrierung erforderlich - starten Sie direkt!
            </p>
          </div>
        </div>
      ) : (
        <div className="h-screen flex flex-col">
          <header className="bg-white border-b px-4 py-3 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-800">
              KI-Antragsassistent
            </h1>
            <button
              onClick={() => setShowChat(false)}
              className="text-gray-600 hover:text-gray-800"
            >
              Zurück zur Übersicht
            </button>
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

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
      <div className="text-blue-500 mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}