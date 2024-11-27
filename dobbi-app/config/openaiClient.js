// config/openaiClient.js
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Variable de entorno para mayor seguridad
  baseURL: "https://api.x.ai/v1", // Configura la URL base de la API
});
