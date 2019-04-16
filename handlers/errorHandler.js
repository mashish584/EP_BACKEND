const { formatErrors } = require("../util");

/**
 * Async/Await Error Handler
 */
exports.catchAsyncError = fn => (req, res, next) => fn(req, res, next).catch(next);

/**
 * 404 Errors
 */

exports.NotFoundError = (req, res, next) => {
	const error = new Error("Not Found");
	error.status = 404;
	next(error);
};

/**
 * Error Rendering for user
 */

exports.ErrorRendering = (err, req, res, next) => {
	let { message, status, name } = err;

	// check for jsonwebtoken error
	if (name.toLowerCase() === "jsonwebtokenerror") {
		status = 400; //Bad request
		message = "Invalid token for access";
		// if not ajax request "logout" user
		if (!req.isAjax) {
			delete req.session.user;
			delete req.session.passport;
			return res.redirect("/");
		}
	}

	if (!req.isAjax) {
		res.locals.message = message;
		res.locals.status = status || 500;
		// error stack based on project mode
		res.locals.errorStack = process.env.MODE === "dev" ? err.stack : "";
		return res.render("error", { title: message });
	} else {
		// log the stack
		console.log(err.stack);
		return res.status(status || 500).json(formatErrors(message));
	}
};
