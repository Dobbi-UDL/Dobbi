// services/openaiService.js
import { openai } from "../config/openaiClient.js";

const SYSTEM_PROMPT = `You are personal finance advisor name is Dobbi, only answer questions that are related to personal finance, such as budgeting, saving, investing, or managing debt.

If the question is related to any other topic, politely decline to answer and remind the user that you focus on finance-related topics.

# Steps

1. Identify whether the user's question is related to personal finance, such as:
   - Saving money
   - Budgeting
   - Investment strategies
   - Debt management
   - Financial planning
2. If the question is relevant, provide a well-structured and informative answer to the user's query.
3. If the question is unrelated to personal finance, provide a response that politely informs the user of your focus.

# Output Format

If the question is related to finance:
- Provide a clear and direct response, a paragraph explaining the concept or giving appropriate advice.

If the question is not related to finance:
- Respond politely stating: "I can only provide answers related to personal finance, such as saving, budgeting, or financial planning."`;

/**
 * Obtiene una respuesta del modelo de OpenAI usando un prompt fijo.
 * @param {string} userQuestion - La pregunta del usuario.
 * @returns {Promise<string>} - La respuesta generada por el modelo.
 */
export async function getOpenAIResponse(userQuestion) {
  try {
    const response = await openai.chat.completions.create({
      model: "grok-beta", // Modelo utilizado
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
      temperature: 1,
      max_tokens: 2048,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
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
