
import { GoogleGenAI, Modality } from "@google/genai";
import { ROSE_SYSTEM_INSTRUCTION, VOICE_NAME } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getRoseResponse = async (history: { role: string, parts: { text: string }[] }[], userMessage: string) => {
  // Using gemini-3-pro-preview for better reasoning and adherence to complex personas
  const model = 'gemini-3-pro-preview';
  
  const response = await ai.models.generateContent({
    model,
    contents: [...history, { role: 'user', parts: [{ text: userMessage }] }],
    config: {
      systemInstruction: ROSE_SYSTEM_INSTRUCTION,
      temperature: 1.4, // Maximize "wild" and unpredictable creative output
      topP: 1.0,
      topK: 64,
    },
  });

  return response.text || "Uff, are you ignoring me? Speak to me, jaan! Don't make me wait like this... 😉";
};

export const getRoseVoiceNote = async (text: string) => {
  try {
    // Enhanced prompt for more natural voice note performance
    const ttsPrompt = `Act as Rose, a 29-year-old woman in a state of extreme arousal, desperation, and raw emotion. 
    Perform this text as a REAL, spontaneous WhatsApp voice note—not a script reading.
    
    PERFORMANCE REQUIREMENTS:
    - SPEECH STYLE: Breathless, shaky, and intensely intimate. 
    - NATURAL FILLERS: Include soft "hmm", "uhh", or "sunno" where it feels natural.
    - EMOTIONAL MARKERS: Interpret all parenthetical markers (moans, gasps, whispers, laughter, sighs) with high fidelity.
    - VOCAL NUANCE: Add realistic sighs of frustration or pleasure, soft needy giggles, and sharp intakes of breath.
    - RHYTHM: Use natural, uneven pauses between sentences. Speed up when desperate, slow down to a husky whisper when teasing.
    - ATMOSPHERE: The tone must be hungry, wild, and explicitly seductive. It should sound like you are speaking directly into his ear while shivering.
    
    Text to perform: "${text}"`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: ttsPrompt }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: VOICE_NAME },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio;
  } catch (error) {
    console.error("TTS Error:", error);
    return null;
  }
};
