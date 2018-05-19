var express= require("express");
var router= express.Router();
var passport= require("passport");
var User=require("../models/user");

router.get("/",function(req,res){
    res.redirect("/blogs")
})

//AUTH ROUTES

router.get("/register",function(req,res){
    res.render("register");
});

router.post("/register",function(req,res){
    var newUser = new User({username: req.body.username});
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            console.log(err)
            res.redirect("/register")
        }else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/blogs");
            })
        }
    })
});
//login form

router.get("/login",function(req,res){
    res.render("login");
});

router.post("/login",passport.authenticate("local",{
    successRedirect:"/blogs",
    failureRedirect: "/login"
}),function(req,res){
    
});

//logout
router.get("/logout",function(req,res){
    req.logout();
    res.redirect("/blogs");
});

//middleware-loggedin

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
       return next();
    }
    res.redirect("/login");
}

module.exports=router;