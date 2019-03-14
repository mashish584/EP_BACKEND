const { check } = require("express-validator/check");
const User = require("../models/User");

// TODO: VALIDATE LOGIN FORM DATA
exports.valdidateLoginData = [
	check("email")
		.trim()
		.isLength({ min: 1 })
		.withMessage("Please enter your email address"),
	check("password")
		.isLength({ min: 1 })
		.withMessage("Please enter your password")
];

// TODO: VALIDATE SIGNUP FORM DATA
exports.validateUserData = [
	check("fullname")
		.trim()
		.not()
		.isEmpty()
		.escape()
		.withMessage("Please enter your fullname"),

	check("email")
		.trim()
		.isEmail()
		.withMessage("Please enter your valid email address")
		.custom(async value => {
			if (value) {
				const user = await User.findOne({
					email: { $regex: value, $options: "i" }
				});
				if (user)
					throw new Error("User is already registered with provided email");
			}
		}),

	check("password").custom(value => {
		const regExp = new RegExp(
			"^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(.{8,12}$)"
		);
		if (!regExp.test(value)) {
			throw new Error(
				"Password must be 8-12 characters long and must contain atleast one lowercase,uppercase,number & special character"
			);
		}
		return value ? value : true;
	}),

	check("confirm")
		.not()
		.isEmpty()
		.withMessage("Please confirm your password")
		.custom((value, { req }) => {
			if (value && req.body.password !== value) {
				throw new Error("Password mismatch");
			}
			return value ? value : true;
		})
];
