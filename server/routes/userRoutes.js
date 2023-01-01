const {Router}=require('express')
const userController=require('../controllers/userControllers')

const router = Router();


router.post('/getUser', userController.getUser);
router.post('/signup', userController.signupUser);
router.post('/login', userController.loginUser);

module.exports=router