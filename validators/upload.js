const { formatErrors } = require("../util");

// TODO: VALIDATE SINGLE IMAGE UPlOAD
exports.validateImageUpload = (req, res, next) => {
	const { file } = req;

	if (file && !file.mimetype.includes("image")) {
		return res
			.status(422)
			.json(formatErrors("Invalid image Type", "body", "image"));
	}

	next();
};
