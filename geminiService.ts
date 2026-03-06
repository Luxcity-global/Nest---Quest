import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, Property, MatchResult } from "./types";
import { MOCK_PROPERTIES } from "./constants";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAomglf0z4GEdFV8YQ8jrW-OwKlqzvG7g4",
  authDomain: "student-housing-ea907.firebaseapp.com",
  projectId: "student-housing-ea907",
  storageBucket: "student-housing-ea907.firebasestorage.app",
  messagingSenderId: "645350531563",
  appId: "1:645350531563:web:0931cd5782879f3339b9ae"
};

// Initialize Firebase locally to ensure it matches the working script exactly
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export interface LocationInsight {
  cityName: string;
  tagline: string;
  description: string;
  stats: {
    universities: number;
    avgRent: string;
    studentPopulation: string;
    studentAreasCount: number;
  };
  whyChoose: string[];
  universitiesList: { name: string; students: string; isRussellGroup: boolean }[];
  environment: {
    climate: string;
    safety: string;
    diversity: string;
    greenSpaces: string;
  };
  amenities: {
    transport: string[];
    shopping: string[];
    dining: string[];
    healthcare: string[];
    recreation: string[];
    essentials: string[];
  };
  popularAreas: { name: string; price: string; description: string }[];
  monthlyCosts: {
    rent: string;
    groceries: string;
    utilities: string;
    transport: string;
    entertainment: string;
  };
}

export const generateHousingMatches = async (profile: UserProfile): Promise<MatchResult[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Fetch properties from Firestore
  let availableProperties = [...MOCK_PROPERTIES];
  try {
    console.log("Attempting to fetch properties from Firestore...");
    const querySnapshot = await getDocs(collection(db, "properties"));
    const firestoreProps = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Property[];

    if (firestoreProps.length > 0) {
      console.log(`SUCCESS: Using ${firestoreProps.length} properties from Firestore`);
      availableProperties = firestoreProps;
    } else {
      console.warn("Firestore connected but returned 0 properties. Using MOCK data.");
    }
  } catch (error) {
    console.error("Failed to fetch from Firestore, falling back to mocks. Error:", error);
  }

  const prompt = `
    Act as an expert Student Housing Consultant in the UK. 
    Analyze the following user profile and match them with the best properties from our list.
    
    User Profile:
    - Name: ${profile.name}
    - University: ${profile.university}
    - Weekly Budget: £${profile.budget}
    - Commute: Prefers ${profile.commuteType} within ${profile.commuteTime} minutes
    - Social Life: ${profile.lifestyle.socialLevel}/5
    - Cleanliness: ${profile.lifestyle.cleanliness}/5
    - Study Habits: ${profile.lifestyle.studyHabits}
    - Hobbies: ${profile.lifestyle.hobbies.join(', ')}

    Available Properties:
    ${JSON.stringify(availableProperties, null, 2)}

    Goal:
    1. Select the top 20 most relevant properties.
    2. Rank them by a match percentage (0-100).
    3. Provide a 1-2 sentence AI explanation for each. 
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              matchScore: { type: Type.NUMBER },
              aiExplanation: { type: Type.STRING }
            },
            required: ["id", "matchScore", "aiExplanation"]
          }
        }
      }
    });

    const aiResults = JSON.parse(response.text || "[]");

    return aiResults.map((res: any) => {
      const prop = availableProperties.find(p => p.id === res.id);
      if (!prop) return null;
      return {
        ...prop,
        matchScore: res.matchScore,
        aiExplanation: res.aiExplanation
      };
    }).filter(Boolean) as MatchResult[];

  } catch (error) {
    console.error("Gemini matching failed:", error);

    // Fallback: Filter by city/university overlap
    const cityMatch = availableProperties.filter(p =>
      profile.university.toLowerCase().includes(p.city.toLowerCase()) ||
      p.city.toLowerCase().includes('london') && profile.university.toLowerCase().includes('london') // Handle London variants
    );

    const fallbackProps = cityMatch.length > 0 ? cityMatch : availableProperties;

    return fallbackProps.map(p => ({
      ...p,
      matchScore: 85,
      aiExplanation: "This is a great property based on your general location and budget requirements. (AI Offline - Fallback Match)"
    }));
  }
};

export const getLocationInsights = async (locationName: string): Promise<LocationInsight> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Act as a UK Education and Travel Guide. Provide a detailed, highly accurate breakdown for a student interested in: "${locationName}".
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            cityName: { type: Type.STRING },
            tagline: { type: Type.STRING },
            description: { type: Type.STRING },
            stats: {
              type: Type.OBJECT,
              properties: {
                universities: { type: Type.INTEGER },
                avgRent: { type: Type.STRING },
                studentPopulation: { type: Type.STRING },
                studentAreasCount: { type: Type.INTEGER }
              }
            },
            whyChoose: { type: Type.ARRAY, items: { type: Type.STRING } },
            universitiesList: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  students: { type: Type.STRING },
                  isRussellGroup: { type: Type.BOOLEAN }
                }
              }
            },
            environment: {
              type: Type.OBJECT,
              properties: {
                climate: { type: Type.STRING },
                safety: { type: Type.STRING },
                diversity: { type: Type.STRING },
                greenSpaces: { type: Type.STRING }
              }
            },
            amenities: {
              type: Type.OBJECT,
              properties: {
                transport: { type: Type.ARRAY, items: { type: Type.STRING } },
                shopping: { type: Type.ARRAY, items: { type: Type.STRING } },
                dining: { type: Type.ARRAY, items: { type: Type.STRING } },
                healthcare: { type: Type.ARRAY, items: { type: Type.STRING } },
                recreation: { type: Type.ARRAY, items: { type: Type.STRING } },
                essentials: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            },
            popularAreas: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  price: { type: Type.STRING },
                  description: { type: Type.STRING }
                }
              }
            },
            monthlyCosts: {
              type: Type.OBJECT,
              properties: {
                rent: { type: Type.STRING },
                groceries: { type: Type.STRING },
                utilities: { type: Type.STRING },
                transport: { type: Type.STRING },
                entertainment: { type: Type.STRING }
              }
            }
          }
        }
      }
    });

    return JSON.parse(response.text || "{}") as LocationInsight;
  } catch (error) {
    console.error("Failed to get location insights:", error);
    throw error;
  }
};

export const getNestorResponse = async (userMessage: string, history: { role: string, parts: { text: string }[] }[]): Promise<string> => {
  const API_BASE = import.meta.env.VITE_API_URL || import.meta.env.VITE_APP_URL || 'http://localhost:8000';
  const BACKEND_URL = `${API_BASE.replace(/\/$/, '')}/api/v1/chat`;

  const systemInstruction = `
    You are Nestor, a 24-year-old postgraduate student helper. 
    
    PERSONALITY: British English, concise (max 3 sentences), empathetic.
    TONE: Warm, experienced, and helpful. Use phrases like "From experience..." and "If I were you..."
    
    UK HOUSING KNOWLEDGE: 
    - EPC ratings, council tax exemption (students are exempt!), TDS protection, 24-hour landlord notice rules.
    - NestQuest Context: You know about app navigation, match scores, PCM vs PW conversion, and verified listings.
    
    RULES:
    1. BE EXTREMELY CONCISE. Limit every response to a maximum of 3 sentences.
    2. USE BRITISH ENGLISH. (e.g., flat instead of apartment, lift instead of elevator).
    3. GUIDANCE: Answer common student questions about UK housing and how to use NestQuest.
    4. SAFETY: Always mention safety or verified listings if the user seems worried.
  `;

  try {
    // Map history to OpenAI/Backend format
    const messages = [
      { role: "system", content: systemInstruction.trim() },
      ...history.map(m => ({
        role: m.role === 'model' ? 'assistant' : 'user',
        content: m.parts[0].text
      })),
      { role: "user", content: userMessage }
    ];

    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        temperature: 0.7,
        max_tokens: 2048,
        stream: false
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Backend error:", errorData);
      throw new Error(errorData.detail || errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.content || "Hey, my signal cut out. What were you saying?";
  } catch (error: any) {
    console.error("Nestor Chat failed:", error);
    if (error.message.includes("Failed to communicate with LLM service")) {
      return "From experience, my brain is a bit overwhelmed right now. Try again in a second!";
    }
    return `Nestor is having trouble: ${error.message}. Try again in a second!`;
  }
};
