// ---------------------------------------------------------------------------
// Development types – coaches, training sessions, drills, equipment, KB
// ---------------------------------------------------------------------------

export type CoachStatus = "active" | "eoi" | "archived" | "suspended";
export type WWCCStatus = "valid" | "expiring" | "expired";
export type SessionStatus = "published" | "draft";
export type DrillDifficulty = "Beginner" | "Beginner-Intermediate" | "Intermediate" | "Intermediate-Advanced" | "Advanced";
export type EquipmentCondition = "good" | "fair" | "poor";
export type KBDocStatus = "ready" | "processing" | "failed";

/**
 * A coach record with compliance info (WWCC, first-aid).
 * Table: `public.coaches`
 */
export interface Coach {
  id: string;
  user_id: string;
  certification_level: string | null;
  wwcc_number: string | null;
  wwcc_expiry: string | null;
  wwcc_status: WWCCStatus;
  first_aid_expiry: string | null;
  status: CoachStatus;
  created_at: string;
}

/**
 * A structured training session composed of drills.
 * Table: `public.training_sessions`
 */
export interface TrainingSession {
  id: string;
  title: string;
  age_group: string;
  skill_level: string;
  focus_area: string;
  duration_minutes: number;
  status: SessionStatus;
  created_by: string;
  created_at: string;
}

/** Links a drill into a session at a given position. */
export interface SessionDrill {
  id: string;
  session_id: string;
  drill_id: string;
  section: "warm_up" | "main" | "cool_down";
  order_index: number;
  duration_override: number | null;
}

/**
 * A reusable training drill with AI-generated imagery support.
 * Table: `public.drills`
 */
export interface Drill {
  id: string;
  drill_id_code: string;    // e.g. "DRB-001"
  name: string;
  age_groups: string;
  skill_category: string;
  difficulty: DrillDifficulty;
  duration_minutes: number;
  equipment: string;
  setup: string;
  instructions: string;
  coach_role: string;
  targeted_results: string;
  ai_image_description: string;
  image_url: string | null;
  created_by: string | null;
  ai_generated: boolean;
  created_at: string;
}

/** Physical equipment tracked for auditing. Table: `public.equipment` */
export interface Equipment {
  id: string;
  name: string;
  category: string;
  quantity: number;
  min_stock: number;
  condition: EquipmentCondition;
  location: string | null;
  last_audit_date: string | null;
  created_at: string;
}

/**
 * A document uploaded to the AI knowledge base for RAG.
 * Table: `public.kb_documents`
 */
export interface KBDocument {
  id: string;
  name: string;
  file_url: string;
  file_size: number;
  page_count: number;
  chunks_generated: number;
  status: KBDocStatus;
  category: string | null;
  uploaded_by: string;
  created_at: string;
}
