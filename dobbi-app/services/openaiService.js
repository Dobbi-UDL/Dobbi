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

Short helpful answers
Split output into natural chat messages, MAX 5. mark split with --
Only discuss financial topics decline others
Don't recommend other apps except Dobbi itself`;

const USE_AI = true; // Toggle for AI responses

const getMockResponse = async () => {
  // Simulate reasonable API delay (500-1500ms)
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));
  return `mock`;
};

/**
 * Obtiene una respuesta del modelo de OpenAI usando un prompt fijo.
 * @param {string} userQuestion - La pregunta del usuario.
 * @returns {Promise<string>} - La respuesta generada por el modelo.
 */
export async function getOpenAIResponse(userQuestion, financialData = null, username = null) {
  const userContext = username ? `\nUser: ${username}` : '';
  const financialContext = financialData ? formatFinancialMetrics(financialData) : '';
  const contextualPrompt = `${SYSTEM_PROMPT}${userContext}\n\n${financialContext}`;
  
  try {
    if (!USE_AI) {
      console.log('-----------------PROMPT-----------------');
      console.log(contextualPrompt);
      return getMockResponse(userQuestion);
    }

    const response = await openai.chat.completions.create({
      model: "grok-beta",
      messages: [
        {
          role: "system",
          content: contextualPrompt,
        },
        {
          role: "user",
          content: userQuestion,
        },
      ],
      temperature: 0.7, // Slightly reduced for more focused responses
      max_tokens: 500, // Increased significantly
      frequency_penalty: 0.2,
      presence_penalty: 0.1,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error(
      "Error calling OpenAI API:",
      error.response ? error.response.data : error.message
    );
    return getMockResponse(userQuestion); // Fallback to mock response on error
  }
}

const formatFinancialMetrics = (data) => {
  const { monthlyTrend = [], expenseCategories = [], incomeCategories = [] } = data;

  return `Monthly Trend:
${monthlyTrend.map(t => 
    `${t.month_year}:+${t.total_income}-${t.total_expenses}`
  ).join('\n')}

Top 5 Expenses:
${expenseCategories.slice(0,5).map(e => 
    `${e.category_name}:${e.percentage.toFixed(1)}%`
  ).join('\n')}

Top 5 Income:
 ${incomeCategories.slice(0,5).map(i => 
    `${i.category_name}:${i.percentage.toFixed(1)}%`
  ).join('\n')}`;
};