const Comment = require('../models/comment');
const Post = require('../models/post');
const commentsMailer=require('../mailers/comments_mailer')
const queue=require('../config/kue');
const commentEmailWorker=require('../workers/comment_email_worker');

module.exports.create =async function(req, res){
    try{
        let post =await Post.findById(req.body.post);


        if (post){
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user:req.user._id,
            });
                console.log(post.comments);
                post.comments.push(comment);
                
                post.save();
                comment=await comment.populate('user');
                // commentsMailer.newComment(comment);
                let job=queue.create('emails',comment).save(function(err){
                    if(err){
                        console.log('error in sending to the queue',err);
                        return;
                    }
                    console.log('job enqueued',job.id);
                })
                return res.redirect('/');
            };
        }catch(err){
            console.log('error in the create comment ',err);
        }
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