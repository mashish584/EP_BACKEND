const express = require("express");
const router = express();

// Hanlders
const {
	upload_ms,
	upload_on_imagekit,
	catchAsyncError,
	AUTH_GUARD
} = require("../handlers/_index");

// Validators
const {
	validateEventUpdate,
	validateEventData,
	validateCommentData,
	valditeReplyData,
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
	GET_USER_PROFILE,
	GET_USER_HOSTED_EVENTS,
	GET_EVENT_SEARCH,
	GET_EVENT_COMMENTS,
	POST_ADD_EVENT,
	POST_CHECKOUT,
	POST_EVENT_COMMENT,
	POST_EVENT_COMMENT_REPLY,
	POST_CONTACT_MESSAGE,
	PUT_UPDATE_EVENT
} = require("../controllers/indexControllers.js");

// GET ROUTES
router.get("/", catchAsyncError(GET_HOMEPAGE));
router.get("/event/:slug", catchAsyncError(GET_EVENT_DESCRIPTION));
router.get("/category/:name", catchAsyncError(GET_CATEGORY_EVENTS));
router.get("/category/:name/:page", catchAsyncError(GET_CATEGORY_EVENTS));
router.get("/host-event", AUTH_GUARD, GET_EVENT_ADDFORM);
router.get("/event/:id/update", AUTH_GUARD, catchAsyncError(GET_EVENT_UPDATEFORM));
router.get("/user/profile/:id", catchAsyncError(GET_USER_PROFILE));
router.get("/user/profile/:id/events", catchAsyncError(GET_USER_HOSTED_EVENTS));
router.get(
	"/user/profile/:id/events/:page",
	catchAsyncError(GET_USER_HOSTED_EVENTS)
);
router.get("/search", catchAsyncError(GET_EVENT_SEARCH));
router.get("/event/:id/comments/:page", catchAsyncError(GET_EVENT_COMMENTS));

// api
router.get("/api/me", (req, res, next) => {
	return res.status(200).json({ userId: req.user ? req.user.id : null });
});

// POST ROUTES
router.post(
	"/host-event",
	AUTH_GUARD,
	upload_ms.single("image"),
	validateEventData,
	validateImageUpload,
	validationResult,
	catchAsyncError(upload_on_imagekit),
	catchAsyncError(POST_ADD_EVENT)
);

router.post(
	"/event/:id/comment",
	AUTH_GUARD,
	validateCommentData,
	validationResult,
	catchAsyncError(POST_EVENT_COMMENT)
);

router.post(
	"/event/:id/comment/:comment/reply",
	AUTH_GUARD,
	valditeReplyData,
	validationResult,
	catchAsyncError(POST_EVENT_COMMENT_REPLY)
);

router.post(
	"/checkout/connect/:type/:id",
	AUTH_GUARD,
	catchAsyncError(POST_CHECKOUT)
);

router.post("/contact", catchAsyncError(POST_CONTACT_MESSAGE));

// PUT ROUTES

router.put(
	"/event/:id/update",
	AUTH_GUARD,
	validateEventUpdate,
	upload_ms.single("image"),
	validateEventData,
	validateImageUpload,
	validationResult,
	catchAsyncError(upload_on_imagekit),
	catchAsyncError(PUT_UPDATE_EVENT)
);

module.exports = router;
