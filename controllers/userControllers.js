const User = require("../models/User");
const { delete_image_from_imagekit } = require("../handlers/uploadHandler");
const { formatSuccess } = require("../util");

// GET CONTROLLERS
exports.GET_USER_PROFILE = (req, res, next) => {
	return res.render("user_info", { title: "My Profile" });
};

exports.GET_USER_HOSTED_EVENTS = (req, res, next) => {
	return res.render("user_event", { title: "My Hosted Events" });
};

exports.GET_USER_WALLET = (req, res, next) => {
	return res.render("user_wallet", { title: "My Wallet" });
};

exports.GET_USER_SETTINGS = (req, res, next) => {
	return res.render("user_settings", { title: "Settings" });
};

// PUT CONTROLLERS

/**
 * * Profile Image Upload Todos
 * 	TODO #1 : Extract data from request body
 * 	TODO #2 : Update the loggedIn user profile image
 * 	TODO #3 : Return success message
 * *Finished
 */
exports.PUT_UPDATE_PROFILE_IMAGE = async (req, res, next) => {
	const { profileImg, imageUrl } = req.body;
	const user = await User.findOneAndUpdate({ _id: req.user }, { profileImg });
	if (user.profileImg) {
		await delete_image_from_imagekit(user.profileImg);
	}
	return res
		.status(200)
		.json(formatSuccess({ msg: "Upload success", profileImg, imageUrl }));
};
