var express = require("express");
var app = express();
app.set("view engine", "ejs");

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended : true}));

var campgrounds = [
        {name:"Salmon Creek", image:"https://cdn.vox-cdn.com/thumbor/-JoPdcgAuLTUsWiDZ62CX4wb33k=/0x0:5225x3479/1200x800/filters:focal(2195x1322:3031x2158)/cdn.vox-cdn.com/uploads/chorus_image/image/54137643/camping_tents.0.jpg"},
        {name:"Jolie Ville", image:"https://i2-prod.cambridge-news.co.uk/incoming/article12958592.ece/ALTERNATES/s810/Campsites.jpg"},
        {name:"Holy Valley", image:"http://www.motorhomeland.com/img-test/blog/campsite.jpg"}
        ];
        
app.get("/", function(req,res){
    res.render("landing");
})

app.get("/campgrounds", function(req,res){
    res.render("campgrounds",{campgrounds:campgrounds});
})

app.post("/campgrounds", function(req,res){
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name:name , image:image}
    campgrounds.push(newCampground);
    res.redirect("/campgrounds");
})

app.get("/campgrounds/new",function(req,res){
    res.render("new");
})

app.listen( process.env.PORT, process.env.ip, function(){
    console.log("yelpCamp server ready!");
});