-- 1. Tenants Table
CREATE TABLE IF NOT EXISTS tenants (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) NOT NULL UNIQUE,
    uuid CHAR(36) NOT NULL UNIQUE,
    logo VARCHAR(255),
    theme VARCHAR(255) DEFAULT 'light',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Tenant Customers Table
CREATE TABLE IF NOT EXISTS tenant_customers (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL DEFAULT 'customer',
    tenant_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- 3. Tenant Customer Devices Table
CREATE TABLE IF NOT EXISTS tenant_customer_devices (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,
    tenant_customer_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_customer_id) REFERENCES tenant_customers(id) ON DELETE CASCADE
);

-- 4. Dashboards Table
CREATE TABLE IF NOT EXISTS dashboards (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    tenant_id INTEGER NOT NULL,
    customer_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES tenant_customers(id) ON DELETE SET NULL
);

-- 5. Tenant Devices Table
CREATE TABLE IF NOT EXISTS tenant_devices (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    tenant_uuid CHAR(36) NOT NULL,
    device_id VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL,
    last_seen DATETIME NOT NULL,
    dashboard_id INTEGER,
    FOREIGN KEY (tenant_uuid) REFERENCES tenants(uuid) ON DELETE CASCADE,
    FOREIGN KEY (dashboard_id) REFERENCES dashboards(id) ON DELETE SET NULL
);

-- 6. Widgets Table
CREATE TABLE IF NOT EXISTS widgets (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    dashboard_id INTEGER NOT NULL,
    type VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    device_id VARCHAR(255),
    telemetry_column VARCHAR(255),
    position JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (dashboard_id) REFERENCES dashboards(id) ON DELETE CASCADE
);

-- 7. Telemetry Table
CREATE TABLE IF NOT EXISTS telemetry (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    device_id VARCHAR(255) NOT NULL,
    temperature FLOAT,
    humidity FLOAT,
    door_status TINYINT(1),
    battery_level INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
