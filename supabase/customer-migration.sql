-- Migration untuk tabel customer
-- Jalankan script ini di Supabase SQL Editor

CREATE TABLE IF NOT EXISTS customer (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  information_from VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Buat index untuk email dan created_at
CREATE INDEX IF NOT EXISTS idx_customer_email ON customer(email);
CREATE INDEX IF NOT EXISTS idx_customer_created_at ON customer(created_at DESC);

-- Buat trigger untuk update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_customer_updated_at BEFORE UPDATE
    ON customer FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Tambahkan komentar untuk dokumentasi
COMMENT ON TABLE customer IS 'Tabel untuk menyimpan data customer dari form CTA';
COMMENT ON COLUMN customer.name IS 'Nama lengkap customer';
COMMENT ON COLUMN customer.email IS 'Email address customer';
COMMENT ON COLUMN customer.phone IS 'Nomor telepon customer';
COMMENT ON COLUMN customer.message IS 'Pesan dari customer';
COMMENT ON COLUMN customer.information_from IS 'Sumber informasi bagaimana customer mengetahui kami';

