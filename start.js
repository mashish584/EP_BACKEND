require("dotenv").config({ path: "secret.env" });

const mongoose = require("mongoose");
// mongo setup with mongoose
mongoose.connect(process.env.DATABASE, { useNewUrlParser: true }, err => {
	if (err) console.log(`Mongo connection error - ${err.message}`);
});
mongoose.set("useCreateIndex", true);

//server module import & setup
const app = require("./server");

app.set("port", process.env.PORT || 4040);
app.listen(app.get("port"), () =>
	console.log(`Server is running on port ${app.get("port")}`)
);
