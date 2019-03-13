const { check } = require("express-validator/check");
const moment = require("moment");

exports.validateEventData = [
	check("name")
		.trim()
		.not()
		.isEmpty()
		.escape()
		.withMessage("Please enter name of an event"),
	check("spot")
		.trim()
		.custom(value => {
			if (value && isNaN(value)) {
				throw new Error("Please enter valid value for sport ");
			}
			return value ? value : true;
		}),
	check("location").custom(value => {
		const { coordinates, address } = JSON.parse(value);
		if (!address.trim() || coordinates.length !== 2) {
			throw new Error("Please select proper location");
		}
		return value ? value : true;
	}),
	check("category")
		.trim()
		.not()
		.isEmpty()
		.escape()
		.withMessage("Please select event category"),
	check("description")
		.trim()
		.isLength({ min: 25 })
		.escape()
		.withMessage("Please enter description of 25 words atleast"),
	check("date").custom(value => {
		if (!value) throw new Error("Please select data");
		if (value) {
			const [todayDate, eventDate] = [
				moment(new Date()).format("YYYY-MM-DD"),
				moment(value, "DD/MM/YYYY").format("YYYY-MM-DD")
			];
			if (moment(eventDate, "YYYY-MM-DD").isBefore(todayDate)) {
				throw new Error("Please select valid date");
			}

			return value;
		}
	}),
	check("start")
		.trim()
		.not()
		.isEmpty()
		.withMessage("Please select event start time"),
	check("end")
		.trim()
		.not()
		.isEmpty()
		.withMessage("Please select event end time"),
	check("price")
		.trim()
		.custom(value => {
			if (value && isNaN(value)) {
				throw new Error("Please enter valid value for price ");
			}
			return value ? value : true;
		})
];
