const errorHandler = require("./errorHandler");
const mailHandler = require("./mailHandler");
const uploadHandler = require("./uploadHandler");

module.exports = {
	...errorHandler,
	...mailHandler,
	...uploadHandler
};
