const express=require('express');


const router=express.Router();
const passport=require('passport');

const commentsController=require('../controllers/comments_controller');
//passport.checkAuthentication is two level of check if they are sign in then they will be allowed to post something
router.post('/create',passport.checkAuthentication,commentsController.create);

module.exports=router;