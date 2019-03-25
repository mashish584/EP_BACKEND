const moment = require("moment");
const { randomBytes } = require("crypto");
const { sign } = require("jsonwebtoken");

// create jwt
exports.createJWT = user => {
	return sign(
		{
			id: user.id,
			fullname: user.fullname,
			email: user.email,
			profileImg: user.profileImg
				? `${process.env.IMAGE_KIT_EP}${user.profileImg}`
				: "https://www.drupal.org/files/issues/default-avatar.png",
			connect: user.connect
		},
		process.env.SECRET
	);
};

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
exports.createPagination = async (
	count,
	currentPage,
	max = process.env.EVENT_PAGINATION_LIMIT
) => {
	const limit = parseInt(max, 10);
	const page = currentPage || 1;
	const pages = Math.ceil(count / limit);
	const skip = page * limit - limit;
	return { page: parseInt(page, 10), pages, skip, limit };
};

// Nest comment with replies
exports.nestCommentReplies = comments => {
	const [parent, child] = [
		comments.filter(comment => !comment.childOf),
		comments.filter(comment => comment.childOf)
	];
	return parent.map(comment => {
		const replies = child.filter(
			reply => reply.childOf.toString() === comment.id.toString()
		);
		// console.log(comment.replies);
		return {
			...comment._doc,
			replies
		};
	});
};

// function to check is input date in past
exports.inputDateInPast = date =>
	moment(moment(date, "DD/MM/YYYY").format("l"), "MM/DD/YYYY").isBefore(
		moment(moment().format("l"), "MM/DD/YYYY")
	);
// function to check is db date in past
exports.dateInPast = date =>
	moment(moment.unix(date / 1000).format("l"), "MM/DD/YYYY").isBefore(
		moment(moment().format("l"), "MM/DD/YYYY")
	);
// moment
exports.moment = moment;

// ObjectID
exports.ObjectId = require("mongoose").Types.ObjectId;
