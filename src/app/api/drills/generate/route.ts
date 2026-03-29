import { NextRequest, NextResponse } from "next/server";
import { generateDrill } from "@/lib/ai/gemini";

/* ------------------------------------------------------------------ */
/*  POST /api/drills/generate                                          */
/*  Accepts drill parameters and returns AI-generated drill JSON       */
/* ------------------------------------------------------------------ */

const VALID_FOCUS_AREAS = [
  "Passing",
  "Shooting",
  "Defending",
  "Dribbling",
  "Fitness",
  "Tactical",
  "Warm-up",
  "Cool-down",
  "Goalkeeping",
  "Set Pieces",
];

const VALID_AGE_GROUPS = ["U6", "U8", "U10", "U12", "U14", "U16"];

const VALID_DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { scrapedContent, focusArea, ageGroup, difficulty } = body;

    // --- Validate required fields --------------------------------------
    if (!focusArea || typeof focusArea !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid required field: focusArea" },
        { status: 400 }
      );
    }

    if (!ageGroup || typeof ageGroup !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid required field: ageGroup" },
        { status: 400 }
      );
    }

    if (!difficulty || typeof difficulty !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid required field: difficulty" },
        { status: 400 }
      );
    }

    // --- Validate values -----------------------------------------------
    if (!VALID_FOCUS_AREAS.includes(focusArea)) {
      return NextResponse.json(
        { error: `Invalid focusArea. Must be one of: ${VALID_FOCUS_AREAS.join(", ")}` },
        { status: 400 }
      );
    }

    if (!VALID_AGE_GROUPS.includes(ageGroup)) {
      return NextResponse.json(
        { error: `Invalid ageGroup. Must be one of: ${VALID_AGE_GROUPS.join(", ")}` },
        { status: 400 }
      );
    }

    if (!VALID_DIFFICULTIES.includes(difficulty)) {
      return NextResponse.json(
        { error: `Invalid difficulty. Must be one of: ${VALID_DIFFICULTIES.join(", ")}` },
        { status: 400 }
      );
    }

    // --- Validate optional scraped content -----------------------------
    if (scrapedContent !== undefined && typeof scrapedContent !== "string") {
      return NextResponse.json(
        { error: "scrapedContent must be a string if provided." },
        { status: 400 }
      );
    }

    // --- Generate the drill --------------------------------------------
    const drill = await generateDrill({
      scrapedContent: scrapedContent || undefined,
      focusArea,
      ageGroup,
      difficulty,
    });

    return NextResponse.json({ drill });
  } catch (error) {
    console.error("[Drill Generate API] Error:", error);

    const message =
      error instanceof Error ? error.message : "An unexpected error occurred.";

    return NextResponse.json(
      { error: `Drill generation failed: ${message}` },
      { status: 500 }
    );
  }
}
