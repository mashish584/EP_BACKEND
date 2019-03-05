/**
 * Async/Await Error Handler
 */
exports.CatchAsyncError = fn => (req, res, next) => fn(req, res, next).catch(next);

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
	const { message, status } = err;
	res.locals.message = message;
	res.locals.status = status || 500;
	// error stack based on project mode
	res.locals.errorStack = process.env.MODE = "dev" ? err.stack : "";
	return res.render("error", { title: message });
};
