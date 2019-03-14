const Event = require("../models/Event");
const { getNumberFromTime, formatSuccess, moment } = require("../util");
const { delete_image_from_imagekit } = require("../handlers/uploadHandler");
const { categories } = require("../data/sample");

// GET CONTROLLERS

exports.GET_HOMEPAGE = async (req, res, next) => {
	// TODO : Fetch 4 events of next 20 days
	const upcomingEvents = await Event.find({
		$and: [
			{ date: { $gte: Date.now() } },
			{ date: { $lte: moment().add(20, "days") } }
		]
	}).limit(4);
	return res.render("index", { title: "Home", upcomingEvents, categories });
};

exports.GET_EVENT_DESCRIPTION = async (req, res, next) => {
	//TODO: Fetch event with slug
	const event = await Event.findOne({ slug: req.params.slug });
	// TODO : Fetch 4 other events of "event" host
	const otherEvents = await Event.find({
		_id: { $ne: event.id },
		organiser: event.organiser
	}).limit(4);
	return res.render("event_desc", { title: event.name, event, otherEvents });
};

exports.GET_CATEGORY_EVENTS = async (req, res, next) => {
	const { name: category } = req.params;
	const events = await Event.find({
		category: { $regex: category, $options: "i" }
	});

	return res.render("event_list", { title: category, category, events });
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
		organiser: req.user
	}).save();

	// TODO #2:
	return res.status(200).json(formatSuccess({ msg: "Event added", event }));
};

// PUT CONTROLLERS

/**
 * *Update Event
 * 	TODO #1 : Check upload body property and set it equal to cover if value exist
 * 	TODO #2 : Find Event and update it
 * 	TODO #3 : Delete old image from server if cover image is in body
 * 	TODO #4 : Return success with updated event data
 * *Finished
 */

exports.PUT_UPDATE_EVENT = async (req, res, next) => {
	const { id } = req.params;
	// TODO #1:
	if (req.body.uploadImg) {
		req.body.cover = req.body.uploadImg;
	}

	// TODO #2:
	const event = await Event.findOneAndUpdate(
		{ _id: id },
		{
			...req.body,
			time: {
				start: getNumberFromTime(req.body.start),
				end: getNumberFromTime(req.body.end)
			},
			location: JSON.parse(req.body.location),
			date: moment(req.body.date, "DD/MM/YYYY").valueOf()
		}
	).exec();

	// TODO #3:
	if (req.body.cover && event.cover) {
		await delete_image_from_imagekit(event.cover);
	}

	// TODO #4:
	return res
		.status(200)
		.success(formatSuccess({ msg: "Event updated", event: req.body }));
};
