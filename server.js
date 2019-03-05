const express = require("express");
const path = require("path");
const session = require("express-session");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo")(session);
const flash = require("connect-flash");

// created app routes
const appRoute = require("./routes/_index");

// error handlers
const { NotFoundError, ErrorRendering } = require("./handlers/errorHandler.js");

const app = express();

// setting up ejs as templating engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "assets")));
app.use(flash());

// session middleware
app.use(
	session({
		secret: process.env.SECRET,
		resave: false,
		saveUninitialized: false,
		store: new MongoStore({ mongooseConnection: mongoose.connection }),
		cookie: { maxAge: 10 * 60 * 60 * 1000 } // 10 hours
	})
);

app.use((req, res, next) => {
	res.locals.user = req.user || null;
	res.locals.flash = req.flash();
	next();
});

// Application routes
app.use("/", appRoute.indexRoutes);
app.use("/", appRoute.authRoutes);
app.use("/profile", appRoute.userRoutes);

// catch 404 and forward to error handlers
app.use(NotFoundError);

// error rendering
app.use(ErrorRendering);

module.exports = app;
