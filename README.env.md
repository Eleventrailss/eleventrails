# Environment Variables Setup

## Supabase Configuration

Untuk menggunakan Supabase, Anda perlu mengatur environment variables berikut:

1. Buat file `.env.local` di root project (copy dari `.env.example` jika ada)

2. Tambahkan variabel berikut:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Cara Mendapatkan Supabase Credentials

1. Masuk ke [Supabase Dashboard](https://app.supabase.com/)
2. Pilih project Anda atau buat project baru
3. Pergi ke **Settings** → **API**
4. Copy nilai berikut:
   - **Project URL** → untuk `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → untuk `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Contoh File .env.local

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Catatan Penting

- **JANGAN** commit file `.env.local` ke repository (sudah ada di `.gitignore`)
- Variabel yang diawali dengan `NEXT_PUBLIC_` akan di-expose ke client-side
- Restart development server setelah menambahkan environment variables baru

## Menggunakan Supabase Client

Setelah environment variables diatur, Anda dapat menggunakan Supabase client di aplikasi:

```typescript
import { supabase } from '@/lib/supabase'

// Contoh penggunaan
const { data, error } = await supabase
  .from('rides')
  .select('*')
```

