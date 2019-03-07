const { randomBytes } = require("crypto");
const { compareSync, hashSync } = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const User = require("../models/User");
const { send } = require("../handlers/mailHandler");

/*================================
			GET CONTROLLERS
=================================*/
exports.GET_LOGIN = (req, res, next) => {
	return res.render("login", { title: "Login" });
};

exports.GET_REGISTER = (req, res, next) => {
	return res.render("signup", { title: "Become a host" });
};

exports.GET_FORGOT = (req, res, next) => {
	return res.render("forgot", { title: "Get new password" });
};

exports.GET_LOGOUT = (req, res, next) => {
	// TODO: Delete session & redirect back
	delete req.session.user;
	return res.redirect("back");
};

/*================================
			POST CONTROLLERS
=================================*/

exports.POST_SIGNUP = async (req, res, next) => {
	/**
	 *  *POST_SIGNUP_TODOS
	 * 	TODO #1: Generate confirmation token for user validation
	 * 	TODO #2: Save user info with confirmation token
	 * 	TODO #3: Send confirmation mail to user
	 * 	TODO #4: Return success response
	 *  *FINSISH
	 */

	//TODO #1 :
	const confirmationToken = randomBytes(Math.floor(Math.random() * 64)).toString("hex");

	//TODO #2 :
	const { email } = await new User({
		...req.body,
		confirmationToken
	}).save();

	// TODO #3:
	await send({
		receiver: email,
		token: confirmationToken,
		type: "activation",
		subject: "Welcome to EP",
		message: `Thanks for joining our platform.Please <a href="${
			process.env.BASE_URL
		}/account/activation/${confirmationToken}">visit</a> to activate your account.`
	});

	// TODO #4:
	return res.status(200).json({
		success: {
			msg: "Account created.Please check your mail account for activation link."
		}
	});
};

exports.POST_SIGNIN = async (req, res, next) => {
	/**
	 *  *POST_SIGNIN_TODOS
	 * 	TODO #1: Extract body
	 * 	TODO #2: Find user
	 * 		? if exist compare password
	 * 		? if match check active status
	 * 		? if status true generate jwt save it in user "session"
	 * 		* return success message
	 * 	TODO #3:
	 * 			!Throw Error
	 *  *FINSISH
	 */

	//  TODO #1:
	const { email, password } = req.body;

	// TODO #2:
	const user = await User.findOne({ email });

	if (user) {
		//? compare password
		if (compareSync(password, user.password)) {
			//? check active status
			if (!user.active) {
				return res.status(401).json({ errors: [{ location: "#signin", msg: "Please activate your account." }] });
			}
			//? generate jwt and set session
			req.session.user = sign({ userId: user.id }, process.env.SECRET);
			return res.status(200).json({ success: { msg: "Access granted." } });
		}
	}

	//! throw error for failed login
	return res.status(401).json({ errors: [{ location: "#signin", msg: "Email and Password not matched." }] });
};

exports.POST_FORGOT = async (req, res, next) => {
	/**
	 *  *POST_FORGOT
	 * 	TODO #1: Extract email from body and validate it for empty value
	 * 	TODO #2: If email is valid create new password with "crypto"
	 * 	TODO #3: Find user & updated the password hash in db with new password hash
	 * 	TODO #4: If user is not null
	 * 			? send new generated pasword on user email account
	 *		TODO #5: Send success message in everu case
	 *  *FINSISH
	 */

	// TODO #1:
	const { email } = req.body;

	if (!email) {
		req.flash("error", "Email is missing.");
		return res.redirect("back");
	}

	// TODO #2:
	const newPassword = randomBytes(22)
		.toString("hex")
		.substring(3, 12);

	// TODO #3:
	const user = await User.findOneAndUpdate({ email }, { password: hashSync(newPassword, 5) });

	// TODO #4:
	if (user) {
		//send new password
		await send({ receiver: email, subject: "Forgot Password", message: `Your new password is ${newPassword} .` });
	}

	// TODO #5:
	req.flash("success", "New password generated.Please check your mail account.");
	return res.redirect("back");
};
