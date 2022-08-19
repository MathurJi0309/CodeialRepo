const express=require('express');


const router=express.Router();
const passport=require('passport');

const postsController=require('../controllers/posts_controller');
//passport.checkAuthentication is two level of check if they are sign in then they will be allowed to post something
router.post('/create',passport.checkAuthentication,postsController.create);
router.get('/destroy/:id',passport.checkAuthentication,postsController.destroy);
module.exports=router;