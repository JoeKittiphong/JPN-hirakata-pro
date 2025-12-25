
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getMnemonic = async (char: string, type: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Explain how to remember the Japanese ${type} character "${char}" with a short, creative Thai mnemonic (เคล็ดลับการจำแบบสั้นๆ). Keep it under 20 words.`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "สู้ๆ นะ! ฝึกฝนบ่อยๆ จะจำได้เอง";
  }
};
