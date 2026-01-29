-- Add tenant_id column to notifications table
-- This migration adds the missing tenant_id column that is required for multi-tenant notification filtering

ALTER TABLE notifications 
ADD COLUMN tenant_id INT NOT NULL DEFAULT 1 AFTER id;

-- Add index for performance
CREATE INDEX idx_tenant_id ON notifications(tenant_id);

-- Note: The DEFAULT 1 is temporary. You may need to update existing rows with the correct tenant_id
-- Example: UPDATE notifications SET tenant_id = (SELECT tenant_id FROM tenant_devices WHERE device_id = notifications.device_id LIMIT 1);
