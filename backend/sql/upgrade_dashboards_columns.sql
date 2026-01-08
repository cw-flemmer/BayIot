-- Upgrade script for dashboards table
ALTER TABLE dashboards ADD COLUMN columns INTEGER DEFAULT 6;
