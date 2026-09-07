-- ==============================================================================
-- Pulse / Admark Digitals Internal Command Center - Supabase Schema
-- Run this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/mbimqqllqitjmckybyll/sql/new
-- ==============================================================================

-- 1. CLIENTS TABLE
CREATE TABLE IF NOT EXISTS public.clients (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    logo TEXT,
    industry TEXT,
    website TEXT,
    email TEXT,
    phone TEXT,
    location TEXT,
    account_manager_id TEXT,
    status TEXT DEFAULT 'Active',
    payment_terms TEXT,
    notes TEXT,
    contacts JSONB DEFAULT '[]'::jsonb,
    last_activity TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'USER',
    avatar TEXT,
    title TEXT,
    client_id TEXT,
    department TEXT,
    capacity_hours_per_week NUMERIC DEFAULT 40,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    client_id TEXT REFERENCES public.clients(id) ON DELETE SET NULL,
    description TEXT,
    project_manager_id TEXT,
    team_member_ids JSONB DEFAULT '[]'::jsonb,
    start_date TEXT,
    deadline TEXT,
    priority TEXT DEFAULT 'Medium',
    status TEXT DEFAULT 'Active',
    health JSONB DEFAULT '{}'::jsonb,
    budget JSONB DEFAULT '{"total": 0, "spent": 0, "currency": "INR"}'::jsonb,
    tech_stack JSONB DEFAULT '[]'::jsonb,
    live_url TEXT,
    repository_url TEXT,
    staging_url TEXT,
    production_url TEXT,
    figma_url TEXT,
    git_account TEXT,
    vercel_account TEXT,
    backend_provider TEXT,
    backend_account TEXT,
    progress NUMERIC DEFAULT 0,
    pinned BOOLEAN DEFAULT FALSE,
    maintenance_notes TEXT,
    uptime_sla TEXT,
    sla_target TEXT,
    maintenance_tasks JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. MODULES TABLE
CREATE TABLE IF NOT EXISTS public.modules (
    id TEXT PRIMARY KEY,
    project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    lead_id TEXT,
    progress NUMERIC DEFAULT 0,
    "order" INTEGER DEFAULT 1,
    target_date TEXT,
    status TEXT DEFAULT 'Planned',
    deliverables JSONB DEFAULT '[]'::jsonb,
    completed_deliverables JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TASKS TABLE
CREATE TABLE IF NOT EXISTS public.tasks (
    id TEXT PRIMARY KEY,
    task_number INTEGER,
    project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
    module_id TEXT,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'Todo',
    priority TEXT DEFAULT 'Medium',
    type TEXT DEFAULT 'Feature',
    assignee_id TEXT,
    reporter_id TEXT,
    estimated_hours NUMERIC DEFAULT 0,
    actual_hours NUMERIC DEFAULT 0,
    due_date TEXT,
    subtasks JSONB DEFAULT '[]'::jsonb,
    tags JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. BUGS TABLE
CREATE TABLE IF NOT EXISTS public.bugs (
    id TEXT PRIMARY KEY,
    bug_number INTEGER,
    project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    severity TEXT DEFAULT 'Medium',
    status TEXT DEFAULT 'Open',
    assignee_id TEXT,
    steps_to_reproduce TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. MILESTONES TABLE
CREATE TABLE IF NOT EXISTS public.milestones (
    id TEXT PRIMARY KEY,
    project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    due_date TEXT,
    status TEXT DEFAULT 'Planned',
    progress NUMERIC DEFAULT 0,
    deliverables JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. CHANGE REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.change_requests (
    id TEXT PRIMARY KEY,
    cr_number TEXT,
    project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    reason TEXT,
    impact_scope TEXT,
    status TEXT DEFAULT 'Draft',
    estimated_cost NUMERIC DEFAULT 0,
    currency TEXT DEFAULT 'INR',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. ACTIVITIES & AUDIT LOG
CREATE TABLE IF NOT EXISTS public.activities (
    id TEXT PRIMARY KEY,
    project_id TEXT,
    user_id TEXT,
    action TEXT NOT NULL,
    target_type TEXT,
    target_title TEXT,
    target_id TEXT,
    timestamp TEXT,
    details TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ENABLE ROW LEVEL SECURITY (RLS) & ALLOW INTERNAL ACCESS
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bugs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.change_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Create open policies for anon & authenticated roles (internal delivery tool)
DROP POLICY IF EXISTS "Public access clients" ON public.clients;
CREATE POLICY "Public access clients" ON public.clients FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access users" ON public.users;
CREATE POLICY "Public access users" ON public.users FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access projects" ON public.projects;
CREATE POLICY "Public access projects" ON public.projects FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access modules" ON public.modules;
CREATE POLICY "Public access modules" ON public.modules FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access tasks" ON public.tasks;
CREATE POLICY "Public access tasks" ON public.tasks FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access bugs" ON public.bugs;
CREATE POLICY "Public access bugs" ON public.bugs FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access milestones" ON public.milestones;
CREATE POLICY "Public access milestones" ON public.milestones FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access change_requests" ON public.change_requests;
CREATE POLICY "Public access change_requests" ON public.change_requests FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access activities" ON public.activities;
CREATE POLICY "Public access activities" ON public.activities FOR ALL USING (true) WITH CHECK (true);

-- Enable Realtime for live cross-device collaboration
ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;
ALTER PUBLICATION supabase_realtime ADD TABLE public.modules;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;
