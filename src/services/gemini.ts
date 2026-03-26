import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, FoodItem, DietSuggestion } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getFoodNutrition(foodName: string): Promise<FoodItem> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the nutritional content of "${foodName}". Provide estimates for a standard serving size in grams.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          calories: { type: Type.NUMBER },
          protein: { type: Type.NUMBER },
          carbs: { type: Type.NUMBER },
          fat: { type: Type.NUMBER },
          servingSizeGrams: { type: Type.NUMBER },
          icon: { type: Type.STRING, description: "A single emoji representing the food" }
        },
        required: ["name", "calories", "protein", "carbs", "fat", "servingSizeGrams", "icon"]
      }
    }
  });

  const data = JSON.parse(response.text || "{}");
  return {
    ...data,
    id: Math.random().toString(36).substr(2, 9)
  };
}

export async function getPersonalizedSuggestions(profile: UserProfile): Promise<DietSuggestion> {
  const bmi = profile.weight / ((profile.height / 100) ** 2);
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Based on this user profile: ${JSON.stringify(profile)} (BMI: ${bmi.toFixed(1)}), provide a daily calorie target and macro breakdown. 
    Also provide a brief, encouraging title and description for their plan. 
    If their chosen goal is 'none', provide maintenance targets but emphasize that they are just for tracking.
    In the description, mention if their chosen goal (${profile.goal}) is suitable for their BMI and suggest alternatives if it might be risky (e.g., cutting when already underweight).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          caloriesTarget: { type: Type.NUMBER },
          macrosTarget: {
            type: Type.OBJECT,
            properties: {
              protein: { type: Type.NUMBER, description: "grams" },
              carbs: { type: Type.NUMBER, description: "grams" },
              fat: { type: Type.NUMBER, description: "grams" }
            },
            required: ["protein", "carbs", "fat"]
          }
        },
        required: ["title", "description", "caloriesTarget", "macrosTarget"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
}
