/**
 * supabase-schema.sql
 * ─────────────────────────────────────────────────────────────
 * Run this SQL in the Supabase Dashboard → SQL Editor to
 * create all URMS tables in your PostgreSQL instance.
 *
 * Tables created:
 *   users, resources, bookings, maintenance_tickets,
 *   notifications, reports
 *
 * All primary keys use UUIDs (gen_random_uuid()).
 * Foreign keys are enforced at the DB level.
 * ─────────────────────────────────────────────────────────────
 */

-- ────────────────────────────────────────────────────────────
-- Enable pgcrypto extension for UUID generation (if needed)
-- ────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ────────────────────────────────────────────────────────────
-- 1. users
--    Stores Firebase-authenticated user metadata.
--    The `id` maps to the Firebase UID.
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id         TEXT PRIMARY KEY,           -- Firebase UID
    name       TEXT,
    email      TEXT UNIQUE,
    role       TEXT NOT NULL DEFAULT 'student',  -- 'student' | 'lecturer' | 'admin' | 'maintenance'
    department TEXT,                       -- Added for department-wise analytics
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- 2. resources
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS resources (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name                TEXT NOT NULL,
    type                TEXT NOT NULL DEFAULT 'Lecture Halls',
    capacity            TEXT NOT NULL DEFAULT '0',
    location            TEXT NOT NULL,
    availability_status TEXT NOT NULL DEFAULT 'Available',
    department          TEXT,              -- Added for department-wise analytics
    equipment           TEXT,              -- JSON array stored as text
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- 3. bookings
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bookings (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
    user_id     TEXT,                      -- Firebase UID (nullable for legacy rows)
    start_time  TIMESTAMPTZ NOT NULL,
    end_time    TIMESTAMPTZ NOT NULL,
    status      TEXT NOT NULL DEFAULT 'Approved',  -- 'Pending' | 'Approved' | 'Completed' | 'Cancelled'
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- 4. maintenance_tickets
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS maintenance_tickets (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource_id  UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
    title        TEXT NOT NULL,
    description  TEXT NOT NULL DEFAULT '',
    priority     TEXT NOT NULL DEFAULT 'Low'
                     CHECK (priority IN ('Low', 'Medium', 'High')),
    status       TEXT NOT NULL DEFAULT 'OPEN'
                     CHECK (status IN ('OPEN', 'IN_PROGRESS', 'COMPLETED')),
    created_by   TEXT NOT NULL,            -- Firebase UID
    assigned_to  TEXT,                     -- Firebase UID of technician
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    outcome      TEXT CHECK (outcome IN ('Fixed', 'Faulty', 'Decommissioned'))
);

-- ────────────────────────────────────────────────────────────
-- 5. notifications
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
    id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id   TEXT NOT NULL,               -- Firebase UID
    message   TEXT NOT NULL,
    type      TEXT NOT NULL DEFAULT 'info',  -- 'info' | 'warning' | 'alert'
    is_read   BOOLEAN NOT NULL DEFAULT FALSE,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- 6. reports
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reports (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    generated_by TEXT NOT NULL,            -- Firebase UID
    report_type  TEXT NOT NULL,            -- e.g. 'maintenance', 'usage', 'booking'
    file_path    TEXT,                     -- optional path/URL to stored PDF
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- Indexes for common query patterns
-- ────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_bookings_resource_id        ON bookings(resource_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status             ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_maintenance_resource_id     ON maintenance_tickets(resource_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_status          ON maintenance_tickets(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id       ON notifications(user_id);
