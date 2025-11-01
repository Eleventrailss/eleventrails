-- =====================================================
-- ElevenTrails - Storage Bucket Setup Script
-- =====================================================
-- Jalankan script ini di Supabase SQL Editor untuk membuat bucket dan policy

-- =====================================================
-- 1. CREATE STORAGE BUCKET
-- =====================================================
-- Membuat bucket "rides" sebagai public
INSERT INTO storage.buckets (id, name, public)
VALUES ('rides', 'rides', true)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 2. CREATE POLICIES FOR PUBLIC READ
-- =====================================================
-- Policy untuk allow public read (karena bucket public)
CREATE POLICY IF NOT EXISTS "Allow public read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'rides');

-- =====================================================
-- 3. CREATE POLICIES FOR AUTHENTICATED USERS
-- =====================================================
-- Policy untuk allow authenticated users upload
CREATE POLICY IF NOT EXISTS "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'rides');

-- Policy untuk allow authenticated users update
CREATE POLICY IF NOT EXISTS "Allow authenticated updates"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'rides');

-- Policy untuk allow authenticated users delete
CREATE POLICY IF NOT EXISTS "Allow authenticated deletes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'rides');

-- =====================================================
-- 4. VERIFY BUCKET CREATION
-- =====================================================
-- Cek apakah bucket sudah dibuat
SELECT * FROM storage.buckets WHERE id = 'rides';

-- =====================================================
-- CATATAN:
-- =====================================================
-- 1. Bucket "rides" akan dibuat sebagai PUBLIC
-- 2. Public bisa membaca semua file di bucket
-- 3. Hanya authenticated users yang bisa upload/update/delete
-- 4. Jika ingin private bucket, ubah 'true' menjadi 'false' pada INSERT

