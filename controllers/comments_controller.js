const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = function(req, res){
    Post.findById(req.body.post, function(err, post){

        if (post){
            Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            }, function(err, comment){
                // handle error
                if(err){
                    console.log(err,'error in push comment');
                    return;
                }
                console.log(post.comments);
                post.comments.push(comment);
                post.save();

                return res.redirect('/');
            });
        }

    });
}

module.exports.destroy=function(req,res){
    Comment.findById(req.params.id,function(err,comment){
        console.log(req.user);
        if(err){
            console.log(err,'probelm in destroy of comment ')
        }
        if(comment.user == req.user.id){
            let postId=comment.post;
            comment.remove();
            Post.findByIdAndUpdate(postId,{$pull:{comments:req.params.id}},function(err,post){
                return res.redirect('back');
            })
        }else{
            return res.redirect('back');
        }
    })
}