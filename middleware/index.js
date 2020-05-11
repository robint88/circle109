const Post = require("../models/post");
const Comment = require("../models/comment");

const middlewareObj ={};

middlewareObj.checkOwner =function(req, res, next){
    if(req.isAuthenticated()){
        Post.findById(req.params.postId, function(err, foundPost){
            if(err){
                req.flash("error", "Post not found");
                res.redirect('back');
            } else {
                if(foundPost.user.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that.");
                    res.redirect('back');
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect('back');
    }
};

middlewareObj.checkCommentOwner = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.commentId, function(err, foundComment){
            if(err){
                req.flash("error", "Something went wrong");
                res.redirect('back');
            } else {
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect('back');
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect('back');
    }
};

middlewareObj.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that.");
    res.redirect("/login");
}

module.exports = middlewareObj