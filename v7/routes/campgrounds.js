var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");

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
router.post("/", function(req,res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name:name , image:image , description: desc}
   // create a new campground and save it in the DB
    Campground.create(
      newCampground
      , function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.redirect("/");
        }
    });
})

// NEW
router.get("/new",function(req,res){
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

module.exports = router;