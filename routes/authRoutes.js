const express = require("express");
const passport = require("passport");
const router = express.Router();

// validators
const {
	validateUserData,
	valdidateLoginData,
	validationResult
} = require("../validators/_index");

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

//Handlers
const { catchAsyncError, UNAUTH_GUARD } = require("../handlers/_index");

// GET ROUTES
router.get("/login", UNAUTH_GUARD, GET_LOGIN);
router.get("/signup", UNAUTH_GUARD, GET_REGISTER);

// * Facebook Auth
router.get("/auth/facebook", passport.authenticate("facebook", { scope: "email" }));
router.get(
	"/auth/facebook/callback",
	passport.authenticate("facebook", {
		failureRedirect: "/login",
		successRedirect: "/",
		failureFlash: true
	})
);

// * Google Auth
router.get("/auth/google", passport.authenticate("google", { scope: ["email"] }));

router.get(
	"/auth/google/callback",
	passport.authenticate("google", {
		failureRedirect: "/login",
		successRedirect: "/",
		failureFlash: true
	})
);

router.get("/forgot", UNAUTH_GUARD, GET_FORGOT);
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
