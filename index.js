const express=require('express');
const cookieParser=require('cookie-parser');
const app=express();
const port =8000;
const expressLayouts=require('express-ejs-layouts');
const db=require('./config/mongoose');
//used for session cookie
const session=require('express-session');
const passport=require('passport');
const passportLocal=require('./config/passport-local-strategy'); 
const passportJWT=require('./config/passport-jwt-strategy');
const passportGoogle=require('./config/passport-google-oauth2-strategy');
const MongoStore =require('connect-mongo')(session);
const sassMiddleware=require('node-sass-middleware');
const flash = require('connect-flash');
const customMware=require('./config/middleware');


app.use(sassMiddleware({
    src:'./assets/scss',
    dest:'./assets/css',
    debug:true,
    outputstyle:'extended',
    prefix:'/css'


}));
app.use(express.urlencoded());
app.use(cookieParser());
app.use(express.static('./assets'));
//make the upload path avilable to browser
app.use('/uploads',express.static(__dirname + '/uploads'));


app.use(expressLayouts);
// extracts style and scripts from sub pages into the layout
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);


app.set('view engine','ejs');

app.set('views','./views');


//mongo store is used to store the session cookie in the db

app.use(session({
    //name of cookie
    name:'codeial',
    //key to encode and decode(we use proper key in deploment)
    secret:'blahsomething',
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:(1000*60*10)

    },
    store:new MongoStore(
         {
            mongooseConnection:db,
            autoRemove:'disabled'
    },
    function(err){
        if(err){
            console.log(err);
        }
        else{
            console.log('mongo store activated');
        }
    }
    )
    

}));

app.use(passport.initialize());
app.use(passport.session());


app.use(passport.setAuthenticatedUser);
//we use flash just after the session 
app.use(flash());
app.use(customMware.setFlash);

app.use('/',require('./routes'));


app.listen(port,function(err){
    if(err){
        console.log(`Error in running the srever:${err}`);
        return;
    }
    console.log(`srever is ruuning on the port:${port}`);
});