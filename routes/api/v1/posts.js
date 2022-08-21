const express=require('express');

const router =express.Router();
const passport=require('passport');


const postsApi=require('../../../controllers/api/v1/posts_api');


router.get('/',postsApi.index)
// prevent session cookie genrated we have to use the session:false
router.delete('/:id',passport.authenticate('jwt',{session:false}),postsApi.destroy);

module.exports=router;