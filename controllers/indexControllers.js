const User = require("../models/User");
const Event = require("../models/Event");
const {
	getNumberFromTime,
	formatSuccess,
	createPagination,
	moment
} = require("../util");
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

exports.GET_USER_PROFILE = async (req, res, next) => {
	//TODO : Redirect to /profile if owner is visitor
	if (req.user === req.params.id) {
		return res.redirect("/profile/me");
	}
	// TODO : Find profile user Info
	const userInfo = await User.findOne({ _id: req.params.id });
	return res.render("user_info", {
		title: userInfo.fullname,
		userInfo
	});
};

exports.GET_USER_HOSTED_EVENTS = async (req, res, next) => {
	//TODO : Redirect to /profile if owner is visitor
	if (req.user === req.params.id) {
		return res.redirect("/profile/events");
	}
	//TODO #1 : Pagination setup
	const count = await Event.countDocuments({ organiser: req.params.id });
	const pagination = await createPagination(count, req.params.page);

	//TODO #2 : Redirect user to /events if page < 1 / Redirect user to last page if page > pages
	if (pagination.pages && pagination.page < 1)
		return res.redirect(`/user/profile/${req.params.id}/events`);
	if (pagination.pages && pagination.page > pagination.pages)
		return res.redirect(
			`/user/profile/${req.params.id}/events/${pagination.pages}`
		);

	// TODO #3 : Get all events of current user
	const events = await Event.find({ organiser: req.params.id })
		.skip(pagination.skip)
		.limit(pagination.limit);

	return res.render("user_event", {
		title: "My Hosted Events",
		events,
		pagination,
		userInfo: { id: req.params.id }
	});
};

exports.GET_EVENT_SEARCH = async (req, res, next) => {
	const { category, lng, lat, location } = req.query;
	const events = await Event.find({
		"location.coordinates": {
			$geoWithin: { $centerSphere: [[lng, lat], 15.7 / 3963.2] }
		}
	});
	return res.json({ category, lng, lat, location, events });
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
	)
		.exec()
		.catch(err => console.log(err));

	// TODO #3:
	if (req.body.cover && event.cover) {
		await delete_image_from_imagekit(event.cover);
	}

	// TODO #4:
	return res
		.status(200)
		.success(formatSuccess({ msg: "Event updated", event: req.body }));
};
