var mqtt = require('mqtt');
let options = {
    "clientId": 'nodejs',
    "keepalive": 30,
    "connectTimeout": 30000,    //Wait till 30sec before disconnecting
    "clean": false,
    "protocolId": "MQTT",
    "protocolVersion": 4
    //"username":'jigneshk5',
    //"password":'jignesh12345'
  }
  var client  = mqtt.connect('mqtt://broker.hivemq.com',options);
  module.exports = client;