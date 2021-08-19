const express= require("express");
const router = express.Router();
const {getOrderById, createOrder, getAllOrders, getOrderStatus, updateStatus}= require("../controllers/order")
const { getUserById, pushOrderInPurchaseList } = require("../controllers/user");
const { isSignedin, isAuthenticated, isAdmin } = require("../controllers/auth");
const { updateStock } = require("../controllers/product")

//Param

router.param("userId", getUserById);
router.param("orderId", getOrderById);

//Actual Routes 
//create
router.post("/order/create/:userId",isSignedin,isAuthenticated, pushOrderInPurchaseList, updateStock, createOrder);

//read
router.get("/order/all/:userId",isSignedin,isAuthenticated,isAdmin, getAllOrders );

//status of order
router.get("/order/status/:userId",isSignedin, isAuthenticated, isAdmin, getOrderStatus);
router.put("/order/:orderId/status/:userId",isSignedin, isAuthenticated, isAdmin, updateStatus)


module.exports = router;