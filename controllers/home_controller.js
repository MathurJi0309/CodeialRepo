const Post = require('../models/post');
const User=require('../models/user');



module.exports.home=async function(req,res){
    // console.log(req.cookies);
    // Post.find({},function(err,posts){
    //     return res.render('home',{
    //         title:"Codeial | home",
    //         posts:posts
    //     });
    // })
    // populate the user o feach post




    // this is code without the async await


//     Post.find({})
//     .populate('user')
//     .populate({
//         path:'comments',
//         populate:{
//             path:'user'
//         }
//     })
//     .exec(function(err,posts){
//         User.find({},function(err,users){
//             return res.render('home',{
//                 title:"Codeial | home",
//                 posts:posts,
//                 all_users:users
//             });
//         })
//     })
// }
try{
    let posts=await Post.find({})
    .sort('-createdAt')
    .populate('user')
    .populate({
        path:'comments',
        populate:{
            path:'user'
        }
    });
       let users=await User.find({});
       return res.render('home',{
        title:"Codeial | home",
        posts:posts,
        all_users:users
    });
}
catch(err){
    console.log('error in the module.exports.home ',err);
    return;
}}