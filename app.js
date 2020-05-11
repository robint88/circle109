require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const flash = require("connect-flash");
const passport = require('passport');
const localStrategy = require('passport-local');
// MODELS
const Post = require("./models/post");
const Comment = require("./models/comment");
const User = require("./models/user");
// ROUTES
const indexRoutes = require('./routes/index');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+'/public'));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require('moment');

// mongoose.connect("mongodb://localhost:27017/circle109", {useNewUrlParser: true});
mongoose.connect("mongodb+srv://robinadmin:DBPWD@cluster0-9qvnu.mongodb.net/circle109?retryWrites=true&w=majority");

//Pasport config
app.use(require('express-session')({
    secret: process.env.SECRET, //USE .ENV FILE TO CREATE SECRET
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// Pass in currentUser and Flash messages
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//Routes
app.use(indexRoutes);
app.use("/discussion",postRoutes);
app.use("/discussion/:postId/comments", commentRoutes);

// //ALLOWS TO RUN ON HEROKU OR LOCAL
app.listen(process.env.PORT || 3000);
//server
// app.listen(3000, function(){
//     console.log("SERVER RUNNING ON POST 3000! WOOHOO!");
// });
