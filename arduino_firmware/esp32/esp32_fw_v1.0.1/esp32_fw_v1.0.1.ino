#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

// ===== USER CONFIG =====
//const char* ssid = "FLEMMER-2.4G";
//const char* password = "0677521411";
const char* ssid = "CWF-Shop";
const char* password = "0677521411";

String deviceId; //Wifi Mac Address
const char* customer = "491771d2-410d-4b8b-bbba-c0f180b5aa6f";
const char* site = "standfordsquare";
const char* device = "5C013B32DD30";

const char* mqtt_server = "156.155.253.143";
const int mqtt_port = 8883;
String mqtt_topic_telemetry = "coldchain/" + String(customer) + "/" + String(site) + "/" + String(device) + "/telemetry";
// ========================

const int doorPin = 16;

WiFiClient espClient;
PubSubClient client(espClient);

int lastDoorState = HIGH;  // start assuming open

unsigned long lastTelemetry = 0;
unsigned long lastHeartbeat = 0;

//const long telemetryInterval = 5 * 60 * 1000; // 15 minutes (Testing: Set to 1 minute)
const long telemetryInterval = 15000; // 15 minutes (Testing: Set to 1 minute)
//const long heartbeatInterval = 1 * 60 * 1000;  // 5 minutes (Testing: Set to 1 minute)
const long heartbeatInterval = 15000;  // 5 minutes (Testing: Set to 1 minute)

void setup_wifi() {
  delay(10);
  Serial.println("Connecting to WiFi...");
  
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi connected");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

void reconnect_mqtt() {
  while (!client.connected()) {
    String clientId = "ESP32-" + deviceId;    
    Serial.print("Connecting to MQTT using device id... ");
    Serial.println(deviceId);

    if (client.connect(clientId.c_str())) {
      Serial.println("connected");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" trying again in 5 seconds");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);

  pinMode(doorPin, INPUT_PULLUP);

  setup_wifi();

  deviceId = WiFi.macAddress();           // e.g. "AC:67:B2:1F:9A:3C"
  deviceId.replace(":", "");              // clean -> "AC67B21F9A3C" (optional)

  client.setServer(mqtt_server, mqtt_port);

  Serial.println("Door MQTT Sensor Started");
}

void loop() {
  if (!client.connected()) {
    reconnect_mqtt();
  }
  client.loop();
  unsigned long now = millis();
    // ---------- Heartbeat every 5 min ----------
  if (now - lastTelemetry > telemetryInterval) {
  lastTelemetry = now;
  int doorState = digitalRead(doorPin);
  
  StaticJsonDocument<200> doc;  
  doc["door"] = doorState ? "0" : "1";    
  
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