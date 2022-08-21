 const User =require('../models/user');
 const fs=require('fs');
 const path =require('path');


module.exports.profile=function(req,res){
    User.findById(req.params.id,function(err,user){
        //there is some problem 
    return res.render('user_profile',{
        title:"User Profile",
        profile_user:user
    });
    })
}

// Render the sign in page

module.exports.signIn=function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }

    
    return res.render('user_sign_in',{
        title:'Codeial|Sign in'
    })
}

module.exports.update=async function(req,res){
    // if(req.user.id==req.params.id){
    //     //we write at the place of req.body as well {name:req.body.name,eamil:req.body.email}
    //     User.findByIdAndUpdate(req.params.id,req.body,function(err,user){
    //         return res.redirect('back');
    //     });
    // }else{
    //     return res.status(401).send('Unauthorized');
    // }
    if(req.user.id==req.params.id){
        try{
            let user=await User.findById(req.params.id);
            User.uploadedAvatar(req,res,function(err){
                if(err){
                    console.log('error in multer',err);
                    return ;
                }
                //multer use bocs it will not save bocs it is multi type d=so for that we use multer
                user.name=req.body.name;
                user.email=req.body.email;
                //bocs avtar is not required so it will cahnge or update t=when their is file
                if(req.file){
                    if(user.avatar){
                        fs.unlinkSync(path.join(__dirname , '..'  ,user.avatar))
                    }
                    // this is saving the path of the uploded file into the avatar field in the user
                    user.avatar=User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                return res.redirect('back');
            })

        }catch(err){
            req.flash('error in the update',err);
            return res.redirect('back');
        }


    }else{
        req.flash('error','Unauthorized');
        return res.status(401).send('Unauthorized');
    }

}
//Render the sign up page

module.exports.signUp=function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_up',{
        title:'Codeial|Sign Up'
    })
}

// get the sign up data
module.exports.create = function(req, res){
    console.log(req.body  ,'creat');
    if (req.body.password != req.body.confirm_password){
        return res.redirect('back');
    }
    console.log(req.body,'create');
    User.findOne({email: req.body.email}, function(err, user){
        if(err){console.log('error in finding user in signing up'); return}

        if (!user){
            User.create(req.body, function(err, user){

                if(err){console.log('error in creating user while signing up',err); 
                return}

                return res.redirect('/users/sign-in');
            })
        }else{
            return res.redirect('back');
        }

    });
}

//sign in and create session for the user

module.exports.createSession= function(req,res){
    req.flash('success','Logged in Successfully');
    console.log('createSession');
    return res.redirect('/');
}




module.exports.destorySession=function(req,res){
    //inbuilt function in passport js for logout
     
    
    req.logout(function(err){
        if(err){
            console.log('err in logout');
        return ;
        }
        req.flash('success','Logged out Successfully');
        return res.redirect('/');
    }
    );

   
}