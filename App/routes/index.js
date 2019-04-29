/*
var express=require("express");
var router=express.Router();
var passport=require("passport");
var User=require("../models/user");
//Auth routes...come on pulkit u cn do it..
//show register form
router.get("/register",function(req,res){
	res.render("register", {page: 'register'});
});
//handle sign up logic
router.post("/register",function(req,res){
	var newUser=new User({username:req.body.username,car:req.body.car,phone:req.body.phone});
	User.register(newUser,req.body.password,function(err,user){
    if(err){
        req.flash("error",err.message);
    	return res.render("register",{error: err.message});
    }
    passport.authenticate("local")(req,res,function(){
    	req.flash("success","Welcome "+user.username);
    	console.log(req);
    	//res.redirect("/campgrounds");
    	res.redirect("/login");
    });
	});
});

//show login form
router.get("/login",function(req,res){
	res.render("login");
});

//post login route

/*router.post("/login",function(req,res){
	var user_name=req.body.username;
	var password=req.body.password;
	console.log(user_name,password);

});

  router.post("/login",passport.authenticate("local",{
	//successRedirect:"/api/mqtt/parking",
	successRedirect:"/api/mqtt/parking", 
	failureRedirect:"/login"
}),function(req,res){
	console.log(req);
});

//logic route
router.get("/logout",function(req,res){
	req.logout();
	req.flash("error","Logged You Out!!");
	res.redirect("/");
});
*/
let liveentry={"slot1":false,"slot2":false,"slot3":false,"slot4":false,"slot5":false,"slot6":false};
const express = require('express');
var db = require('../db');
let userObj={};
const router = express.Router();
let client = require('../mqtt');
const user = require('../api/routes/livedata');
let booking=[];
let userArr=[];
let userArr1=[];
client.on('message', function(topic, msg) {
	//console.log('Msg received');
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
	if(topic=='parkon/users'){
		userObj = JSON.parse(msg.toString());
		//console.log(userObj);
		if(userArr.includes(userObj.carnum)){
			console.log(userArr);
		}
		else{
			userArr.push(userObj);
			console.log(userArr);
		  //'records' is the array of all parameter passed in the body to POST
			let records = [userObj.carnum,userObj.model,userObj.category,userObj.slot];
			let placeholders = records.map((value) => '?').join(',');
		//Sql query for adding data to different columns(fields) of the user
			let sql = `INSERT INTO user(CARNUM,MODEL,CATEGORY,SLOT) VALUES`+'('+placeholders+')';
			// output the INSERT statement
			console.log(sql);	
			db.run(sql, records, function(err) {
				if (err) {
					console.log(err.message);
				}
				else{
					console.log(`Rows inserted ${this.changes}`);
				}
			});
		}
	}
});
//show login form
router.get("/login",function(req,res){
	res.render("login");
	//console.log(userObj.carnum);
});

router.get("/payment",function(req,res){
	res.render("payment");
	//console.log(userObj.carnum);
});

//post login route

router.post("/login",function(req,res){
	var carnum=req.body.carnum;
	if(carnum==userObj.carnum){
		res.redirect("/api/mqtt/parking");
		}
		else{
			req.flash("error","Enter your Car number correctly OR You are not in the parking space");
			res.redirect("login");
		}
	});
	router.post("/payment",function(req,res){
		var id=req.body.parking_id;
		var pay;
		function get_time_diff( datetime )
	{
			var datetime = typeof datetime !== 'undefined' ? datetime : "2014-01-01 01:02:03.123456";

			var datetime = new Date( datetime ).getTime();
			var now = new Date().getTime();

			if( isNaN(datetime) )
			{
					return "";
			}

			//console.log( datetime + " " + now);

			if (datetime < now) {
					var milisec_diff = now - datetime;
			}else{
					var milisec_diff = datetime - now;
			}

			var days = Math.floor(milisec_diff / 1000 / 60 / (60 * 24));

			var date_diff = new Date( milisec_diff );
			pay = days*1000+(date_diff.getHours()-5)*50+(date_diff.getMinutes()-30)*1
			return days + " Days "+ (date_diff.getHours()-5) + " Hours " + (date_diff.getMinutes()-30) + " Minutes " + date_diff.getSeconds() + " Seconds";

	}
	if(id==userObj.id){
		var period = get_time_diff(userObj.datetime);
		console.log(period);
		req.flash("success","Payment Successful");
		client.publish("parkon/exit"+userObj.slot,"true");
		res.render("payment_success.ejs",{duration:period,entry:userObj.datetime,exit:new Date().toLocaleString(),payment:pay});
	}
	else{
		req.flash("error","Payment Unsuccessful");
		res.redirect("payment");
	}
});

router.post("/verify",function(req,res){
	var parkingid=req.body.parking_id;
	if(parkingid==userObj.id){
		booking.push(Object.assign({},{'slot':userObj.slot}));
		console.log(booking);
		//res.render("krishna");
		res.render("krishna1",{park:liveentry});
	}
	else{
		req.flash("error","Enter parking id correctly");
		res.redirect("/verify");
	}
});



module.exports=router;