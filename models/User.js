const mongoose = require("mongoose");
const { hashSync, genSaltSync } = require("bcryptjs");

const UserSchema = new mongoose.Schema(
	{
		fullname: {
			type: String,
			trim: true,
			required: true
		},
		email: {
			type: String,
			trim: true,
			unique: true,
			required: true
		},
		password: {
			type: String,
			required: true
		},
		profileImg: String,
		active: {
			type: Boolean,
			default: false
		},
		confirmationToken: String,
		tokenExpiration: Date
	},
	{
		timestamps: true
	}
);

UserSchema.pre("save", function(next) {
	const user = this;
	user.password = hashSync(user.password, genSaltSync(10));
	next();
});

module.exports = mongoose.model("User", UserSchema);
