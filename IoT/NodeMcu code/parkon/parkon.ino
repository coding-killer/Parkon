#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <MQTT.h>

String slot;
const int trigPin = D0;
const int echoPin1 = D3;
const int echoPin2 = D4;
const int echoPin3 = D5;
const int dataPin = D6;   //Outputs the byte to transfer
const int loadPin = D7;   //Controls the internal transference of data in SN74HC595 internal registers
const int clockPin = D8;  //Generates the clock signal to control the transference of data
//const int echoPin4 = D6;
//const int echoPin5 = D7;
//const int echoPin6 = D8;
const char ssid[] = "silver lions zone";
const char pass[] = "science@123";
WiFiClient net;
MQTTClient client;
byte data1 = B00000000;
byte newdata1,newdata2,newdata3;
unsigned long lastMillis = 0;
String y;
void connect() {
  Serial.print("checking wifi...");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(1000);
  }

  Serial.print("\nconnecting...");
  while (!client.connect("esp8266")) {
    Serial.print(".");
    delay(1000);
  }

  Serial.println("\nconnected!");

  client.subscribe("status/sensor1");
  client.subscribe("status/sensor2");
  client.subscribe("status/sensor3");
  client.subscribe("status/sensor4");
  client.subscribe("status/sensor5");
  client.subscribe("status/sensor6");
}
void updateShiftRegister1(byte data)
{
   digitalWrite(loadPin, LOW);
   shiftOut(dataPin, clockPin, MSBFIRST, data);
   digitalWrite(loadPin, HIGH);
}
void updateShiftRegister2(byte data)
{
   digitalWrite(loadPin, LOW);
   shiftOut(dataPin, clockPin, LSBFIRST, data);
   digitalWrite(loadPin, HIGH);
}
void messageReceived(String &topic, String &payload) {
  Serial.println("incoming: " + topic + " - " + payload);
  if(topic=="status/sensor1" && payload=="true"){
    int dist = triggerRadar(trigPin,echoPin1);
    Serial.println("sensor1 "+String(dist));
    byte data = B00000001;
    if(dist<=15){
      Serial.println("led1 true");
      
      if(data!=data1 ){
        if(data1==B00000000){
          updateShiftRegister1(data);
          data1=data;
          }
          else{
        newdata1=data1+data;
        updateShiftRegister1(newdata1);
          }
      }
      else{
        updateShiftRegister1(data);
        data1=data;
      }
    }
    else{
      //client.publish("parkon/led1", "false");
      updateShiftRegister2(data);
      Serial.println("led1 false");
      }
    }
  if(topic=="status/sensor2" && payload=="true"){
    int dist = triggerRadar(trigPin,echoPin2);
    Serial.println("sensor2 "+String(dist));
    byte data = B00000010;
    if(dist<=15){
      Serial.println("led2 true");
      if(data!=data1 ){
        if(data1==B00000000){
          updateShiftRegister1(data);
          data1=data;
          }
          else{
        newdata2=data1+data;
        updateShiftRegister1(newdata2);
          }
      }
      else{
        updateShiftRegister1(data);
        data1=data;
      }
    }
    else{
      updateShiftRegister2(data);
      Serial.println("led2 false");
      }
    }
  if(topic=="status/sensor3" && payload=="true"){
    int dist = triggerRadar(trigPin,echoPin3);
    Serial.println("sensor3 "+String(dist));
    byte data = B00000100;
    if(dist<=15){
      Serial.println("led3 true");
      if(data!=data1 ){
        if(data1==B00000000){
          updateShiftRegister1(data);
          data1=data;
          }
          else{
        newdata3=data1+data;
        updateShiftRegister1(newdata3);
          }
      }
      else{
        updateShiftRegister1(data);
        data1=data;
      }
    }
    else{
      updateShiftRegister2(data);
      Serial.println("led3 false");
      }
    }
//  if(topic=="status/sensor4" && payload=="true"){
//    int dist = triggerRadar(trigPin,echoPin4);
//    Serial.println("sensor4 "+String(dist));
//    if(dist<=15){
//      client.publish("parkon/led4", "true");
//    }
//    else{
//      client.publish("parkon/led4", "false");
//      }
//    }
//  if(topic=="status/sensor5" && payload=="true"){
//    int dist = triggerRadar(trigPin,echoPin5);
//    Serial.println("sensor5 "+String(dist));
//    if(dist<=15){
//      client.publish("parkon/led5", "true");
//    }
//    else{
//      client.publish("parkon/led5", "false");
//      }
//    }
//  if(topic=="status/sensor6" && payload=="true"){
//    int dist = triggerRadar(trigPin,echoPin6);
//    Serial.println("sensor6 "+String(dist));
//    if(dist<=15){
//      client.publish("parkon/led6", "true");
//    }
//    else{
//      client.publish("parkon/led6", "false");
//      }
//    }
}
double triggerRadar(int trigPin, int echoPin){
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  long duration = pulseIn(echoPin, HIGH);
  double d = duration*0.0343/2;
  return d;
}

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid,pass);
  pinMode(trigPin, OUTPUT);  // Sets the trigPin as an Output
  pinMode(echoPin1, INPUT);  // Sets the echoPin as an Input
  pinMode(echoPin2, INPUT);  
  pinMode(echoPin3, INPUT);
  pinMode(dataPin, OUTPUT);
  pinMode(loadPin, OUTPUT);
  pinMode(clockPin, OUTPUT); 
  //pinMode(echoPin4, INPUT); 
  //pinMode(echoPin5, INPUT); 
  //pinMode(echoPin6, INPUT);  

  client.begin("broker.hivemq.com",1883, net);
  client.onMessage(messageReceived);
  connect();
}

void loop() {
  client.loop();
  delay(10);  // <- fixes some issues with WiFi stability

  if (!client.connected()) {
    connect();
  }
}
