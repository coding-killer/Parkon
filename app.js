
var http = require("http");
var express=require("express");
var app=express();
var bodyParser=require("body-parser");
//var mongoose=require("mongoose");
var cors =require('cors');
var path =require('path');
var flash=require("connect-flash");
var passport=require("passport");
var LocalStrategy=require("passport-local");
var methodOverride=require("method-override");
var Campground=require("./models/campground");
var Comment=require("./models/comment");
var User=require("./models/user");
var seedDB=require("./seeds");
var router =express.Router();
//const spaceRoutes = require("./api/routes/spaces");
const mqttData = require("./api/routes/liveData");

var commentRoutes=require("./routes/comments");
var campgroundRoutes=require("./routes/campgrounds");
var indexRoutes=require("./routes/index");
var maps=require("./routes/maps");

//  mongoose.connect("mongodb://pulkit:pulkit11@ds155825.mlab.com:55825/parkingopt",{
// 	useNewUrlParser:true
// }); 
//mongoose.connect("mongodb://localhost/yelp_camp_v10");
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();
//passport config
app.use(require("express-session")({
	secret:"Pulkit is best",
	resave:false,
	saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
});

app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/maps",maps);

app.get("/",function(req,res){
	res.render("landing");
});

app.get("/about",function(req,res){
	res.render("about");
});

app.get("/qr",function(req,res){
	res.render("qr");
});

app.get("/verify",function(req,res){
	res.render("verify");
});

app.get("/goo",function(req,res){
	res.redirect("/login");
});

//app.use("/api/space",spaceRoutes);
app.use("/api/mqtt",mqttData);

app.listen(3000,'0.0.0.0');
