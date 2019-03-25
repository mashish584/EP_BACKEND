const { check } = require("express-validator/check");
const Event = require("../models/Event");
const { formatErrors, inputDateInPast, dateInPast } = require("../util");

exports.validateEventUpdate = async (req, res, next) => {
	const event = await Event.findOne({ _id: req.params.id });

	if (dateInPast(event.date)) {
		return res
			.status(400)
			.json(formatErrors((msg = "Update event failed."), (location = "form")));
	}

	next();
};

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
			if (inputDateInPast(value)) {
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
