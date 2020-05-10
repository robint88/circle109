const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Post = require("../models/post");
const Comment = require("../models/comment");

//  **** COMMENTS ****
router.get('/discussion/:postId/comments/new', isLoggedIn,function(req,res){
    Post.findById(req.params.postId, function(err, foundPost){
        if(err){
            console.log(err);
        } else {
            res.render('comments/new', {post: foundPost});
        }
    });
});
router.post("/discussion/:postId/comments", isLoggedIn, function(req, res){
    Post.findById(req.params.postId, function(err, foundPost){
        if(err){
            console.log(err);
        } else {
            Comment.create(req.body.comment, function(err, newComment){
                if(err){
                    console.log(err);
                } else {
                    newComment.save();
                    foundPost.comments.push(newComment);
                    foundPost.save();
                    res.redirect("/discussion/" + foundPost._id);
                }
            });
        }
    });
});

// Middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;