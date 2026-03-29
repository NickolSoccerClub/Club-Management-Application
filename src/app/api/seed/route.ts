import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { DRILL_LIBRARY } from "@/lib/data/drills";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ---------------------------------------------------------------------------
// Helper – realistic DOB for an age group (relative to 2026)
// ---------------------------------------------------------------------------
function dobForAgeGroup(ageGroup: string): string {
  const ageMap: Record<string, number> = {
    U7: 6, U9: 8, U10: 9, U11: 10, U12: 11, U13: 12,
    U14: 13, U15: 14, U16: 15, U17: 16,
  };
  const age = ageMap[ageGroup] ?? 11;
  const year = 2026 - age;
  // Random month/day for variety
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0");
  const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// ---------------------------------------------------------------------------
// Seed data definitions
// ---------------------------------------------------------------------------
const PLAYERS = [
  { first_name: "Liam", last_name: "Carter", age_group: "U12", status: "registered", grade_score: 7.2, position: "Midfielder" },
  { first_name: "Olivia", last_name: "Bennett", age_group: "U10", status: "registered", grade_score: 6.8, position: "Forward" },
  { first_name: "Noah", last_name: "Patel", age_group: "U14", status: "eoi", grade_score: 7.5, position: "Defender" },
  { first_name: "Emma", last_name: "Nguyen", age_group: "U12", status: "registered", grade_score: 8.1, position: "Goalkeeper" },
  { first_name: "Oliver", last_name: "Smith", age_group: "U16", status: "pending", grade_score: 6.5, position: "Midfielder" },
  { first_name: "Charlotte", last_name: "Jones", age_group: "U10", status: "registered", grade_score: 7.0, position: "Defender" },
  { first_name: "William", last_name: "Brown", age_group: "U14", status: "registered", grade_score: 8.3, position: "Forward" },
  { first_name: "Amelia", last_name: "Wilson", age_group: "U12", status: "eoi", grade_score: 6.9, position: "Midfielder" },
  { first_name: "James", last_name: "Taylor", age_group: "U16", status: "registered", grade_score: 7.8, position: "Defender" },
  { first_name: "Sophia", last_name: "Anderson", age_group: "U10", status: "pending", grade_score: 6.2, position: "Forward" },
  { first_name: "Lucas", last_name: "Thomas", age_group: "U12", status: "registered", grade_score: 7.4, position: "Midfielder" },
  { first_name: "Mia", last_name: "Jackson", age_group: "U14", status: "registered", grade_score: 7.1, position: "Defender" },
  { first_name: "Henry", last_name: "White", age_group: "U10", status: "eoi", grade_score: 6.5, position: "Goalkeeper" },
  { first_name: "Harper", last_name: "Harris", age_group: "U16", status: "registered", grade_score: 8.0, position: "Forward" },
  { first_name: "Alexander", last_name: "Martin", age_group: "U12", status: "pending", grade_score: 6.7, position: "Defender" },
  { first_name: "Evelyn", last_name: "Garcia", age_group: "U14", status: "registered", grade_score: 7.6, position: "Midfielder" },
  { first_name: "Benjamin", last_name: "Martinez", age_group: "U10", status: "registered", grade_score: 6.4, position: "Midfielder" },
  { first_name: "Abigail", last_name: "Robinson", age_group: "U12", status: "eoi", grade_score: 7.3, position: "Forward" },
  { first_name: "Jack", last_name: "Clark", age_group: "U16", status: "registered", grade_score: 8.5, position: "Goalkeeper" },
  { first_name: "Emily", last_name: "Lewis", age_group: "U14", status: "pending", grade_score: 7.0, position: "Defender" },
];

const TEAMS = [
  { name: "Nickol Thunder", age_group: "U7", division: "Mixed", capacity: 10 },
  { name: "Nickol Lightning", age_group: "U7", division: "Mixed", capacity: 10 },
  { name: "Nickol Storm", age_group: "U9", division: "A", capacity: 12 },
  { name: "Nickol Blaze", age_group: "U9", division: "B", capacity: 12 },
  { name: "Nickol Titans", age_group: "U11", division: "A", capacity: 16 },
  { name: "Nickol Hawks", age_group: "U13", division: "A", capacity: 16 },
  { name: "Nickol Eagles", age_group: "U15", division: "A", capacity: 18 },
  { name: "Nickol Wolves", age_group: "U17", division: "A", capacity: 18 },
];

// ---------------------------------------------------------------------------
// GET /api/seed
// ---------------------------------------------------------------------------
export async function GET() {
  try {
    // ---- Idempotency check ------------------------------------------------
    const { count: playerCount } = await supabase
      .from("players")
      .select("*", { count: "exact", head: true });

    const { count: teamCount } = await supabase
      .from("teams")
      .select("*", { count: "exact", head: true });

    const { count: drillCount } = await supabase
      .from("drills")
      .select("*", { count: "exact", head: true });

    if ((playerCount ?? 0) >= 20 && (teamCount ?? 0) >= 8 && (drillCount ?? 0) >= 23) {
      return NextResponse.json({
        message: "Already seeded",
        players: playerCount,
        teams: teamCount,
        drills: drillCount,
      });
    }

    const summary: Record<string, unknown> = {};

    // ---- Season -----------------------------------------------------------
    let seasonId: string;

    const { data: existingSeason } = await supabase
      .from("seasons")
      .select("id")
      .eq("year", 2026)
      .eq("is_current", true)
      .single();

    if (existingSeason) {
      seasonId = existingSeason.id;
      summary.season = "Using existing 2026 season";
    } else {
      const { data: newSeason, error: seasonError } = await supabase
        .from("seasons")
        .insert({
          name: "Season 2026",
          year: 2026,
          start_date: "2026-03-01",
          end_date: "2026-10-31",
          phase: "pre_season",
          is_current: true,
        })
        .select("id")
        .single();

      if (seasonError) throw new Error(`Season insert failed: ${seasonError.message}`);
      seasonId = newSeason!.id;
      summary.season = "Created Season 2026";
    }

    // ---- Players ----------------------------------------------------------
    if ((playerCount ?? 0) < 20) {
      const playerRows = PLAYERS.map((p, i) => ({
        first_name: p.first_name,
        last_name: p.last_name,
        dob: dobForAgeGroup(p.age_group),
        age_group: p.age_group,
        status: p.status,
        grade_score: p.grade_score,
        position: p.position,
        photo_consent: "none" as const,
        ffa_number: `FFA-2026${String(i + 1).padStart(4, "0")}`,
      }));

      const { error: playersError, data: insertedPlayers } = await supabase
        .from("players")
        .insert(playerRows)
        .select("id");

      if (playersError) throw new Error(`Players insert failed: ${playersError.message}`);
      summary.players = `Inserted ${insertedPlayers?.length ?? 0} players`;
    } else {
      summary.players = "Players already exist, skipped";
    }

    // ---- Teams ------------------------------------------------------------
    if ((teamCount ?? 0) < 8) {
      const teamRows = TEAMS.map((t) => ({
        name: t.name,
        age_group: t.age_group,
        division: t.division,
        season_id: seasonId,
        capacity: t.capacity,
        status: "active" as const,
      }));

      const { error: teamsError, data: insertedTeams } = await supabase
        .from("teams")
        .insert(teamRows)
        .select("id");

      if (teamsError) throw new Error(`Teams insert failed: ${teamsError.message}`);
      summary.teams = `Inserted ${insertedTeams?.length ?? 0} teams`;
    } else {
      summary.teams = "Teams already exist, skipped";
    }

    // ---- Drills -----------------------------------------------------------
    if ((drillCount ?? 0) < 23) {
      const drillRows = DRILL_LIBRARY.map((d) => ({
        drill_id_code: d.drill_id,
        name: d.name,
        age_groups: d.age_groups,
        skill_category: d.skill_category,
        difficulty: d.difficulty,
        duration_minutes: d.duration_minutes,
        equipment: d.equipment,
        setup: d.setup,
        instructions: d.instructions,
        coach_role: d.coach_role,
        targeted_results: d.targeted_results,
        ai_image_description: d.ai_image_description,
        ai_generated: false,
      }));

      const { error: drillsError, data: insertedDrills } = await supabase
        .from("drills")
        .insert(drillRows)
        .select("id");

      if (drillsError) throw new Error(`Drills insert failed: ${drillsError.message}`);
      summary.drills = `Inserted ${insertedDrills?.length ?? 0} drills`;
    } else {
      summary.drills = "Drills already exist, skipped";
    }

    return NextResponse.json({ message: "Seed complete", ...summary });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[seed] Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
