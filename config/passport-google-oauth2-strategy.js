const passport=require('passport');
const googleStrategy =require('passport-google-oauth').OAuth2Strategy;
//crypto use for genration the random secret key
const crypto=require('crypto');
const User=require('../models/user');


//tell passpor to use the a new strategy for google login

passport.use(new googleStrategy({
    clientID:"737931005215-fvj6ctqtjcthf3f5igd9bop192hcun5u.apps.googleusercontent.com",
    clientSecret:"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",
    callbackURL:"http://localhost:8000/users/auth/google/callback",
},
//it show the same as JWT give the token to header,hear also token genrated by the google, if that expire the token then it will refresh by making again token
function(accessToken,refreshToken,profile,done){
    //profile content the user info 
    User.findOne({email:profile.emails[0].value}).exec(function(err,user){
        if(err){
            console.log('error in google strategyt',err);
            return ;
        }
        console.log(profile);
        if(user){
            //if found set this user as req.user
            return done(null,user);
        }else{
            //if not avilabe in the data base then we have to create in the db and set it as req.user
            User.create({
                name:profile.displayName,
                email:profile.emails[0].value,
                // this is how i am genrating the random password
                password:crypto.randomBytes(20).toString('hex')
            },function(err,user){
               if(err){
                console.log('error in creating the user in google strategy-passport',err);
                return;
               } ;
               return done(null,user);
            })
        }
    })
}




))



module.exports=passport;