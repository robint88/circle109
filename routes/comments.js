const mongoose = require('mongoose');
const express = require('express');
const router = express.Router({mergeParams: true});
const Post = require("../models/post");
const Comment = require("../models/comment");
const middleware = require("../middleware/index");

//  **** COMMENTS ****
// New
router.get('/new', middleware.isLoggedIn,function(req,res){
    Post.findById(req.params.postId, function(err, foundPost){
        if(err){
            console.log(err);
        } else {
            res.render('comments/new', {post: foundPost});
        }
    });
});
// Create
router.post("/", middleware.isLoggedIn, function(req, res){
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
                    res.json(newComment);
                    // req.flash("success", "Comment created!");
                    // res.redirect("/discussion/" + foundPost._id);
                }
            });
        }
    });
});
// Edit
router.get("/:commentId/edit", middleware.checkCommentOwner, function(req, res){    
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
router.put('/:commentId', middleware.checkCommentOwner, function(req, res){
    // 3rd arg makes comment the update item, not original
    Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, {new: true}, function(err, updatedComment){
        if(err){
            res.redirect('back');
        } else {
            // req.flash("success", "Comment updated!");
            // res.redirect('/discussion/' + req.params.postId);
            res.json(updatedComment);
        }
    });
});
// Destroy
router.delete("/:commentId", middleware.checkCommentOwner, function(req, res){
    //NEED TO PULL COMMENT FROM POST -COMMENT ARRAY TOO
    // Post.updateOne({_id: req.params.id}, {$pull {debates: req.params.commentId}})
    //     }
    // })
    Comment.findByIdAndRemove(req.params.commentId, function(err, foundComment){
        if(err){
            req.flash("error", "Something went wrong");
            res.redirect('back');
        } else {
            // req.flash("success", "Comment deleted!");
            // res.redirect('/discussion/' + req.params.postId);
            res.json(foundComment);
        }
    })
});

module.exports = router;