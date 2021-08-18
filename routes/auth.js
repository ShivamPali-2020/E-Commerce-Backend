var express = require("express");
var router = express.Router();
const { signout,signup,signin, isSignedin } = require("../controllers/auth");
const { check } = require('express-validator');
const { min } = require("lodash");


router.post("/signup",
[
    check('name').isLength({min:3}).withMessage('name must be at least 3 chars long'),
    check('email').isEmail().withMessage('email is required'),
    check('password').isLength({min:5}).withMessage('password must be at least 5 chars long')
], signup); 

router.post("/signin",
[
    check('email').isEmail().withMessage('email is required'),
    check('password').isLength({min:5}).withMessage('password must be at least 5 chars long')
], signin)

router.get("/testroute",isSignedin,(req,res)=>{
    res.send(
        req.auth
    )
});


router.get("/signout", signout);

module.exports = router;
