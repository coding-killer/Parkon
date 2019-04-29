#import RPi.GPIO as GPIO
import time
#from picamera import PiCamera
import requests
import base64
import json
import paho.mqtt.client as mqtt
import paho.mqtt.publish as publish
from luma.core.interface.serial import i2c
from luma.core.render import canvas
from luma.oled.device import ssd1306, ssd1325, ssd1331, sh1106
from PIL import ImageFont, ImageDraw
import pandas as pd

serial = i2c(port=1, address=0x3C)
device = ssd1306(serial, rotate=0)

SECRET_KEY = 'sk_cf8f745fc44b67c6f94ec520'
#camera = PiCamera()
#GPIO Mode (BOARD / BCM)
GPIO.setmode(GPIO.BOARD)

#set GPIO Pins
servoPIN = 12
#servoPin1 = 
GPIO_IR = 8
led1=7
led2=10
led3=16
led4=11
led5=13
led6=15

slotmicro=0

#set GPIO direction (IN / OUT)
GPIO.setup(servoPIN, GPIO.OUT)
GPIO.setup(GPIO_IR,GPIO.IN)
GPIO.setup(led1,GPIO.OUT)
GPIO.setup(led2,GPIO.OUT)
GPIO.setup(led3,GPIO.OUT)
GPIO.setup(led4,GPIO.OUT)
GPIO.setup(led5,GPIO.OUT)
GPIO.setup(led6,GPIO.OUT)
#GPIO.setup(8, GPIO.IN, pull_up_down=GPIO.PUD_UP)
#GPIO.setwarnings(False)
pwm=GPIO.PWM(servoPIN, 50)

def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))
    print("connected to Mqtt Broker")
    # Subscribing in on_connect() means that if we lose the connection and
    # reconnect then subscriptions will be renewed.
    client.subscribe("led1")
    client.subscribe("led2")
    client.subscribe("led3")
    client.subscribe("led4")
    client.subscribe("led5")
    client.subscribe("led6")
    client.subscribe("exit1")
    client.subscribe("exit2")
    client.subscribe("exit3")
    client.subscribe("exit4")
    client.subscribe("exit5")
    client.subscribe("exit6")

# The callback for when a PUBLISH message is received from the server.
def on_message(client, userdata, msg):
    print(msg.topic+" "+str(msg.payload))
    if(msg.topic=="exit1" and msg.payload.decode("utf-8") =="true"):
        carlist[:] = [d for d in carlist if d.get('slot') != 1]
        if 1 in slotlist:
            slotlist.remove(1)
        print(carlist)
    if(msg.topic=="exit2" and msg.payload.decode("utf-8") =="true"):
        carlist[:] = [d for d in carlist if d.get('slot') != 2]
        if 2 in slotlist:
            slotlist.remove(2)
        print(carlist)
    if(msg.topic=="exit3" and msg.payload.decode("utf-8") =="true"):
        carlist[:] = [d for d in carlist if d.get('slot') != 3]
        if 3 in slotlist:
            slotlist.remove(3)
        print(carlist)
    if(msg.topic=="exit4" and msg.payload.decode("utf-8") =="true"):
        carlist[:] = [d for d in carlist if d.get('slot') != 4]
        if 4 in slotlist:
            slotlist.remove(4)
    if(msg.topic=="exit5" and msg.payload.decode("utf-8") =="true"):
        carlist[:] = [d for d in carlist if d.get('slot') != 5]
        if 5 in slotlist:
            slotlist.remove(5)
        print(carlist)
    if(msg.topic=="exit6" and msg.payload.decode("utf-8") =="true"):
        carlist[:] = [d for d in carlist if d.get('slot') != 6]
        if 6 in slotlist:
            slotlist.remove(6)
        print(carlist)
        
    if(msg.topic=="led1" and msg.payload.decode("utf-8") =="true"):
        GPIO.output(led1, GPIO.HIGH)
    else:
        GPIO.output(led1, GPIO.LOW)
    if(msg.topic=="led2" and msg.payload.decode("utf-8") =="true"):
        GPIO.output(led2, GPIO.HIGH)
    else:
        GPIO.output(led2, GPIO.LOW)
    if(msg.topic=="led3" and msg.payload.decode("utf-8") =="true"):
        GPIO.output(led3, GPIO.HIGH)
    else:
        GPIO.output(led3, GPIO.LOW)
    if(msg.topic=="led4" and msg.payload.decode("utf-8") =="true"):
        GPIO.output(led4, GPIO.HIGH)
    else:
        GPIO.output(led4, GPIO.LOW)
    if(msg.topic=="led5" and msg.payload.decode("utf-8") =="true"):
        GPIO.output(led5, GPIO.HIGH)
    else:
        GPIO.output(led5, GPIO.LOW)
    if(msg.topic=="led6" and msg.payload.decode("utf-8") =="true"):
        GPIO.output(led6, GPIO.HIGH)
    else:
        GPIO.output(led6, GPIO.LOW)
# Blocking call that processes network traffic, dispatches callbacks and
# handles reconnecting.
# Other loop*() functions are available that give a threaded interface and a
# manual interface.

def SetAngle(angle):
  duty = angle / 18 + 2
  GPIO.output(servoPIN, True)
  pwm.ChangeDutyCycle(duty)
  time.sleep(1)
  GPIO.output(servoPIN, False)
  pwm.ChangeDutyCycle(0)

def displaySlot(slot):
    with canvas(device) as draw:
        font1 = ImageFont.truetype('/home/pi/luma.examples/examples/fonts/Volter__28Goldfish_29.ttf',20)
        font2 = ImageFont.truetype('/home/pi/luma.examples/examples/fonts/ChiKareGo.ttf',18)
        if(slot==1 || slot==2):
            category="MICRO"
        if(slot==3 || slot==4):
            category="MINI"
        if(slot==5 || slot==6):
            category="LARGE"
        draw.text((20, 0), category,font=font1,fill="white")
        draw.text((25, 40), "SLOT: "+str(slot),font=font2,fill="white")

def displayUnavailable():
    with canvas(device) as draw:
        font2 = ImageFont.truetype('/home/pi/luma.examples/examples/fonts/ChiKareGo.ttf',18)
        draw.text((25, 40), "UNAVAILABLE",font=font2,fill="white")
    
def clickPic(i):
    camera.rotation = 180
    camera.start_preview()
    time.sleep(1)
    camera.capture('/home/pi/Desktop/jignesh/parking/img/capture%s.jpg'%i)
    camera.stop_preview()
    print("Clicked")

def processPic(num):
    #IMAGE_PATH = './img/capture%s.jpg'%i
    IMAGE_PATH = './img/1.jpg'
    if (num=='1'):
        IMAGE_PATH = './img/Clearnano.jpg'

    elif (num=='2'):
        IMAGE_PATH = './img/alto.jpg'
    
    elif (num=='3'):
        IMAGE_PATH = './img/duster1.jpg'

    elif (num=='4'):
        IMAGE_PATH = './img/honda-city1.jpg'
        
    elif (num=='5'):
        IMAGE_PATH = './img/tata-safari.jpg'
       
    elif (num=='6'):
        IMAGE_PATH = './img/fortuner.jpg'

    with open(IMAGE_PATH, 'rb') as image_file:
        img_base64 = base64.b64encode(image_file.read())

    print("processing.....")
    
    url = 'https://api.openalpr.com/v2/recognize_bytes?recognize_vehicle=1&country=in&secret_key=%s' % (SECRET_KEY)
    r = requests.post(url, data = img_base64)
    a = r.json()
    carnum = a["results"][0]["plate"]
    model = a["results"][0]["vehicle"]["make_model"][0]["name"]
    obj= {'license':carnum,'model':model}
    jsonStr= json.dumps(obj)
    print("CARNUM",carnum,sep=" - ")
    print("MODEL",model,sep=" - ")
    client.publish("cardata",jsonStr)
    return [carnum,model]
 
if __name__ == '__main__':
    try:
        pwm.start(0)
        i=0
        slot=[1,2,3,4,5,6]
        model = ''
        carlist=[]
        slotlist=[]
        slotlist_=[]
        msglist=[]
        client = mqtt.Client()
        #client.username_pw_set(username="jigneshk5",password="jignesh12345")
        client.on_connect = on_connect
        client.on_message = on_message
        client.connect("broker.hivemq.com", 1883, 60)
        
        while True:
            client.loop()
            SetAngle(20)
            slotlist_=slotlist
            
            for y in range(len(slotlist)):
                client.publish("status/sensor"+str(slotlist[y]),msglist[y])
            d = input("Detected(y/n): ")   
            if(GPIO.input(GPIO_IR)==True):
                slotlist=[]
                msglist=[]
                print("detected")
                num = input("Select car by number: ")
                #clickPic(i)
                x = processPic(num)
                carnum = x[0]
                model= x[1]
                url = "https://raw.githubusercontent.com/jigneshk5/Parkon/master/car.csv"
                df = pd.read_csv(url)
                #df = pd.read_csv('car.csv')
                for index, row in df.iterrows():
                    #print(row['car_model'])
                    if(row['car_model']== model):
                        category = row['car_category']
                #print(category)
                if(category=='micro'):
                    print("category"+category)
                    if(slotmicro<2):
                        slotmicro+=1
                        slotallot=slotmicro
                    else:
                        slotnew = list(set(slot) - set(slotlist_))
                        slotallot=sorted(slotnew)[0]
                    if(slotallot<=6):
                        cardict={"carnum":carnum,"model":model,"slot":slotallot,"msg":"true"}
                        carlist.append(cardict.copy())
                        carString = json.dumps(carlist)
                        client.publish("users",carString)
                        for x in range(len(carlist)):
                            slotlist.append(carlist[x]["slot"])
                            msglist.append(carlist[x]["msg"])
                        print("AllOTED: SLOT"+str(slotallot))
                        SetAngle(90)
                        displaySlot(slotallot)
                    else:
                        print("UNAVAILABLE")
                        displayUnavailable()
                    print(carlist)
                elif(category=='mini'):
                    print("category"+category)
                    slot1=slot
                    print(slot1)
                    slot1 = [e for e in slot1 if e not in (1,2)]  
                    slotlist1=slotlist_
                    print(slotlist1)
                    slotlist1 = [e for e in slotlist1 if e not in (1,2)]     
                    slotnew = list(set(slot1) - set(slotlist1))
                    slotallot=sorted(slotnew)[0]
                    if(slotallot<=6):
                        cardict={"carnum":carnum,"model":model,"slot":slotallot,"msg":"true"}
                        carlist.append(cardict.copy())
                        carString = json.dumps(carlist)
                        client.publish("users",carString)
                        for x in range(len(carlist)):
                            slotlist.append(carlist[x]["slot"])
                            msglist.append(carlist[x]["msg"])
                        print("AllOTED: SLOT"+str(slotallot))
                        displaySlot(slotallot)
                        SetAngle(90)
                    else:
                        print("UNAVAILABLE")
                        displayUnavailable()
                    print(carlist)
                elif(category =='large'):
                    print("category"+category)
                    slot2=slot
                    slot2 = [e for e in slot2 if e not in (1,2,3,4)]  
                    slotlist2=slotlist_
                    slotlist2 = [e for e in slotlist2 if e not in (1,2,3,4)]     
                    slotnew = list(set(slot2) - set(slotlist2))
                    slotallot=sorted(slotnew)[0]
                    if(slotallot<=6):
                        cardict={"carnum":carnum,"model":model,"slot":slotallot,"msg":"true"}
                        carlist.append(cardict.copy())
                        carString = json.dumps(carlist)
                        client.publish("users",carString)
                        for x in range(len(carlist)):
                            slotlist.append(carlist[x]["slot"])
                            msglist.append(carlist[x]["msg"])
                        print("AllOTED: SLOT"+str(slotallot))
                        print(carlist)
                        SetAngle(90)
                        displaySlot(slotallot)
                    else:
                        print("UNAVAILABLE")
                        displayUnavailable()
                else:
                    print("Unable to recognize")
                
                i+=1
            time.sleep(0.5)
 
        # Reset by pressing CTRL + C
    except KeyboardInterrupt:
        print("Measurement stopped by User")
        GPIO.cleanup()
    finally:
        print("clean up") 
        GPIO.cleanup() # cleanup all GPIO 
