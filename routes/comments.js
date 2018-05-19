
var express= require("express");
var router= express.Router();
var Blog= require("../models/blog");
var Comment= require("../models/comment");
var middleware=require("../middleware/index.js")

//COMMENT ROUTES

//new route

router.get("/blogs/:id/comments/new",middleware.isLoggedIn,function(req, res) {
    Blog.findById(req.params.id,function(err, foundBlog) {
        if(err){
            console.log(err);
        }else{
            res.render("comments/new",{blog:foundBlog});
        }
    })
});

//create route
router.post("/blogs/:id/comments",middleware.isLoggedIn,function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            console.log(err);
        }else{
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    console.log(err);
                }else{
                    comment.author.id=req.user._id;
                    comment.author.username=req.user.username;
                    comment.save();
                    foundBlog.comments.push(comment);
                    foundBlog.save();
                    console.log(comment);
                    res.redirect("/blogs/"+foundBlog._id)
                }
            })
        }
    })
})

//edit
router.get("/blogs/:id/comments/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
     Comment.findById(req.params.comment_id,function(err,foundComment){
      res.render("comments/edit",{blog_id:req.params.id, comment:foundComment});   
     
 })
});
//update

router.put("/blogs/:id/comments/:comment_id",middleware.checkCommentOwnership, function(req,res){
      Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/blogs/"+ req.params.id);
        }
    }) 
});

//destroy

router.delete("/blogs/:id/comments/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            res.redirect("back");
        }else{
            // req.flash("success","successfully deleted comment");
            res.redirect("/blogs/"+req.params.id)
        }
    })
})



module.exports= router;