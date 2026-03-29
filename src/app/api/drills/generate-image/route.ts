import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { drillName, description } = await req.json();

    if (!description || typeof description !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid description field." },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
      generationConfig: {
        // @ts-expect-error - responseModalities is supported but not in types yet
        responseModalities: ["TEXT", "IMAGE"],
      },
    });

    const prompt = `Create a professional soccer/football coaching drill diagram image.

STYLE REQUIREMENTS:
- Clean, professional coaching diagram style similar to soccerxpert.com
- Bird's eye / top-down view of a green grass football pitch
- Use bright, clear colors on the green background
- Show white boundary lines for the drill area with dimensions labeled
- Player positions shown as colored circles (blue for team A, red/yellow for team B, green for goalkeeper)
- Orange triangles for cones/markers
- WHITE arrows with arrowheads showing player movement directions
- YELLOW dashed arrows showing ball movement/passing direction
- Clear labels for key elements
- Professional, clean aesthetic — not cartoonish
- Include a title bar at the top with the drill name: "${drillName || "Soccer Drill"}"

DRILL TO ILLUSTRATE:
${description}

Generate a clear, detailed tactical diagram showing the complete drill setup with all player positions, equipment placement, movement patterns, and passing directions clearly marked with arrows.`;

    const result = await model.generateContent(prompt);
    const response = result.response;

    // Extract image from response parts
    const parts = response.candidates?.[0]?.content?.parts;
    if (!parts) {
      return NextResponse.json(
        { error: "No response from image generation model." },
        { status: 500 }
      );
    }

    for (const part of parts) {
      if (part.inlineData) {
        const { mimeType, data } = part.inlineData;
        return NextResponse.json({
          image: `data:${mimeType};base64,${data}`,
          drillName: drillName || "Drill",
        });
      }
    }

    return NextResponse.json(
      { error: "Image generation did not return an image. The model may have returned text only." },
      { status: 500 }
    );
  } catch (error) {
    console.error("Image generation error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Image generation failed: ${message}` },
      { status: 500 }
    );
  }
}
