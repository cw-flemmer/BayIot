#include <WiFi.h>
#include <WiFiManager.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

// ===== USER CONFIG =====
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
  WiFiManager wm;
  
  // Set captive portal timeout to 3 minutes (180 seconds)
  // If it can't connect, it will start AP. If nobody sets credentials within 3 minutes, it resets.
  wm.setConfigPortalTimeout(180);

  String apName = "BayIoT_" + deviceId;
  Serial.print("Starting WiFiManager AP / Connecting to known WiFi. AP Name: ");
  Serial.println(apName);

  bool res = wm.autoConnect(apName.c_str());

  if (!res) {
    Serial.println("Failed to connect or hit timeout. Restarting...");
    delay(3000);
    ESP.restart(); // Restart ESP32 and try again
  } 
  else {
    Serial.println("\nWiFi connected");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
  }
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

  // Initialize WiFi mode to STAtion
  WiFi.mode(WIFI_STA);
  uint64_t chipid = ESP.getEfuseMac(); // Safely read hardware MAC without WiFi radio running
  char macStr[13];
  snprintf(macStr, 13, "%04X%08X", (uint16_t)(chipid >> 32), (uint32_t)chipid);
  deviceId = String(macStr);

  setup_wifi();

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