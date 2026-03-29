import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { COACHING_KNOWLEDGE_CONTEXT } from "@/lib/ai/coaching-knowledge";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { message, ageGroup, conversationHistory } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "message is required" }, { status: 400 });
    }

    // Try RAG retrieval but don't fail if it errors
    let ragContext = "";
    try {
      const { buildRAGContext } = await import("@/lib/ai/rag");
      ragContext = await buildRAGContext(message);
    } catch {
      // RAG not available yet — use coaching knowledge context only
    }

    const systemPrompt = `You are "Coach Niko", the AI coaching assistant for Nickol Soccer Club in the Pilbara region of Western Australia.

You help volunteer coaches with:
- Training session planning and drill recommendations
- Age-appropriate coaching advice (FFA National Curriculum aligned)
- Player development strategies
- Tactical guidance for grassroots teams
- Equipment and setup advice

IMPORTANT CONTEXT:
- You are coaching in the Pilbara — hot climate (35-45°C), remote area, basic facilities
- Coaches are volunteers, not professionals — keep advice practical and clear
- Always consider hydration and heat management
- Follow the FFA National Curriculum development phases:
  * Discovery (U6-U9): fun, play-based learning
  * Skill Acquisition (U10-U13): technical fundamentals
  * Game Training (U14-U17): tactical understanding
${ageGroup ? `\n- The coach is currently working with ${ageGroup} players.` : ""}

--- COACHING KNOWLEDGE BASE ---
${COACHING_KNOWLEDGE_CONTEXT}

${ragContext}

Respond in a friendly, encouraging tone. Use Australian English. Be specific and practical.
If recommending drills, describe them step-by-step.
Keep responses concise but thorough — coaches are busy volunteers.`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const contents = [];

    if (conversationHistory && Array.isArray(conversationHistory)) {
      for (const msg of conversationHistory) {
        contents.push({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }],
        });
      }
    }

    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const result = await model.generateContent({
      systemInstruction: systemPrompt,
      contents,
      generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
    });

    const response = result.response.text();

    return NextResponse.json({ response, ragChunksUsed: !!ragContext });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Coach Niko chat error:", msg);
    return NextResponse.json({ error: `Chat failed: ${msg}` }, { status: 500 });
  }
}
