var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// ===============================
// COMMENTS ROUTES
// ===============================

//NEW
router.get("/new",middleware.isLoggedIn, function(req, res){
    var campgroundId = req.params.id;
    Campground.findById(campgroundId, function(err,campground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

//CREATE
router.post("/",middleware.isLoggedIn,function(req, res){
   //lookup campground using ID
   Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               comment.save();
               campground.comments.push(comment);
               campground.save();
               req.flash("success", "Successfully added comment");
               res.redirect('/campgrounds/' + campground._id);
           }
        });
       }
   });
   //create new comment
   //connect new comment to campground
   //redirect campground show page
});

// Edit
router.get("/:commentId/edit", middleware.checkCommentOwnership, function(req,res){
    var campground_id = req.params.id;
    Comment.findById(req.params.commentId,function(err,comment){
        if(err){
            res.redirect("back");
        } else {
            console.log(comment.text);
            res.render("comments/edit",{comment: comment, campground_id: campground_id});
        }
    });
});

// Update

router.put("/:commentId", middleware.checkCommentOwnership, function(req,res){
    var comment = req.body.comment;
    Comment.findByIdAndUpdate(req.params.commentId, comment, function(err,comment){
       if(err){
           res.redirect("back");
       } else {
           req.flash("success", "Successfully editted comment");
           res.redirect("/campgrounds/"+req.params.id);
       }
    });
});

// deleter

router.delete("/:commentId", middleware.checkCommentOwnership, function(req,res){
    Comment.findByIdAndRemove(req.params.commentId, function(err,comment){
       if(err){
           res.redirect("back");
       } else {
           req.flash("success", "Successfully deleted comment");
           res.redirect("/campgrounds/"+req.params.id);
       }
    });
});

module.exports = router;