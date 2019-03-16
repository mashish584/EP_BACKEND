const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");

const EventSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true
		},
		slug: {
			type: String,
			slug: "name",
			slug_padding_size: 2,
			unique: true
		},
		spot: Number,
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
		category: {
			type: String,
			trim: true,
			required: true
		},
		description: {
			type: String,
			trim: true,
			required: true
		},
		cover: String,
		date: {
			type: Number,
			required: true
		},
		time: {
			start: Number,
			end: Number
		},
		price: {
			type: Number,
			default: 0
		},
		organiser: {
			type: mongoose.Schema.ObjectId,
			ref: "User"
		}
	},
	{
		timestamps: true
	}
);

// TODO : Index setup
EventSchema.index({ "location.coordinates": "2dsphere" });

// TODO : Populate fields with the reference id data
function populate(next) {
	this.populate(
		"organiser",
		"-password -confirmationToken -tokenExpiration -createdAt -updatedAt"
	);
	next();
}

// TODO : Hook populate function on find & find-one hook
EventSchema.pre("find", populate);
EventSchema.pre("findOne", populate);

// TODO: Add slug plugin to mongoose instance
mongoose.plugin(slug);

module.exports = mongoose.model("Event", EventSchema);
