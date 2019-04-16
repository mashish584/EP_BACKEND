const express = require("express");
const router = express.Router();

// Hanlders
const {
	upload_ms,
	upload_on_imagekit,
	catchAsyncError,
	AUTH_GUARD
} = require("../handlers/_index");

// Validators
const {
	validationResult,
	validateImageUpload,
	validateProfileInfo,
	validateResetForm
} = require("../validators/_index");

// Controllers
const {
	GET_USER_PROFILE,
	GET_USER_HOSTED_EVENTS,
	GET_USER_SETTINGS,
	GET_USER_WALLET,
	GET_USER_STRIPE_CONNECT,
	PUT_UPDATE_PROFILE_INFO,
	PUT_UPDATE_PROFILE_IMAGE,
	PUT_UPDATE_PROFILE_PASSWORD
} = require("../controllers/userControllers");

// route middleware
router.use(AUTH_GUARD);

// GET ROUTES
router.get("/me", catchAsyncError(GET_USER_PROFILE));
router.get("/events", catchAsyncError(GET_USER_HOSTED_EVENTS));
router.get("/events/:page", catchAsyncError(GET_USER_HOSTED_EVENTS));
router.get("/wallet/:type", catchAsyncError(GET_USER_WALLET));
router.get("/wallet/:type/:page", catchAsyncError(GET_USER_WALLET));
router.get("/setting", catchAsyncError(GET_USER_SETTINGS));
router.get("/stripe/connect/response", catchAsyncError(GET_USER_STRIPE_CONNECT));

// PUT ROUTES
router.put(
	"/me/info",
	validateProfileInfo,
	catchAsyncError(PUT_UPDATE_PROFILE_INFO)
);
router.put(
	"/me/upload",
	upload_ms.single("image"),
	validateImageUpload,
	catchAsyncError(upload_on_imagekit),
	catchAsyncError(PUT_UPDATE_PROFILE_IMAGE)
);

router.put(
	"/me/update/password",
	validateResetForm,
	validationResult,
	catchAsyncError(PUT_UPDATE_PROFILE_PASSWORD)
);

module.exports = router;
