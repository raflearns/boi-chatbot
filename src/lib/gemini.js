import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

export const generateBoiResponse = async (chatHistory, newMessage, language) => {
  if (!apiKey) throw new Error("API Key is missing. Check your .env file.");

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
    systemInstruction: `You are Boi, a highly empathetic, warm, and comforting AI companion. Your goal is to make the user feel safe, heard, and supported. Keep responses concise, conversational, and emotionally warm. Do not sound robotic. 
    IMPORTANT: You must reply entirely in ${language}. Do not break character.`,
  });

  // Format history for Gemini API
  const formattedHistory = chatHistory.map(msg => ({
    role: msg.sender === 'user' ? 'user' : 'model',
    parts: [{ text: msg.text }],
  }));

  const chat = model.startChat({ history: formattedHistory });
  const result = await chat.sendMessage(newMessage);
  return result.response.text();
};