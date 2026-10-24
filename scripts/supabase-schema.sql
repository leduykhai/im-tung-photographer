-- ==============================================================================
-- BẢNG LƯU TRỮ LEAD TƯ VẤN - I'M TUNG PHOTOGRAPHER
-- Chạy đoạn script SQL này trong SQL Editor của Supabase để tạo bảng và chỉ mục.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    phone_e164 TEXT NOT NULL,
    wedding_date DATE,
    email TEXT,
    zalo_number TEXT,
    province TEXT,
    venue TEXT,
    service TEXT,
    preferred_channel TEXT NOT NULL DEFAULT 'phone',
    message TEXT,
    album_id TEXT,
    album_slug TEXT,
    album_title TEXT,
    album_url TEXT,
    source_page TEXT,
    form_location TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    consent_given BOOLEAN NOT NULL DEFAULT true,
    consent_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    privacy_policy_version TEXT NOT NULL
);

-- Bật tính năng Row Level Security (RLS) để bảo vệ dữ liệu khách hàng
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Tạo chính sách bảo mật: KHÔNG cho phép Anonymous đọc hoặc ghi trực tiếp
-- Next.js Server Route kết nối bằng Service Role Key có toàn quyền ghi phía máy chủ
CREATE POLICY "Cho phep Service Role quan tri toan quyen"
    ON public.leads
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Các chỉ mục tăng tốc độ lọc và tìm kiếm danh sách khách hàng
CREATE INDEX IF NOT EXISTS idx_leads_submitted_at ON public.leads (submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_phone ON public.leads (phone);
CREATE INDEX IF NOT EXISTS idx_leads_album_slug ON public.leads (album_slug);
