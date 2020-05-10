const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Post = require('../models/post');

router.get('/', function(req, res){
    Post.find({}, function(err, foundPosts){
        if(err){
            console.log(err);
        } else {
            res.render('discussion', {posts: foundPosts});
        }
    })
});
// New
router.get('/new', isLoggedIn, function(req, res){
    res.render('new');
});
// Create
router.post('/', isLoggedIn, function(req,res){
    Post.create(req.body.post, function(err, newPost){
        if(err){
            console.log(err);
        } else {
            const author = {
                id: req.user._id,
                username: req.user.username
            }
            newPost.user = author;
            newPost.save();
            res.redirect('/discussion/' + newPost._id);
        }
    });
});
// Show
router.get('/:postId', function(req,res){
    Post.findById(req.params.postId).populate("comments").exec(function(err, foundPost){
        if(err){
            console.log(err);
        } else {
            res.render('show', {post: foundPost});
        }
    });
});
// Edit
router.get('/:postId/edit', function(req,res){
    Post.findById(req.params.postId, function(err, foundPost){
        if(err){
            console.log(err);
        } else {
            res.render('edit', {post: foundPost});
        }
    });
});
// Update
router.put('/:postId', function(req, res){
    const post = req.body.post;
    Post.findByIdAndUpdate(req.params.postId, post, function(err, updatedPost){
        if(err) {
            console.log(err);
        } else {
            res.redirect('/discussion/' + updatedPost._id);
        }
    });
});
// Destroy
router.delete('/:postId', function(req,res){
    Post.findByIdAndRemove(req.params.postId, function(err){
        if(err){
            console.log(err);
        }
        res.redirect('/discussion');
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