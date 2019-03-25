const { hashSync } = require("bcryptjs");
const axios = require("axios");
const User = require("../models/User");
const Event = require("../models/Event");
const Booking = require("../models/Booking");
const { delete_image_from_imagekit } = require("../handlers/_index");
const { formatSuccess, createPagination, createJWT } = require("../util");

// GET CONTROLLERS
exports.GET_USER_PROFILE = async (req, res, next) => {
	// TODO #1 : GET AUTH USER INFO
	const userInfo = await User.findOne({ _id: req.user.id }).select(
		"-password -confirmationToken"
	);
	return res.render("user_info", { title: "My Profile", userInfo });
};

exports.GET_USER_HOSTED_EVENTS = async (req, res, next) => {
	//TODO #1 : Pagination setup
	const count = await Event.countDocuments({ organiser: req.user.id });
	const pagination = await createPagination(count, req.params.page);

	//TODO #2 : Redirect user to /events if page < 1 / Redirect user to last page if page > pages
	if (pagination.pages && pagination.page < 1)
		return res.redirect("/profile/events");
	if (pagination.pages && pagination.page > pagination.pages)
		return res.redirect(`/profile/events/${pagination.pages}`);

	// TODO #3 : Get all events of current user
	const events = await Event.find({ organiser: req.user.id })
		.skip(pagination.skip)
		.limit(pagination.limit);

	return res.render("user_event", {
		title: "My Hosted Events",
		events,
		pagination,
		userInfo: { id: req.user.id }
	});
};

exports.GET_USER_WALLET = async (req, res, next) => {
	// TODO #1: Get wallet type
	const { type, page } = req.params;

	// TODO #2: Count items
	let count;

	if (type === "paid" || type === "receive") {
		count = await Booking.countDocuments({
			[type === "paid" ? "payer" : "receiver"]: req.user.id
		});
	} else {
		return next();
	}

	// TODO #3: Pagination setup
	const pagination = await createPagination(count, page);

	// TODO #4: Redirect user to /wallet/:type if page < 1 / Redirect to last page page>pages
	if (pagination.pages && pagination.page < 1)
		return res.redirect(`/profile/wallet/${type}`);
	if (pagination.pages && pagination.page > pagination.pages)
		return res.redirect(`/profile/wallet/${type}/${pagination.pages}`);

	// TODO #5: Get all wallet details
	let wallet = [];
	if (type === "paid" || type === "receive") {
		wallet = await Booking.find({
			[type === "paid" ? "payer" : "receiver"]: req.user.id
		})
			.sort({ createdAt: -1 })
			.skip(pagination.skip)
			.limit(pagination.limit);
	}

	// TODO #6: Get user wallet paid and receive amount
	const data = await Booking.find({
		$or: [{ receiver: req.user.id }, { payer: req.user.id }]
	}).select("+amount +receiver +payer");

	const paid = data.reduce(
		(prev, item) =>
			String(item.payer) === req.user.id ? prev + item.amount : prev,
		0
	);

	const receive = data.reduce(
		(prev, item) =>
			String(item.receiver) === req.user.id ? prev + item.amount : prev,
		0
	);

	return res.render("user_wallet", {
		title: "My Wallet",
		type,
		wallet,
		pagination,
		userInfo: { id: req.user.id, receive, paid }
	});
};

exports.GET_USER_SETTINGS = async (req, res, next) => {
	// TODO #1 : GET AUTH USER INFO
	const userInfo = await User.findOne({ _id: req.user.id }).select(
		"-password -confirmationToken"
	);
	return res.render("user_settings", { title: "Settings", userInfo });
};

exports.GET_USER_STRIPE_CONNECT = async (req, res, next) => {
	// TODO #1 : Create data object for oauth
	const data = {
		client_secret: process.env.STRIPE_SEC, //stripe secret
		code: req.query.code, //auth_code
		grant_type: "authorization_code"
	};
	// TODO #2 : Perform oauth
	let { data: response } = await axios.post(
		`https://connect.stripe.com/oauth/token`,
		data
	);

	// TODO #3 : Save user stripe account
	const user = await User.findOneAndUpdate(
		{ _id: req.user.id },
		{ connect: response.stripe_user_id },
		{ new: true }
	);

	// TODO #4 : Update the user session with new jwt
	req.session.user = createJWT(user);

	// TODO #5 : Create success flash
	req.flash(
		"success",
		"Your stripe account is successfully connect with our platform."
	);

	// TODO #5 : Redirect user to /host-event
	return res.redirect(`${process.env.BASE_URL}/host-event`);
};

// PUT CONTROLLERS

/**
 * * Profile Info Update
 * 	TODO #1 : Find auth user and update his profile Info
 * 	TODO #2 : Return success
 * *Finshed
 */

exports.PUT_UPDATE_PROFILE_INFO = async (req, res, next) => {
	// TODO #1 :
	await User.findOneAndUpdate({ _id: req.user.id }, req.body, {
		new: true
	}).exec();
	// TODO #2 :
	return res.status(200).json(formatSuccess({ msg: "Profile info updated." }));
};

/**
 * * Profile Image Upload Todos
 * 	TODO #1 : Extract data from request body
 * 	TODO #2 : Update the loggedIn user profile image
 * 	TODO #3 : Delete existing image from server if exist
 * 	TODO #3 : Return success message
 * *Finished
 */
exports.PUT_UPDATE_PROFILE_IMAGE = async (req, res, next) => {
	// TODO #1:
	const { uploadImg: profileImg, imageUrl } = req.body;
	// TODO #2:
	const user = await User.findOneAndUpdate({ _id: req.user.id }, { profileImg });
	// TODO #3:
	if (user.profileImg) {
		await delete_image_from_imagekit(user.profileImg);
	}
	//TODO #4:
	return res
		.status(200)
		.json(formatSuccess({ msg: "Upload success", profileImg, imageUrl }));
};

/**
 *  * Profile Password Update
 * 	TODO #1 : Extract new password from body
 * 	TODO #2 : Hash it & update the auth user with new password
 * 	TODO #3 : Return success message
 *  * Finished
 */
exports.PUT_UPDATE_PROFILE_PASSWORD = async (req, res, next) => {
	// TODO #1:
	const { newPassword: password } = req.body;
	// TODO #2:
	await User.findOneAndUpdate(
		{ _id: req.user.id },
		{ password: hashSync(password) }
	).exec();
	//TODO #3:
	return res.status(200).json(formatSuccess({ msg: "Password updated." }));
};
