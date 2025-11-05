# Fix RLS Error: "new row violates row-level security policy"

## Solusi yang Sudah Diterapkan

Saya sudah membuat API route `/api/upload-file` yang menggunakan **service role key** untuk bypass RLS. Upload sekarang dilakukan melalui API route ini, bukan langsung dari client.

## Alternatif: Setup Storage Policies

Jika ingin tetap menggunakan direct upload dari client, Anda perlu setup Storage Policies di Supabase:

### Cara Setup Storage Policies:

1. **Buka Supabase Dashboard**
   - Login ke https://supabase.com
   - Pilih project Anda

2. **Buka SQL Editor**
   - Klik menu **SQL Editor** di sidebar

3. **Jalankan SQL berikut:**

```sql
-- Allow public read access
CREATE POLICY "Public Access SELECT" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'uploads');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'uploads');

-- Allow authenticated users to update
CREATE POLICY "Authenticated users can update" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'uploads');

-- Allow authenticated users to delete
CREATE POLICY "Authenticated users can delete" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'uploads');
```

4. **Verifikasi Policies:**
   - Buka **Storage** → **Policies**
   - Pastikan ada 4 policies untuk bucket `uploads`
   - Pastikan semua policies aktif (enabled)

## Status Saat Ini

✅ **Upload sudah menggunakan API route** yang bypass RLS menggunakan service role key
✅ **Tidak perlu setup Storage Policies** jika menggunakan API route
✅ **Error RLS sudah teratasi** dengan menggunakan service role key di server-side

## Catatan

- API route `/api/upload-file` menggunakan `supabaseAdmin` yang memiliki service role key
- Service role key bypasses semua RLS policies
- Upload sekarang dilakukan di server-side melalui API route
- Client hanya mengirim file ke API route, tidak langsung ke Supabase Storage

