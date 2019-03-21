const mongoose = require("mongoose");
const CommentSchema = new mongoose.Schema(
	{
		comment: {
			type: String,
			required: true,
			trim: true
		},
		author: {
			type: mongoose.Schema.ObjectId,
			ref: "User"
		},
		event: {
			type: mongoose.Schema.ObjectId,
			ref: "Event"
		},
		childOf: mongoose.Schema.ObjectId
	},
	{
		timestamps: true
	}
);

function populate(next) {
	this.populate(
		"author",
		"-password -confirmationToken -tokenExpiration -createdAt -updatedAt"
	);
	next();
}

CommentSchema.pre("find", populate);
CommentSchema.pre("findOne", populate);

module.exports = mongoose.model("Comment", CommentSchema);
