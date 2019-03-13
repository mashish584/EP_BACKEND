const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true
		},
		slug: String,
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

module.exports = mongoose.model("Event", EventSchema);
