var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/yelpcamp");
app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine", "ejs");

// Set up Schema

var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Campground =  mongoose.model("Campground", campgroundSchema);

// Campground.create(
//       {
//       name:"Jolie Ville",
//       image:"https://i2-prod.cambridge-news.co.uk/incoming/article12958592.ece/ALTERNATES/s810/Campsites.jpg",
//       description: "This is a beautiful place. Highly recommended!"
//       }
//       , function(err, campground){
//         if(err){
//             console.log(err);
//         } else {
//             console.log(campground);
//         }
//     });

// ========== RESTFUL ROUTES ================

app.get("/", function(req,res){
    res.render("landing");
})

// INDEX 
app.get("/campgrounds", function(req,res){
    // get all capmgrounds from db
    Campground.find({},function(err,allCampgrounds){
        if(err){
            console.log(err)
        } else {
          res.render("index",{campgrounds:allCampgrounds});  
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
    res.render("new");
})

// SHOW
app.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id, function(err,foundCampground){
        if(err){
            console.log(err);
        } else {
           res.render("show",{campground:foundCampground}); 
        }
    });
});

app.listen( process.env.PORT, process.env.ip, function(){
    console.log("yelpCamp server ready!");
});