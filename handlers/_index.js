const errorHandler = require("./errorHandler");
const mailHandler = require("./mailHandler");
const uploadHandler = require("./uploadHandler");
const guardHandler = require("./routeGuardsHandler");

module.exports = {
	...errorHandler,
	...mailHandler,
	...uploadHandler,
	...guardHandler
};
