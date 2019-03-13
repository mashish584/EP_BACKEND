const Event = require("../models/Event");
const { getNumberFromTime, formatSuccess, moment } = require("../util");
const { categories } = require("../data/sample");

// GET CONTROLLERS
exports.GET_HOMEPAGE = (req, res, next) => {
	return res.render("index", { title: "Home", categories });
};

exports.GET_EVENT_DESCRIPTION = (req, res, next) => {
	return res.render("event_desc", { title: "BMX" });
};

exports.GET_CATEGORY_EVENTS = (req, res, next) => {
	return res.render("event_list", { title: "Event List" });
};

exports.GET_EVENT_ADDFORM = (req, res, next) => {
	return res.render("add_event", { title: "Host Event", categories });
};

exports.GET_EVENT_UPDATEFORM = async (req, res, next) => {
	const { id } = req.params;
	const event = await Event.findOne({ _id: id });
	return res.render("update_event", { title: event.name, event, categories });
};

// POST CONTROLLERS
/**
 * * Add Event
 * 	TODO #1: Create event & update incoming body data
 * 	TODO #2: Return success message
 * * Finished
 */
exports.POST_ADD_EVENT = async (req, res, next) => {
	// TODO #1:
	const event = await new Event({
		...req.body,
		time: {
			start: getNumberFromTime(req.body.start),
			end: getNumberFromTime(req.body.end)
		},
		location: JSON.parse(req.body.location),
		date: moment(req.body.date, "DD/MM/YYYY").valueOf(),
		cover: req.body.uploadImg,
		user: req.user
	}).save();

	// TODO #2:
	return res.status(200).json(formatSuccess({ msg: "Event added", event }));
};
