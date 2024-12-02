// config/openaiClient.js
import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey:
    "xai-wLQwbVPQ2XVUiid5jzw8JSS3JX3D68ISPajOJqC3k31k2Xd9bF1qAjZj8SYDNrwmT4197vIX9LnDdoiE", // Variable de entorno para mayor seguridad
  baseURL: "https://api.x.ai/v1", // Configura la URL base de la API
});
