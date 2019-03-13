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

exports.moment = require("moment");
