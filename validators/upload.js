const { formatErrors } = require("../util");

// TODO: VALIDATE SINGLE IMAGE UPlOAD
exports.validateImageUpload = (req, res, next) => {
	const {
		file: { mimetype }
	} = req;

	if (!mimetype.includes("image")) {
		return res
			.status(403)
			.json(formatErrors("Invalid image Type", "body", "profile"));
	}

	next();
};
