#ifndef CONFIG_H
#define CONFIG_H

// ---------- WiFi Settings ----------
#define ssid = "FLEMMER-2.4G";
#define password = "0677521411";

// ---------- MQTT Settings ----------
#define mqtt_server = "156.155.253.143"; // e.g., 192.168.1.100
#define mqtt_port = 8883;              // No TLS

// identify customer + device (IMPORTANT)
#define customer = "shoprite";
#define site = "standfordsquare";
#define device = "liquorstore";

#endif // CONFIG_H