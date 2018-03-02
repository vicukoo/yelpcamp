var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport =  require("passport"),
    localStrategy =  require("passport-local"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    methodOverride = require("method-override"),
    seedDB = require("./seeds");

var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");
    
mongoose.connect("mongodb://localhost/yelpcamp");
app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
// seedDB();

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

// pass req.user on everypage

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
});

app.use(indexRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds",campgroundRoutes);

app.listen( process.env.PORT, process.env.ip, function(){
    console.log("yelpCamp server ready!");
});