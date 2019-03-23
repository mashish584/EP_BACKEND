const mongoose = require("mongoose");
const BookingSchema = new mongoose.Schema(
	{
		transactionId: {
			type: String,
			required: true
		},
		event: {
			type: mongoose.Schema.ObjectId,
			ref: "Event"
		},
		payer: {
			type: mongoose.Schema.ObjectId,
			ref: "User"
		},
		receiver: {
			type: mongoose.Schema.ObjectId,
			ref: "User"
		},
		receipt: {
			type: String,
			required: true
		},
		status: {
			type: String,
			required: true
		}
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model("Booking", BookingSchema);
