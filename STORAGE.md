# Storage Structure - Local File System

Gambar akan disimpan di folder `public` dengan struktur berikut:

## Struktur Folder

```
public/
├── rides/
│   ├── primary/
│   │   └── [timestamp].[ext]        # Primary picture untuk rides
│   ├── secondary/
│   │   └── [timestamp].[ext]        # Secondary picture untuk rides
│   └── gallery/
│       └── [timestamp].[ext]         # Gallery photos untuk rides
│
└── stories/
    └── [timestamp].[ext]              # Picture untuk stories
```

## Cara Kerja

1. **Upload via API Route** (`/api/upload`)
   - File di-upload ke server
   - Server menyimpan file ke folder `public/{folder}/{subfolder}/`
   - Server mengembalikan URL public (contoh: `/rides/primary/1234567890.jpg`)

2. **URL yang Dihasilkan**
   - Rides Primary: `/rides/primary/1234567890.jpg`
   - Rides Secondary: `/rides/secondary/1234567890.jpg`
   - Rides Gallery: `/rides/gallery/1234567890.jpg`
   - Stories: `/stories/1234567890.jpg`

3. **Auto Create Folder**
   - Folder akan otomatis dibuat jika belum ada
   - Menggunakan `fs.mkdir` dengan recursive option

## Keuntungan

- ✅ Tidak perlu setup Supabase Storage
- ✅ File langsung tersedia via public URL
- ✅ Mudah di-manage dan di-backup
- ✅ Tidak ada limit storage dari Supabase

## Catatan

- Pastikan folder `public` memiliki permission write
- File akan tersimpan permanen di server
- Direkomendasikan untuk backup folder `public` secara rutin
- Untuk production, pertimbangkan menggunakan CDN atau object storage yang lebih scalable

