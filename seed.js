var mongoose= require("mongoose");
var Blog= require("./models/blog");
var Comment= require("./models/comment");

var data=[
    {
        title:"abc",
        image: "https://images.unsplash.com/photo-1487064835902-6f99ba5baa5b?ixlib=rb-0.3.5&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjE0NTg5fQ&s=0f5e7408189068b4c5a3fbf447aad65e",
        body: "djghjh"
        
    },
    {
        title:"abc",
        image: "https://images.unsplash.com/photo-1487064835902-6f99ba5baa5b?ixlib=rb-0.3.5&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjE0NTg5fQ&s=0f5e7408189068b4c5a3fbf447aad65e",
        body: "djghjh"
        
        
    },
        
    {
        title:"abc",
        image: "https://images.unsplash.com/photo-1487064835902-6f99ba5baa5b?ixlib=rb-0.3.5&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjE0NTg5fQ&s=0f5e7408189068b4c5a3fbf447aad65e",
        body: "djghjh"
    
    }
    ];

function seedDB(){
    //remove all blogs
    Blog.remove({},function(err){
        if(err){
            console.log(err)
        }else{
            console.log("removed all blogs");
            //add new blogs
            data.forEach(function(seed){
                Blog.create(seed,function(err,blog){
                    if(err){
                        console.log(err);
                    }else{
                        console.log("added blog "+ blog);
                        //add comment
                        Comment.create({text:"abracadabra",author:"boomer"},function(err,comment){
                            if(err){
                                console.log(err);
                            }else{
                                
                                blog.comments.push(comment);
                                blog.save();
                                console.log("comment created "+ comment);
                            }
                        })
                    }
                })
            })
            
        }
    });
}

module.exports = seedDB;