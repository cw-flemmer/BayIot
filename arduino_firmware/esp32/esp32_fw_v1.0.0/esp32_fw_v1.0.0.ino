#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

// ---------- WiFi Settings ----------
const char* ssid = "FLEMMER-2.4G";
const char* password = "0677521411";

// ---------- MQTT Settings ----------
const char* mqtt_server = "156.155.253.143"; // e.g., 192.168.1.100
const int mqtt_port = 8883;              // No TLS

// identify customer + device (IMPORTANT)
const char* customer = "shoprite";
const char* site = "standfordsquare";
const char* device = "liquorstore";

String mqtt_topic_telemetry = "coldchain/" + String(customer) + "/" + String(site) + "/" + String(device) + "/telemetry";
String mqtt_topic_heartbeat = "coldchain/" + String(customer) + "/" + String(site) + "/" + String(device) + "/heartbeat";;

// ---------- Globals ----------
WiFiClient espClient;
PubSubClient client(espClient);
unsigned long lastTelemetry = 0;
unsigned long lastHeartbeat = 0;

const long telemetryInterval = 5 * 60 * 1000; // 15 minutes (Testing: Set to 1 minute)
const long heartbeatInterval = 1 * 60 * 1000;  // 5 minutes (Testing: Set to 1 minute)

// ---------- WiFi Connect ----------
void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to WiFi: ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

// ---------- MQTT Connect ----------
void reconnect() {
  while (!client.connected()) {
    Serial.print("Connecting to MQTT... ");
    if (client.connect("ESP32Client")) {
      Serial.println("connected");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" trying again in 5 seconds");
      delay(5000);
    }
  }
}

// ---------- Setup ----------
void setup() {
  Serial.begin(115200);    
  delay(1000);
  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);  
}

// ---------- Main Loop ----------
void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  unsigned long now = millis();

  // ---------- Heartbeat every 5 min ----------
  if (now - lastHeartbeat > heartbeatInterval) {
    lastHeartbeat = now;

    StaticJsonDocument<100> hb;
    hb["status"] = "alive";
    hb["timestamp"] = millis();

    char hbPayload[128];
    serializeJson(hb, hbPayload);

    if (client.publish(mqtt_topic_heartbeat.c_str(), hbPayload)) {
      Serial.print("Heartbeat sent: ");
      Serial.println(hbPayload);
    } else {
      Serial.println("Heartbeat failed");
    }
  }

  // ---------- Full telemetry every 15 min ----------
  if (now - lastTelemetry > telemetryInterval) {
    lastTelemetry = now;

    // Generate dummy data    
    float temperature = random(200, 800) / 100.0; // 2.0°C – 8.0°C
    float humidity = random(4000, 7000) / 100.0;   // 40% – 70%
    int battery = random(80, 100);                // 80% – 100%
    bool door = random(0, 2);                     // 0 = closed, 1 = open

    StaticJsonDocument<200> doc;    
    doc["temperature"] = temperature;
    doc["humidity"] = humidity;
    doc["battery"] = battery;
    doc["door"] = door ? "0" : "1";    

    char payload[256];
    serializeJson(doc, payload);

    if (client.publish(mqtt_topic_telemetry.c_str(), payload)) {
      Serial.print("Telemetry sent: ");
      Serial.println(payload);
    } else {
      Serial.println("Telemetry publish failed");
    }
  }
}