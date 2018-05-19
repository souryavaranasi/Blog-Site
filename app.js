var express=require("express"),
    app=express(),
    methodOverride=require("method-override"),
    bodyParser=require("body-parser"),
    expressSanitizer=require("express-sanitizer"),
    mongoose=require("mongoose"),
    passport=require("passport"),
    LocalStrategy=require("passport-local"),
    Blog= require("./models/blog"),
    Comment=require("./models/comment"),
    User=require("./models/user"),
    seedDB= require("./seed");
    // seedDB();
    // mongoose.Promise = global.Promise; 

var commentRoutes=require("./routes/comments"),
    blogRoutes=require("./routes/blogs"),
    indexRoutes=require("./routes/index");
    
// mongoose.connect("mongodb://localhost/restful_blog_app", {useMongoClient: true});
mongoose.connect("mongodb://blogsite:blogsite@ds229450.mlab.com:29450/blogsite", {useMongoClient: true});

// mongodb://blogsite:blogsite@ds229450.mlab.com:29450/blogsite

app.use(bodyParser.urlencoded({ extended: true }))
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

//passport init/configuration
app.use(require("express-session")({
    secret: "welcome to blog site!",
    resave:false,
    saveUninitialized:false
}))

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    next();
})

app.use(indexRoutes);
app.use(commentRoutes);
app.use(blogRoutes);

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Blog Appserver has started")
})