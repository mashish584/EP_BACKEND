const passport = require("passport");
const FacebookStrategy = require("passport-facebook");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");
const { createJWT } = require("../util");

passport.use(
	new FacebookStrategy(
		{
			clientID: process.env.FB_APP_ID,
			clientSecret: process.env.FB_APP_SEC,
			callbackURL: `${process.env.BASE_URL}/auth/facebook/callback`,
			passReqToCallback: true,
			profileFields: ["email"]
		},
		async function(req, accessToken, refreshToken, profile, done) {
			const { email } = profile._json;
			const user = await User.findOne({ email });
			if (user) {
				return done(null, user);
			} else {
				return done(
					null,
					false,
					req.flash("error", "No account exist. Please do signup now.")
				);
			}
		}
	)
);

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_APP_ID,
			clientSecret: process.env.GOOGLE_APP_SEC,
			callbackURL: `${process.env.BASE_URL}/auth/google/callback`,
			passReqToCallback: true
		},
		async function(req, accessToken, refreshToken, profile, done) {
			const { email } = profile._json;
			const user = await User.findOne({ email });
			if (user) {
				return done(null, user);
			} else {
				return done(
					null,
					false,
					req.flash("error", "No account exist. Please do signup now.")
				);
			}
		}
	)
);

// used to serialize the user for the session
passport.serializeUser(function(user, done) {
	done(null, createJWT(user));
});
