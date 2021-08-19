var express = require("express");
var router = express.Router();

const {getProductById, createProduct, getAProduct, photo, deleteProduct, updateProduct, getAllProduct, getAllCategories} = require("../controllers/product")
const { getUserById } = require("../controllers/user");
const { isSignedin, isAdmin, isAuthenticated } = require("../controllers/auth");

//Params
router.param("userId", getUserById);
router.param("productId", getProductById);

//Actual Routes
//create routes
router.post("/product/create/:userId",isSignedin, isAuthenticated , isAdmin, createProduct);

//read routes
router.get("/product/:productId", getAProduct);
router.get("/product/photo/:productId", photo);

//update route
router.put("/product/:productId/:userId",isSignedin, isAuthenticated , isAdmin, updateProduct);


//delete route
router.delete("/product/:productId/:userId",isSignedin, isAuthenticated , isAdmin, deleteProduct);


//listing route
router.get("/products", getAllProduct);
router.get("/product/categories", getAllCategories);

module.exports = router;
