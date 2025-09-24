
import { GoogleGenAI, Type } from "@google/genai";
import { KeywordData, ContentIdeas } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const keywordResponseSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      keyword: {
        type: Type.STRING,
        description: "The generated long-tail keyword.",
      },
      searchVolume: {
        type: Type.INTEGER,
        description: "Estimated monthly search volume on YouTube as a whole number (e.g., 25000).",
      },
      competition: {
        type: Type.INTEGER,
        description: "Estimated competition level for this keyword on YouTube, as a score from 1 (Low) to 100 (High).",
      },
    },
    required: ["keyword", "searchVolume", "competition"],
  },
};

const contentIdeasSchema = {
    type: Type.OBJECT,
    properties: {
        titles: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "An array of 3 creative, engaging, and SEO-friendly YouTube video titles."
        },
        description: {
            type: Type.STRING,
            description: "A sample YouTube video description, approximately 100-150 words long, including a call-to-action."
        }
    },
    required: ["titles", "description"],
}

export async function fetchKeywordIdeas(topic: string, country: string): Promise<KeywordData[]> {
  try {
    const prompt = `
      Act as a world-class YouTube SEO and content strategy expert, with deep knowledge of Google's keyword analysis algorithms.
      My channel is about: "${topic}".
      My target audience is in: "${country}".
      
      Generate a list of exactly 100 related long-tail keyword ideas that are excellent for YouTube videos. These keywords should have high potential for discovery on both Google Search and YouTube.

      For each keyword, provide the following metrics, specifically tailored for YouTube searches within "${country}":
      1.  **searchVolume**: Provide a highly accurate estimated monthly YouTube search volume. Your estimation should be as precise as what Google Keyword Planner would provide, but calibrated for the YouTube platform. Consider search trends on Google to inform potential YouTube viewership.
      2.  **competition**: An estimated competition level from other creators on YouTube, as a score from 1 (Low Competition) to 100 (High Competition).

      Return the result as a valid JSON array of objects. Do not include any introductory text or markdown formatting.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: keywordResponseSchema,
        temperature: 0.7,
        topP: 0.95,
      },
    });
    
    const jsonText = response.text.trim();
    const parsedData = JSON.parse(jsonText);

    if (!Array.isArray(parsedData)) {
        throw new Error("API did not return a valid array.");
    }

    return parsedData as KeywordData[];

  } catch (error) {
    console.error("Error fetching from Gemini API:", error);
    throw new Error("Failed to generate keyword ideas. The model may be unavailable or the request was malformed. Please try again later.");
  }
}

export async function fetchContentIdeas(keyword: string, topic: string): Promise<ContentIdeas> {
    try {
        const prompt = `
            As a YouTube content strategist for a channel about "${topic}", generate content ideas for the keyword "${keyword}".
            Provide exactly 3 unique, creative, and highly clickable YouTube video titles.
            Also, write a sample YouTube video description (100-150 words) that is engaging, SEO-optimized for the keyword, and includes a call-to-action (like subscribing or commenting).
            Return the result as a single JSON object.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: contentIdeasSchema,
                temperature: 0.8,
            }
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as ContentIdeas;

    } catch (error) {
        console.error("Error fetching content ideas from Gemini API:", error);
        throw new Error("Failed to generate content ideas. Please try again.");
    }
}