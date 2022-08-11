 const User =require('../models/user');


module.exports.profile=function(req,res){
    return res.render('user',{
        title:"user"
    });
}

// Render the sign in page

module.exports.signIn=function(req,res){
    return res.render('user_sign_in',{
        title:'Codeial|Sign in'
    })
}

//Render the sign up page

module.exports.signUp=function(req,res){
    return res.render('user_sign_up',{
        title:'Codeial|Sign Up'
    })
}

// get the sign up data
module.exports.create = function(req, res){
    console.log(req.body);
    if (req.body.password != req.body.confirm_password){
        return res.redirect('back');
    }
    console.log(req.body);
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

}