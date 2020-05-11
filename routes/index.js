const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');


// ===========================
// =======INDEX ROUTE=========
// ===========================
router.get('/', function(req,res){
    res.render('posts/index');
});

// ============================
// USER ROUTES
// ============================
router.get("/register", function(req, res){
    res.render('register');
});
router.post("/register", function(req, res){
    const newUser = new User({username: req.body.username,residentType: req.body.residentType});
    User.register(newUser, req.body.password, function(err, newUser){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            passport.authenticate('local')(req, res, function(){
                req.flash("success", "Welcome, " + newUser.username);
                res.redirect('/discussion');
            });
        }
    });
});
router.get("/login", function(req,res){
    res.render('login');
});
router.post("/login", passport.authenticate('local',{
        successRedirect: "/discussion",
        failureRedirect: "/login"
    }), function(req,res){
        // CAN REMOVE CALLBACK
});
router.get("/logout", function(req,res){
    req.logout();
    req.flash("success", "Logged out");
    res.redirect("/");
});

module.exports = router;