const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const middleware = require("../middleware");

router.get('/', function(req, res){
    Post.find({}).sort({updatedAt: 'desc'}).exec(function(err, foundPosts){
        if(err){
            console.log(err);
        } else {
            res.render('posts/discussion', {posts: foundPosts});
        }
    })
});
// New
router.get('/new', middleware.isLoggedIn, function(req, res){
    res.render('posts/new');
});
// Create
router.post('/', middleware.isLoggedIn, function(req,res){
    const postUser = {
        id: req.user._id,
        username: req.user.username
    }
    const postTitle = req.body.post.title
    const postContent = req.body.post.content

    const postInfo = {title: postTitle, content: postContent, user: postUser};

    Post.create(postInfo, function(err, newPost){
        if(err){
            console.log(err);
        } else {
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
            res.render('posts/show', {post: foundPost});
        }
    });
});
// Edit
router.get('/:postId/edit', middleware.checkOwner, function(req,res){
        Post.findById(req.params.postId, function(err, foundPost){
            res.render('posts/edit', {post: foundPost});
        });  
});
// Update
router.put('/:postId', middleware.checkOwner, function(req, res){
    const post = req.body.post;
    Post.findByIdAndUpdate(req.params.postId, post, function(err, updatedPost){
        if(err) {
            console.log(err);
        } else {
            req.flash("success", "Updated post!");
            res.redirect('/discussion/' + updatedPost._id);
        }
    });
});
// Destroy
router.delete('/:postId', middleware.checkOwner, function(req,res){
    Post.findByIdAndRemove(req.params.postId, function(err){
        if(err){
            console.log(err);
        }
        res.redirect('/discussion');
    });
});

// Middleware


module.exports = router;