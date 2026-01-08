-- Add dashboard_id to tenant_devices
ALTER TABLE `tenant_devices`
ADD COLUMN `dashboard_id` INT NULL AFTER `tenant_uuid`,
ADD CONSTRAINT `fk_device_dashboard` FOREIGN KEY (`dashboard_id`) REFERENCES dashboards(`id`) ON DELETE SET NULL;

-- Create index for performance
CREATE INDEX idx_device_dashboard ON tenant_devices(`dashboard_id`);
