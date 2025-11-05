# Konfigurasi Supabase Storage untuk Migrasi

## Setup Bucket di Supabase

1. **Buka Supabase Dashboard**
   - Login ke https://supabase.com
   - Pilih project Anda

2. **Buat Bucket `uploads`**
   - Buka menu **Storage** di sidebar
   - Klik **"New bucket"** atau **"Create bucket"**
   - Nama bucket: `uploads`
   - **Public bucket**: ✅ Centang (PENTING!)
   - Klik **"Create bucket"**

3. **Set Storage Policies (OPSIONAL - Tidak diperlukan jika menggunakan API route)**

   ⚠️ **CATATAN PENTING**: Sistem sekarang menggunakan API route `/api/upload-file` yang menggunakan **service role key** untuk bypass RLS. Jadi **tidak perlu setup Storage Policies** untuk upload.

   Jika ingin tetap menggunakan direct upload dari client (tanpa API route), baru perlu setup Storage Policies:

   **Buka SQL Editor** di Supabase Dashboard dan jalankan:
   ```sql
   -- Allow public read access
   CREATE POLICY "Public Access SELECT" 
   ON storage.objects FOR SELECT 
   USING (bucket_id = 'uploads');

   -- Allow authenticated users to upload/update/delete
   CREATE POLICY "Authenticated users can upload" 
   ON storage.objects FOR INSERT 
   WITH CHECK (bucket_id = 'uploads');

   CREATE POLICY "Authenticated users can update" 
   ON storage.objects FOR UPDATE 
   USING (bucket_id = 'uploads');

   CREATE POLICY "Authenticated users can delete" 
   ON storage.objects FOR DELETE 
   USING (bucket_id = 'uploads');
   ```

4. **Environment Variables**
   Pastikan file `.env.local` berisi:
   ```
   SERVICE_ROLE_KEY=your_service_role_key_here
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```

## Troubleshooting

### Error: "new row violates row-level security policy"
**Ini adalah masalah paling umum!**

**Solusi yang Sudah Diterapkan:**
- ✅ Sistem sekarang menggunakan API route `/api/upload-file` yang menggunakan **service role key**
- ✅ Service role key **bypasses semua RLS policies**
- ✅ **Tidak perlu setup Storage Policies** untuk upload

**Jika masih error:**
- Pastikan `SERVICE_ROLE_KEY` sudah benar di `.env.local`
- Restart development server setelah mengubah `.env.local`
- Pastikan API route `/api/upload-file` bisa diakses

### Error: "Bucket not found"
- Pastikan bucket `uploads` sudah dibuat di Supabase Dashboard
- Pastikan nama bucket tepat: `uploads` (dengan "s")

### Error: "Permission denied" atau "Access denied"
- Pastikan bucket diset sebagai **Public**
- Pastikan `SERVICE_ROLE_KEY` benar di `.env.local`

### Error: "SERVICE_ROLE_KEY is not set"
- Pastikan `.env.local` ada di root project
- Pastikan SERVICE_ROLE_KEY sudah di-set dengan benar
- Restart development server setelah mengubah `.env.local`

## Cara Kerja Upload Saat Ini

1. **Client mengirim file** → API route `/api/upload-file`
2. **API route menggunakan** → `supabaseAdmin` (service role key)
3. **Service role key** → Bypasses semua RLS policies
4. **Upload berhasil** → Return full URL Supabase Storage

**Keuntungan:**
- ✅ Tidak perlu setup Storage Policies yang kompleks
- ✅ Lebih aman karena menggunakan service role key di server-side
- ✅ Bypasses RLS secara otomatis


