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
		phone: {
			type: String,
			trim: true
		},
		bio: {
			type: String,
			trim: true
		},
		location: {
			type: {
				type: String,
				default: "Point"
			},
			coordinates: [Number],
			address: {
				type: String,
				trim: true
			}
		},
		social: {
			facebook: {
				type: String,
				trim: true
			},
			twitter: {
				type: String,
				trim: true
			},
			linkedin: {
				type: String,
				trim: true
			},
			instagram: {
				type: String,
				trim: true
			}
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

//TODO: Hash password before any save call
UserSchema.pre("save", function(next) {
	const user = this;
	user.password = hashSync(user.password, genSaltSync(10));
	next();
});

module.exports = mongoose.model("User", UserSchema);
