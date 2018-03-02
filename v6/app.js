var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport =  require("passport"),
    localStrategy =  require("passport-local"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seeds");

mongoose.connect("mongodb://localhost/yelpcamp");
app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
seedDB();

// ========== PASSPORT CONFIGURATION ========

app.use(require("express-session")({
    secret: "Once Again Biboubou wins",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ========== RESTFUL ROUTES ================

// pass req.user on everypage
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    console.log(req.user);
    next();
});

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
app.get("/campgrounds/:id/comments/new",isLoggedIn, function(req, res){
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
app.post("/campgrounds/:id/comments",isLoggedIn,function(req, res){
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
               campground.comments.push(comment);
               campground.save();
               res.redirect('/campgrounds/' + campground._id);
           }
        });
       }
   });
   //create new comment
   //connect new comment to campground
   //redirect campground show page
});

// ===============================
// AUTH ROUTES
// ===============================

//register form
app.get("/register", function(req,res){
    res.render("register");
});

app.post("/register", function(req,res){
    var newUser = new User({username: req.body.username});
    User.register(newUser ,req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('register');
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/campgrounds");
        });
    });
});

//login
app.get("/login", function(req,res){
    res.render("login");
});

app.post("/login",passport.authenticate("local",{
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req,res){
});

//logout
app.get("/logout", function(req,res){
    req.logout();
    res.redirect("/campgrounds");
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen( process.env.PORT, process.env.ip, function(){
    console.log("yelpCamp server ready!");
});