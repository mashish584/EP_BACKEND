const express = require("express");
const router = express.Router();

const { GET_LOGIN, GET_FORGOT, GET_REGISTER } = require("../controllers/authControllers");

router.get("/login", GET_LOGIN);
router.get("/signup", GET_REGISTER);
router.get("/forgot", GET_FORGOT);

module.exports = router;
