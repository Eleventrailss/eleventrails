-- =====================================================
-- FAQ TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for active FAQs
CREATE INDEX IF NOT EXISTS idx_faqs_is_active ON faqs(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_faqs_display_order ON faqs(display_order);

-- Trigger for updated_at
CREATE TRIGGER update_faqs_updated_at
  BEFORE UPDATE ON faqs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public can view active FAQs"
  ON faqs FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage FAQs"
  ON faqs FOR ALL
  USING (auth.role() = 'authenticated');

