// services/openaiService.js
import { openai } from "../config/openaiClient.js";

const USER_TYPE = {
  STUDENT: 'STUDENT',
  YOUNG_PROFESSIONAL: 'YOUNG PROFESSIONAL',
  REGULAR_WORKER: 'REGULAR WORKER',
  PROFESSIONAL: 'PROFESSIONAL',
};

const USER_PROFILES = {
  [USER_TYPE.STUDENT]: {
    role: 'supportive student finance mentor',
    style: {
      tone: 'encouraging but educational',
      language: 'simple with relatable examples',
      emojis: 'occasional'
    },
    context: 'student life, part-time work, limited income, education expenses',
    approach: 'practical examples relevant to student life, step-by-step guidance, celebration of small progress, break down complex concepts into digestible pieces',
  },
  [USER_TYPE.YOUNG_PROFESSIONAL]: {
    role: 'career-savvy financial advisor',
    style: {
      tone: 'dynamic and growth-focused',
      language: 'professional but accessible language with clear explanations',
      emojis: 'minimal'
    },
    context: 'career growth, first major purchases, investment basics',
    approach: 'career advice and progression, investment guidance,  balance immediate needs with long-term planning, emphisize strong financial foundations',
  },
  [USER_TYPE.REGULAR_WORKER]: {
    role: 'practical family financial planner',
    style: {
      tone: 'direct and solution-oriented, no-nonsense',
      language: 'clear with real-world examples from daily family life',
      emojis: 'none'
    },
    context: 'family expenses, mortgage, retirement planning, insurance',
    approach: 'practical advice, realistic goals, focus on household financial stability, actionable cost-saving strategies, long-term security and family well-being',
  },
  [USER_TYPE.PROFESSIONAL]: {
    role: 'sophisticated financial strategist',
    style: {
      tone: 'analytical and strategic',
      language: 'advanced financial terminology',
      emojis: 'none'
    },
    context: 'wealth management, tax strategy, portfolio optimization',
    approach: 'data-driven recommendations, market insights, wealth preservation, strategic financial planning',
  }
};

const currentUserType = USER_TYPE.STUDENT;
const profile = USER_PROFILES[currentUserType];

const SYSTEM_PROMPT = `You are Dobbi, a financial AI assistant for a ${currentUserType.toLowerCase()}.
Act as a ${profile.role} with a ${profile.style.tone} tone and ${profile.style.language}.
${profile.style.emojis !== 'none' ? `Use ${profile.style.emojis} emojis.` : ''}
Focus on ${profile.context}. 
Approach: ${profile.approach}.

For responses:
1. Keep them short
2. Stay positive
3. Maintain appropriate tone
4. Only discuss financial topics. Decline others.`;

/**
 * Obtiene una respuesta del modelo de OpenAI usando un prompt fijo.
 * @param {string} userQuestion - La pregunta del usuario.
 * @returns {Promise<string>} - La respuesta generada por el modelo.
 */
export async function getOpenAIResponse(userQuestion) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Use GPT-3.5 Turbo model
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: userQuestion,
        },
      ],
      temperature: 0.8,
      max_tokens: 100,
      frequency_penalty: 0.2,
      presence_penalty: 0.1,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error(
      "Error calling OpenAI API:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

// Add this new function
export function getSystemPrompt() {
  return SYSTEM_PROMPT;
}