import axios from "./axios";
import { getFormData, asyncErrorHandler, notificationFlash } from "./helper";

export default () => {
	const signinForm = document.querySelector("#signin");
	const signupForm = document.querySelector("#signup");

	// TODO #1: Handle SignIn Form
	signinForm &&
		signinForm.addEventListener(
			"submit",
			asyncErrorHandler(async function(e) {
				e.preventDefault();
				// get form data
				const body = getFormData(Array.from(this.querySelectorAll("input")));
				// send request
				const { status } = await axios.post("/signin", body);
				// rediret user
				if (status === 200) {
					window.location.href = "/";
				}
			})
		);

	//TODO #2: Handle SignUpForm
	signupForm &&
		signupForm.addEventListener(
			"submit",
			asyncErrorHandler(async function(e) {
				e.preventDefault();
				// get form data
				const body = getFormData(Array.from(this.querySelectorAll("input")));
				// send request
				const { status } = await axios.post("/signup", body);
				// show success message
				if (status === 200) {
					this.reset();
					notificationFlash(
						"success",
						"Account created.Check your mail account for verification mail."
					);
				}
			})
		);
};
