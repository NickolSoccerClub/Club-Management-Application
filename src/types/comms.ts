// ---------------------------------------------------------------------------
// Communications types – messages, news, media, social, events
// ---------------------------------------------------------------------------

export type MessageStatus = "sent" | "delivered" | "read" | "failed";
export type ArticleStatus = "published" | "draft" | "scheduled" | "archived";
export type MediaStatus = "pending" | "approved" | "rejected";
export type SocialPostStatus = "scheduled" | "posted" | "failed";
export type EventType = "training" | "social" | "fundraiser" | "agm";
export type EventStatus = "upcoming" | "in_progress" | "completed" | "cancelled";

/** A message sent to one or more recipients via selected channels. */
export interface Message {
  id: string;
  subject: string;
  body: string;
  sender_id: string;
  recipient_type: string;
  channels: string[];
  sent_at: string;
  status: MessageStatus;
}

/** A news article for the club website. Table: `public.news_articles` */
export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  author_id: string;
  status: ArticleStatus;
  published_at: string | null;
  featured_image_url: string | null;
  created_at: string;
}

/** An uploaded photo or video awaiting consent verification. */
export interface MediaItem {
  id: string;
  url: string;
  thumbnail_url: string | null;
  type: string;
  uploaded_by: string;
  status: MediaStatus;
  photo_consent_verified: boolean;
  created_at: string;
}

/** A social-media post that can be scheduled for future publishing. */
export interface SocialPost {
  id: string;
  content: string;
  platforms: string[];
  scheduled_at: string | null;
  posted_at: string | null;
  status: SocialPostStatus;
  image_url: string | null;
  created_by: string;
}

/** A club event with RSVP tracking. Table: `public.club_events` */
export interface ClubEvent {
  id: string;
  title: string;
  description: string | null;
  date: string;
  time: string;
  location: string;
  type: EventType;
  status: EventStatus;
  rsvp_count: number;
  rsvp_capacity: number;
  created_by: string;
  created_at: string;
}
