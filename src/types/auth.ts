// ---------------------------------------------------------------------------
// Auth & Role types – matches Supabase: profiles, user_roles, seasons
// ---------------------------------------------------------------------------

/** The four portal roles plus the super-admin role. */
export type RoleType = "parent" | "coach" | "manager" | "committee" | "admin";

/**
 * A user profile stored in `public.profiles`.
 * One-to-one with `auth.users` via `id`.
 */
export interface Profile {
  id: string;               // UUID, FK to auth.users
  email: string;
  display_name: string;
  avatar_url: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Maps a user to one or more roles, optionally scoped to a season.
 * Table: `public.user_roles`
 */
export interface UserRole {
  id: string;
  user_id: string;          // FK to profiles
  role_type: RoleType;
  season_id: string | null;  // FK to seasons
  granted_by: string | null; // FK to profiles
  granted_at: string;
  status: "active" | "inactive" | "pending";
}

/**
 * A competition season that scopes most data in the platform.
 * Table: `public.seasons`
 */
export interface Season {
  id: string;
  name: string;
  year: number;
  start_date: string;
  end_date: string;
  phase: "planning" | "pre_season" | "in_season" | "post_season";
  is_current: boolean;
  created_at: string;
}
