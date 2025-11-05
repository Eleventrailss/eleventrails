# Panduan Setup SEO dan Google Search Console

## ✅ Komponen SEO yang Sudah Terpasang

Website Anda sudah dilengkapi dengan komponen SEO berikut:

1. **Metadata Lengkap** (`app/layout.tsx`)
   - Title tags dengan template
   - Meta descriptions
   - Keywords
   - Open Graph tags (Facebook, LinkedIn)
   - Twitter Card tags
   - Canonical URLs
   - Google Site Verification

2. **Structured Data (JSON-LD)** (`components/structured-data.tsx`)
   - TouristTrip schema
   - LocalBusiness schema
   - WebSite schema

3. **Sitemap.xml** (`app/sitemap.ts`)
   - Semua halaman utama sudah terdaftar
   - Priority dan change frequency sudah dikonfigurasi

4. **Robots.txt** (`public/robots.txt`)
   - Mengizinkan crawling semua halaman publik
   - Memblokir `/admin/` dan `/api/`

## 🚀 Langkah-Langkah Setelah Mendaftar di Google Search Console

### 1. Verifikasi Website di Google Search Console

Setelah menambahkan `GOOGLE_SITE_VERIFICATION` di `.env`:

```
GOOGLE_SITE_VERIFICATION=your-verification-code-here
```

**Langkah-langkah:**
1. Buka [Google Search Console](https://search.google.com/search-console)
2. Klik "Add Property" → pilih "URL prefix"
3. Masukkan URL website Anda (contoh: `https://eleventrails.com`)
4. Pilih metode verifikasi "HTML tag"
5. Copy kode verifikasi yang diberikan Google
6. Tambahkan ke file `.env` sebagai `GOOGLE_SITE_VERIFICATION`
7. Restart development server (`npm run dev`)
8. Deploy website ke production
9. Klik "Verify" di Google Search Console

### 2. Submit Sitemap ke Google Search Console

Setelah website terverifikasi:

1. Di Google Search Console, pilih property website Anda
2. Klik menu "Sitemaps" di sidebar kiri
3. Masukkan URL sitemap: `https://eleventrails.com/sitemap.xml`
4. Klik "Submit"

### 3. Request Indexing untuk Halaman Penting

Setelah submit sitemap, request indexing manual untuk halaman utama:

1. Di Google Search Console, gunakan "URL Inspection" tool
2. Masukkan URL halaman utama (contoh: `https://eleventrails.com`)
3. Klik "Request Indexing"
4. Ulangi untuk halaman penting lainnya:
   - `/about`
   - `/rides`
   - `/stories`
   - `/faq`

### 4. Monitoring dan Optimasi

**Setelah 1-2 minggu:**
- Cek "Coverage" di Google Search Console untuk melihat halaman yang terindex
- Cek "Performance" untuk melihat pencarian yang muncul
- Perbaiki error jika ada (404, duplicate content, dll)

**Tips Optimasi:**
- Update konten secara rutin untuk meningkatkan fresh content
- Tambahkan konten berkualitas dengan keyword yang relevan
- Pastikan semua gambar memiliki alt text
- Pastikan website mobile-friendly (sudah responsive)
- Pastikan loading speed cepat

## 📋 Checklist SEO

- [x] Metadata lengkap (title, description, keywords)
- [x] Open Graph tags
- [x] Twitter Card tags
- [x] Structured Data (JSON-LD)
- [x] Sitemap.xml
- [x] Robots.txt
- [x] Google Site Verification
- [x] Canonical URLs
- [ ] Google Search Console terverifikasi
- [ ] Sitemap submitted ke Google
- [ ] Request indexing untuk halaman utama
- [ ] Monitoring di Google Search Console

## 🔍 Cara Mengecek Apakah Website Sudah Terindex

1. **Via Google Search:**
   ```
   site:eleventrails.com
   ```

2. **Via Google Search Console:**
   - Klik "Coverage" → lihat "Valid" pages

3. **Via URL Inspection:**
   - Gunakan tool "URL Inspection" di Google Search Console
   - Masukkan URL halaman → lihat status indexing

## ⚠️ Catatan Penting

1. **Proses Indexing Butuh Waktu:**
   - Indexing awal bisa memakan waktu 1-4 minggu
   - Setelah submit sitemap, Google akan mulai crawling
   - Tidak semua halaman akan langsung muncul di hasil pencarian

2. **Pastikan Environment Variables:**
   - `NEXT_PUBLIC_SITE_URL` sudah diisi dengan URL production
   - `GOOGLE_SITE_VERIFICATION` sudah diisi dengan kode verifikasi

3. **Update Sitemap Secara Berkala:**
   - Jika menambah halaman baru, update `app/sitemap.ts`
   - Google akan otomatis mendeteksi perubahan sitemap

4. **Konten Berkualitas:**
   - Fokus pada konten yang relevan dan berkualitas
   - Gunakan keyword yang natural, jangan keyword stuffing
   - Update konten secara rutin

## 📞 Troubleshooting

**Website tidak muncul di Google setelah 4 minggu:**
- Cek apakah website sudah terverifikasi di Google Search Console
- Cek apakah sitemap sudah di-submit
- Cek "Coverage" untuk melihat apakah ada error
- Pastikan robots.txt tidak memblokir crawling
- Pastikan website accessible dari internet (tidak hanya localhost)

**Sitemap tidak bisa diakses:**
- Pastikan `NEXT_PUBLIC_SITE_URL` sudah benar
- Cek apakah sitemap bisa diakses di `https://eleventrails.com/sitemap.xml`
- Pastikan website sudah di-deploy ke production

