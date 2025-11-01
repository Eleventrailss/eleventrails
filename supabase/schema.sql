-- =====================================================
-- ElevenTrails Database Schema for Supabase
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for email lookup
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- =====================================================
-- STORIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  pic TEXT,
  author VARCHAR(255),
  stories_detail TEXT,
  tags TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for active stories
CREATE INDEX IF NOT EXISTS idx_stories_is_active ON stories(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_stories_created_at ON stories(created_at DESC);
-- GIN index for tags array search
CREATE INDEX IF NOT EXISTS idx_stories_tags ON stories USING GIN(tags);

-- =====================================================
-- RIDES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS rides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  tags TEXT[], -- Array of tags
  short_description TEXT,
  description TEXT,
  primary_picture TEXT,
  secondary_picture TEXT,
  original_price DECIMAL(10, 2) NOT NULL,
  final_price DECIMAL(10, 2) NOT NULL,
  type VARCHAR(50) CHECK (type IN ('group', 'personal')) NOT NULL,
  duration VARCHAR(100),
  location VARCHAR(255),
  meeting_point VARCHAR(255),
  difficulty_level VARCHAR(50),
  whatsapp_message TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for rides
CREATE INDEX IF NOT EXISTS idx_rides_is_active ON rides(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_rides_type ON rides(type);
CREATE INDEX IF NOT EXISTS idx_rides_difficulty_level ON rides(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_rides_created_at ON rides(created_at DESC);

-- GIN index for tags array search
CREATE INDEX IF NOT EXISTS idx_rides_tags ON rides USING GIN(tags);

-- =====================================================
-- RIDE_INFOS TABLE (for nested info records)
-- =====================================================
CREATE TABLE IF NOT EXISTS ride_infos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ride_id UUID NOT NULL REFERENCES rides(id) ON DELETE CASCADE,
  icon VARCHAR(255), -- Icon name or path
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for ride_infos
CREATE INDEX IF NOT EXISTS idx_ride_infos_ride_id ON ride_infos(ride_id);
CREATE INDEX IF NOT EXISTS idx_ride_infos_display_order ON ride_infos(ride_id, display_order);

-- =====================================================
-- RIDE_GALLERY_PHOTOS TABLE (for multiple gallery photos)
-- =====================================================
CREATE TABLE IF NOT EXISTS ride_gallery_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ride_id UUID NOT NULL REFERENCES rides(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  alt_text VARCHAR(255),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for ride_gallery_photos
CREATE INDEX IF NOT EXISTS idx_ride_gallery_photos_ride_id ON ride_gallery_photos(ride_id);
CREATE INDEX IF NOT EXISTS idx_ride_gallery_photos_display_order ON ride_gallery_photos(ride_id, display_order);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stories_updated_at
  BEFORE UPDATE ON stories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rides_updated_at
  BEFORE UPDATE ON rides
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ride_infos_updated_at
  BEFORE UPDATE ON ride_infos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE rides ENABLE ROW LEVEL SECURITY;
ALTER TABLE ride_infos ENABLE ROW LEVEL SECURITY;
ALTER TABLE ride_gallery_photos ENABLE ROW LEVEL SECURITY;

-- Public read access for active rides (example policy)
CREATE POLICY "Public can view active rides"
  ON rides FOR SELECT
  USING (is_active = true);

-- Public read access for active stories (example policy)
CREATE POLICY "Public can view active stories"
  ON stories FOR SELECT
  USING (is_active = true);

-- Public read access for ride_infos (example policy)
CREATE POLICY "Public can view ride_infos"
  ON ride_infos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM rides
      WHERE rides.id = ride_infos.ride_id
      AND rides.is_active = true
    )
  );

-- Public read access for ride_gallery_photos (example policy)
CREATE POLICY "Public can view ride_gallery_photos"
  ON ride_gallery_photos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM rides
      WHERE rides.id = ride_gallery_photos.ride_id
      AND rides.is_active = true
    )
  );

-- Admin/authenticated users can manage rides (example policy)
CREATE POLICY "Authenticated users can manage rides"
  ON rides FOR ALL
  USING (auth.role() = 'authenticated');

-- Admin/authenticated users can manage stories (example policy)
CREATE POLICY "Authenticated users can manage stories"
  ON stories FOR ALL
  USING (auth.role() = 'authenticated');

-- Admin/authenticated users can manage users (example policy)
CREATE POLICY "Authenticated users can manage users"
  ON users FOR ALL
  USING (auth.role() = 'authenticated');

-- Admin/authenticated users can manage ride_infos (example policy)
CREATE POLICY "Authenticated users can manage ride_infos"
  ON ride_infos FOR ALL
  USING (auth.role() = 'authenticated');

-- Admin/authenticated users can manage ride_gallery_photos (example policy)
CREATE POLICY "Authenticated users can manage ride_gallery_photos"
  ON ride_gallery_photos FOR ALL
  USING (auth.role() = 'authenticated');

-- =====================================================
-- HELPER VIEWS (Optional - for easier queries)
-- =====================================================

-- View for rides with all related data
CREATE OR REPLACE VIEW rides_with_details AS
SELECT 
  r.*,
  COALESCE(
    json_agg(
      DISTINCT jsonb_build_object(
        'id', ri.id,
        'name', ri.name,
        'icon', ri.icon,
        'question', ri.question,
        'answer', ri.answer,
        'display_order', ri.display_order
      )
      ORDER BY ri.display_order
    ) FILTER (WHERE ri.id IS NOT NULL),
    '[]'::json
  ) as infos,
  COALESCE(
    json_agg(
      DISTINCT jsonb_build_object(
        'id', rgp.id,
        'photo_url', rgp.photo_url,
        'alt_text', rgp.alt_text,
        'display_order', rgp.display_order
      )
      ORDER BY rgp.display_order
    ) FILTER (WHERE rgp.id IS NOT NULL),
    '[]'::json
  ) as gallery_photos
FROM rides r
LEFT JOIN ride_infos ri ON r.id = ri.ride_id
LEFT JOIN ride_gallery_photos rgp ON r.id = rgp.ride_id
WHERE r.is_active = true
GROUP BY r.id;

