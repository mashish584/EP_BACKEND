const { compareSync, hashSync } = require("bcryptjs");
const User = require("../models/User");
const { send } = require("../handlers/_index");
const { formatErrors, formatSuccess, generateToken, createJWT } = require("../util");

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
	delete req.session.passport;
	return res.redirect("back");
};

exports.GET_ACTIVATE_ACCOUNT = async (req, res, next) => {
	/**
	 * *USER_ACCOUNT_ACTIVATE_TODOS
	 * 	TODO #1 : Extract token from body
	 * 	TODO #2 : Find user having a token & Update the isActive status to true & confirmationToken to null
	 * 	TODO #3 : Redirect user to login page
	 * 					? If user success flash
	 * 					? if !user error flash
	 * *FINISH
	 */

	//  TODO #1:
	const { token: confirmationToken } = req.params;
	// TODO #2:
	const user = await User.findOneAndUpdate(
		{ confirmationToken },
		{ confirmationToken: null, active: true }
	);
	// TODO #3:
	user
		? req.flash("success", "Account Activated.")
		: req.flash("error", "Invalid token.");
	return res.redirect("/login");
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
	 *  *FINISH
	 */

	//TODO #1 :
	const confirmationToken = generateToken();
	//TODO #2 :
	const { email } = await new User({
		...req.body,
		email: req.body.email.toLowerCase(),
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
	return res
		.status(200)
		.json(
			formatSuccess(
				"Account created.Please check your mail account for activation link."
			)
		);
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
	 *  *FINISH
	 */

	//  TODO #1:
	const { email, password } = req.body;

	// TODO #2:
	const user = await User.findOne({
		email: { $regex: email, $options: "i" }
	});

	if (user) {
		//? compare password
		if (compareSync(password, user.password)) {
			if (!user.active) {
				return res
					.status(401)
					.json(formatErrors("Please activate your account", "#signin"));
			}
			//? generate jwt and set session
			req.session.user = createJWT(user);
			return res.status(200).json(formatSuccess("Access granted."));
		}
	}

	//! throw error for failed login
	return res
		.status(401)
		.json(formatErrors("Email and Password not matched.", "#signin"));
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
	 *  *FINISH
	 */

	// TODO #1:
	const { email } = req.body;

	if (!email) {
		req.flash("error", "Email is missing.");
		return res.redirect("back");
	}

	// TODO #2:
	const newPassword = generateToken(22).substring(3, 12);

	// TODO #3:
	const user = await User.findOneAndUpdate(
		{ email },
		{ password: hashSync(newPassword, 5) }
	);

	// TODO #4:
	if (user) {
		//send new password
		await send({
			receiver: email,
			subject: "Forgot Password",
			message: `Your new password is ${newPassword} .`
		});
	}

	// TODO #5:
	req.flash("success", "New password generated.Please check your mail account.");
	return res.redirect("back");
};
