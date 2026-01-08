CREATE TABLE IF NOT EXISTS telemetry (
    id INT AUTO_INCREMENT PRIMARY KEY,
    device_id VARCHAR(255) NOT NULL,
    temperature FLOAT,
    humidity FLOAT,
    door_status BOOLEAN,
    battery_level INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_device_created (device_id, created_at)
);
