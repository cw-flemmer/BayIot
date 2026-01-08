-- Create tenant_devices table
CREATE TABLE IF NOT EXISTS tenant_devices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tenant_uuid CHAR(36) NOT NULL,
    device_id VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_seen DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_tenant_uuid FOREIGN KEY (tenant_uuid) REFERENCES tenants(uuid) ON DELETE CASCADE
);

-- Index for faster lookups by tenant_uuid
CREATE INDEX idx_tenant_uuid ON tenant_devices(tenant_uuid);
