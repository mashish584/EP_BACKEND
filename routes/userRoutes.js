const express = require("express");
const router = express.Router();

// Hanlders
const {
	upload_ms,
	upload_on_imagekit,
	catchAsyncError
} = require("../handlers/_index");

// Validators
const { validateImageUpload } = require("../validators/upload");

// Controllers
const {
	GET_USER_PROFILE,
	GET_USER_HOSTED_EVENTS,
	GET_USER_SETTINGS,
	GET_USER_WALLET,
	PUT_UPDATE_PROFILE_IMAGE
} = require("../controllers/userControllers");

// GET ROUTES
router.get("/me", GET_USER_PROFILE);
router.get("/events", GET_USER_HOSTED_EVENTS);
router.get("/wallet", GET_USER_WALLET);
router.get("/setting", GET_USER_SETTINGS);

// PUT ROUTES
router.put(
	"/me/upload",
	upload_ms.single("profile"),
	validateImageUpload,
	catchAsyncError(upload_on_imagekit),
	catchAsyncError(PUT_UPDATE_PROFILE_IMAGE)
);

module.exports = router;
