const { validationResult } = require("express-validator/check");
const profileValidators = require("./profile");
const uploadValidators = require("./upload");
const userValidators = require("./user");
const eventValidators = require("./event");

module.exports = {
	...profileValidators,
	...uploadValidators,
	...userValidators,
	...eventValidators,
	// TODO: EXTRACT ERRORS AND SEND AS RESPONSE
	validationResult: (req, res, next) => {
		const result = validationResult(req);
		if (!result.isEmpty()) {
			return res.status(422).json({ errors: result.array() });
		}
		next();
	}
};
