const express = require("express");
const router = express.Router();

// validators
const {
	validateUserData,
	valdidateLoginData,
	validationResult
} = require("../validators/user");

// Controllers
const {
	GET_LOGIN,
	GET_FORGOT,
	GET_REGISTER,
	GET_LOGOUT,
	GET_ACTIVATE_ACCOUNT,
	POST_SIGNIN,
	POST_SIGNUP,
	POST_FORGOT
} = require("../controllers/authControllers");

// Asyn Error Handler
const { catchAsyncError } = require("../handlers/_index");

// GET ROUTES
router.get("/login", GET_LOGIN);
router.get("/signup", GET_REGISTER);
router.get("/forgot", GET_FORGOT);
router.get("/logout", GET_LOGOUT);
router.get("/account/activation/:token", catchAsyncError(GET_ACTIVATE_ACCOUNT));

// POST ROUTES
router.post(
	"/signin",
	valdidateLoginData,
	validationResult,
	catchAsyncError(POST_SIGNIN)
);
router.post(
	"/signup",
	validateUserData,
	validationResult,
	catchAsyncError(POST_SIGNUP)
);
router.post("/forgot", catchAsyncError(POST_FORGOT));

module.exports = router;
