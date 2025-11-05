# Debug Supabase Migration

Coba jalankan migrasi lagi dan periksa:

1. **Di UI hasil migrasi** - scroll ke bawah bagian "Migration Results", setiap file yang gagal akan menampilkan error detail (text merah)

2. **Di terminal server** - buka terminal dimana `npm run dev` berjalan, lihat console log untuk error detail

3. **Di browser console** - buka Developer Tools (F12), tab Console, lihat apakah ada error

4. **Periksa Environment Variables**:
   - Pastikan `.env.local` ada dan berisi:
     ```
     SERVICE_ROLE_KEY=your_service_role_key
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
     ```

5. **Periksa Supabase Dashboard**:
   - Bucket `upload` sudah dibuat
   - Bucket diset sebagai **Public**
   - Storage policies sudah dikonfigurasi dengan benar

Jika masih gagal, silakan copy error message yang muncul di bagian "Migration Results" untuk setiap file yang gagal, atau screenshot error yang muncul.

