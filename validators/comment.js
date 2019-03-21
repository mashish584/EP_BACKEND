const { check } = require("express-validator/check");

exports.validateCommentData = [
	check("comment")
		.trim()
		.isLength({ min: 1 })
		.escape()
		.withMessage("Please enter something in comment box")
];

exports.valditeReplyData = [
	check("reply")
		.trim()
		.isLength({ min: 1 })
		.escape()
		.withMessage("Please enter something in reply box")
];
