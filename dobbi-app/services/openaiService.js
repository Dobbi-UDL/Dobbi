import { openai } from "../config/openaiClient.js";

const USE_AI = true; // Toggle for AI responses

const USER_TYPE = {
  STUDENT: 'STUDENT',
  YOUNG_PROFESSIONAL: 'YOUNG_PROFESSIONAL',
  REGULAR_WORKER: 'REGULAR_WORKER',
  PROFESSIONAL: 'PROFESSIONAL',
};

const USER_PROFILES = {
  'STUDENT': {
    role: 'supportive student finance mentor',
    style: {
      tone: 'encouraging but educational',
      language: 'simple with relatable examples',
      emojis: 'occasional'
    },
    context: 'student life, part-time work, limited income, education expenses',
    approach: 'practical examples relevant to student life, step-by-step guidance, celebration of small progress, break down complex concepts into digestible pieces',
  },
  'YOUNG_PROFESSIONAL': {
    role: 'career-savvy financial advisor',
    style: {
      tone: 'dynamic and growth-focused',
      language: 'professional but accessible language with clear explanations',
      emojis: 'minimal'
    },
    context: 'career growth, first major purchases, investment basics',
    approach: 'career advice and progression, investment guidance,  balance immediate needs with long-term planning, emphisize strong financial foundations',
  },
  'REGULAR_WORKER': {
    role: 'practical family financial planner',
    style: {
      tone: 'direct and solution-oriented, no-nonsense',
      language: 'clear with real-world examples from daily family life',
      emojis: 'none'
    },
    context: 'family expenses, mortgage, retirement planning, insurance',
    approach: 'practical advice, realistic goals, focus on household financial stability, actionable cost-saving strategies, long-term security and family well-being',
  },
  'PROFESSIONAL': {
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

// Add this mapping object to convert database types to profile types
const USER_TYPE_MAPPING = {
  'student': 'STUDENT',
  'young_professional': 'YOUNG_PROFESSIONAL',
  'family': 'REGULAR_WORKER',
  'professional': 'PROFESSIONAL'
};

const getMockResponse = async () => {
  // Simulate reasonable API delay (500-1500ms)
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));
  return `I can help you manage your family's finances, set up saving goals, and track your expenses right here in the Dobbi app. Let's focus on making your household financially stable and secure. --

What specific financial concerns do you have for your family?
`;
};

/**
 * Obtiene una respuesta del modelo de OpenAI usando un prompt fijo.
 * @param {string} userQuestion - La pregunta del usuario.
 * @returns {Promise<string>} - La respuesta generada por el modelo.
 */
export async function getOpenAIResponse(userQuestion, username = null, financialData = null, offersData = null, userType = 'STUDENT') {
  // Map the database user type to profile type
  const normalizedUserType = USER_TYPE_MAPPING[userType?.toLowerCase()] || 'STUDENT';
  
  const profile = USER_PROFILES[normalizedUserType];
  
  if (!profile) {
    console.error(`Invalid user type: ${userType} (normalized: ${normalizedUserType}), falling back to STUDENT profile`);
    profile = USER_PROFILES['STUDENT'];
  }

  // Add debug logging
  console.log('User type:', userType);
  console.log('Normalized type:', normalizedUserType);
  console.log('Selected profile:', profile?.role);

  const userContext = username ? `\nUser: ${username}` : '';
  const today = `Today: ${new Date().toLocaleDateString()}`; // Add current date to context
  const financialContext = financialData ? formatFinancialMetrics(financialData) : '';
  const offersContext = offersData ? formatOffers(offersData) : '';

  // Create system prompt using the provided user type and profile
  const systemPrompt = `You are Dobbi, a financial AI assistant for a ${userType}.
Act as a ${profile.role} with a ${profile.style.tone} tone and ${profile.style.language}.
${profile.style.emojis !== 'none' ? `Use ${profile.style.emojis} emojis.` : ''}
Focus on ${profile.context}. 
Approach: ${profile.approach}.

SHORT TOTAL OUTPUT.
!!!Split into short natural length chat messages. mark split with -- 
Don't want long unnatural chat bubbles.
Be helpful and positive
Only discuss financial topics decline others
Don't recommend other apps except Dobbi app yourself
Make sure to reference user's situation/type in responses

Dobbi is a financial advisor app that let's you track your finances, set saving goals, and redeem offers from partner companies using points earned using the app.

If there's a relevant offer available, related to the user's query, you can suggest it naturally. Don't suggest offers if they don't fit the context or query, only if they are helpful for the user.

Show offers with the following format: [**Title** for x points], expiring on mm-dd-yyyy.`;

  const contextualPrompt = `${systemPrompt}\n\n${userContext}\n\n${today}\n${financialContext}\n\n${offersContext}`;
  
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
      temperature: 0.7,
      max_tokens: 500, 
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

const formatOffers = (data) => {
  if (!data || data.length === 0) return '';

  return `Available Offers:
${data.map(cat =>
    `${cat.category_name}
${cat.offers.map(o =>
      `  ${o.title}, ${o.points_required}pts, exp ${new Date(o.end_date).toLocaleDateString()}`
    ).join('\n')}`
  ).join('\n')}`;
};