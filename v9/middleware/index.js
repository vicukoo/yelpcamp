var Campground = require("../models/campground"),
    Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You would need to login first.");
    res.redirect("/login");
};

middlewareObj.checkCommentOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.commentId,function(err,comment){
            if(err){
                res.redirect("back");
            } else {
                if(comment.author.id.equals(req.user._id)){
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
       res.redirect("back"); 
    }
}

middlewareObj.checkCampgroundOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id,function(err,campground){
            if(err){
                res.redirect("back");
            } else {
                if(campground.author.id.equals(req.user._id)){
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
       res.redirect("back"); 
    }
}

module.exports = middlewareObj;