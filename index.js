const express=require('express');
const cookieParser=require('cookie-parser');
const app=express();
const port =8000;
const expressLayouts=require('express-ejs-layouts');
const db=require('./config/mongoose');


app.use(express.urlencoded());
app.use(cookieParser());
app.use(express.static('./assets'));
app.use(expressLayouts);
// extracts style and scripts from sub pages into the layout
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);
app.use('/',require('./routes'));

app.set('view engine','ejs');

app.set('views','./views');

app.listen(port,function(err){
    if(err){
        console.log(`Error in running the srever:${err}`);
        return;
    }
    console.log(`srever is ruuning on the port:${port}`);
})