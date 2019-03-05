exports.GET_LOGIN = (req, res, next) => {
	return res.render("login", { title: "Login" });
};

exports.GET_REGISTER = (req, res, next) => {
	return res.render("signup", { title: "Become a host" });
};

exports.GET_FORGOT = (req, res, next) => {
	return res.render("forgot", { title: "Get new password" });
};
