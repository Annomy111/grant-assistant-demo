# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an EU grant assistance application for German-Ukrainian civil society organizations, built with Next.js 15.5.0, TypeScript, and Tailwind CSS. The application helps NGOs create EU funding proposals through a conversational AI interface supporting multiple grant programs (Horizon Europe, CERV, ERASMUS+, Creative Europe).

## Key Commands

### Development
```bash
npm run dev           # Start development server
npm run build         # Build for production (runs prisma generate first)
npm run start         # Start production server
```

### Database
```bash
npx prisma generate   # Generate Prisma client
npx prisma db push    # Push schema to database
```

### Testing
```bash
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage
npm run test:landing  # Test landing page specifically
npm run test:chat     # Test chat interface
npm run test:flow     # Test application flow
npm run test:headless # Run tests in headless mode
npm run test:headed   # Run tests with visible browser
```

### Individual Test Execution
```bash
node __tests__/landing.test.js     # Run single test file directly
npx jest landing.test.js --bail    # Run with Puppeteer, stop on first failure
```

## Architecture & Key Components

### Workflow State Management
The application uses a multi-step workflow with context accumulation:

1. **Introduction Phase**: Collects organization name, project title, and call identifier
2. **Excellence Step**: Project objectives and methodology (50% weight)
3. **Impact Step**: Expected outcomes and dissemination (30% weight)  
4. **Implementation Step**: Work plan and resources (20% weight)
5. **Review Step**: Final document review and export

### Critical Context Detection Logic

The `getUpdatedContext` function in `src/components/chat/ChatInterface.tsx` is crucial for workflow progression:
- Only updates context during introduction phase (`step === 'introduction'`)
- Filters out generic prompts (e.g., "please continue", "check")
- Detects organization, project title, and call based on assistant prompts and message sequence
- Workflow advances only when all three fields are present

### Template-Specific AI Prompts

Each grant program has specialized prompts in `src/lib/ai/grant-assistant.ts`:
- **HORIZON**: Focuses on Work Packages, TRL levels, €438M budget
- **CERV**: Emphasizes democracy, 90% funding rate, Ukraine association
- **ERASMUS**: Capacity building, €10M Ukraine window
- **CREATIVE**: Cultural cooperation, 80% funding rate

### API Context Preservation

The `/api/chat` route preserves frontend context:
```typescript
const context = extractContextFromHistory(history, messageContext);
// messageContext from frontend takes precedence
```

### State Persistence

Uses localStorage for conversation state (`grant-assistant-state`):
- Messages array
- Project context (organization, title, call)
- Current workflow step
- Selected template ID
- Populated sections

## Common Development Issues & Solutions

### Issue: Project Title Not Captured
**Symptom**: Second user message (project title) doesn't update context
**Solution**: Check `getUpdatedContext` logic - ensure it's not filtered as generic prompt and that conditions properly detect when assistant asks for project info

### Issue: Workflow Stuck at Introduction
**Symptom**: All three fields present but workflow doesn't advance
**Solution**: Verify in `/api/chat/route.ts` that the check happens:
```typescript
if (context.organizationName && context.projectTitle && context.call) {
  nextStep = 'excellence';
}
```

### Issue: Context Overwriting
**Symptom**: Valid context gets replaced with generic messages
**Solution**: The `isGenericPrompt` check filters out common navigation phrases

## Environment Setup

Required environment variables in `.env.local`:
```env
DATABASE_URL="postgresql://..."     # Neon PostgreSQL connection
DEEPSEEK_API_KEY="sk-..."          # DeepSeek API key
DEEPSEEK_API_URL="https://api.deepseek.com/v1"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Template System

Templates are loaded from `src/lib/templates/samples/` and include:
- Pre-filled context (organization, project details)
- Section-specific content generators
- Language-specific formatting
- Program-specific terminology

## Testing Strategy

Tests use Puppeteer for E2E testing. Key test patterns:
- Wait for loading spinners to disappear before proceeding
- Use `waitForFunction` for dynamic content
- Clear textarea with `clickCount: 3` + Backspace
- Check localStorage for state verification

## Important File Locations

- **Chat Interface**: `src/components/chat/ChatInterface.tsx` - Main UI and context management
- **API Route**: `src/app/api/chat/route.ts` - Workflow progression logic
- **Grant Assistant**: `src/lib/ai/grant-assistant.ts` - AI prompts and template selection
- **Templates**: `src/lib/templates/samples/*.ts` - Grant program templates
- **Database Schema**: `prisma/schema.prisma` - PostgreSQL schema definition