-- =====================================================
-- ElevenTrails - Example Data Insertion Queries
-- =====================================================

-- =====================================================
-- 1. INSERT USER
-- =====================================================
-- Password: Tokoku45@
-- Note: Password perlu di-hash menggunakan bcrypt sebelum disimpan
-- Untuk generate hash bcrypt, gunakan: https://bcrypt-generator.com/
-- Atau gunakan library bcrypt di aplikasi (contoh: bcryptjs di Node.js)
-- 
-- Contoh hash bcrypt untuk "Tokoku45@" (cost 10):
-- $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
--
-- Untuk production, SELALU hash password di application layer, bukan di SQL!
INSERT INTO users (email, password)
VALUES ('eleventrailss@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy');

-- =====================================================
-- 2. INSERT STORY
-- =====================================================
INSERT INTO stories (title, pic, author, stories_detail, tags, is_active)
VALUES (
  'INTO THE JUNGLE LOMBOK DIRT BIKE TOURS',
  '/stories/jungle-lombok.jpg',
  'John Doe',
  'Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod tempor.',
  ARRAY['Adventure', 'Trail Riding', 'Lombok'],
  true
);

-- =====================================================
-- 3. INSERT RIDE (dengan semua field)
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
-- 4. INSERT RIDE INFOS (multiple records)
-- =====================================================
-- Setelah mendapatkan ride_id dari insert sebelumnya
INSERT INTO ride_infos (ride_id, name, icon, question, answer, display_order)
VALUES
  (
    'ride-uuid-here', -- Ganti dengan UUID dari ride yang baru dibuat
    'Duration',
    'Clock',
    'Berapa lama durasi trail riding?',
    'Durasi trail riding bervariasi tergantung paket yang dipilih, mulai dari 3 jam hingga 7 jam. Paket full day biasanya dimulai pagi hari dan selesai di sore hari.',
    0
  ),
  (
    'ride-uuid-here',
    'Location',
    'MapPin',
    'Di mana lokasi trail riding?',
    'Lokasi trail riding berada di Kuta Lombok dengan pemandangan alam yang menakjubkan.',
    1
  ),
  (
    'ride-uuid-here',
    'Meeting Point',
    'Navigation',
    'Di mana titik pertemuan?',
    'Titik pertemuan berada di Kuta Lombok. Tim kami akan menghubungi Anda untuk detail lokasi yang lebih spesifik.',
    2
  ),
  (
    'ride-uuid-here',
    'Difficulty Level',
    'TrendingUp',
    'Apa level kesulitan trail ini?',
    'Trail ini memiliki level kesulitan Easy-Medium, cocok untuk pemula dan rider berpengalaman.',
    3
  );

-- =====================================================
-- 5. INSERT RIDE GALLERY PHOTOS (multiple photos)
-- =====================================================
INSERT INTO ride_gallery_photos (ride_id, photo_url, alt_text, display_order)
VALUES
  (
    'ride-uuid-here', -- Ganti dengan UUID dari ride
    '/gallery/mountain-bike-rider.jpg',
    'Mountain bike rider',
    0
  ),
  (
    'ride-uuid-here',
    '/gallery/off-road-motorcycle-1.jpg',
    'Off-road motorcycle',
    1
  ),
  (
    'ride-uuid-here',
    '/gallery/off-road-motorcycle-2.jpg',
    'Off-road motorcycle',
    2
  ),
  (
    'ride-uuid-here',
    '/gallery/off-road-motorcycle-3.jpg',
    'Off-road motorcycle',
    3
  ),
  (
    'ride-uuid-here',
    '/gallery/dirt-bike-rider-on-mountain-trail.jpg',
    'Dirt bike rider on mountain trail',
    4
  ),
  (
    'ride-uuid-here',
    '/gallery/dirt-bike-protective-suit.jpg',
    'Dirt bike protective suit',
    5
  );

-- =====================================================
-- 6. QUERY CONTOH - Get all active rides with details
-- =====================================================
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
GROUP BY r.id
ORDER BY r.created_at DESC;

-- =====================================================
-- 7. QUERY CONTOH - Get single ride with all details
-- =====================================================
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
WHERE r.id = 'ride-uuid-here' -- Ganti dengan UUID ride
GROUP BY r.id;

-- =====================================================
-- 8. QUERY CONTOH - Search rides by tags
-- =====================================================
SELECT * 
FROM rides 
WHERE 'Easy' = ANY(tags) 
  AND is_active = true
ORDER BY created_at DESC;

-- =====================================================
-- 9. QUERY CONTOH - Get all active stories
-- =====================================================
SELECT * 
FROM stories 
WHERE is_active = true
ORDER BY created_at DESC;

-- =====================================================
-- 10. UPDATE CONTOH - Update ride
-- =====================================================
UPDATE rides
SET 
  title = 'UPDATED TITLE',
  final_price = 950000.00,
  updated_at = NOW()
WHERE id = 'ride-uuid-here';

-- =====================================================
-- 11. DELETE CONTOH - Soft delete ride (set is_active = false)
-- =====================================================
UPDATE rides
SET is_active = false, updated_at = NOW()
WHERE id = 'ride-uuid-here';

-- =====================================================
-- 12. DELETE CONTOH - Hard delete ride (akan cascade delete infos dan photos)
-- =====================================================
DELETE FROM rides WHERE id = 'ride-uuid-here';

