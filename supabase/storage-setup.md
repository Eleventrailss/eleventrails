# Cara Membuat Bucket Storage di Supabase

## Metode 1: Menggunakan Supabase Dashboard (Recommended)

### Langkah-langkah:

1. **Buka Supabase Dashboard**
   - Masuk ke [https://app.supabase.com/](https://app.supabase.com/)
   - Pilih project Anda

2. **Masuk ke Storage**
   - Di sidebar kiri, klik **Storage** (atau ikon folder)
   - Atau langsung ke: Project Settings → Storage

3. **Buat Bucket Baru**
   - Klik tombol **"New bucket"** atau **"Create bucket"**
   - Masukkan nama bucket: **`rides`**
   - Pilih visibility:
     - **Public**: Jika ingin gambar bisa diakses langsung via URL
     - **Private**: Jika ingin gambar hanya diakses melalui authenticated requests
   - Klik **"Create bucket"**

4. **Atur Policies (Opsional)**
   - Setelah bucket dibuat, klik bucket **"rides"**
   - Pergi ke tab **"Policies"**
   - Klik **"New Policy"** untuk membuat policy jika diperlukan
   - Untuk public bucket, biasanya sudah bisa diakses tanpa policy tambahan

## Metode 2: Menggunakan SQL Editor (Advanced)

### Langkah-langkah:

1. **Buka SQL Editor**
   - Di Supabase Dashboard, klik **SQL Editor** di sidebar kiri

2. **Jalankan Script SQL**
   - Copy dan paste script berikut:
   ```sql
   -- Membuat bucket "rides" sebagai public
   INSERT INTO storage.buckets (id, name, public)
   VALUES ('rides', 'rides', true)
   ON CONFLICT (id) DO NOTHING;
   ```

3. **Atur Policy untuk Upload (jika perlu)**
   ```sql
   -- Policy untuk allow authenticated users upload
   CREATE POLICY "Allow authenticated uploads"
   ON storage.objects FOR INSERT
   TO authenticated
   WITH CHECK (bucket_id = 'rides');

   -- Policy untuk allow authenticated users update
   CREATE POLICY "Allow authenticated updates"
   ON storage.objects FOR UPDATE
   TO authenticated
   USING (bucket_id = 'rides');

   -- Policy untuk allow authenticated users delete
   CREATE POLICY "Allow authenticated deletes"
   ON storage.objects FOR DELETE
   TO authenticated
   USING (bucket_id = 'rides');
   ```

4. **Policy untuk Public Read (jika bucket public)**
   ```sql
   -- Policy untuk allow public read
   CREATE POLICY "Allow public read"
   ON storage.objects FOR SELECT
   TO public
   USING (bucket_id = 'rides');
   ```

## Folder Structure di Bucket

Setelah bucket dibuat, struktur folder yang akan digunakan:
```
rides/
├── primary/
│   └── [timestamp].[ext]
├── secondary/
│   └── [timestamp].[ext]
└── gallery/
    └── [timestamp].[ext]
```

## Catatan Penting

1. **Public vs Private Bucket:**
   - **Public**: Gambar bisa diakses langsung via URL tanpa authentication
   - **Private**: Gambar hanya bisa diakses melalui authenticated requests

2. **Storage Limits:**
   - Free tier: 1 GB storage
   - Pro tier: 100 GB storage
   - Pastikan tidak melebihi limit

3. **File Size Limits:**
   - Default: 50 MB per file
   - Bisa diubah di bucket settings

4. **File Formats:**
   - Disarankan: JPG, PNG, WebP
   - Hindari format yang terlalu besar

## Testing Upload

Setelah bucket dibuat, Anda bisa test dengan:

1. Upload file manual melalui Dashboard
2. Atau test dari aplikasi dengan form add rides

## Troubleshooting

### Error: "Bucket not found"
- Pastikan bucket sudah dibuat dengan nama tepat **"rides"**
- Pastikan bucket sudah di-set sebagai public atau policy sudah diatur

### Error: "Access denied"
- Cek policy bucket
- Pastikan RLS (Row Level Security) sudah diatur dengan benar
- Untuk public bucket, pastikan policy "Allow public read" sudah dibuat

### Error: "File too large"
- Perkecil ukuran file gambar
- Atau ubah limit file size di bucket settings

