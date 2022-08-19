const Post = require('../models/post');
const post=require('../models/post');



module.exports.home=function(req,res){
    // console.log(req.cookies);
    // Post.find({},function(err,posts){
    //     return res.render('home',{
    //         title:"Codeial | home",
    //         posts:posts
    //     });
    // })
    // populate the user o feach post
    Post.find({}).populate('user').exec(function(err,posts){
        return res.render('home',{
            title:"Codeial | home",
            posts:posts
        });
    })
}