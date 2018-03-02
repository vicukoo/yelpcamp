var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    seedDB = require("./seeds");

mongoose.connect("mongodb://localhost/yelpcamp");
app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine", "ejs");
app.use(express.static("public"));
seedDB();

// ========== RESTFUL ROUTES ================

app.get("/", function(req,res){
    res.render("landing");
})

// INDEX 
app.get("/campgrounds", function(req,res){
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
app.post("/campgrounds", function(req,res){
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
            res.redirect("/campgrounds");
        }
    });
})

// NEW
app.get("/campgrounds/new",function(req,res){
    res.render("campgrounds/new");
})

// SHOW
app.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err){
            console.log(err);
        } else {
           res.render("campgrounds/show",{campground:foundCampground}); 
        }
    });
});

// ===============================
// COMMENTS ROUTES
// ===============================

//NEW
app.get("/campgrounds/:id/comments/new", function(req, res){
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
app.post("/campgrounds/:id/comments", function(req,res){
    var comment = req.body.comment;
    Campground.findById(req.params.id, function(err,campground){
        if(err){
            console.log(err);
        } else {
            Comment.create(
              comment
              , function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/"+campground._id);
                }
            });
        }
    });
})

app.listen( process.env.PORT, process.env.ip, function(){
    console.log("yelpCamp server ready!");
});