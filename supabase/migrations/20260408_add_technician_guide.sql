-- Migration: Add technician_guide column to features table
-- Date: 2026-04-08
-- Purpose: Store internal coding procedure reference for technicians.
--          This field is admin-only and not exposed to customers.

ALTER TABLE features ADD COLUMN IF NOT EXISTS technician_guide text;
