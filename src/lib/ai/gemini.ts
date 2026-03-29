import { GoogleGenerativeAI } from "@google/generative-ai";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface DrillGenerated {
  drill_id: string;
  name: string;
  age_groups: string[];
  skill_category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration_minutes: number;
  equipment: string[];
  setup: string;
  instructions: string[];
  coach_role: string;
  targeted_results: string[];
  ai_image_description: string;
}

/* ------------------------------------------------------------------ */
/*  Gemini Client                                                      */
/* ------------------------------------------------------------------ */

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

const CATEGORY_PREFIXES: Record<string, string> = {
  Passing: "PAS",
  Shooting: "SHT",
  Defending: "DEF",
  Dribbling: "DRB",
  Fitness: "FIT",
  Tactical: "TAC",
  "Warm-up": "WRM",
  "Cool-down": "CLD",
  Goalkeeping: "GKP",
  "Set Pieces": "STP",
};

function buildSystemPrompt(params: {
  scrapedContent?: string;
  focusArea: string;
  ageGroup: string;
  difficulty: string;
}): string {
  const referenceBlock = params.scrapedContent
    ? `
--- REFERENCE MATERIAL ---
The following content was scraped from an external coaching resource. Use it as
reference and inspiration when creating the drill. Adapt ideas to match the
requested age group, difficulty, and focus area. Do NOT copy verbatim.

${params.scrapedContent}
--- END REFERENCE MATERIAL ---
`
    : "";

  return `You are an expert soccer/football coaching assistant for the Nickol Soccer Club.
Your task is to generate a single, high-quality training drill in JSON format.

${referenceBlock}

DRILL CREATION STANDARDS:
1. drill_id format: [CATEGORY]-[THREE-DIGIT NUMBER] (e.g. DRB-025, PAS-012).
   Category prefixes: ${JSON.stringify(CATEGORY_PREFIXES)}
   Pick the prefix that best matches the focus area. Use a random three-digit number between 001-999.

2. Required fields (all must be present):
   - drill_id: string
   - name: string (concise, descriptive drill name)
   - age_groups: string[] (e.g. ["U8", "U10"])
   - skill_category: string (e.g. "Passing", "Shooting", "Dribbling", etc.)
   - difficulty: "Beginner" | "Intermediate" | "Advanced"
   - duration_minutes: number (realistic, typically 8-25 minutes)
   - equipment: string[] (e.g. ["cones", "bibs", "goals"])
   - setup: string (clear description of how to set up the drill area)
   - instructions: string[] (numbered step-by-step instructions, at least 4 steps)
   - coach_role: string (what the coach should focus on during the drill)
   - targeted_results: string[] (what players should improve by doing this drill)
   - ai_image_description: string (detailed visual description of the drill layout suitable for AI image generation; include player positions, cone placement, movement arrows, field dimensions)

3. Age-appropriateness guidelines:
   - Ages 4-6 (U6): Fun, playful activities. Basic motor skills, very simple rules. Lots of touches on the ball. Short durations (5-10 min). Use animal names and games.
   - Ages 7-9 (U8/U10): Fundamental skill building. Introduce basic techniques. Small-sided games. Moderate duration (10-15 min). Keep instructions simple and visual.
   - Ages 10-13 (U12/U14): Skill refinement and tactical awareness. More structured drills. Introduce positional concepts. Duration 12-20 min. Encourage decision-making.
   - Ages 13-15 (U14/U16): Advanced techniques and game-realistic scenarios. Complex tactical drills. High intensity. Duration 15-25 min. Focus on match application.

REQUESTED PARAMETERS:
- Focus Area: ${params.focusArea}
- Age Group: ${params.ageGroup}
- Difficulty: ${params.difficulty}

Respond with ONLY valid JSON matching the DrillGenerated schema. No markdown, no code fences, no explanations.`;
}

/* ------------------------------------------------------------------ */
/*  Fallback mock drill                                                */
/* ------------------------------------------------------------------ */

function createFallbackDrill(params: {
  focusArea: string;
  ageGroup: string;
  difficulty: string;
}): DrillGenerated {
  const prefix = CATEGORY_PREFIXES[params.focusArea] ?? "GEN";
  const num = String(Math.floor(Math.random() * 999) + 1).padStart(3, "0");

  return {
    drill_id: `${prefix}-${num}`,
    name: `${params.focusArea} Development Drill`,
    age_groups: [params.ageGroup],
    skill_category: params.focusArea,
    difficulty: params.difficulty as DrillGenerated["difficulty"],
    duration_minutes: 15,
    equipment: ["cones", "balls", "bibs"],
    setup:
      "Set up a 20x20 yard grid with cones. Divide players into two equal teams with bibs.",
    instructions: [
      "Divide players into two teams and assign bibs.",
      "Each team starts on opposite sides of the grid.",
      "On the coach's whistle, players begin the activity focusing on the key skill.",
      "Rotate roles every 3 minutes to ensure all players get equal practice time.",
      "Progress the drill by adding constraints such as limited touches or a time limit.",
    ],
    coach_role:
      "Observe technique and provide individual feedback. Encourage communication between players and ensure all players are engaged.",
    targeted_results: [
      "Improved technical ability in the focus area",
      "Better decision-making under pressure",
      "Enhanced teamwork and communication",
    ],
    ai_image_description: `A 20x20 yard training grid marked with orange cones at each corner. Two teams of players wearing different colored bibs are positioned inside the grid. Arrows show movement patterns related to ${params.focusArea.toLowerCase()} exercises. A coach stands on the sideline observing.`,
  };
}

/* ------------------------------------------------------------------ */
/*  Main generation function                                           */
/* ------------------------------------------------------------------ */

export async function generateDrill(params: {
  scrapedContent?: string;
  focusArea: string;
  ageGroup: string;
  difficulty: string;
}): Promise<DrillGenerated> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: buildSystemPrompt(params) }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
    });

    const response = result.response;
    const text = response.text().trim();

    // Strip potential markdown code fences if the model wraps the JSON
    const cleaned = text
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const drill: DrillGenerated = JSON.parse(cleaned);

    // Validate required fields exist
    const requiredFields: (keyof DrillGenerated)[] = [
      "drill_id",
      "name",
      "age_groups",
      "skill_category",
      "difficulty",
      "duration_minutes",
      "equipment",
      "setup",
      "instructions",
      "coach_role",
      "targeted_results",
      "ai_image_description",
    ];

    for (const field of requiredFields) {
      if (drill[field] === undefined || drill[field] === null) {
        console.error(`[Gemini] Missing required field: ${field}. Falling back to mock drill.`);
        return createFallbackDrill(params);
      }
    }

    return drill;
  } catch (error) {
    console.error("[Gemini] Drill generation failed:", error);
    return createFallbackDrill(params);
  }
}
