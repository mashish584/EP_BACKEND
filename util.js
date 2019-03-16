const { randomBytes } = require("crypto");

// generate token
exports.generateToken = (size = Math.floor(Math.random() * 64)) =>
	randomBytes(size).toString("hex");

// format all errors
exports.formatErrors = (msg, location = "", param = "") => {
	return {
		errors: [{ msg, location, param }]
	};
};

// format success message
exports.formatSuccess = data => {
	const obj = {
		success: {}
	};
	Object.keys(data).map(key => (obj.success[key] = data[key]));
	return obj;
};

// time to number
exports.getNumberFromTime = time => {
	const timeArray = time.split(":");
	const hours = parseInt(timeArray[0], 10) * 3600;
	const minutes = parseInt(timeArray[1], 10) * 60;
	return hours + minutes;
};

// number to time
exports.getTimeFromNumber = number => {
	const hours = parseInt(number / 3600, 10);
	const remain = number - hours * 3600;
	const minutes = remain / 60;
	return `${hours < 10 ? 0 : ""}${hours}:${minutes} ${hours > 12 ? "PM" : "AM"}`;
};

// camel case string
exports.formatCamelCase = string => {
	let words = string.split(" ");
	words = words.map(
		word => `${word.slice(0, 1).toUpperCase()}${word.substring(1)}`
	);
	return words.join(" ");
};

// create pagination
exports.createPagination = async (count, currentPage) => {
	const limit = parseInt(process.env.EVENT_PAGINATION_LIMIT, 10);
	const page = currentPage || 1;
	const pages = Math.ceil(count / limit);
	const skip = page * limit - limit;
	return { page: parseInt(page, 10), pages, skip, limit };
};

// moment
exports.moment = require("moment");
