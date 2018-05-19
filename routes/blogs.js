var express= require("express");
var router= express.Router();
var mongoose=require("mongoose");
var Blog= require("../models/blog");
var Comment= require("../models/comment");
var middleware=require("../middleware/index.js");


// INDEX ROUTE
router.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log(err)
        }else{
             res.render("blogs/index",{blogs:blogs});
            // console.log(blogs)
        }
    })
})


// NEW ROUTE
router.get("/blogs/new",middleware.isLoggedIn,function(req,res){
    res.render("blogs/new");
})
// CREATE ROUTE
router.post("/blogs",middleware.isLoggedIn,function(req,res){
    // create blog
    req.body.blog.body=req.sanitize(req.body.blog.body);

    Blog.create(req.body.blog,function(err,newBlog){
        if(err){
            res.render("blogs/new")
        }else{
            newBlog.author.id=req.user._id;
            newBlog.author.username=req.user.username;
            newBlog.save();
            res.redirect("/blogs")
        }
    })
    // redirect to index
})
// SHOW ROUTE

router.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id).populate("comments").exec(function(err,foundBlog){
        if(err){
            res.redirect("/blogs")
            console.log("error")
        }else{
            console.log(foundBlog);
            res.render("blogs/show",{blog: foundBlog})
        }
    })
})
// EDIT ROUTE

router.get("/blogs/:id/edit",middleware.checkBlogOwnership,function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
    res.render("blogs/edit",{blog: foundBlog});
});
});
//update route
router.put("/blogs/:id",middleware.checkBlogOwnership,function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
        if(err){
            res.redirect("blogs/edit");
        }else{
            res.redirect("/blogs/"+ req.params.id);
        }
    });
    // res.send("edit page")
});
// DELETE ROUTE
router.delete("/blogs/:id",middleware.checkBlogOwnership,function(req,res){
    // res.send("delete blog post")
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/blogs")
        }else{
            res.redirect("/blogs")
        }
    })
})






module.exports= router;