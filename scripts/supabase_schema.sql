-- ====================================================================
-- MK BUILDERS & DEVELOPERS - SUPABASE DATABASE SCHEMA
-- SQL Script for Supabase SQL Editor
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Ongoing', 'New Launch', 'Few Plots Left', 'Completed')),
    city TEXT NOT NULL,
    area TEXT NOT NULL,
    landmark TEXT DEFAULT '',
    type TEXT NOT NULL CHECK (type IN ('residential', 'commercial', 'agricultural', 'industrial')),
    sizes JSONB DEFAULT '[]'::jsonb,
    size_prices JSONB DEFAULT '[]'::jsonb,
    total_plots INT NOT NULL DEFAULT 0,
    available_plots INT NOT NULL DEFAULT 0,
    starting_price TEXT DEFAULT '',
    price_lakh NUMERIC DEFAULT NULL,
    amenities JSONB DEFAULT '[]'::jsonb,
    rera TEXT DEFAULT '',
    image TEXT NOT NULL,
    video_url TEXT DEFAULT NULL,
    gallery_images JSONB DEFAULT '[]'::jsonb,
    gallery_videos JSONB DEFAULT '[]'::jsonb,
    description TEXT NOT NULL DEFAULT '',
    progress_timeline JSONB DEFAULT '[]'::jsonb,
    layout_pdf_url TEXT DEFAULT NULL,
    nearby_places JSONB DEFAULT '[]'::jsonb,
    faqs JSONB DEFAULT '[]'::jsonb,
    map_link TEXT DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. ENQUIRIES TABLE
CREATE TABLE IF NOT EXISTS public.enquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT DEFAULT NULL,
    city TEXT DEFAULT NULL,
    project_slug TEXT DEFAULT NULL,
    project_name TEXT DEFAULT NULL,
    message TEXT DEFAULT NULL,
    status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Closed')),
    notes TEXT DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. BLOGS TABLE
CREATE TABLE IF NOT EXISTS public.blogs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    cover_image TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Real Estate',
    author TEXT NOT NULL DEFAULT 'MK Team',
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. AUTOMATIC TIMESTAMP TRIGGER
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_projects_updated_at ON public.projects;
CREATE TRIGGER set_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_enquiries_updated_at ON public.enquiries;
CREATE TRIGGER set_enquiries_updated_at BEFORE UPDATE ON public.enquiries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_blogs_updated_at ON public.blogs;
CREATE TRIGGER set_blogs_updated_at BEFORE UPDATE ON public.blogs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. INDEXES
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_city ON public.projects(city);
CREATE INDEX IF NOT EXISTS idx_projects_type ON public.projects(type);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON public.enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON public.enquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON public.blogs(slug);

-- 7. ROW LEVEL SECURITY & POLICIES (SAFE DROP & CREATE)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    -- Projects policies
    EXECUTE 'DROP POLICY IF EXISTS "Allow public read projects" ON public.projects';
    EXECUTE 'DROP POLICY IF EXISTS "Allow all access to projects" ON public.projects';
    EXECUTE 'CREATE POLICY "Allow public read projects" ON public.projects FOR SELECT USING (true)';
    EXECUTE 'CREATE POLICY "Allow all access to projects" ON public.projects FOR ALL USING (true) WITH CHECK (true)';

    -- Enquiries policies
    EXECUTE 'DROP POLICY IF EXISTS "Allow public insert enquiries" ON public.enquiries';
    EXECUTE 'DROP POLICY IF EXISTS "Allow all access to enquiries" ON public.enquiries';
    EXECUTE 'CREATE POLICY "Allow public insert enquiries" ON public.enquiries FOR INSERT WITH CHECK (true)';
    EXECUTE 'CREATE POLICY "Allow all access to enquiries" ON public.enquiries FOR ALL USING (true) WITH CHECK (true)';

    -- Blogs policies
    EXECUTE 'DROP POLICY IF EXISTS "Allow public read blogs" ON public.blogs';
    EXECUTE 'DROP POLICY IF EXISTS "Allow all access to blogs" ON public.blogs';
    EXECUTE 'CREATE POLICY "Allow public read blogs" ON public.blogs FOR SELECT USING (true)';
    EXECUTE 'CREATE POLICY "Allow all access to blogs" ON public.blogs FOR ALL USING (true) WITH CHECK (true)';
END $$;
