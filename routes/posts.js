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
            res.render('show', {post: foundPost});
        }
    });
});
// Edit
router.get('/:postId/edit', checkOwner, function(req,res){
        Post.findById(req.params.postId, function(err, foundPost){
            res.render('edit', {post: foundPost});
        });  
});
// Update
router.put('/:postId', checkOwner, function(req, res){
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
router.delete('/:postId', checkOwner, function(req,res){
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
function checkOwner(req, res, next){
    if(req.isAuthenticated()){
        Post.findById(req.params.postId, function(err, foundPost){
            if(err){
                res.redirect('back');
            } else {
                if(foundPost.user.id.equals(req.user._id)){
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