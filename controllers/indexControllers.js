const Stripe = require("stripe")(process.env.STRIPE_SEC);
const User = require("../models/User");
const Event = require("../models/Event");
const Comment = require("../models/Comment");
const Booking = require("../models/Booking");
const { send } = require("../handlers/mailHandler");
const {
	getNumberFromTime,
	formatSuccess,
	createPagination,
	formatErrors,
	nestCommentReplies,
	dateInPast,
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

	//! 404
	if (!event) return next();

	// TODO: Get all replies
	event.comments = nestCommentReplies(event.comments);

	// TODO: Check if login user got booking
	const isBookingExist = req.user
		? event.bookings.filter(booking => {
				if (String(booking.receiver) === req.user.id) {
					return booking;
				}
		  })
		: [];

	// TODO : Fetch 4 other events of "event" host
	const otherEvents = await Event.find({
		_id: { $ne: event.id },
		organiser: event.organiser
	}).limit(4);

	// TODO : Render template
	return res.render("event_desc", {
		title: event.name,
		event,
		isBookingExist,
		otherEvents
	});
};

exports.GET_CATEGORY_EVENTS = async (req, res, next) => {
	//TODO : Destruct and rename name param
	const { name: category } = req.params;

	//TODO #1 : Pagination setup
	const count = await Event.countDocuments({
		category: new RegExp(`^${category}$`, "i")
	});
	const pagination = await createPagination(count, req.params.page);

	//TODO #2 : Redirect user to /events if page < 1 / Redirect user to last page if page > pages
	if (pagination.pages && pagination.page < 1)
		return res.redirect(`/category/${category}}`);
	if (pagination.pages && pagination.page > pagination.pages)
		return res.redirect(`/category/${category}/${pagination.pages}`);

	// TODO #3 : Get all events
	const events = await Event.find({
		category: new RegExp(`^${category}$`, "i")
	})
		.skip(pagination.skip)
		.limit(pagination.limit);

	return res.render("event_list", {
		title: category,
		category,
		events,
		pagination
	});
};

exports.GET_EVENT_ADDFORM = (req, res, next) => {
	return res.render("add_event", { title: "Host Event", categories });
};

exports.GET_EVENT_UPDATEFORM = async (req, res, next) => {
	const { id } = req.params;
	const event = await Event.findOne({
		$and: [{ _id: id }, { organiser: req.user.id }]
	});

	//! 404
	if (!event) return next();

	return res.render("update_event", { title: event.name, event, categories });
};

exports.GET_USER_PROFILE = async (req, res, next) => {
	//TODO : Redirect to /profile if owner is visitor
	if (req.user.id === req.params.id) {
		return res.redirect("/profile/me");
	}
	// TODO : Find profile user Info
	const userInfo = await User.findOne({ _id: req.params.id });

	//! 404
	if (!userInfo) return next();

	return res.render("user_info", {
		title: userInfo.fullname,
		userInfo
	});
};

exports.GET_USER_HOSTED_EVENTS = async (req, res, next) => {
	//TODO : Redirect to /profile if owner is visitor
	if (req.user.id === req.params.id) {
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

/**
 *  * Search Todos
 * 	TODO #1 : Extract query properties in variable
 * 	TODO #2 : create empty object for filter & variable for storing operator type AND or OR
 * 		?Check for category
 * 		?Check for location
 * 			?Check for lng & lat
 *   TODO #3 : Update operator value
 *   TODO #4 : Pagination
 * 		?remove "?page" from url if exist and setup redirection for inappropriate page
 *   TODO #5 : Find Event and pass filter object & render search page
 *  * Finished
 */
exports.GET_EVENT_SEARCH = async (req, res, next) => {
	// TODO #1 :
	const { category, lng, lat, location } = req.query;
	// TODO #2 :
	const filterObj = [];
	let operator;

	// ? check for category
	if (category) {
		filterObj.push({
			category: category.toLowerCase() === "all" ? { $ne: category } : category
		});
	}
	// ? check for location and push lng and lat filter if available else push location filter
	if (location) {
		if (lng && lat) {
			filterObj.push({
				"location.coordinates": {
					// within 25 km
					$geoWithin: { $centerSphere: [[lng, lat], 15.7 / 3963.2] }
				}
			});
		} else {
			filterObj.push({
				"location.address": { $regex: location, $options: "i" }
			});
		}
	}

	// TODO #3 :
	operator = filterObj.length === 2 ? "$and" : "$or";

	// TODO #4 :
	const count = await Event.countDocuments({
		[operator]: filterObj,
		date: { $gte: Date.now() }
	});
	const pagination = await createPagination(count, req.query.page);
	// ? remove "?page" from url
	const pageUrl = req.originalUrl.includes("page")
		? req.originalUrl.substring(0, req.originalUrl.lastIndexOf("&"))
		: req.originalUrl;
	// ? redirection for inappropriate pages
	if (pagination.pages && pagination.page < 1)
		return res.redirect(`${pageUrl}&page=1`);
	if (pagination.pages && pagination.page > pagination.pages)
		return res.redirect(`${pageUrl}&page=${pagination.pages}`);

	// TODO #5 :
	const events = await Event.find({
		[operator]: filterObj
	})
		.sort({ date: -1 })
		.skip(pagination.skip)
		.limit(pagination.limit);

	return res.render("search_result", {
		title: "Search Results",
		events,
		query: req.query,
		pagination,
		path: pageUrl
	});
};

/**
 * *Comment Load Todos
 * 	TODO #1 : Get eventId and page number
 * 	TODO #2 : Count all comments of event & Create Pagination
 * 	TODO #3 : Get all the comments of particular event and update each comment with replies
 * 	TODO #4 : Return
 * *Finished
 */
exports.GET_EVENT_COMMENTS = async (req, res, next) => {
	// TODO #1:
	const { id, page } = req.params;
	// TODO #2:
	const count = await Comment.countDocuments({
		event: id,
		childOf: { $exists: false }
	});

	const pagination = await createPagination(count, page, 3);

	// TODO #3:
	let comments = await Comment.find({ event: id }).sort({ createdAt: -1 });
	comments = nestCommentReplies(comments).splice(pagination.skip, pagination.limit);

	// TODO #4:
	return res.status(200).json(
		formatSuccess({
			msg: "Comments fetched",
			comments,
			pagination
		})
	);
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
		organiser: req.user.id
	}).save();

	// TODO #2:
	return res.status(200).json(formatSuccess({ msg: "Event added", event }));
};

/**
 * * Post Comment
 * 	TODO #1 : Check for event existence & return if count is 0
 * 	TODO #2 : Save comment
 * 	TODO #3 : Return response
 * * Finished
 */
exports.POST_EVENT_COMMENT = async (req, res, next) => {
	const { id } = req.params;
	// TODO #1 :
	const isEventExist = await Event.countDocuments({ _id: id });
	//! 404
	if (!isEventExist) {
		return res.status(404).json(formatErrors("Please try again!", "", "comment"));
	}
	// TODO #2 :
	const comment = await new Comment({
		...req.body,
		author: req.user.id,
		event: id
	}).save();

	// TODO #3 :
	return res.status(200).json(
		formatSuccess({
			msg: "Comment added",
			comment: {
				...comment._doc,
				author: req.user
			}
		})
	);
};

/**
 * * Post comment reply
 * 	TODO #1 : Check for comment existence & return if count is 0
 * 	TODO #2 : Save reply
 * 	TODO #3 : Return response
 * * Finished
 */

exports.POST_EVENT_COMMENT_REPLY = async (req, res, next) => {
	const { id, comment } = req.params;
	// TODO #1 :
	const isCommentExist = await Comment.countDocuments({ _id: comment });
	if (!isCommentExist)
		return res.status(422).json(formatErrors("Please try again!", "", "reply"));
	// TODO #2 :
	const reply = await new Comment({
		comment: req.body.reply,
		childOf: comment,
		author: req.user.id,
		event: id
	}).save();

	// TODO #3 :
	return res.status(200).json(
		formatSuccess({
			msg: "Reply added",
			reply: {
				...reply._doc,
				author: req.user
			}
		})
	);
};

/**
 *  * Post connect checkout
 * 	TODO #1 : Destruct the type & id
 * 	TODO #2 : Getevent & recalculate amount of checkout if found else 404
 * 	TODO #3 : First validate booking & perform stripe checkout if it is valid
 * 	TODO #4 : Save booking detail with required info and send mail to user
 * 	TODO #5 : Return response
 *  * Finished
 */
exports.POST_CHECKOUT = async (req, res, next) => {
	// TODO #1:
	const { type, id } = req.params;
	const { token } = req.body;

	// TODO #2:
	const event = await Event.findOne({ _id: id });
	// !404
	if (!event) {
		return res
			.status(404)
			.json(formatErrors((msg = "Event not found"), (location = "form")));
	}
	const totalAmount = event.price * 100;

	// TODO #3:

	// validation
	if (dateInPast(event.date)) {
		throw new Error(`Bookings closed.`);
	}
	const countBooking = event.bookings.find(
		booking => String(booking.receiver) === req.user.id
	);
	if (countBooking) throw new Error(`You already have booking for this event.`);

	// checkout
	const charge = await Stripe.charges.create({
		amount: totalAmount,
		currency: "usd",
		description: `Payment of $${totalAmount / 100} against the booking of ${
			event.name
		} event`,
		source: token,
		destination: {
			amount: totalAmount - (totalAmount * 5) / 100,
			account: event.organiser.connect
		}
	});

	// TODO #4:
	await new Booking({
		transactionId: charge.id,
		amount: totalAmount / 100,
		event: event.id,
		payer: req.user.id,
		receiver: event.organiser.id,
		receipt: charge.receipt_url,
		status: charge.status
	}).save();

	await send({
		receiver: req.user.email,
		subject: "Payment Success",
		message: `Congrats, ${charge.description} completed.Here is your <a href="${
			charge.receipt_url
		}">receipt </a>.  `
	});

	// TODO #5:
	return res
		.status(200)
		.json(
			formatSuccess({ msg: "Booking Done.Check you mail account for receipt." })
		);
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
		{
			$and: [{ _id: id }, { organiser: req.user.id }]
		},
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

	//! 404
	if (!event) {
		return res
			.status(404)
			.json(formatErrors((msg = "Event not found"), (location = "form")));
	}

	// TODO #3:
	if (req.body.cover && event.cover) {
		await delete_image_from_imagekit(event.cover);
	}

	// TODO #4:
	return res.status(200).json(
		formatSuccess({
			msg: "Event updated",
			event: req.body
		})
	);
};
