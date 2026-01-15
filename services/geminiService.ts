
import { GoogleGenAI, Type } from "@google/genai";
import { GeminiSuggestion } from "../types";

export const getAIListingHelp = async (imageBase64: string, itemName?: string): Promise<GeminiSuggestion & { name: string }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Analyze this image of a returned item. 
  1. Identify exactly what the item is and provide a clear, concise name (max 40 chars).
  2. Suggest a fair original resale price in EUR for a liquidation bin store (be realistic for a second-hand/returned item).
  3. Write a short, catchy 2-sentence description focusing on its features and value.
  4. Categorize it (e.g., Electronics, Home, Kitchen, Fashion, Toys).
  ${itemName ? `Note: The user says this might be "${itemName}".` : ""}
  Provide the result in JSON format.`;

  const imagePart = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: imageBase64.split(',')[1] || imageBase64,
    },
  };

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: [{ text: prompt }, imagePart] },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          suggestedPrice: { type: Type.NUMBER },
          description: { type: Type.STRING },
          category: { type: Type.STRING },
        },
        required: ["name", "suggestedPrice", "description", "category"],
      },
    },
  });

  try {
    const result = JSON.parse(response.text || '{}');
    return result as GeminiSuggestion & { name: string };
  } catch (e) {
    return {
      name: itemName || "Objet non identifié",
      suggestedPrice: 50,
      description: "Super objet en excellent état, une affaire à saisir !",
      category: "Divers"
    };
  }
};
