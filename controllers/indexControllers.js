exports.GET_HOMEPAGE = (req, res, next) => {
	return res.render("index", { title: "Home" });
};

exports.GET_EVENT_DESCRIPTION = (req, res, next) => {
	return res.render("event_desc", { title: "BMX" });
};

exports.GET_CATEGORY_EVENTS = (req, res, next) => {
	return res.render("event_list", { title: "Event List" });
};

exports.GET_EVENT_ADDFORM = (req, res, next) => {
	return res.render("add_event", { title: "Host Event" });
};
