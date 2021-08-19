var express = require('express');
var router = express.Router();

const {getUser, getUserById, updateUser, userPurchaseList}= require("../controllers/user");
const {isSignedin, isAuthenticated, isAdmin}= require("../controllers/auth");

router.param("userId", getUserById);

router.get("/user/:userId", isSignedin, isAuthenticated, getUser);

router.put("/user/:userId", isSignedin, isAuthenticated,updateUser);

router.put("/order/user/:userId", isSignedin, isAuthenticated,userPurchaseList);

module.exports = router
