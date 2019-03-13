const express = require("express");
const router = express();

// Hanlders
const {
	upload_ms,
	upload_on_imagekit,
	catchAsyncError
} = require("../handlers/_index");

// Validators
const {
	validateEventData,
	validateImageUpload,
	validationResult
} = require("../validators/_index");
// Controllers
const {
	GET_HOMEPAGE,
	GET_EVENT_DESCRIPTION,
	GET_CATEGORY_EVENTS,
	GET_EVENT_ADDFORM,
	GET_EVENT_UPDATEFORM,
	POST_ADD_EVENT,
	PUT_UPDATE_EVENT
} = require("../controllers/indexControllers.js");

// GET ROUTES
router.get("/", GET_HOMEPAGE);
router.get("/event/:slug", GET_EVENT_DESCRIPTION);
router.get("/category/:eventName", GET_CATEGORY_EVENTS);
router.get("/host-event", GET_EVENT_ADDFORM);
router.get("/event/:id/update", GET_EVENT_UPDATEFORM);

// POST ROUTES
router.post(
	"/host-event",
	upload_ms.single("image"),
	validateEventData,
	validateImageUpload,
	validationResult,
	upload_on_imagekit,
	catchAsyncError(POST_ADD_EVENT)
);

// PUT ROUTES

// router.put(
// 	"/event/:id/update",
// 	upload_ms.single("image"),
// 	validateEventData,
// 	validateImageUpload,
// 	validationResult,
// 	upload_on_imagekit,
// 	catchAsyncError(PUT_UPDATE_EVENT)
// );

module.exports = router;
