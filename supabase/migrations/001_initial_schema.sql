-- ============================================================
-- Nickol Soccer Club - Complete Database Schema
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgvector";

-- ============================================================
-- AUTH & RBAC
-- ============================================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE seasons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  year INTEGER NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  phase TEXT NOT NULL CHECK (phase IN ('planning','pre_season','in_season','post_season')),
  is_current BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role_type TEXT NOT NULL CHECK (role_type IN ('parent','coach','manager','committee','admin')),
  season_id UUID REFERENCES seasons(id),
  granted_by UUID REFERENCES profiles(id),
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive','pending'))
);
CREATE INDEX idx_user_roles_user ON user_roles(user_id);
CREATE INDEX idx_user_roles_role ON user_roles(role_type);

-- ============================================================
-- REGISTRAR
-- ============================================================

CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  dob DATE NOT NULL,
  age_group TEXT NOT NULL,
  gender TEXT,
  ffa_number TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'eoi' CHECK (status IN ('registered','eoi','pending','inactive')),
  medical_notes TEXT,  -- Should be encrypted at application layer
  photo_consent TEXT NOT NULL DEFAULT 'none' CHECK (photo_consent IN ('none','internal_only','public_website','social_media')),
  position TEXT,
  grade_score NUMERIC(3,1),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_players_age_group ON players(age_group);
CREATE INDEX idx_players_status ON players(status);

CREATE TABLE guardians (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  relationship TEXT NOT NULL DEFAULT 'parent'
);

CREATE TABLE player_guardians (
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  guardian_id UUID NOT NULL REFERENCES guardians(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (player_id, guardian_id)
);

CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  age_group TEXT NOT NULL,
  division TEXT NOT NULL DEFAULT 'A',
  season_id UUID NOT NULL REFERENCES seasons(id),
  coach_id UUID REFERENCES profiles(id),
  capacity INTEGER NOT NULL DEFAULT 16,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('active','draft','full','archived')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE team_players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  jersey_number INTEGER,
  position TEXT,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(team_id, player_id)
);

CREATE TABLE schedule_games (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  season_id UUID NOT NULL REFERENCES seasons(id),
  home_team_id UUID NOT NULL REFERENCES teams(id),
  away_team TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  venue TEXT NOT NULL,
  field TEXT,
  age_group TEXT NOT NULL,
  round TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('published','draft','cancelled','completed')),
  result_home INTEGER,
  result_away INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- FINANCIAL
-- ============================================================

CREATE TABLE income (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  season_id UUID NOT NULL REFERENCES seasons(id),
  date DATE NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  paid_by TEXT,
  reference TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','reconciled','rejected')),
  recorded_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  season_id UUID NOT NULL REFERENCES seasons(id),
  date DATE NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  submitted_by UUID NOT NULL REFERENCES profiles(id),
  approved_by UUID REFERENCES profiles(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','reconciled','rejected')),
  receipt_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE budget_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  season_id UUID NOT NULL REFERENCES seasons(id),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income','expense')),
  budgeted_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  notes TEXT,
  created_by UUID NOT NULL REFERENCES profiles(id)
);

CREATE TABLE sponsors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  tier TEXT NOT NULL CHECK (tier IN ('platinum','gold','silver','bronze')),
  logo_url TEXT,
  website_url TEXT,
  contract_start DATE NOT NULL,
  contract_end DATE NOT NULL,
  annual_value NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive','pending')),
  season_id UUID NOT NULL REFERENCES seasons(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE grants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  season_id UUID NOT NULL REFERENCES seasons(id),
  grant_name TEXT NOT NULL,
  granting_body TEXT NOT NULL,
  amount_applied NUMERIC(10,2) NOT NULL,
  amount_received NUMERIC(10,2),
  application_date DATE,
  decision_date DATE,
  status TEXT NOT NULL DEFAULT 'identified' CHECK (status IN ('identified','draft','submitted','approved','rejected','received')),
  reporting_requirements TEXT,
  next_report_due DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- DEVELOPMENT
-- ============================================================

CREATE TABLE coaches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  certification_level TEXT,
  wwcc_number TEXT,
  wwcc_expiry DATE,
  wwcc_status TEXT NOT NULL DEFAULT 'valid' CHECK (wwcc_status IN ('valid','expiring','expired')),
  first_aid_expiry DATE,
  status TEXT NOT NULL DEFAULT 'eoi' CHECK (status IN ('active','eoi','archived','suspended')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE drills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  drill_id_code TEXT NOT NULL UNIQUE,  -- e.g. "DRB-001"
  name TEXT NOT NULL,
  age_groups TEXT NOT NULL,
  skill_category TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  equipment TEXT NOT NULL,
  setup TEXT NOT NULL,
  instructions TEXT NOT NULL,
  coach_role TEXT NOT NULL,
  targeted_results TEXT NOT NULL,
  ai_image_description TEXT,
  image_url TEXT,
  created_by UUID REFERENCES profiles(id),
  ai_generated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE training_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  age_group TEXT NOT NULL,
  skill_level TEXT NOT NULL,
  focus_area TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('published','draft')),
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE session_drills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES training_sessions(id) ON DELETE CASCADE,
  drill_id UUID NOT NULL REFERENCES drills(id),
  section TEXT NOT NULL CHECK (section IN ('warm_up','main','cool_down')),
  order_index INTEGER NOT NULL DEFAULT 0,
  duration_override INTEGER
);

CREATE TABLE equipment (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  min_stock INTEGER NOT NULL DEFAULT 0,
  condition TEXT NOT NULL DEFAULT 'good' CHECK (condition IN ('good','fair','poor')),
  location TEXT,
  last_audit_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE kb_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  page_count INTEGER NOT NULL DEFAULT 0,
  chunks_generated INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'processing' CHECK (status IN ('ready','processing','failed')),
  category TEXT,
  uploaded_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vector embeddings for RAG (Coach Niko)
CREATE TABLE kb_embeddings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID NOT NULL REFERENCES kb_documents(id) ON DELETE CASCADE,
  chunk_text TEXT NOT NULL,
  chunk_index INTEGER NOT NULL,
  embedding VECTOR(768),  -- Gemini embedding dimension
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_kb_embeddings_vector ON kb_embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- ============================================================
-- COMMUNICATIONS
-- ============================================================

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  sender_id UUID NOT NULL REFERENCES profiles(id),
  recipient_type TEXT NOT NULL,
  channels TEXT[] NOT NULL DEFAULT '{}',
  sent_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent','delivered','read','failed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE news_articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  author_id UUID NOT NULL REFERENCES profiles(id),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('published','draft','scheduled','archived')),
  published_at TIMESTAMPTZ,
  featured_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  type TEXT NOT NULL DEFAULT 'image',
  uploaded_by UUID NOT NULL REFERENCES profiles(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  photo_consent_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE social_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  platforms TEXT[] NOT NULL DEFAULT '{}',
  scheduled_at TIMESTAMPTZ,
  posted_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled','posted','failed')),
  image_url TEXT,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TIME NOT NULL,
  location TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('training','social','fundraiser','agm')),
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming','in_progress','completed','cancelled')),
  rsvp_count INTEGER DEFAULT 0,
  rsvp_capacity INTEGER DEFAULT 0,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- COMMITTEE
-- ============================================================

CREATE TABLE committee_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  role_name TEXT NOT NULL,
  season_id UUID NOT NULL REFERENCES seasons(id),
  start_date DATE NOT NULL,
  end_date DATE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','outgoing','vacant'))
);

CREATE TABLE meetings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  location TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'ordinary' CHECK (type IN ('ordinary','special','agm')),
  agenda_status TEXT NOT NULL DEFAULT 'draft' CHECK (agenda_status IN ('draft','finalized')),
  minutes_status TEXT NOT NULL DEFAULT 'none' CHECK (minutes_status IN ('draft','approved','none')),
  season_id UUID NOT NULL REFERENCES seasons(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE agenda_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meeting_id UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  presenter TEXT,
  duration_minutes INTEGER NOT NULL DEFAULT 5,
  order_index INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE action_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  assigned_to UUID NOT NULL REFERENCES profiles(id),
  due_date DATE NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('high','medium','low')),
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo','in_progress','completed')),
  source TEXT,
  meeting_id UUID REFERENCES meetings(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE agm_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  season_id UUID NOT NULL REFERENCES seasons(id),
  date DATE NOT NULL,
  attendee_count INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE agm_positions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agm_id UUID NOT NULL REFERENCES agm_records(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','voting','completed'))
);

CREATE TABLE agm_nominees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  position_id UUID NOT NULL REFERENCES agm_positions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  statement TEXT,
  votes INTEGER NOT NULL DEFAULT 0,
  is_winner BOOLEAN DEFAULT FALSE
);

CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  folder TEXT NOT NULL,
  type TEXT NOT NULL,
  url TEXT NOT NULL,
  uploaded_by UUID NOT NULL REFERENCES profiles(id),
  size TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SAFETY & AUDIT
-- ============================================================

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  type TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('info','warning','success','action_required')),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  entity_type TEXT,
  entity_id TEXT,
  action_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_notifications_user ON notifications(user_id, read);

CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  changes JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_audit_log_user ON audit_log(user_id);
CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id);

CREATE TABLE photo_consents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  guardian_id UUID NOT NULL REFERENCES guardians(id),
  consent_type TEXT NOT NULL DEFAULT 'none' CHECK (consent_type IN ('none','internal_only','public_website','social_media')),
  granted BOOLEAN DEFAULT FALSE,
  granted_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ
);

-- ============================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE income ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE grants ENABLE ROW LEVEL SECURITY;
ALTER TABLE drills ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_drills ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE kb_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE kb_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE committee_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read their own, committee can read all
CREATE POLICY "Users read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Seasons: everyone can read
CREATE POLICY "Anyone can read seasons" ON seasons FOR SELECT USING (true);

-- Committee members get full access to most tables
-- (Simplified policies - in production these would be more granular based on role)
CREATE POLICY "Committee full access players" ON players FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role_type IN ('committee','admin') AND status = 'active')
);

CREATE POLICY "Committee full access teams" ON teams FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role_type IN ('committee','admin') AND status = 'active')
);

CREATE POLICY "Committee full access drills" ON drills FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role_type IN ('committee','admin','coach') AND status = 'active')
);

CREATE POLICY "Committee full access finance" ON income FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role_type IN ('committee','admin') AND status = 'active')
);

-- Notifications: users can only see their own
CREATE POLICY "Users read own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Audit log: only admins can read
CREATE POLICY "Admin read audit log" ON audit_log FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role_type = 'admin' AND status = 'active')
);
