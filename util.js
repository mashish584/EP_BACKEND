// format all errors
exports.formatErrors = (msg, location, param = "") => {
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
