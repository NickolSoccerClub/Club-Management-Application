// ---------------------------------------------------------------------------
// Registrar types – players, guardians, teams, schedule
// ---------------------------------------------------------------------------

export type PlayerStatus = "registered" | "eoi" | "pending" | "inactive";
export type PhotoConsent = "none" | "internal_only" | "public_website" | "social_media";
export type TeamStatus = "active" | "draft" | "full" | "archived";
export type GameStatus = "published" | "draft" | "cancelled" | "completed";

/**
 * A registered (or expression-of-interest) player.
 * Table: `public.players`
 */
export interface Player {
  id: string;
  first_name: string;
  last_name: string;
  dob: string;
  age_group: string;
  gender: string | null;
  ffa_number: string | null;
  status: PlayerStatus;
  medical_notes: string | null;  // encrypted at rest
  photo_consent: PhotoConsent;
  position: string | null;
  grade_score: number | null;
  created_at: string;
  updated_at: string;
}

/**
 * A parent / guardian linked to one or more players.
 * Table: `public.guardians`
 */
export interface Guardian {
  id: string;
  user_id: string | null;   // FK to profiles (if they have an account)
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  relationship: string;
}

/** Junction table linking players to guardians. */
export interface PlayerGuardian {
  player_id: string;
  guardian_id: string;
  is_primary: boolean;
}

/**
 * A team within a season, assigned to an age group and division.
 * Table: `public.teams`
 */
export interface Team {
  id: string;
  name: string;
  age_group: string;
  division: string;
  season_id: string;
  coach_id: string | null;
  capacity: number;
  status: TeamStatus;
  created_at: string;
}

/** A player's assignment to a team. Table: `public.team_players` */
export interface TeamPlayer {
  id: string;
  team_id: string;
  player_id: string;
  jersey_number: number | null;
  position: string | null;
  assigned_at: string;
}

/**
 * A scheduled fixture / game.
 * Table: `public.schedule_games`
 */
export interface ScheduleGame {
  id: string;
  season_id: string;
  home_team_id: string;
  away_team: string;
  date: string;
  time: string;
  venue: string;
  field: string | null;
  age_group: string;
  round: string;
  status: GameStatus;
  result_home: number | null;
  result_away: number | null;
  created_at: string;
}
