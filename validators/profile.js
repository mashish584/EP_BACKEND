const { compareSync } = require("bcryptjs");
const { check } = require("express-validator/check");
const User = require("../models/User");

exports.validateProfileInfo = [
	check("bio")
		.trim()
		.escape(),
	check("phone")
		.trim()
		.escape()
];

exports.validateResetForm = [
	check("oldPassword").custom(async (value, { req }) => {
		if (!value) throw new Error("Please enter your old password");
		if (value) {
			const { password } = await User.findOne({ _id: req.user.id });
			if (!compareSync(value, password)) {
				throw new Error("Old password is incorrect");
			}
		}
		return value ? value : true;
	}),
	check("newPassword").custom(value => {
		const regExp = new RegExp(
			"^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(.{8,12}$)"
		);
		if (!regExp.test(value)) {
			throw new Error(
				"Password must be 8-12 characters long and must contain atleast one lowercase,uppercase,number & special character"
			);
		}
		return value ? value : true;
	})
];
