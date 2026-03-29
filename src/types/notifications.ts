// ---------------------------------------------------------------------------
// Notification, audit, and consent types
// ---------------------------------------------------------------------------

export type NotificationType = "info" | "warning" | "success" | "action_required";

/** An in-app notification for a user. Table: `public.notifications` */
export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string;
  read: boolean;
  entity_type: string | null;
  entity_id: string | null;
  action_url: string | null;
  created_at: string;
}

/** An immutable audit-log entry. Table: `public.audit_logs` */
export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  changes: Record<string, unknown> | null;
  ip_address: string | null;
  created_at: string;
}

/** A guardian's photo-consent decision for a player. Table: `public.photo_consents` */
export interface PhotoConsentRecord {
  id: string;
  player_id: string;
  guardian_id: string;
  consent_type: "none" | "internal_only" | "public_website" | "social_media";
  granted: boolean;
  granted_at: string;
  revoked_at: string | null;
}
