-- =====================================================
-- ElevenTrails - Seed Data for Rides
-- =====================================================
-- Jalankan script ini di Supabase SQL Editor untuk menambahkan data dummy rides

-- =====================================================
-- 1. INSERT RIDE - BEGINNER TRAIL
-- =====================================================
INSERT INTO rides (
  title,
  tags,
  short_description,
  description,
  primary_picture,
  secondary_picture,
  original_price,
  final_price,
  type,
  duration,
  location,
  meeting_point,
  difficulty_level,
  whatsapp_message,
  is_active
)
VALUES (
  'BEGINNER TRAIL',
  ARRAY['Easy', 'Family', 'Nature'],
  'Jalur ideal untuk pemula, ramah keluarga, dan pemandangan alam yang indah.',
  'Jalur ideal untuk pemula, ramah keluarga, dan pemandangan alam yang indah. Nikmati pengalaman riding yang aman dan menyenangkan dengan jalur yang telah disesuaikan untuk semua level kemampuan.',
  '/rides/beginner-trail-primary.jpg',
  '/rides/beginner-trail-secondary.jpg',
  1200000.00,
  1000000.00,
  'group',
  '7 Hours',
  'Kuta Lombok',
  'Kuta Lombok',
  'Easy-Medium',
  'Halo, saya tertarik untuk booking BEGINNER TRAIL',
  true
)
RETURNING id;

-- =====================================================
-- 2. INSERT RIDE - INTERMEDIATE RIDGE
-- =====================================================
INSERT INTO rides (
  title,
  tags,
  short_description,
  description,
  primary_picture,
  secondary_picture,
  original_price,
  final_price,
  type,
  duration,
  location,
  meeting_point,
  difficulty_level,
  whatsapp_message,
  is_active
)
VALUES (
  'INTERMEDIATE RIDGE',
  ARRAY['Medium', 'Adventure', 'Fun'],
  'Untuk rider berpengalaman, lebih banyak tanjakan dan petualangan menantang.',
  'Untuk rider berpengalaman, lebih banyak tanjakan dan petualangan menantang. Jalur ini menawarkan tantangan yang lebih tinggi dengan medan yang bervariasi dan pemandangan yang spektakuler.',
  '/rides/intermediate-trail-primary.jpg',
  '/rides/intermediate-trail-secondary.jpg',
  1500000.00,
  1350000.00,
  'group',
  '8 Hours',
  'Senggigi, Lombok',
  'Senggigi, Lombok',
  'Medium',
  'Halo, saya tertarik untuk booking INTERMEDIATE RIDGE',
  true
)
RETURNING id;

-- =====================================================
-- 3. INSERT RIDE - EXPERT CHALLENGE
-- =====================================================
INSERT INTO rides (
  title,
  tags,
  short_description,
  description,
  primary_picture,
  secondary_picture,
  original_price,
  final_price,
  type,
  duration,
  location,
  meeting_point,
  difficulty_level,
  whatsapp_message,
  is_active
)
VALUES (
  'EXPERT CHALLENGE',
  ARRAY['Hard', 'Technical', 'Adrenaline'],
  'Trek ekstrim untuk ekstremis dengan rintangan teknikal.',
  'Trek ekstrim untuk ekstremis dengan rintangan teknikal. Jalur ini dirancang khusus untuk expert rider yang mencari tantangan ekstrem dan adrenalin tinggi.',
  '/rides/expert-trail-primary.jpg',
  '/rides/expert-trail-secondary.jpg',
  2000000.00,
  1800000.00,
  'personal',
  '10 Hours',
  'Gunung Rinjani Area',
  'Gunung Rinjani Base Camp',
  'Hard',
  'Halo, saya tertarik untuk booking EXPERT CHALLENGE',
  true
)
RETURNING id;

-- =====================================================
-- Catatan:
-- Setelah menjalankan INSERT di atas, Anda akan mendapatkan UUID untuk setiap ride.
-- Gunakan UUID tersebut untuk INSERT ride_infos dan ride_gallery_photos
-- 
-- Contoh:
-- SET @beginner_trail_id = 'uuid-dari-ride-pertama';
-- INSERT INTO ride_infos (ride_id, name, icon, question, answer, display_order) VALUES (...);
-- INSERT INTO ride_gallery_photos (ride_id, photo_url, alt_text, display_order) VALUES (...);

