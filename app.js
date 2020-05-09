require('dotenv').config;
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+'/public'));
app.use(methodOverride("_method"));

mongoose.connect("mongodb://localhost:27017/circle109", {useNewUrlParser: true});

// MODEL
const Post = require("./models/post");
const Comment = require("./models/comment");

//Routes
app.get('/', function(req,res){
    res.render('index');

});
app.get('/discussion', function(req, res){
    Post.find({}, function(err, foundPosts){
        if(err){
            console.log(err);
        } else {
            res.render('discussion', {posts: foundPosts});
        }
    })
});
app.get('/discussion/new', function(req, res){
    res.render('new');
});
app.post('/discussion', function(req,res){
    Post.create(req.body.post, function(err, newPost){
        if(err){
            console.log(err);
        } else {
            newPost.save();
            res.redirect('/discussion/' + newPost._id);
        }
    });
});
app.get('/discussion/:postId', function(req,res){
    Post.findById(req.params.postId).populate("comments").exec(function(err, foundPost){
        if(err){
            console.log(err);
        } else {
            res.render('show', {post: foundPost});
        }
    });
});
app.get('/discussion/:postId/edit', function(req,res){
    Post.findById(req.params.postId, function(err, foundPost){
        if(err){
            console.log(err);
        } else {
            res.render('edit', {post: foundPost});
        }
    });
});
app.put('/discussion/:postId', function(req, res){
    const post = req.body.post;
    Post.findByIdAndUpdate(req.params.postId, post, function(err, updatedPost){
        if(err) {
            console.log(err);
        } else {
            res.redirect('/discussion/' + updatedPost._id);
        }
    });
});
app.delete('/discussion/:postId', function(req,res){
    Post.findByIdAndRemove(req.params.postId, function(err){
        if(err){
            console.log(err);
        }
        res.redirect('/discussion');
    });
});
//  **** COMMENTS ****
app.get('/discussion/:postId/comments/new', function(req,res){
    Post.findById(req.params.postId, function(err, foundPost){
        if(err){
            console.log(err);
        } else {
            res.render('comments/new', {post: foundPost});
        }
    });
});
app.post("/discussion/:postId/comments", function(req, res){
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

// //ALLOWS TO RUN ON HEROKU OR LOCAL
// app.listen(process.env.PORT || 3000);
//server
app.listen(3000, function(){
    console.log("SERVER RUNNING ON POST 3000! WOOHOO!");
});
