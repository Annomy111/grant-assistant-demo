# KI-Antragsassistent für EU-Förderanträge

Eine KI-gestützte Webanwendung, die zivilgesellschaftliche Organisationen in Deutschland und der Ukraine bei der Erstellung von EU-Förderanträgen unterstützt.

## Features

### 🎯 Kernfunktionen
- **Schritt-für-Schritt Anleitung**: Geführter Prozess durch alle Abschnitte eines EU Horizon Europe Antrags
- **KI-Unterstützung**: Intelligente Textvorschläge und Formulierungshilfen durch DeepSeek AI
- **Mehrsprachigkeit**: Verfügbar in Deutsch, Ukrainisch und Englisch
- **Dokumenten-Export**: Export als PDF oder Word-Dokument

### 📊 EU Horizon Europe Vorlage
- **Excellence**: Ziele, Methodik und Innovation
- **Impact**: Erwartete Wirkung und Verbreitung
- **Implementation**: Arbeitsplan, Ressourcen und Konsortium

### 💡 Benutzerfreundliches Interface
- Chat-basierte Interaktion für intuitive Bedienung
- Fortschrittsanzeige für alle Antragsschritte
- Quick Actions für häufige Anfragen
- Beispielprojekte und Best Practices

## Technologie-Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **KI-Integration**: DeepSeek AI API
- **Datenbank**: Neon (PostgreSQL) mit Prisma ORM
- **UI-Komponenten**: Radix UI, Lucide Icons
- **Export**: HTML zu PDF/Word Konvertierung

## Installation

1. Repository klonen:
```bash
git clone <repository-url>
cd grant-assistant
```

2. Abhängigkeiten installieren:
```bash
npm install
```

3. Umgebungsvariablen konfigurieren:
```bash
cp .env.local.example .env.local
```

Fügen Sie Ihre Credentials in `.env.local` ein:
```env
# Neon Database
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# DeepSeek API
DEEPSEEK_API_KEY="your-deepseek-api-key"
DEEPSEEK_API_URL="https://api.deepseek.com/v1"

# App Settings
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

4. Datenbank einrichten:
```bash
npx prisma generate
npx prisma db push
```

5. Entwicklungsserver starten:
```bash
npm run dev
```

Die App ist nun unter `http://localhost:3000` verfügbar.

## Projektstruktur

```
grant-assistant/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # API Routes
│   │   │   └── chat/           # Chat-Endpunkt
│   │   ├── layout.tsx          # Root Layout
│   │   └── page.tsx            # Hauptseite
│   ├── components/             # React Komponenten
│   │   ├── chat/               # Chat-Komponenten
│   │   │   ├── ChatInterface.tsx
│   │   │   ├── ChatMessage.tsx
│   │   │   ├── ChatInput.tsx
│   │   │   ├── StepIndicator.tsx
│   │   │   └── QuickActions.tsx
│   │   ├── ExportDialog.tsx    # Export-Dialog
│   │   └── LanguageSelector.tsx # Sprachauswahl
│   ├── contexts/               # React Contexts
│   │   └── LanguageContext.tsx # Mehrsprachigkeit
│   ├── lib/                    # Utilities und Services
│   │   ├── ai/                 # KI-Integration
│   │   │   ├── deepseek.ts     # DeepSeek Client
│   │   │   └── grant-assistant.ts # Antrags-Logik
│   │   ├── export/             # Export-Funktionen
│   │   │   └── document-generator.ts
│   │   ├── i18n/               # Übersetzungen
│   │   │   └── translations.ts
│   │   └── utils.ts            # Hilfsfunktionen
│   └── generated/              # Generierte Dateien
│       └── prisma/             # Prisma Client
├── prisma/
│   └── schema.prisma           # Datenbank-Schema
├── public/                     # Statische Dateien
└── package.json               # Projekt-Dependencies
```

## Nutzung

### 1. Projekt starten
- Öffnen Sie die Hauptseite
- Klicken Sie auf "Jetzt Antrag erstellen"

### 2. Grundinformationen eingeben
- Name der Organisation
- Projekttitel
- Land (Deutschland/Ukraine)
- Projektbeschreibung

### 3. Antragsabschnitte bearbeiten
Die KI führt Sie durch:
- **Excellence**: Projektziele und innovative Aspekte
- **Impact**: Erwartete Auswirkungen und Verbreitung
- **Implementation**: Arbeitsplan und Ressourcenplanung

### 4. Dokument exportieren
- Wählen Sie zwischen PDF oder Word-Format
- Das Dokument enthält alle eingegebenen Informationen

## API-Endpoints

### POST /api/chat
Hauptendpunkt für die Chat-Kommunikation

```typescript
{
  message: string;          // Benutzernachricht
  applicationId?: string;   // Antrags-ID
  currentStep: string;      // Aktueller Schritt
  history: Message[];       // Chatverlauf
}
```

## Datenbank-Schema

### Hauptmodelle:
- **Organization**: Organisationsdaten
- **User**: Benutzerprofile
- **Application**: Förderanträge
- **Session**: Chat-Sitzungen
- **Document**: Generierte Dokumente
- **Template**: Antragsvorlagen

## Deployment

### Vercel Deployment
```bash
vercel
```

### Docker Deployment
```bash
docker build -t grant-assistant .
docker run -p 3000:3000 grant-assistant
```

## Sicherheit

- Alle API-Schlüssel in Umgebungsvariablen
- Verschlüsselte Datenbankverbindung
- Keine Speicherung sensibler Daten im Frontend
- GDPR-konforme Datenverarbeitung

## Roadmap

- [ ] Weitere Förderprogramme (Erasmus+, Creative Europe)
- [ ] Kollaborative Bearbeitung
- [ ] Budgetrechner mit Visualisierung
- [ ] Integration mit EU-Submission-Portalen
- [ ] Offline-Modus
- [ ] Mobile Apps (iOS/Android)

## Support

Für Fragen und Unterstützung:
- Erstellen Sie ein Issue im GitHub Repository
- Kontaktieren Sie das Entwicklungsteam

## Lizenz

MIT License - siehe LICENSE Datei für Details

## Mitwirkende

Entwickelt für zivilgesellschaftliche Organisationen in Deutschland und der Ukraine zur Förderung der europäischen Zusammenarbeit.

---

**Hinweis**: Dies ist ein Prototyp für Demonstrationszwecke. Für den Produktiveinsatz sind weitere Konfigurationen und Sicherheitsmaßnahmen erforderlich.