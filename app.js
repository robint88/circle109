require('dotenv').config;
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const passport = require('passport');
const localStrategy = require('passport-local');
// MODEL
const Post = require("./models/post");
const Comment = require("./models/comment");
const User = require("./models/user");
// ROUTE
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+'/public'));
app.use(methodOverride("_method"));

mongoose.connect("mongodb://localhost:27017/circle109", {useNewUrlParser: true});

//Pasport config
app.use(require('express-session')({
    secret: 'Lando is a very barky boy', //USE .ENV FILE TO CREATE SECRET
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Pass in currentUser
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
});

//Routes
app.get('/', function(req,res){
    res.render('index');
});
app.use("/discussion",postRoutes);
app.use("/discussion/:postId/comments", commentRoutes);

// USER ROUTES
app.get("/register", function(req, res){
    res.render('register');
});
app.post("/register", function(req, res){
    const newUser = new User({username: req.body.username,residentType: req.body.residentType});
    User.register(newUser, req.body.password, function(err, newUser){
        if(err){
            console.log(err);
            return res.render('register');
        } else {
            passport.authenticate('local')(req, res, function(){
                res.redirect('/discussion');
            });
        }
    });
});
app.get("/login", function(req,res){
    res.render('login');
});
app.post("/login", passport.authenticate('local',{
        successRedirect: "/discussion",
        failureRedirect: "/login"
    }), function(req,res){
        // CAN REMOVE CALLBACK
});
app.get("/logout", function(req,res){
    req.logout();
    res.redirect("/");
})

// Middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

// //ALLOWS TO RUN ON HEROKU OR LOCAL
// app.listen(process.env.PORT || 3000);
//server
app.listen(3000, function(){
    console.log("SERVER RUNNING ON POST 3000! WOOHOO!");
});
