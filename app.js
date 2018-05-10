var express=require("express"),
    app=express(),
    methodOverride=require("method-override"),
    bodyParser=require("body-parser"),
    expressSanitizer=require("express-sanitizer"),
    mongoose=require("mongoose");
    mongoose.Promise = global.Promise; 
mongoose.connect("mongodb://localhost/restful_blog_app", {useMongoClient: true});
app.use(bodyParser.urlencoded({ extended: true }))
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default:Date.now}
});
var Blog=mongoose.model("Blog",blogSchema);
// Blog.create({
//     title: "CoffeeMe",
//     image: "http://www.bathtubmermaid.com/wp-content/uploads/2017/08/merlene-goulet-51572.jpg",
//     body: "Hello! this is all about Coffee and me"
// })
app.get("/",function(req,res){
    res.redirect("/blogs")
})
// INDEX ROUTE
app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log(err)
        }else{
             res.render("index",{blogs:blogs});
            // console.log(blogs)
        }
    })
})
// NEW ROUTE
app.get("/blogs/new",function(req,res){
    res.render("new")
})
// CREATE ROUTE
app.post("/blogs",function(req,res){
    // create blog
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog,function(err,newBlog){
        if(err){
            res.render("new")
        }else{
            res.redirect("/blogs")
        }
    })
    // redirect to index
})
// SHOW ROUTE

app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs")
            console.log("error")
        }else{
            res.render("show",{blog: foundBlog})
        }
    })
})
// EDIT ROUTE

app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs")
        }else{
            res.render("edit",{blog: foundBlog})
        }
    })
    
})
app.put("/blogs/:id",function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
        if(err){
            res.redirect("edit")
        }else{
            res.redirect("/blogs/"+ req.params.id)
        }
    })
    // res.send("edit page")
})
// DELETE ROUTE
app.delete("/blogs/:id",function(req,res){
    // res.send("delete blog post")
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/blogs")
        }else{
            res.redirect("/blogs")
        }
    })
})






app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Blog Appserver has started")
})