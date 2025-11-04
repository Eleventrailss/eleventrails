-- =====================================================
-- GENERAL SETTINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS general_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(255) UNIQUE NOT NULL,
  value TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for key lookup
CREATE INDEX IF NOT EXISTS idx_general_settings_key ON general_settings(key);

-- Trigger for updated_at
CREATE TRIGGER update_general_settings_updated_at
  BEFORE UPDATE ON general_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE general_settings ENABLE ROW LEVEL SECURITY;

-- Admin/authenticated users can manage general_settings
CREATE POLICY "Authenticated users can manage general_settings"
  ON general_settings FOR ALL
  USING (auth.role() = 'authenticated');

-- Public read access for general_settings (optional - remove if settings should be private)
CREATE POLICY "Public can view general_settings"
  ON general_settings FOR SELECT
  USING (true);

