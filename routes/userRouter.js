const express = require("express");
const router = express.Router();
const userController = require("../controllers/user/userController");
const passport = require("passport");

router.get("/pageNotFound",userController.pageNotFound);
router.get("/",userController.loadHomepage);
router.get("/signup",userController.loadSignup);
router.get("/shop",userController.loadShopping);
router.post('/signup',userController.signup);
router.post("/verify-otp",userController.verifyOtp);
router.post("/resend-otp",userController.resendOtp);
router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}));
router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/login', failureMessage:true,session:true}), async(req,res)=>{
    try {
        req.session.user = req.session.passport.user
        res.redirect('/')
    } catch (error) {
        console.error("Google callback error:", error);
        req.session.error_message = "Something went wrong";
        res.redirect("/login");
    }
}
);

router.get('/login',userController.loadLogin);
router.post("/login",userController.login);

router.get("/logout",userController.logout);

module.exports = router;