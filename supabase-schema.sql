-- Supabase Veritabanı Şeması
-- Bu SQL kodlarını Supabase Dashboard > SQL Editor'da çalıştırın

-- 1. Projeler tablosu
CREATE TABLE IF NOT EXISTS projects (
  id BIGSERIAL PRIMARY KEY,
  project_id INTEGER,
  title TEXT NOT NULL,
  image_url TEXT,
  demo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Site içeriği tablosu
CREATE TABLE IF NOT EXISTS site_content (
  id INTEGER PRIMARY KEY DEFAULT 1,
  content JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Form gönderileri tablosu
CREATE TABLE IF NOT EXISTS form_submissions (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. RLS (Row Level Security) politikaları
-- Projeler için RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Projeler herkese açık" ON projects
  FOR SELECT USING (true);

CREATE POLICY "Projeler admin tarafından yönetilebilir" ON projects
  FOR ALL USING (auth.role() = 'authenticated');

-- Site içeriği için RLS
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Site içeriği herkese açık" ON site_content
  FOR SELECT USING (true);

CREATE POLICY "Site içeriği admin tarafından yönetilebilir" ON site_content
  FOR ALL USING (auth.role() = 'authenticated');

-- Form gönderileri için RLS
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Form gönderileri herkese eklenebilir" ON form_submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Form gönderileri admin tarafından görülebilir" ON form_submissions
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Form gönderileri admin tarafından silinebilir" ON form_submissions
  FOR DELETE USING (auth.role() = 'authenticated');

-- 5. Trigger fonksiyonları
-- Updated_at otomatik güncelleme
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Projeler tablosu için trigger
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Site içeriği tablosu için trigger
CREATE TRIGGER update_site_content_updated_at
    BEFORE UPDATE ON site_content
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 6. İndeksler (performans için)
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_form_submissions_created_at ON form_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_project_id ON projects(project_id);

-- 7. Başlangıç verisi (opsiyonel)
-- Site içeriği için varsayılan kayıt
INSERT INTO site_content (id, content) VALUES (
  1,
  '{}'
) ON CONFLICT (id) DO NOTHING;