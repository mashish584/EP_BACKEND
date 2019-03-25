const { formatErrors } = require("../util");

/**
 * AUTH GUARD
 * 	* Redirect unauth user to homepage
 * 	* Return json respone if ajax request detected
 */

exports.AUTH_GUARD = (req, res, next) => {
	if (!req.user) {
		return req.isAjax
			? res
					.status(401)
					.json(formatErrors((msg = "Not Authorize"), (location = "form")))
			: res.redirect("/");
	}
	next();
};

/**
 * UNAUTH GUARD
 * 	* Redirect login user to home if he/she try to access login page
 */

exports.UNAUTH_GUARD = (req, res, next) => {
	if (req.user) {
		return res.redirect("/");
	}
	next();
};
