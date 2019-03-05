const express = require("express");
const router = express.Router();

const {
	GET_USER_PROFILE,
	GET_USER_HOSTED_EVENTS,
	GET_USER_SETTINGS,
	GET_USER_WALLET
} = require("../controllers/userControllers");

router.get("/me", GET_USER_PROFILE);
router.get("/events", GET_USER_HOSTED_EVENTS);
router.get("/wallet", GET_USER_WALLET);
router.get("/setting", GET_USER_SETTINGS);

module.exports = router;
