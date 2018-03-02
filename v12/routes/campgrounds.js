var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var middleware = require("../middleware");

// ========== RESTFUL ROUTES ================

// INDEX 
router.get("/", function(req,res){
    // get all capmgrounds from db
    Campground.find({},function(err,allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index",{campgrounds:allCampgrounds});  
        }
    });
})

// CREATE
router.post("/", middleware.isLoggedIn,  function(req,res){
    var newCampground = req.body.campground;
    newCampground.author = {
        id : req.user._id,
        username: req.user.username
    };
   // create a new campground and save it in the DB
    Campground.create(
      newCampground
      , function(err, campground){
        if(err){
            console.log(err);
        } else {
            console.log(campground);
            res.redirect("/campgrounds");
        }
    });
})

// NEW
router.get("/new", middleware.isLoggedIn, function(req,res){
    res.render("campgrounds/new");
})

// SHOW
router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err){
            console.log(err);
        } else {
           res.render("campgrounds/show",{campground:foundCampground}); 
        }
    });
});

//EDIT

router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req,res){
        Campground.findById(req.params.id,function(err,campground){
            if(err){
                res.redirect("back");
            } else {
                res.render("campgrounds/edit", {campground: campground});
            }
        });
});

//UPDATE

router.put("/:id", middleware.checkCampgroundOwnership, function(req,res){
    var campground = req.body.campground;
    var author = {
        id: req.user._id,
        username : req.user.username
    }
    campground.author = author;
    Campground.findByIdAndUpdate(req.params.id,campground ,function(err,newCampground){
        if(err){
            res.redirect("/campgrounds")
        } else {
            res.redirect("/campgrounds/" + newCampground._id);
        }
    });
});

// DESTROY 
router.delete("/:id", middleware.checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds")
        } else {
            res.redirect("/campgrounds");
        }
    });
});



module.exports = router;