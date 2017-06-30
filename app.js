var express = require("express"),
    app     = express(),
   mongoose = require("mongoose"),
 bodyParser = require("body-parser"),
methodOverride = require('method-override'); //allows you to send a put request with a form with a bit of messing about

//app config
mongoose.connect("mongodb://localhost/blog_app"); //name blog_app is arbitrary
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride('_method')); //argument is what is looked for in query string to override

//method config
var blogSchema = new mongoose.Schema({
    title: String,
});
var Blog = mongoose.model("Blag", blogSchema);
// Blog.create({title:"Hello"}); makes an example for our database

/////
/////ROUTES

//INDEX Routes
app.get("/", function(req,res) {
    res.redirect("/blogs");
});

app.get("/blogs",function(req,res) {
    Blog.find({}, function(err, blogs){
        res.render("index", {blogs:blogs});
    });
});

//NEW  Route
app.get("/blogs/new",function(req,res){
    res.render("new");
});

//CREATE Route
app.post("/blogs", function(req,res){
    var typedBlog={title:req.body.title}; //title is input name in form
   Blog.create(typedBlog, function(err, newBlog){
          res.redirect("/blogs");
    });
});

//SHOW Route
app.get("/blogs/:id", function(req, res){
   Blog.findById(req.params.id, function(err, blog){ //lower case d!
          res.render("show", {blog: blog});
   });
});

//EDIT Route
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err,foundBlog){
            res.render("edit", {blog:foundBlog});
    });
});

//UPDATE Route
app.put("/blogs/:id", function(req, res){
    Blog.findByIdAndUpdate(req.params.id, {title:req.body.title}, function(err,updatedBlog){ //takes blog to update, what to replace it with, and callback
            res.redirect("/blogs/"+ updatedBlog._id); //takes to /blogs/:id
    });
});

//DELETE Route
app.delete("/blogs/:id", function(req,res){
   Blog.findByIdAndRemove(req.params.id, function(err){    //no data to include in callback, its gone! 
           res.redirect("/blogs");
   }); 
});
//listen for requests
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("server running");
});