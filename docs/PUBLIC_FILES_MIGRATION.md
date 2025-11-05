# Panduan Migrasi File dari Public Folder ke Supabase Storage

## Cara Menjalankan Migrasi Semua File

### Langkah-langkah:

1. **Login ke Admin Panel**
   - Buka `/admin/login`
   - Login dengan kredensial admin

2. **Akses Halaman Migrate**
   - Klik menu **"Migrate Files"** di sidebar admin
   - Atau akses langsung ke `/admin/migrate`

3. **Scan Semua File (Pertama Kali)**
   - Pastikan checkbox **"Scan semua file di public folder"** sudah dicentang
   - Klik tombol **"Scan Files"**
   - Tunggu proses scan selesai
   - Sistem akan menampilkan semua file yang ditemukan

4. **Review File yang Akan Di-migrate**
   - Lihat daftar file yang ditemukan
   - Pastikan semua file yang diperlukan sudah termasuk
   - File akan di-migrate dengan struktur folder yang sama:
     - File di root `public/` → `static/` di Supabase Storage
     - File di `public/rides/` → `rides/` di Supabase Storage
     - File di `public/stories/` → `stories/` di Supabase Storage
     - File di `public/testimonials/` → `testimonials/` di Supabase Storage

5. **Jalankan Migrasi**
   - Klik tombol **"Start Migration"**
   - Konfirmasi dialog yang muncul
   - Tunggu proses migrasi selesai (bisa memakan waktu jika banyak file)

6. **Review Hasil**
   - Lihat summary migrasi (Total, Success, Failed)
   - Review detail hasil untuk setiap file
   - Copy URL baru jika diperlukan untuk update manual

## File yang Akan Di-scan

Sistem akan otomatis scan **semua file** di folder `public/` termasuk:
- ✅ File di root: `hero-bg.png`, `hero-pic-obj.png`, `placeholder.svg`, dll
- ✅ File di subfolder: `rides/`, `stories/`, `testimonials/`
- ✅ Struktur folder akan tetap terjaga

**File yang DI-SKIP**:
- ❌ Folder hidden (dimulai dengan `.`)
- ❌ File hidden (`.gitkeep`, `.DS_Store`, dll)
- ❌ File non-image/video (misalnya `robots.txt`, dll)

**Folder yang DI-INCLUDE**:
- ✅ Folder `general_setting/` (sekarang juga di-migrate karena akan bisa di add/edit/delete)
- ✅ Semua folder lainnya (`rides/`, `stories/`, `testimonials/`, dll)

## Struktur Migrasi

```
public/
├── hero-bg.png          → static/hero-bg.png
├── placeholder.svg      → static/placeholder.svg
├── rides/
│   ├── primary/
│   │   └── file.jpg     → rides/primary/file.jpg
│   └── gallery/
│       └── image.jpg    → rides/gallery/image.jpg
└── stories/
    └── video.mp4        → stories/video.mp4
```

## Setelah Migrasi

Setelah migrasi berhasil:
1. **File akan tersimpan di Supabase Storage** dengan struktur folder yang sama
2. **URL baru akan muncul** di hasil migrasi
3. **Update kode/database** jika diperlukan untuk menggunakan URL baru:
   - File yang sudah di-migrate akan otomatis menggunakan Supabase Storage URL
   - Sistem sudah mendukung backward compatibility
4. **File lama di public folder** bisa tetap ada sebagai backup atau dihapus

## Manfaat Migrasi Semua File

✅ **Centralized Storage**: Semua file terpusat di Supabase Storage
✅ **Easy Updates**: Mudah untuk update/mengganti file melalui admin panel
✅ **Easy Management**: Semua file bisa dikelola dari satu tempat
✅ **CDN Ready**: File siap untuk CDN dan optimasi
✅ **Backup Friendly**: Lebih mudah untuk backup dan restore

## Catatan Penting

- Pastikan **bucket `uploads` sudah dibuat** di Supabase dan diset sebagai **public**
- Pastikan **environment variables** sudah di-set dengan benar
- File yang sudah di-migrate akan tersimpan dengan struktur folder yang sama
- Sistem akan otomatis menggunakan Supabase Storage URL untuk file baru

## Troubleshooting

### Error: "Failed to scan public folder"
- Pastikan development server berjalan (`npm run dev`)
- Pastikan folder `public/` ada dan bisa diakses
- Check console untuk detail error

### Error: "Upload failed"
- Pastikan Supabase credentials benar
- Pastikan bucket `uploads` sudah dibuat dan public
- Check network connection
- Pastikan file tidak terlalu besar (max 50MB per file)

### File tidak muncul setelah migrasi
- Pastikan bucket diset sebagai public
- Check URL yang dihasilkan di hasil migrasi
- Verify file sudah terupload di Supabase Dashboard

### Scan tidak menemukan file
- Pastikan file ada di folder `public/`
- Check apakah file tidak di-skip (hidden files, general_setting folder)
- Pastikan struktur folder benar



