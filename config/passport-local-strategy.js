const passport=require('passport');



const LocalStrategy=require('passport-local').Strategy; 

const User=require('../models/user');
//authentication using passport
passport.use(new LocalStrategy({
    usernameField:'email'
},

function(email,password,done){
    //find a user and establish the indetity
    User.findOne({email:email},function(err,user){
        if(err){
            console.log('Error in finding user --> Passport');
            return done(err);

        }
        if(!user ||user.password!=password){
            console.log('Invalid Username/Password');
            return done(null,false);
        }
        return done(null,user);
    });
}
));

//serialing the user to decide which key is to kept in the cookies


passport.serializeUser(function(user,done){
    done(null,user.id);
});




//deserialing the user from the key in the cookies
passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        if(err){
            console.log('Error i findin guser --> Passport');
            return done(err);
        }
        return done(null,user);
    });

});


//check if the user is authenticated 

passport.checkAuthentication=function(req,res,next){
    //if the user is signed ein, then pass on the request to the next function (controller's action)
    if(req.isAuthenticated()){
        return next();
    }

    //if the user is not singned in \
    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser=function(req,res,next){
    if(req.isAuthenticated()){
        //req.user contains signed in user from the session cookie and we are kust sendin grhis to the locals for the views
        res.locals.user=req.user;
    }

    next();
}
module.exports=passport;