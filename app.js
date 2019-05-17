var express               = require("express");
var mongoose              = require("mongoose");
var passport               = require("passport");
var bodyParser            = require("body-parser");
var LocalStrategy         = require("passport-local");
User                      = require('./models/user');
var passportLocalMongoose = require('passport-local-mongoose');
mongoose.connect("mongodb://localhost/authdemo",{useNewUrlParser: true});

var app = express();
app.use(require('express-session')({
    secret:"kiba",
    resave: false,
    saveUninitialized: false
}));
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));
//=================================================
//           ROUTES
//=================================================
app.get("/",function (req, res) {
  res.render("home");
});
app.get("/secret",isLoggedIn,function (req, res) {
  res.render("secret");
});
// show sign up form
app.get("/register",function (req, res) {
res.render("register");
});
app.post("/register",function (req,res) {
  User.register(new User({username:req.body.username}),req.body.password,function(err,user) {
    if (err) {
      console.log('err:', err);
      return res.render("register");
    } else {
      passport.authenticate("local")(req,res,function () {
        res.redirect("/secret");
      });
    }
  });
});
// LOGIN ROUTES
//Render Login form
app.get("/login",function (req,res) {
  res.render("login");
});
//use of middleware
app.post("/login",passport.authenticate("local",{
successRedirect:"/secret",
failureRedirect:"/login"
}),function (req, res) {
});

//Logout ROUTES

app.get("/logout",function (req,res) {
  req.logout();
  res.redirect("/");
});

function isLoggedIn(req,res, next){
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}
app.listen(8080, function() {
  console.log("server is up");
});
