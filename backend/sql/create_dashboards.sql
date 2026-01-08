-- SQL Script to create the dashboards table
-- This matches the Sequelize model definition in models/Dashboard.js

CREATE TABLE IF NOT EXISTS `dashboards` (
    `id` INTEGER NOT NULL auto_increment , 
    `name` VARCHAR(255) NOT NULL, 
    `description` TEXT, 
    `tenant_id` INTEGER NOT NULL, 
    `customer_id` INTEGER, 
    `created_at` DATETIME NOT NULL, 
    `updated_at` DATETIME NOT NULL, 
    PRIMARY KEY (`id`), 
    CONSTRAINT `dashboards_tenant_fk` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `dashboards_customer_fk` FOREIGN KEY (`customer_id`) REFERENCES `tenant_customers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Optional: Add index for performance on FKs
CREATE INDEX `dashboards_tenant_id_idx` ON `dashboards` (`tenant_id`);
CREATE INDEX `dashboards_customer_id_idx` ON `dashboards` (`customer_id`);
