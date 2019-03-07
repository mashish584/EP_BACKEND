const express = require("express");
const router = express.Router();

// validators
const { validateUserData, valdidateLoginData, validationResult } = require("../validators/user");

// Controllers
const {
	GET_LOGIN,
	GET_FORGOT,
	GET_REGISTER,
	GET_LOGOUT,
	POST_SIGNIN,
	POST_SIGNUP,
	POST_FORGOT
} = require("../controllers/authControllers");

// GET ROUTES
router.get("/login", GET_LOGIN);
router.get("/signup", GET_REGISTER);
router.get("/forgot", GET_FORGOT);
router.get("/logout", GET_LOGOUT);

// POST ROUTES
router.post("/signin", valdidateLoginData, validationResult, POST_SIGNIN);
router.post("/signup", validateUserData, validationResult, POST_SIGNUP);
router.post("/forgot", POST_FORGOT);

module.exports = router;
