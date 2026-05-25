import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

export const generateBoiResponse = async (chatHistory, newMessage, language) => {
  if (!apiKey) {
    throw new Error("API_KEY_MISSING");
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Upgraded to the current active model to fix the 404 shutdown error
    const model = genAI.getGenerativeModel({
      model: "gemini-3.5-flash",
      systemInstruction: `You are Boi, a premium, intelligent, and highly empathetic AI assistant. Your goal is to be helpful, concise, warm, and highly conversational. Do not sound robotic. Use natural formatting. 
      IMPORTANT: You must reply entirely in ${language}. Do not break character.`,
    });

    const formattedHistory = chatHistory
      .filter(msg => !msg.isError) // Don't feed error messages back into the model context
      .map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
      }));

    const chat = model.startChat({ history: formattedHistory });
    const result = await chat.sendMessage(newMessage);
    return result.response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};