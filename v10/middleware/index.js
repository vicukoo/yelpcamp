var Campground = require("../models/campground"),
    Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You must log in first");
    res.redirect("/login");
};

middlewareObj.checkCommentOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.commentId,function(err,comment){
            if(err){
                req.flash("error", "Comment not found");
                res.redirect("back");
            } else {
                if(comment.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You do not have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You must log in first");
        res.redirect("back"); 
    }
}

middlewareObj.checkCampgroundOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id,function(err,campground){
            if(err){
                req.flash("error", "Campground not found");
                res.redirect("back");
            } else {
                if(campground.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You do not have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
    req.flash("error", "You must log in first");
       res.redirect("back"); 
    }
}

module.exports = middlewareObj;