const Comment = require('../models/comment');
const Post = require('../models/post');
const commentsMailer=require('../mailers/comments_mailer')
const queue=require('../config/kue');
const commentEmailWorker=require('../workers/comment_email_worker');
const Like=require('../models/like');
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

module.exports.destroy=async function(req,res){
    try{
        let comment =await Comment.findById(req.params.id);
        if(comment.user == req.user.id){
            let postId=comment.post;
            comment.remove();
            let post =Post.findByIdAndUpdate(postId,{$pull:{comments:req.params.id}});
            // CHANGE :: destory the assocaited likes for this comment 
            await Like.deleteMany({likeable:comment._id,onModel:'Comment'});


            if(req.xhr){
                return res.json(200,{
                    message:'Post deleted',
                    data:{
                        comment_id:req.params.id
                    }
                });
            }

            req.flash('success','Comment deleted!');
            return res.redirect('back');
        }else{
            req.flash('error','Unauthorized');
            return res.redirect('back');
        }
    }catch(err){
        req.flash('error',err);
        return ;
    }
}