const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const htmlToText = require("html-to-text");

const OAuth2Client = new OAuth2(
	process.env.MAIL_CLIENT_ID, // ClientID
	process.env.MAIL_CLIENT_SECRET, // Client Secret
	"https://developers.google.com/oauthplayground" // Redirect URL
);
console.log(process.env.MAIL_CLIENT_ID);
// setting up oauth credential
OAuth2Client.setCredentials({
	refresh_token: process.env.MAIL_REFRESH_TOKEN
});

// generating access token
const accessToken = OAuth2Client.refreshAccessToken().then(
	res => res.credentials.access_token
);

const transport = nodemailer.createTransport({
	service: "gmail",
	auth: {
		type: "OAuth2",
		user: process.env.MAIL_USER,
		clientId: process.env.MAIL_CLIENT_ID,
		clientSecret: process.env.MAIL_CLIENT_SECRET,
		refreshToken: process.env.MAIL_REFRESH_TOKEN,
		accessToken: accessToken
	},
	tls: {
		rejectUnauthorized: false
	}
});

exports.send = async () => {
	const mailOptions = {
		from: `TEST <oauthAccount@gmail.com>`,
		to: "yourmail@gmail.com",
		subject: "TEST SUBJECT",
		html: "<p>HELLO</p>",
		text: htmlToText.fromString("<p>HELLO</p>")
	};
	return transport.sendMail(mailOptions);
};
