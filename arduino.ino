#include <Adafruit_SH110X.h>
#include <splash.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <Adafruit_SPITFT_Macros.h>
#include <Adafruit_SPITFT.h>
#include <gfxfont.h>
#include <Adafruit_GrayOLED.h>
#include <ThingSpeak.h>
#include <WiFiClient.h>
#include <WiFi.h>
#include "HTTPClient.h"
#include "time.h"
#include <ArduinoJson.h>
// SCL 22
#define SCREEN_WIDTH 128 // OLED display width, in pixels
#define SCREEN_HEIGHT 64 // OLED display height, in pixels
#define SENSOR 14

// // Declaration for an SSD1306 display connected to I2C (SDA, SCL pins)
#define OLED_RESET -1 // Reset pin # (or -1 if sharing Arduino reset pin)
//Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);
Adafruit_SH1106G display = Adafruit_SH1106G(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);
#define NUMFLAKES 10
#define XPOS 0
#define YPOS 1
#define DELTAY 2

#define LOGO16_GLCD_HEIGHT 16
#define LOGO16_GLCD_WIDTH  16
long currentMillis = 0;
long previousMillis = 0;
int interval = 1000;
int lastUploaded = 0;
float last_volume = 0;
int om2mInterval = 3000;
float calibrationFactor = 10;
volatile byte pulseCount;
byte pulse1Sec = 0;
float flowRate;
float flowRate_ml_sec;
unsigned long flowMilliLitres;
unsigned int totalMilliLitres;
float flowLitres;
float totalLitres;
WiFiClient client;
///const char *ssid = "esw-m19@iiith";
///const char *password = "e5W-eMai@3!20hOct";
//const char *ssid = "Yatharth";
//const char *password = "klpo9650";
const char *ssid = "JioFi_20FDD75";
const char *password = "ikhmeawitq";
unsigned long thingspeak_channel = 1936930;
const char *thingspeak_write_api = "DYS3X8PLNZ4GPHWM";
const char *thingspeak_read_api = "PKYCLS8M7YCBSM33";
String cse_ip = "esw-onem2m.iiit.ac.in";
String cse_port = "443";
String server = "https://" + String() + cse_ip + ":" + String() + cse_port + String() + "/~/in-cse/in-name/";
///String server = "http://" + String() + cse_ip + ":" + String() + cse_port + String() + "/~/in-cse/in-name/";
const char *ntpServer = "pool.ntp.org";
String accessid = "#KDL2z:9Btjn@";
char host[] = "api.thingspeak.com"; // ThingSpeak address
const int httpPort = 80;
const unsigned long HTTP_TIMEOUT = 10000; // max respone time from server
HTTPClient http;
WiFiServer Server(80);
void createCi()
{
  int i = 0;
  String data;
  http.begin(server + String() + "Team-27" + "/" + "Node-1/Data" + "/");
  http.addHeader("X-M2M-Origin", accessid);
  http.addHeader("Content-Type", "application/json;ty=4");
  http.addHeader("Content-Length", "100");
  data = "[" + String(flowRate) + ", " + String(totalLitres + last_volume) + "]";
  String req_data = String() + "{\"m2m:cin\": {"

                    +
                    "\"con\": \"" + data + "\","

                    +
                    "\"lbl\": \"" + "V1.0.0" + "\","

                    +
                    "\"cnf\": \"text\""

                    +
                    "}}";
  int code = http.POST(req_data);
  Serial.println(code);
  if (code == -1)
  {
    Serial.println("UNABLE TO CONNECT TO THE SERVER");
  }
  http.end();
}

void IRAM_ATTR pulseCounter()
{
  pulseCount++;
}
float convertStringToFloat(String value)
{
  float result = value.toFloat();
  if (1 == isinf(result) && *value.c_str() == '-')
  {
    result = (float)-INFINITY;
  }
  return result;
}
float last_flow = 0;
void setup()
{
  Serial.begin(115200);

  delay(250);                // wait for the OLED to power up
  display.begin(0x3c, true); // Address 0x3C default
  display.display();
  delay(2000);
  display.clearDisplay();
  
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }

  // Print local IP address and start web server
  Serial.println("");
  Serial.println("WiFi connected.");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  Server.begin();

  ThingSpeak.begin(client); // Initialize ThingSpeak
  pinMode(SENSOR, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(SENSOR), pulseCounter, FALLING);
//  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C))
//  {
//    Serial.println(F("Error"));
//    while (true)
//      ;
//  }
  pulseCount = 0;
  flowRate = 0.0;
  flowMilliLitres = 0;
  totalMilliLitres = 0;
  previousMillis = 0;
  display.clearDisplay();
  display.setTextSize(1);
  display.setCursor(0, 10);
  display.setTextColor(WHITE);
  display.println("flow");
  display.display();
  configTime(0, 0, ntpServer);
  last_volume = convertStringToFloat(ThingSpeak.readStringField(thingspeak_channel, 2, thingspeak_read_api));
  //  last_flow = convertStringToFloat(ThingSpeak.readStringField(thingspeak_channel, 1, thingspeak_read_api));
  if (isnan(last_volume) || last_volume < 0)
    last_volume = 0;
  Serial.println(last_volume);
  delay(1000);
}
float counter = 0;
float avg_flowRate = 0;
int flag = 0;
void loop()
{
  if (counter >= 30)
  {
    ThingSpeak.setField(1, String(avg_flowRate / counter));
    ThingSpeak.setField(2, String(totalLitres + last_volume));
    int connection_status = ThingSpeak.writeFields(thingspeak_channel, thingspeak_write_api);
    if (connection_status == 200)
    {
      Serial.println("Sent data to ThingSpeak!");
      counter = 0;
      avg_flowRate = 0;
    }
    else
    {
      Serial.print("Error sending data to ThingSpeak: ");
      Serial.println(connection_status);
    }
  }
  if (WiFi.status() != WL_CONNECTED)
  {
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED)
    {
      Serial.print(".");
      Serial.print("Connecting to ");
      Serial.println(ssid);
      currentMillis = millis();
      if (currentMillis - previousMillis > interval)
      {
        //     prev_time = current_time;
        pulse1Sec = pulseCount;
        pulseCount = 0;
        flowRate = ((1000.0 / (millis() - previousMillis)) * pulse1Sec) / calibrationFactor;
        flowRate_ml_sec = ((1000000.0 / (millis() - previousMillis)) * pulse1Sec) / (calibrationFactor*60);
        previousMillis = millis();
        flowMilliLitres = ((flowRate) / 60) * 1000; // ml/sec * 1sec
        flowLitres = ((flowRate / 60));             // l/sec * 1sec

        // Add the millilitres passed in this second to the cumulative total
        totalMilliLitres += flowMilliLitres;
        totalLitres += flowLitres;
        // Print the flow rate for this second in litres / minute
        Serial.print("Flow rate: ");
        Serial.print(flowRate); // Print the integer part of the variable
        Serial.print("ml/sec");
        Serial.print("\t"); // Print tab space
                            //    printFlow(int(flowRate));

        // Print the cumulative total of litres flowed since starting
        Serial.print("Output Liquid Quantity: ");
        Serial.print(totalMilliLitres + last_volume * 1000);
        Serial.print("mL / ");
        Serial.print(totalLitres + last_volume);
        Serial.println("L");
        printFlow(float(flowRate), float(totalLitres + last_volume));
        avg_flowRate += flowRate;
      }
      counter++;
      delay(1000);
    }
  }
  currentMillis = millis();
  if (currentMillis - previousMillis > interval)
  {
    //     prev_time = current_time;
    pulse1Sec = pulseCount;
    pulseCount = 0;
    flowRate = ((1000.0 / (millis() - previousMillis)) * pulse1Sec) / calibrationFactor;
    flowRate_ml_sec = ((1000000.0 / (millis() - previousMillis)) * pulse1Sec) / (calibrationFactor*60);
    previousMillis = millis();
    flowMilliLitres = ((flowRate) / 60) * 1000; // ml/sec * 1sec
    flowLitres = ((flowRate / 60));             // l/sec * 1sec

    // Add the millilitres passed in this second to the cumulative total
    totalMilliLitres += flowMilliLitres;
    totalLitres += flowLitres;
    // Print the flow rate for this second in litres / minute
    Serial.print("Flow rate: ");
    Serial.print(flowRate); // Print the integer part of the variable
    Serial.print("L/min");
    Serial.print("\t"); // Print tab space
                        //    printFlow(int(flowRate));

    // Print the cumulative total of litres flowed since starting
    Serial.print("Output Liquid Quantity: ");
    Serial.print(totalMilliLitres + last_volume * 1000);
    Serial.print("mL / ");
    Serial.print(totalLitres + last_volume);
    Serial.println("L");
    printFlow(float(flowRate), float(totalLitres + last_volume));
    avg_flowRate += flowRate;
  }
  // sending data to OM2M
  createCi();
  counter += 1;
  delay(1000);
}
void printFlow(float a, float b)
{
  //  display.clearDisplay();
  //   display.setTextSize(1);
  //   display.setCursor(0,0);
  display.clearDisplay();

  display.setTextSize(1);  // Normal 1:1 pixel scale
  display.setTextColor(SH110X_WHITE); // Draw white text
  display.setCursor(0, 0); // Start at top-left corner
  display.cp437(true);     // Use full 256 char 'Code Page 437' font
                           //  display.print("Disney Princesses\n\n");
                           //  display.print("FlowRate(L/min):\n");
  display.print("FlowRate(L/min):\n");
  display.print(a);
  display.print("\n\nVolume(L):\n");
  display.print(b);
  display.display();
  //  delay(500);
}
// last_volume will be read from thingspeak.
