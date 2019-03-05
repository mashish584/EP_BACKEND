const express = require("express");
const router = express();

const {
	GET_HOMEPAGE,
	GET_EVENT_DESCRIPTION,
	GET_CATEGORY_EVENTS,
	GET_EVENT_ADDFORM
} = require("../controllers/indexControllers.js");

router.get("/", GET_HOMEPAGE);
router.get("/event/:slug", GET_EVENT_DESCRIPTION);
router.get("/category/:eventName", GET_CATEGORY_EVENTS);
router.get("/host-event", GET_EVENT_ADDFORM);

module.exports = router;
