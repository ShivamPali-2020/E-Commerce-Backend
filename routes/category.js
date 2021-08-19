var express = require("express");
var router = express.Router();
const {
  getCategoryById,
  createCategory,
  getCategory,
  getAllCategories,
  updateCategory,
  removeCategory,
} = require("../controllers/category");
const { getUserById } = require("../controllers/user");
const { isSignedin, isAdmin, isAuthenticated } = require("../controllers/auth");

//Params
router.param("userId", getUserById);
router.param("categoryId", getCategoryById);

//Actual routers
//create
router.post(
  "/category/create/:userId",
  isSignedin,
  isAuthenticated,
  isAdmin,
  createCategory
);

//read
router.get("/category/:categoryId", getCategory);
router.get("/categories", getAllCategories);

//update
router.put(
  "/category/:categoryId/:userId",
  isSignedin,
  isAuthenticated,
  isAdmin,
  updateCategory
);

//delete
router.delete(
  "/category/:categoryId/:userId",
  isSignedin,
  isAuthenticated,
  isAdmin,
  removeCategory
);

module.exports = router;
