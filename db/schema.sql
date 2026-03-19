-- =============================================
-- LinkedIn Deal Magnet - Supabase Schema
-- =============================================
-- Run this in: Supabase Dashboard > SQL Editor
-- Prerequisites: None (uses built-in gen_random_uuid())
-- =============================================

-- =============================================
-- 1. USERS TABLE
-- =============================================
create table if not exists users (
    id uuid primary key default gen_random_uuid(),
    linkedin_id text unique not null,
    email text,
    name text,
    headline text,
    picture_url text,
    access_token text,
    onboarding_complete boolean default false,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- =============================================
-- 2. COMPANY PROFILES TABLE
-- =============================================
create table if not exists company_profiles (
    id uuid primary key default gen_random_uuid(),
    user_id uuid unique not null references users(id) on delete cascade,
    naics_codes text[] default '{}',
    certifications text[] default '{}',
    past_agencies text[] default '{}',
    capabilities_statement text default '',
    other_certifications text default '',
    business_type text default '',
    zip_code text default '',
    veteran_status text default '',
    goods_or_services text default '',
    company_name text default '',
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- =============================================
-- 3. CONTENT LIBRARY TABLE
-- =============================================
create table if not exists content_library (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references users(id) on delete cascade,
    title text,
    content text,
    template_type text default '',
    agency_target text default '',
    pain_point text default '',
    hashtags text[] default '{}',
    geo_optimized boolean default false,
    is_favorite boolean default false,
    status text default 'draft',
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- =============================================
-- 4. AUDITS TABLE (Phase 1 LinkedIn Optimizer)
-- =============================================
create table if not exists audits (
    id uuid primary key default gen_random_uuid(),
    email text,
    linkedin_url text,
    score integer,
    score_label text,
    ai_headline text,
    fixes jsonb default '[]',
    profile_data jsonb default '{}',
    is_paid boolean default false,
    referrer text,
    created_at timestamptz default now()
);

-- =============================================
-- 5. SCHEDULED POSTS TABLE
-- =============================================
create table if not exists scheduled_posts (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references users(id) on delete cascade,
    title text default 'Scheduled Post',
    content text,
    scheduled_date timestamptz not null,
    library_id uuid references content_library(id) on delete set null,
    status text default 'scheduled',
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- =============================================
-- INDEXES
-- =============================================
create index if not exists idx_company_profiles_user_id on company_profiles(user_id);
create index if not exists idx_content_library_user_id on content_library(user_id);
create index if not exists idx_content_library_status on content_library(user_id, status);
create index if not exists idx_content_library_favorite on content_library(user_id, is_favorite);
create index if not exists idx_scheduled_posts_user_id on scheduled_posts(user_id);
create index if not exists idx_scheduled_posts_date on scheduled_posts(user_id, scheduled_date);
create index if not exists idx_scheduled_posts_status on scheduled_posts(user_id, status);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
alter table users enable row level security;
alter table company_profiles enable row level security;
alter table content_library enable row level security;
alter table scheduled_posts enable row level security;

-- Service role bypass: Since the app uses SUPABASE_SERVICE_KEY (service role),
-- it bypasses RLS automatically. These policies are for future client-side access.

-- Users: can read/update their own row
create policy "Users can view own data"
    on users for select
    using (auth.uid() = id);

create policy "Users can update own data"
    on users for update
    using (auth.uid() = id);

-- Company profiles: tied to user
create policy "Users can view own profile"
    on company_profiles for select
    using (auth.uid() = user_id);

create policy "Users can manage own profile"
    on company_profiles for all
    using (auth.uid() = user_id);

-- Content library: tied to user
create policy "Users can view own content"
    on content_library for select
    using (auth.uid() = user_id);

create policy "Users can manage own content"
    on content_library for all
    using (auth.uid() = user_id);

-- Scheduled posts: tied to user
create policy "Users can view own posts"
    on scheduled_posts for select
    using (auth.uid() = user_id);

create policy "Users can manage own posts"
    on scheduled_posts for all
    using (auth.uid() = user_id);
