const mongoose = require("mongoose");
const NotificationSchema = new mongoose.Schema(
	{
		receiver: {
			type: mongoose.Schema.ObjectId,
			ref: "User"
		},
		user: {
			type: mongoose.Schema.ObjectId,
			ref: "User"
		},
		message: String
	},
	{
		timestamps: true
	}
);

NotificationSchema.pre("find", function(next) {
	this.populate(
		"receiver",
		"-password -confirmationToken -tokenExpiration -createdAt -updatedAt"
	);
	this.populate(
		"user",
		"-password -confirmationToken -tokenExpiration -createdAt -updatedAt"
	);
	next();
});

module.exports = mongoose.model("Notification", NotificationSchema);
