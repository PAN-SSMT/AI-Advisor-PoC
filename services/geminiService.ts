import { GoogleGenAI, Type, Chat } from "@google/genai";
import { Recommendation, RecommendationStatus } from '../types';

// FIX: Per coding guidelines, do not cast environment variables.
const apiKey = process.env.API_KEY;
console.log("API Key loaded:", apiKey ? `${apiKey.substring(0, 10)}...` : "NOT FOUND");
const ai = new GoogleGenAI({ apiKey: apiKey || "" });

const recommendationSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: "A concise title for the recommendation." },
      description: { type: Type.STRING, description: "A detailed description of the recommended action." },
      rationale: { type: Type.STRING, description: "The reasoning behind why this recommendation is important." },
      implementationInstructions: { type: Type.STRING, description: "Step-by-step instructions on how to implement the recommendation. Use a newline character (\\n) to separate each distinct step. For numbered lists, start each line with the number and a period (e.g., '1. First step\\n2. Second step'). This can include multi-line CLI commands or code snippets." },
      riskLevel: { type: Type.STRING, enum: ['Low', 'Medium', 'High', 'Critical'], description: "The security risk level if this is not addressed." },
      effort: { type: Type.STRING, enum: ['Low', 'Medium', 'High'], description: "The estimated effort to implement this recommendation." },
    },
    required: ['title', 'description', 'rationale', 'implementationInstructions', 'riskLevel', 'effort'],
  },
};


export const generateRecommendations = async (context: string): Promise<Recommendation[]> => {
  try {
    const prompt = `
      You are a world-class Cloud Security AI Advisor for Palo Alto Networks products, specifically Prisma Cloud and Cortex Cloud.
      Your task is to analyze the customer's situation and provide proactive, actionable recommendations to improve their security posture.
      
      Current Context: ${context}

      Based on this context, generate a list of 5-7 security recommendations.
      For each recommendation, provide a clear title, a detailed description of the action to take, the rationale behind it, step-by-step implementation instructions, the risk level it addresses, and the estimated implementation effort.
      Ensure the recommendations are specific, relevant, and follow Palo Alto Networks' best practices.
    `;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: recommendationSchema,
      },
    });
    
    const jsonStr = response.text.trim();
    const parsedRecommendations = JSON.parse(jsonStr);

    return parsedRecommendations.map((rec: any) => ({
      ...rec,
      id: crypto.randomUUID(),
      status: RecommendationStatus.Pending,
    }));

  } catch (error) {
    console.error("Error generating recommendations:", error);
    // Return a fallback error recommendation
    return [
      {
        id: crypto.randomUUID(),
        title: 'Error: Could not generate recommendations',
        description: 'There was an issue communicating with the AI model. Please check the console for details and try again later.',
        rationale: 'An API call to the generative model failed.',
        implementationInstructions: 'No implementation instructions available due to an error.',
        riskLevel: 'Medium',
        effort: 'Low',
        status: RecommendationStatus.Pending,
      }
    ];
  }
};

export const createChat = (): Chat => {
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `You are a helpful and knowledgeable AI assistant specializing in Palo Alto Networks' Prisma Cloud and Cortex Cloud. Answer the user's questions clearly and concisely. You are part of the "Cloud Security AI Advisor" application. Current Date: ${new Date().toLocaleDateString()}`
    }
  });
};

export const sendMessage = async (chat: Chat, message: string): Promise<string> => {
  try {
    const response = await chat.sendMessage({ message });
    return response.text;
  } catch (error: any) {
    console.error("Error getting chat response:", error);
    const errorMessage = error?.message || error?.toString() || "Unknown error";
    return `I'm sorry, I encountered an error.`;
  }
};