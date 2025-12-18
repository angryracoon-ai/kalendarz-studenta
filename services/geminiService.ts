
import { GoogleGenAI, Type } from "@google/genai";

export class GeminiService {
  // Always initialize with process.env.API_KEY directly in the method to ensure fresh instance
  private getClient() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async generateStudyPlan(taskTitle: string, subject: string, keywords: string[]) {
    try {
      const ai = this.getClient();
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Stwórz plan nauki dla studenta na temat: "${taskTitle}" z przedmiotu "${subject}". Słowa kluczowe: ${keywords.join(', ')}. Odpowiedz w języku polskim. Skup się na konkretnych krokach i terminach.`,
      });
      // Correctly access text property (not a method)
      return response.text;
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Przepraszam, nie mogłem wygenerować planu w tej chwili.";
    }
  }

  async explainTerm(term: string) {
    try {
      const ai = this.getClient();
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Wyjaśnij pojęcie akademickie "${term}" w prosty sposób, podaj przykład i dlaczego jest ważne dla studenta. Użyj języka polskiego.`,
      });
      // Correctly access text property
      return response.text;
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Nie udało się pobrać definicji.";
    }
  }

  async suggestKeywords(topic: string) {
    try {
      const ai = this.getClient();
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Podaj listę 5 najważniejszych haseł/pojęć do nauki dla tematu: "${topic}".`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    keywords: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    }
                },
                required: ["keywords"]
            }
        }
      });
      // Correctly access text property and parse JSON
      const text = response.text;
      if (!text) return [];
      const data = JSON.parse(text);
      return (data.keywords as string[]) || [];
    } catch (error) {
      console.error("Gemini Error:", error);
      return [];
    }
  }
}

export const geminiService = new GeminiService();
