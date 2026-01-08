-- SQL Script to add uuid to tenants table
-- Run this if you already have the tenants table created.

ALTER TABLE `tenants` 
ADD COLUMN `uuid` CHAR(36) NOT NULL AFTER `domain`,
ADD UNIQUE INDEX `tenants_uuid_unique` (`uuid`);

-- Note: In a production environment with existing data, 
-- you might need to generate unique values for existing rows before making it NOT NULL.
-- For a fresh development setup, the above is fine.
