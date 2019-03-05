exports.GET_USER_PROFILE = (req, res, next) => {
	return res.render("user_info", { title: "My Profile" });
};

exports.GET_USER_HOSTED_EVENTS = (req, res, next) => {
	return res.render("user_event", { title: "My Hosted Events" });
};

exports.GET_USER_WALLET = (req, res, next) => {
	return res.render("user_wallet", { title: "My Wallet" });
};

exports.GET_USER_SETTINGS = (req, res, next) => {
	return res.render("user_settings", { title: "Settings" });
};
