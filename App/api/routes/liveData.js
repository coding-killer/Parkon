const express = require('express');
let client = require('../../mqtt');
let userObj={};

client.subscribe('parkon/users');
client.subscribe('parkon/led1');
client.subscribe('parkon/led2');
client.subscribe('parkon/led3');
client.subscribe('parkon/led4');
client.subscribe('parkon/led5');
client.subscribe('parkon/led6');

client.subscribe('status/sensor1');
client.subscribe('status/sensor2');
client.subscribe('status/sensor3');
client.subscribe('status/sensor4');
client.subscribe('status/sensor5');
client.subscribe('status/sensor6');
const router = express.Router();
var carobj,liveobj;
let liveentry={"slot1":false,"slot2":false,"slot3":false,"slot4":false,"slot5":false,"slot6":false};
let parkingobj = {"sensor1":false,"sensor2":false,"sensor3":false,"sensor4":false,"sensor5":false,"sensor6":false}
let parkingValue;
client.on('connect', function () {
    //console.log("Server connected to the Mqtt Broker");    
})
client.on('message', function(topic, msg) {
    //console.log('Msg received');
    if(topic=='parkon/users'){
      userObj = JSON.parse(msg.toString());
      //console.log(userObj);
    }
    if(topic=='parkon/led1'){
      if(msg.toString()=='true')
        parkingobj.sensor1=true;
      else
        parkingobj.sensor1=false;
    }
    if(topic=='parkon/led2'){
      if(msg.toString()=='true')
      parkingobj.sensor2=true;
    else
      parkingobj.sensor2=false;   
     }
    if(topic=='parkon/led3'){
      if(msg.toString()=='true')
      parkingobj.sensor3=true;
    else
      parkingobj.sensor3=false;    
    }
    if(topic=='parkon/led4'){
      if(msg.toString()=='true')
      parkingobj.sensor4=true;
    else
      parkingobj.sensor4=false;    
    }
    if(topic=='parkon/led5'){
      if(msg.toString()=='true')
      parkingobj.sensor5=true;
    else
      parkingobj.sensor5=false;    
    }
    if(topic=='parkon/led6'){
      if(msg.toString()=='true')
      parkingobj.sensor6=true;
    else
      parkingobj.sensor6=false;
      }
    // else if(topic=='status/parking'){
    //     parkingobj = JSON.parse(msg.toString());
    //      console.log(parkingobj.sensor1);
    // }
    if(topic=='status/sensor1'){
      if(msg.toString()=='true')
        liveentry.slot1=true;
      else
        liveentry.slot1=false;
    }
    if(topic=='status/sensor2'){
      if(msg.toString()=='true')
      liveentry.slot2=true;
    else
      liveentry.slot2=false;   
     }
    if(topic=='status/sensor3'){
      if(msg.toString()=='true')
      liveentry.slot3=true;
    else
      liveentry.slot3=false;    
    }
    if(topic=='status/sensor4'){
      if(msg.toString()=='true')
      liveentry.slot4=true;
    else
      liveentry.slot4=false;    
    }
    if(topic=='status/sensor5'){
      if(msg.toString()=='true')
      liveentry.slot5=true;
    else
      liveentry.slot5=false;    
    }
    if(topic=='status/sensor6'){
      if(msg.toString()=='true')
      liveentry.slot6=true;
    else
      liveentry.slot6=false;
      }
 });
 client.on("error", function(error) {
  console.log("ERROR: ", error);
});

client.on('offline', function() {
  //console.log("offline");
});

client.on('reconnect', function() {
  //console.log("reconnect");
});
// Ping to the server for subscribing the topics

router.get('/', (req, res) => {    
    res.render('index',{booking:bookingValue, parking:parkingValue});
});

//router.get('/parking', (req, res) => {    
   // res.send(parkingobj);
//});
router.get('/parking',function(req,res){
  res.render("krishna",{park:liveentry});
});
router.get('/live', (req, res) => {    
  //res.send(liveobj);
  res.render('livedata',{park:parkingobj});
});
// router.get('/liveData', (req, res) => {    
//   res.send(liveobj);
// });
router.get('/entry', (req, res) => {    
  res.send(liveentry);
  //res.render('livedata',{liveobj});
});
  module.exports = router;
  module.exports.obj= userObj;