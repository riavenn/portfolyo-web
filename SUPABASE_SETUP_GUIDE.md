# Supabase Kurulum Rehberi

## 1. Supabase Projesine Giriş

1. [Supabase Dashboard](https://app.supabase.com) adresine gidin
2. Projenize giriş yapın (URL: https://hejpvppgpsgyznsknfov.supabase.co)
3. Sol menüden **SQL Editor** seçeneğine tıklayın

## 2. Veritabanı Tablolarını Oluşturma

### Adım 1: SQL Editor'da Yeni Sorgu Oluşturun

1. SQL Editor sayfasında **New query** butonuna tıklayın
2. Aşağıdaki SQL kodunu kopyalayıp yapıştırın:

```sql
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
```

3. **RUN** butonuna tıklayarak SQL kodunu çalıştırın

### Adım 2: Tabloları Doğrulayın

1. Sol menüden **Table Editor** seçeneğine tıklayın
2. Aşağıdaki tabloların oluşturulduğunu kontrol edin:
   - `projects`
   - `site_content`
   - `form_submissions`

## 3. Başlangıç Verilerini Ekleme

### Site İçeriği Verisi Ekleme

1. **Table Editor** > **site_content** tablosuna gidin
2. **Insert** > **Insert row** seçeneğine tıklayın
3. Aşağıdaki JSON verisini `content` alanına yapıştırın:

```json
{
  "hero": {
    "title": "Merhaba, Ben [Adınız]",
    "subtitle": "Full Stack Developer",
    "description": "Modern web teknolojileri ile yaratıcı çözümler geliştiriyorum."
  },
  "about": {
    "title": "Hakkımda",
    "description": "Teknoloji tutkunu bir geliştiriciyim. Modern web teknolojileri ile kullanıcı dostu ve performanslı uygulamalar geliştirmeyi seviyorum.",
    "skills": ["React", "Node.js", "JavaScript", "Python", "SQL"]
  },
  "contact": {
    "title": "İletişim",
    "email": "your-email@example.com",
    "phone": "+90 XXX XXX XX XX",
    "address": "İstanbul, Türkiye"
  }
}
```

### Örnek Proje Verisi Ekleme

1. **Table Editor** > **projects** tablosuna gidin
2. **Insert** > **Insert row** seçeneğine tıklayın
3. Aşağıdaki örnek verileri ekleyin:

**Proje 1:**
- `project_id`: 1
- `title`: "E-Ticaret Sitesi"
- `image_url`: "https://via.placeholder.com/400x300"
- `demo_url`: "https://example.com"

**Proje 2:**
- `project_id`: 2
- `title`: "Blog Uygulaması"
- `image_url`: "https://via.placeholder.com/400x300"
- `demo_url`: "https://example.com"

## 4. Authentication Ayarları (Opsiyonel)

### Admin Paneli İçin Authentication

1. Sol menüden **Authentication** seçeneğine tıklayın
2. **Settings** sekmesine gidin
3. **Site URL** alanına `http://localhost:3001` ekleyin
4. **Redirect URLs** alanına aşağıdaki URL'leri ekleyin:
   - `http://localhost:3001`
   - `http://localhost:3001/admin`

### Email Templates (Opsiyonel)

1. **Authentication** > **Email Templates** sekmesine gidin
2. Gerekirse email şablonlarını özelleştirin

## 5. API Keys Kontrolü

1. Sol menüden **Settings** > **API** seçeneğine tıklayın
2. Aşağıdaki anahtarların `.env` dosyasındaki değerlerle eşleştiğini kontrol edin:
   - **Project URL**: `https://hejpvppgpsgyznsknfov.supabase.co`
   - **anon public key**: `.env` dosyasındaki `REACT_APP_SUPABASE_ANON_KEY` ile eşleşmeli

## 6. Real-time Ayarları

1. Sol menüden **Database** > **Replication** seçeneğine tıklayın
2. Aşağıdaki tabloların **Real-time** özelliğinin aktif olduğunu kontrol edin:
   - `projects`
   - `site_content`
   - `form_submissions`

## 7. Test Etme

### Otomatik Bağlantı Testi

Uygulama artık otomatik olarak Supabase bağlantısını test eder:

1. Web uygulamanızı başlatın: `npm start`
2. Ana sayfada loading ekranında Supabase durumunu göreceksiniz:
   - ✅ **Supabase: Bağlı** - Bağlantı başarılı
   - ❌ **Supabase: Bağlantı Hatası** - Bağlantı problemi var

3. Admin paneline gidin: `http://localhost:3001/admin`
4. Admin panelinde de detaylı Supabase durumunu görebilirsiniz:
   - Bağlantı durumu
   - Tablo varlık kontrolü
   - Her tabloda veri olup olmadığı

### Manuel Test İşlemleri

Aşağıdaki işlemleri test edin:
- Proje ekleme/düzenleme/silme
- Site içeriği güncelleme
- İletişim formu gönderimi
- Real-time güncellemelerin çalışması

### Console Logları

Tarayıcı console'unda (F12) aşağıdaki logları görebilirsiniz:
- 🔄 Supabase bağlantısı test ediliyor...
- ✅ Supabase bağlantısı başarılı!
- 📊 Mevcut site_content verisi
- 📋 Tablo durumu

## Sorun Giderme

### Bağlantı Sorunları
- `.env` dosyasındaki Supabase URL ve API key'lerini kontrol edin
- Supabase projesinin aktif olduğundan emin olun

### RLS Politika Sorunları
- Admin işlemleri için authentication gereklidir
- Geliştirme aşamasında RLS'yi geçici olarak devre dışı bırakabilirsiniz

### Real-time Sorunları
- Supabase Dashboard'da Real-time özelliğinin aktif olduğunu kontrol edin
- Browser console'da WebSocket bağlantı hatalarını kontrol edin

## Güvenlik Notları

1. **Production'da mutlaka yapın:**
   - RLS politikalarını gözden geçirin
   - API key'leri güvenli tutun
   - HTTPS kullanın
   - Gereksiz politikaları kaldırın

2. **Geliştirme aşamasında:**
   - Test verileri kullanın
   - Gerçek email adresleri kullanmayın
   - API key'leri paylaşmayın

Bu rehberi takip ederek Supabase ayarlarınızı tamamlayabilirsiniz. Herhangi bir sorunla karşılaştığınızda, Supabase Dashboard'daki logları kontrol edin.