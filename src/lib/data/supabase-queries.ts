import { createClient } from "@/lib/supabase/client";
import type {
  Player,
  PlayerStatus,
  Team,
  TeamPlayer,
  Season,
  GradingSession,
  GradingScore,
} from "@/types";
import type { Drill } from "@/types/development";

// ===========================================================================
// Players
// ===========================================================================

export async function getPlayers(filters?: {
  ageGroup?: string;
  status?: string;
  search?: string;
  sortBy?: string;
}): Promise<Player[]> {
  const supabase = createClient();
  let query = supabase.from("players").select("*");

  if (filters?.ageGroup) {
    query = query.eq("age_group", filters.ageGroup);
  }
  if (filters?.status) {
    query = query.eq("status", filters.status);
  }
  if (filters?.search) {
    query = query.or(
      `first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%`
    );
  }

  // Sorting
  switch (filters?.sortBy) {
    case "name":
      query = query.order("last_name").order("first_name");
      break;
    case "grade_score":
      query = query.order("grade_score", { ascending: false, nullsFirst: false });
      break;
    case "age_group":
      query = query.order("age_group").order("last_name");
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  const { data, error } = await query;
  if (error) throw new Error(`getPlayers failed: ${error.message}`);
  return (data ?? []) as Player[];
}

export async function getPlayerById(id: string): Promise<Player | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("players")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // not found
    throw new Error(`getPlayerById failed: ${error.message}`);
  }
  return data as Player;
}

export async function updatePlayerStatus(
  id: string,
  status: string
): Promise<Player> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("players")
    .update({ status: status as PlayerStatus, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(`updatePlayerStatus failed: ${error.message}`);
  return data as Player;
}

// ===========================================================================
// Teams
// ===========================================================================

export async function getTeams(seasonId?: string): Promise<Team[]> {
  const supabase = createClient();
  let query = supabase.from("teams").select("*");

  if (seasonId) {
    query = query.eq("season_id", seasonId);
  }

  query = query.order("age_group").order("name");

  const { data, error } = await query;
  if (error) throw new Error(`getTeams failed: ${error.message}`);
  return (data ?? []) as Team[];
}

export async function getTeamById(id: string): Promise<Team | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("teams")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw new Error(`getTeamById failed: ${error.message}`);
  }
  return data as Team;
}

export async function getTeamPlayers(teamId: string): Promise<(TeamPlayer & { player: Player })[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("team_players")
    .select("*, player:players(*)")
    .eq("team_id", teamId)
    .order("jersey_number", { nullsFirst: false });

  if (error) throw new Error(`getTeamPlayers failed: ${error.message}`);
  return (data ?? []) as (TeamPlayer & { player: Player })[];
}

export async function assignPlayerToTeam(
  teamId: string,
  playerId: string
): Promise<TeamPlayer> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("team_players")
    .insert({ team_id: teamId, player_id: playerId })
    .select()
    .single();

  if (error) throw new Error(`assignPlayerToTeam failed: ${error.message}`);
  return data as TeamPlayer;
}

// ===========================================================================
// Drills
// ===========================================================================

export async function getDrills(filters?: {
  category?: string;
  ageGroup?: string;
  difficulty?: string;
  search?: string;
}): Promise<Drill[]> {
  const supabase = createClient();
  let query = supabase.from("drills").select("*");

  if (filters?.category) {
    query = query.eq("skill_category", filters.category);
  }
  if (filters?.ageGroup) {
    query = query.ilike("age_groups", `%${filters.ageGroup}%`);
  }
  if (filters?.difficulty) {
    query = query.eq("difficulty", filters.difficulty);
  }
  if (filters?.search) {
    query = query.or(
      `name.ilike.%${filters.search}%,skill_category.ilike.%${filters.search}%`
    );
  }

  query = query.order("drill_id_code");

  const { data, error } = await query;
  if (error) throw new Error(`getDrills failed: ${error.message}`);
  return (data ?? []) as Drill[];
}

export async function getDrillById(id: string): Promise<Drill | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("drills")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw new Error(`getDrillById failed: ${error.message}`);
  }
  return data as Drill;
}

export async function createDrill(drill: Partial<Drill>): Promise<Drill> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("drills")
    .insert({
      drill_id_code: drill.drill_id_code,
      name: drill.name,
      age_groups: drill.age_groups,
      skill_category: drill.skill_category,
      difficulty: drill.difficulty,
      duration_minutes: drill.duration_minutes,
      equipment: drill.equipment,
      setup: drill.setup,
      instructions: drill.instructions,
      coach_role: drill.coach_role,
      targeted_results: drill.targeted_results,
      ai_image_description: drill.ai_image_description ?? "",
      ai_generated: drill.ai_generated ?? false,
      created_by: drill.created_by ?? null,
    })
    .select()
    .single();

  if (error) throw new Error(`createDrill failed: ${error.message}`);
  return data as Drill;
}

// ===========================================================================
// Grading
// ===========================================================================

export async function getGradingSessions(filters?: {
  ageGroup?: string;
  status?: string;
}): Promise<GradingSession[]> {
  const supabase = createClient();
  let query = supabase.from("grading_sessions").select("*");

  if (filters?.ageGroup) {
    query = query.eq("age_group", filters.ageGroup);
  }
  if (filters?.status) {
    query = query.eq("status", filters.status);
  }

  query = query.order("date", { ascending: false });

  const { data, error } = await query;
  if (error) throw new Error(`getGradingSessions failed: ${error.message}`);
  return (data ?? []) as GradingSession[];
}

export async function getGradingScores(
  sessionId: string,
  playerId?: string
): Promise<GradingScore[]> {
  const supabase = createClient();
  let query = supabase
    .from("grading_scores")
    .select("*")
    .eq("grading_session_id", sessionId);

  if (playerId) {
    query = query.eq("player_id", playerId);
  }

  query = query.order("created_at");

  const { data, error } = await query;
  if (error) throw new Error(`getGradingScores failed: ${error.message}`);
  return (data ?? []) as GradingScore[];
}

export async function submitGradingScore(data: {
  sessionId: string;
  playerId: string;
  assessorId: string;
  criteriaId: string;
  score: number;
  notes?: string;
}): Promise<GradingScore> {
  const supabase = createClient();
  const { data: result, error } = await supabase
    .from("grading_scores")
    .insert({
      grading_session_id: data.sessionId,
      player_id: data.playerId,
      assessor_id: data.assessorId,
      criteria_id: data.criteriaId,
      score: data.score,
      notes: data.notes ?? null,
    })
    .select()
    .single();

  if (error) throw new Error(`submitGradingScore failed: ${error.message}`);
  return result as GradingScore;
}

// ===========================================================================
// Seasons
// ===========================================================================

export async function getCurrentSeason(): Promise<Season | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("seasons")
    .select("*")
    .eq("is_current", true)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw new Error(`getCurrentSeason failed: ${error.message}`);
  }
  return data as Season;
}
