-- =============================================================================
-- Grading System Tables
-- =============================================================================

CREATE TABLE grading_bibs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  season_id UUID NOT NULL REFERENCES seasons(id),
  age_group TEXT NOT NULL,
  bib_colour TEXT NOT NULL CHECK (bib_colour IN ('blue','red','green','orange','pink')),
  bib_number INTEGER NOT NULL CHECK (bib_number BETWEEN 1 AND 10),
  allocated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(season_id, age_group, bib_colour, bib_number)
);

CREATE TABLE grading_criteria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  age_phase TEXT NOT NULL CHECK (age_phase IN ('discovery','skill_acquisition','game_training')),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE grading_descriptors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  criteria_id UUID NOT NULL REFERENCES grading_criteria(id) ON DELETE CASCADE,
  score_level INTEGER NOT NULL CHECK (score_level IN (1,3,5,7,10)),
  descriptor_text TEXT NOT NULL
);

CREATE TABLE grading_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id UUID NOT NULL REFERENCES seasons(id),
  title TEXT NOT NULL,
  date DATE NOT NULL,
  age_group TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('training','formal')),
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled','in_progress','completed')),
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE grading_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grading_session_id UUID NOT NULL REFERENCES grading_sessions(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES players(id),
  assessor_id UUID NOT NULL REFERENCES profiles(id),
  criteria_id UUID NOT NULL REFERENCES grading_criteria(id),
  score INTEGER NOT NULL CHECK (score BETWEEN 1 AND 10),
  notes TEXT,
  video_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_grading_scores_session ON grading_scores(grading_session_id);
CREATE INDEX idx_grading_scores_player ON grading_scores(player_id);

CREATE TABLE player_grades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES players(id),
  season_id UUID NOT NULL REFERENCES seasons(id),
  grading_session_id UUID REFERENCES grading_sessions(id),
  overall_score NUMERIC(3,1) NOT NULL,
  ai_summary TEXT,
  strengths TEXT,
  areas_for_improvement TEXT,
  generated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE player_grade_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  season_id UUID NOT NULL REFERENCES seasons(id),
  overall_score NUMERIC(3,1) NOT NULL,
  grade_details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_grade_history_player ON player_grade_history(player_id);

-- =============================================================================
-- Row Level Security
-- =============================================================================

ALTER TABLE grading_bibs ENABLE ROW LEVEL SECURITY;
ALTER TABLE grading_criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE grading_descriptors ENABLE ROW LEVEL SECURITY;
ALTER TABLE grading_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE grading_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_grade_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Committee access grading" ON grading_sessions FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role_type IN ('committee','admin','coach') AND status = 'active')
);
CREATE POLICY "Committee access scores" ON grading_scores FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role_type IN ('committee','admin','coach') AND status = 'active')
);
CREATE POLICY "Anyone read criteria" ON grading_criteria FOR SELECT USING (true);
CREATE POLICY "Anyone read descriptors" ON grading_descriptors FOR SELECT USING (true);
CREATE POLICY "Committee access bibs" ON grading_bibs FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role_type IN ('committee','admin') AND status = 'active')
);
CREATE POLICY "Committee access grades" ON player_grades FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role_type IN ('committee','admin','coach') AND status = 'active')
);
CREATE POLICY "Committee access history" ON player_grade_history FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role_type IN ('committee','admin','coach') AND status = 'active')
);
