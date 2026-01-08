-- Repair script for tenant_devices columns
ALTER TABLE `tenant_devices` ADD COLUMN IF NOT EXISTS `customer` VARCHAR(255) AFTER `tenant_uuid`;
