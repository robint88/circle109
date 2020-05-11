const mongoose = require('mongoose');
const express = require('express');
const router = express.Router({mergeParams: true});
const Post = require("../models/post");
const Comment = require("../models/comment");

//  **** COMMENTS ****
// New
router.get('/new', isLoggedIn,function(req,res){
    Post.findById(req.params.postId, function(err, foundPost){
        if(err){
            console.log(err);
        } else {
            res.render('comments/new', {post: foundPost});
        }
    });
});
// Create
router.post("/", isLoggedIn, function(req, res){
    Post.findById(req.params.postId, function(err, foundPost){
        if(err){
            console.log(err);
        } else {
            Comment.create(req.body.comment, function(err, newComment){
                if(err){
                    console.log(err);
                } else {
                    newComment.author.id = req.user._id;
                    newComment.author.username = req.user.username;
                    newComment.save();
                    foundPost.comments.push(newComment);
                    foundPost.save();
                    res.redirect("/discussion/" + foundPost._id);
                }
            });
        }
    });
});
// Edit
router.get("/:commentId/edit", checkCommentOwner, function(req, res){    
    Comment.findById(req.params.commentId, function(err, foundComment){
        if(err){
            console.log(err);
        } else {
            console.log(foundComment);
            // post_id comes from the route in app.js
            res.render("comments/edit", {post_id: req.params.postId, comment: foundComment});
        }
    });   
});
// Update
router.put('/:commentId', checkCommentOwner, function(req, res){
    Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect('back');
        } else {
            res.redirect('/discussion/' + req.params.postId);
        }
    });
});
// Destroy
router.delete("/:commentId", checkCommentOwner, function(req, res){
    Comment.findByIdAndRemove(req.params.commentId, function(err, foundComment){
        if(err){
            res.redirect('back');
        } else {
            res.redirect('/discussion/' + req.params.postId);
        }
    })
});
// Middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

function checkCommentOwner(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.commentId, function(err, foundComment){
            if(err){
                res.redirect('back');
            } else {
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    res.redirect('back');
                }
            }
        });
    } else {
        res.redirect('back');
    }
}
module.exports = router;