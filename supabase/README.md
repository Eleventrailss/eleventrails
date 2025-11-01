# ElevenTrails Database Schema

Rancangan database untuk aplikasi ElevenTrails menggunakan Supabase PostgreSQL.

## Struktur Tabel

### 1. `users`
Tabel untuk menyimpan data user/admin.

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key (auto-generated) |
| email | VARCHAR(255) | Email user (unique) |
| password | VARCHAR(255) | Password (hashed) |
| created_at | TIMESTAMP | Waktu dibuat |
| updated_at | TIMESTAMP | Waktu terakhir update |

### 2. `stories`
Tabel untuk menyimpan artikel/stories.

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key (auto-generated) |
| title | VARCHAR(255) | Judul story |
| pic | TEXT | URL gambar story |
| author | VARCHAR(255) | Nama penulis (optional) |
| stories_detail | TEXT | Detail/konten lengkap story |
| tags | TEXT[] | Array of tags (e.g., ['Adventure', 'Trail Riding']) |
| is_active | BOOLEAN | Status aktif/non-aktif |
| created_at | TIMESTAMP | Waktu dibuat |
| updated_at | TIMESTAMP | Waktu terakhir update |

### 3. `rides`
Tabel utama untuk menyimpan data rides/trails.

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key (auto-generated) |
| title | VARCHAR(255) | Judul ride |
| tags | TEXT[] | Array of tags (e.g., ['Easy', 'Family', 'Nature']) |
| short_description | TEXT | Deskripsi singkat |
| description | TEXT | Deskripsi lengkap |
| primary_picture | TEXT | URL gambar utama |
| secondary_picture | TEXT | URL gambar kedua |
| original_price | DECIMAL(10,2) | Harga asli |
| final_price | DECIMAL(10,2) | Harga final (setelah diskon) |
| type | VARCHAR(50) | Tipe ride: 'group' atau 'personal' |
| duration | VARCHAR(100) | Durasi ride (e.g., '7 Hours') |
| location | VARCHAR(255) | Lokasi ride |
| meeting_point | VARCHAR(255) | Titik pertemuan |
| difficulty_level | VARCHAR(50) | Level kesulitan (e.g., 'Easy-Medium') |
| whatsapp_message | TEXT | Pesan default untuk WhatsApp |
| is_active | BOOLEAN | Status aktif/non-aktif |
| created_at | TIMESTAMP | Waktu dibuat |
| updated_at | TIMESTAMP | Waktu terakhir update |

### 4. `ride_infos`
Tabel untuk menyimpan multiple info/FAQ untuk setiap ride.

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key (auto-generated) |
| ride_id | UUID | Foreign key ke rides.id |
| name | VARCHAR(255) | Nama info (e.g., 'Duration', 'Location') |
| icon | VARCHAR(255) | Nama icon (e.g., 'Clock', 'MapPin') |
| question | TEXT | Pertanyaan |
| answer | TEXT | Jawaban |
| display_order | INTEGER | Urutan tampil |
| created_at | TIMESTAMP | Waktu dibuat |
| updated_at | TIMESTAMP | Waktu terakhir update |

### 5. `ride_gallery_photos`
Tabel untuk menyimpan multiple foto gallery untuk setiap ride.

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key (auto-generated) |
| ride_id | UUID | Foreign key ke rides.id |
| photo_url | TEXT | URL foto |
| alt_text | VARCHAR(255) | Teks alternatif untuk gambar |
| display_order | INTEGER | Urutan tampil |
| created_at | TIMESTAMP | Waktu dibuat |

## Relasi

- `ride_infos.ride_id` → `rides.id` (One-to-Many)
- `ride_gallery_photos.ride_id` → `rides.id` (One-to-Many)

## Indexes

1. **Performance Indexes:**
   - `idx_users_email` - untuk lookup email cepat
   - `idx_stories_is_active` - untuk query stories aktif
   - `idx_rides_is_active` - untuk query rides aktif
   - `idx_rides_tags` - GIN index untuk pencarian array tags

2. **Foreign Key Indexes:**
   - `idx_ride_infos_ride_id` - untuk join dengan rides
   - `idx_ride_gallery_photos_ride_id` - untuk join dengan rides

## Row Level Security (RLS)

Semua tabel memiliki RLS enabled dengan policy:
- **Public Access:** Hanya dapat membaca data yang `is_active = true`
- **Authenticated Access:** User terautentikasi dapat melakukan semua operasi (CRUD)

## Cara Menggunakan

### 1. Jalankan Script SQL

Masuk ke Supabase Dashboard → SQL Editor → Jalankan file `schema.sql`

Atau menggunakan Supabase CLI:

```bash
supabase db reset
supabase db push
```

### 2. Setup Storage Bucket

Untuk menggunakan fitur upload gambar, buat storage bucket:

**Metode A: Via Dashboard**
1. Buka Supabase Dashboard → Storage
2. Klik "New bucket"
3. Nama: `rides`
4. Pilih Public atau Private
5. Klik "Create bucket"

**Metode B: Via SQL**
Jalankan script `storage-setup.sql` di SQL Editor untuk membuat bucket dan policy secara otomatis.

### 2. Insert Data Contoh

Lihat file `examples.sql` untuk contoh query insert data.

### 3. Query dengan View

Gunakan view `rides_with_details` untuk mendapatkan data ride beserta infos dan gallery photos:

```sql
SELECT * FROM rides_with_details WHERE id = 'ride-uuid';
```

## Catatan Penting

1. **Password:** Pastikan untuk hash password sebelum menyimpan ke database
2. **Tags:** Gunakan array format: `ARRAY['Easy', 'Family', 'Nature']`
3. **Images:** Simpan URL lengkap atau path relatif ke storage
4. **Cascade Delete:** Menghapus ride akan otomatis menghapus ride_infos dan ride_gallery_photos terkait

