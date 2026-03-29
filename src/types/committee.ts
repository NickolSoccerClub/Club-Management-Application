// ---------------------------------------------------------------------------
// Committee types – members, meetings, agenda, actions, AGM, documents
// ---------------------------------------------------------------------------

export type MeetingType = "ordinary" | "special" | "agm";
export type ActionPriority = "high" | "medium" | "low";
export type ActionStatus = "todo" | "in_progress" | "completed";
export type PositionElectionStatus = "pending" | "voting" | "completed";

/** A committee member for a given season. Table: `public.committee_members` */
export interface CommitteeMember {
  id: string;
  user_id: string;
  role_name: string;
  season_id: string;
  start_date: string;
  end_date: string | null;
  status: "active" | "outgoing" | "vacant";
}

/** A scheduled committee meeting. Table: `public.meetings` */
export interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: MeetingType;
  agenda_status: "draft" | "finalized";
  minutes_status: "draft" | "approved" | "none";
  season_id: string;
  created_at: string;
}

/** An item on a meeting agenda. */
export interface AgendaItem {
  id: string;
  meeting_id: string;
  title: string;
  presenter: string | null;
  duration_minutes: number;
  order_index: number;
}

/** A trackable action arising from a meeting or other source. */
export interface ActionItem {
  id: string;
  title: string;
  description: string | null;
  assigned_to: string;
  due_date: string;
  priority: ActionPriority;
  status: ActionStatus;
  source: string | null;
  meeting_id: string | null;
  created_at: string;
}

/** An Annual General Meeting record. Table: `public.agm_records` */
export interface AGMRecord {
  id: string;
  season_id: string;
  date: string;
  attendee_count: number;
}

/** A position up for election at an AGM. */
export interface AGMPosition {
  id: string;
  agm_id: string;
  title: string;
  status: PositionElectionStatus;
}

/** A nominee for an AGM position. */
export interface AGMNominee {
  id: string;
  position_id: string;
  name: string;
  statement: string;
  votes: number;
  is_winner: boolean;
}

/** A club document stored in the document repository. */
export interface Document {
  id: string;
  name: string;
  folder: string;
  type: string;
  url: string;
  uploaded_by: string;
  size: string;
  created_at: string;
}
