import { ApplicationContext } from './ApplicationContextManager';
import { SessionHandler } from '@/hooks/useSession';

/**
 * The context required for making parsing decisions.
 * This aggregates all necessary information for the parser.
 */
export interface ParsingContext {
  currentStep: string;
  lastAssistantMessage?: string;
  existingContext: ApplicationContext;
  sessionHandler: SessionHandler;
}

/**
 * Defines a single rule for parsing a piece of information from user input.
 */
interface ParsingRule {
  key: keyof ApplicationContext;
  // Condition to check if this rule is applicable.
  condition: (input: string, context: ParsingContext) => boolean;
  // Function to extract the value from the input string.
  extract: (input: string, context: ParsingContext) => any;
}

// TODO: Translate the logic from getUpdatedContext into a set of rules.
const parsingRules: ParsingRule[] = [
  // Example Rule for structured input like "Organisation: DUMMY"
  {
    key: 'organizationName',
    condition: (input) => /(organisation|organization):/i.test(input) && !input.includes('Name der Organisation'),
    extract: (input) => input.split(/:(.*)/s)[1]?.trim(),
  },
  {
    key: 'projectTitle',
    condition: (input) => /(projekt|project):/i.test(input) && !input.includes('Projekttitel'),
    extract: (input) => input.split(/:(.*)/s)[1]?.trim(),
  },
  {
    key: 'call',
    condition: (input) => /call:/i.test(input),
    extract: (input) => {
        const value = input.split(/:(.*)/s)[1]?.trim();
        const callMatch = value.match(/HORIZON-CL\d-\d{4}-[\w-]+/);
        return callMatch ? callMatch[0] : value;
    },
  },
  // Rule for HORIZON call identifiers present anywhere in the message
  {
    key: 'call',
    condition: (input) => /HORIZON-CL\d-\d{4}-[\w-]+/.test(input),
    extract: (input) => input.match(/HORIZON-CL\d-\d{4}-[\w-]+/)?.[0],
  },
  // Rule for CERV call identifiers
  {
      key: 'call',
      condition: (input) => /CERV-\d{4}-[\w-]+/.test(input),
      extract: (input) => input.match(/CERV-\d{4}-[\w-]+/)?.[0],
  }
];

/**
 * Parses the user's input string to extract structured data into the application context.
 * @param input The raw string from the user.
 * @param context The current parsing context, including step, history, and session.
 * @returns A promise that resolves to the updates and a record of validated fields.
 */
export const parseUserInput = async (
  input: string,
  context: ParsingContext
): Promise<{ updates: Partial<ApplicationContext>; validatedFields: Record<string, boolean> }> => {
  const updates: Partial<ApplicationContext> = {};
  const validatedFields: Record<string, boolean> = {};
  const { existingContext, sessionHandler, lastAssistantMessage, currentStep } = context;

  // 1. Process explicit rules first
  for (const rule of parsingRules) {
    if (!updates[rule.key] && !existingContext[rule.key] && rule.condition(input, context)) {
      const value = rule.extract(input, context);
      if (value) {
        const isValid = await sessionHandler.validateAndStore(rule.key as string, value);
        if (isValid) {
          updates[rule.key] = value;
          validatedFields[rule.key as string] = true;
        }
      }
    }
  }

  // 2. Handle more complex, sequential, and implicit logic
  // This logic is harder to fit into simple rules and often depends on the conversation flow.

  const lastAssistantContent = lastAssistantMessage?.toLowerCase() || '';

  // Use a temporary validation to check if the input is generic (like "yes", "ok")
  const isGeneric = !(await sessionHandler.validateAndStore('_test_generic', input));
  await sessionHandler.validateAndStore('_test_generic', null); // Clean up the temporary validation

  if (!isGeneric) {
    const lowerLastAssistant = lastAssistantContent.toLowerCase();
      // If we don't have an org name yet and the assistant asked for it
      if (!existingContext.organizationName && !updates.organizationName &&
          (lowerLastAssistant.includes('wie heißt ihre organisation') || lowerLastAssistant.includes('name of your organization'))) {
          const isValid = await sessionHandler.validateAndStore('organizationName', input.trim());
          if (isValid) {
              updates.organizationName = input.trim();
              validatedFields.organizationName = true;
          }
      }
      // If we have an org name but no project title, assume the next message is the project title
      else if (existingContext.organizationName && !existingContext.projectTitle && !updates.projectTitle &&
          (lowerLastAssistant.includes('projekt') || lowerLastAssistant.includes('titel') || lowerLastAssistant.includes('project title'))) {
          const isValid = await sessionHandler.validateAndStore('projectTitle', input.trim());
          if (isValid) {
              updates.projectTitle = input.trim();
              validatedFields.projectTitle = true;
          }
      }
  }


  // Add program type if a call was identified
  if (updates.call) {
      if (updates.call.startsWith('HORIZON')) {
          updates.programType = 'HORIZON';
      } else if (updates.call.startsWith('CERV')) {
          updates.programType = 'CERV';
      }
  }

  return { updates, validatedFields };
};
