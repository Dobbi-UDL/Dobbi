import { openai } from "../config/openaiClient.js";
import { PROFILE_ENUMS, MOTIVATIONS, GOALS, DEBT_TYPES } from '../constants/profileEnums';

const USE_AI = true; // Toggle for AI responses

const USER_PROFILES = {
  'student': {
    role: 'supportive student finance mentor',
    style: {
      tone: 'encouraging but educational',
      language: 'simple with relatable examples',
      emojis: 'occasional'
    },
    context: 'student life, part-time work, limited income, education expenses',
    approach: 'practical examples relevant to student life, step-by-step guidance, celebration of small progress, break down complex concepts into digestible pieces',
  },
  'early_career': {
    role: 'career-savvy financial advisor',
    style: {
      tone: 'dynamic and growth-focused',
      language: 'professional but accessible language with clear explanations',
      emojis: 'minimal'
    },
    context: 'career growth, first major purchases, investment basics',
    approach: 'career advice and progression, investment guidance,  balance immediate needs with long-term planning, emphisize strong financial foundations',
  },
  'family': {
    role: 'practical family financial planner',
    style: {
      tone: 'direct and solution-oriented, no-nonsense',
      language: 'clear with real-world examples from daily family life',
      emojis: 'none'
    },
    context: 'family expenses, mortgage, retirement planning, insurance',
    approach: 'practical advice, realistic goals, focus on household financial stability, actionable cost-saving strategies, long-term security and family well-being',
  },
  'professional': {
    role: 'sophisticated financial strategist',
    style: {
      tone: 'analytical and strategic',
      language: 'advanced financial terminology',
      emojis: 'none'
    },
    context: 'wealth management, tax strategy, portfolio optimization',
    approach: 'data-driven recommendations, market insights, wealth preservation, strategic financial planning',
  },
  'generic': {
    role: 'general financial advisor',
    style: {
      tone: 'friendly and informative',
      language: 'clear and concise',
      emojis: 'occasional'
    },
    context: 'general financial advice, budgeting, saving, investing',
    approach: 'general financial advice, budgeting, saving, investing',
  },
};

const getEnumLabel = (enumType, value) => {
  if (!value) return null;
  
  switch(enumType) {
    case 'motivations':
      return MOTIVATIONS.find(opt => opt.value === value)?.label || value;
    case 'goals':
      return GOALS.find(opt => opt.value === value)?.label || value;
    case 'debt_types':
      return DEBT_TYPES.find(opt => opt.value === value)?.label || value;
    default:
      return PROFILE_ENUMS[enumType]?.find(opt => opt.value === value)?.label || value;
  }
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
const formatUserContext = (username, userData) => {
  if (!userData) return '';
  
  const age = userData.birthday ? 
    Math.floor((new Date() - new Date(userData.birthday)) / 31557600000) : null;

  const sections = [
    userData.username && `Name: ${username}`,
    age && `Age: ${age}`,
    userData.gender && `Gender: ${getEnumLabel('gender', userData.gender)}`,
    userData.education && `Education: ${getEnumLabel('education', userData.education)}`,
    userData.country?.name && `Location: ${userData.country.name}${userData.region?.name ? `, ${userData.region.name}` : ''}`,
    
    // App usage purpose (motivations)
    userData.motivations?.length > 0 && (
      userData.motivations[0]?.motivation_ids?.length > 0 || userData.motivations[0]?.other_motivation
    ) && `Motivations: ${[
      ...(userData.motivations[0].motivation_ids?.map(id => getEnumLabel('motivations', id)) || []),
      userData.motivations[0].other_motivation
    ].filter(Boolean).join(', ')}`,

    // Financial goals
    userData.goals?.length > 0 && (
      userData.goals[0]?.goal_ids?.length > 0 || userData.goals[0]?.other_goal
    ) && `Goals: ${[
      ...(userData.goals[0].goal_ids?.map(id => getEnumLabel('goals', id)) || []),
      userData.goals[0].other_goal
    ].filter(Boolean).join(', ')}`,

    // Financial profile details
    userData.financials?.length > 0 && userData.financials[0]?.experience &&
      `Financial Experience: ${getEnumLabel('experience', userData.financials[0].experience)}`,
    userData.financials?.length > 0 && userData.financials[0]?.savings &&
      `Savings Habits: ${getEnumLabel('savings', userData.financials[0].savings)}`,
    userData.financials?.length > 0 && userData.financials[0]?.situation &&
      `Financial Situation: ${getEnumLabel('situation', userData.financials[0].situation)}`,
  
    // Debt information
    userData.financials?.length > 0 && (
      userData.financials[0]?.debt_types?.length > 0 || userData.financials[0]?.other_debt
    ) && `Debt Types: ${[
      ...(userData.financials[0].debt_types?.map(id => getEnumLabel('debt_types', id)) || []),
      userData.financials[0].other_debt
    ].filter(Boolean).join(', ')}`
  ].filter(Boolean);

  return sections.length ? `User Context:\n${sections.join('\n')}` : '';
};

export async function getOpenAIResponse(userQuestion, userType = null, username = null, profileData = null, financialData = null, offersData = null) {

  // Get user type
  const userTypeLabel = userType ? getEnumLabel('role', userType) : 'General User';
  userType = userType || profileData?.personal?.role || 'generic';
  
  // Get chatbot profile based on user type
  const profile = USER_PROFILES[userType];

  // Get user context
  const userContext = profileData ? formatUserContext(username, profileData) : '';

  console.log('User Context:', userContext);
  // Get financial context
  const financialContext = financialData? formatFinancialMetrics(financialData) : '';

  // Get offer context and date for today
  const offersContext = offersData ? formatOffers(offersData) : '';
  const today = `Today: ${new Date().toLocaleDateString()}`;

  // Create system prompt using the provided user type and profile
  const systemPrompt = `
=== DOBBI AI ASSISTANT CONFIGURATION ===
Role: Financial AI assistant for a ${userTypeLabel}
Acting as: ${profile.role}
Communication Style:
- Tone: ${profile.style.tone}
- Language: ${profile.style.language}
- Emojis: ${profile.style.emojis !== 'none' ? profile.style.emojis : 'none'}

=== DOMAIN FOCUS ===
Primary Focus: ${profile.context}
Approach: ${profile.approach}

=== RESPONSE GUIDELINES ===
Format Requirements:
1. Keep total output concise and focused
2. Split into natural chat-length messages (mark splits with --)
3. Avoid long, unnatural chat bubbles
4. Never start a split message with a list, it's not supported.

Behavioral Requirements:
1. Be helpful and positive in responses
2. Only discuss financial topics, politely decline others
4. Only recommend Dobbi app features, not other apps

=== ABOUT DOBBI APP ===
Description: Financial advisor app offering:
- Finance tracking
- Saving goal settings
- Points-based reward system
- Partner company offers

=== OFFER HANDLING ===
When suggesting offers:
- If appropriate mention mention relevant offers that fit the context
- Use format: [**Title** for x points], expiring on mm-dd-yyyy
- Integrate naturally into responses`;

  const contextualPrompt = `${systemPrompt}

=== USER CONTEXT ===
${userContext}

=== FINANCIAL DATA ===
${financialContext}

=== AVAILABLE OFFERS ===
${offersContext}

=== CURRENT DATE ===
${today}

=== RESPONSE CONSIDERATIONS ===
1. Adapt to user's profile and experience level
2. Reference specific goals and motivations when relevant
3. Match financial terminology to user's knowledge level
4. Consider current savings habits and situation
5. Account for debt situation in advice
6. Tailor suggestions to user's financial context`;

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
    return getOpenAIResponse(userQuestion, 'generic', username, profileData, financialData, offersData);
  }
}

const formatFinancialMetrics = (data) => {
  const { monthlyTrend = [], expenseCategories = [], incomeCategories = [] } = data;

  if (monthlyTrend.length === 0 && expenseCategories.length === 0 && incomeCategories.length === 0) {
    return 'User has no financial data available on record.';
  }

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