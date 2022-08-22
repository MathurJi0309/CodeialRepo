const Post=require('../../../models/post')
const Comment=require('../../../models/comment')
const passport=require('passport');

module.exports.index =async function(req,res){
    //we copied from the home_controller module.exports.home=async function(req,res) 
    let posts=await Post.find({})
    .sort('-createdAt')
    .populate('user')
    .populate({
        path:'comments',
        populate:{
            path:'user'
        }
    });
    return res.json(200,{
        message:"List of posts",
        posts:posts
    })
}
module.exports.destroy=async function(req,res){
    try{
        let post=await Post.findById(req.params.id);
            //.id means converting the object id into string for comparison not use _.id 
            if(post.user == req.user.id){
                post.remove();
                await Comment.deleteMany({post:req.params.id});

                
                return res.json(200,{
                    message:"post and associated commenst deleted successfully"
                });
            }else{
                return res.json(401,{
                    message:"you cannot delete this post "
                })
               
            }

    }catch{
        // req.flash('error here in destory post controller',err);
        return res.json(500,{
            message:"internal server error "
        })
    }
}