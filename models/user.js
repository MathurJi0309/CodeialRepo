const mongoose=require('mongoose');

const multer=require('multer');
const path=require('path');
//avatar save here in this field 
const AVATAR_PATH=path.join('/uploads/users/avatars')

const userSchema=new mongoose.Schema({
    email:{
        type: String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    //we tell field where the path will store bocs database not store the file jsut store the path of the file  
    avatar:{
        type: String
    },
    friendships:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Friendship'
        }
    ]

},{
    timestamps:true
});

// we define some storage property for multer to local diskStorage
let storage =multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,path.join(__dirname,'..',AVATAR_PATH));
    },
    filename: function(req,file,cb){
        cb(null,file.fieldname +'-' + Date.now());
    }

});


// static 
userSchema.statics.uploadedAvatar =multer({storage:storage}).single('avatar');
//we make it avilabe the avtarPath publicly avilabe by static
userSchema.statics.avatarPath=AVATAR_PATH;

const User=mongoose.model('User',userSchema);

module.exports = User;