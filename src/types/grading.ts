// ---------------------------------------------------------------------------
// Grading System Types
// ---------------------------------------------------------------------------

export type BibColour = "blue" | "red" | "green" | "orange" | "pink";
export type AgePhase = "discovery" | "skill_acquisition" | "game_training";
export type GradingSessionType = "training" | "formal";
export type GradingSessionStatus = "scheduled" | "in_progress" | "completed";

export interface GradingBib {
  id: string;
  player_id: string;
  season_id: string;
  age_group: string;
  bib_colour: BibColour;
  bib_number: number;
  allocated_at: string;
}

export interface GradingCriteria {
  id: string;
  age_phase: AgePhase;
  name: string;
  description: string;
  sort_order: number;
}

export interface GradingDescriptor {
  id: string;
  criteria_id: string;
  score_level: 1 | 3 | 5 | 7 | 10;
  descriptor_text: string;
}

export interface GradingSession {
  id: string;
  season_id: string;
  title: string;
  date: string;
  age_group: string;
  type: GradingSessionType;
  status: GradingSessionStatus;
  created_by: string;
  created_at: string;
}

export interface GradingScore {
  id: string;
  grading_session_id: string;
  player_id: string;
  assessor_id: string;
  criteria_id: string;
  score: number;
  notes: string | null;
  video_url: string | null;
  created_at: string;
}

export interface PlayerGrade {
  id: string;
  player_id: string;
  season_id: string;
  grading_session_id: string | null;
  overall_score: number;
  ai_summary: string | null;
  strengths: string | null;
  areas_for_improvement: string | null;
  generated_at: string;
}

export interface PlayerGradeHistory {
  id: string;
  player_id: string;
  season_id: string;
  overall_score: number;
  grade_details: Record<string, unknown> | null;
  created_at: string;
}
