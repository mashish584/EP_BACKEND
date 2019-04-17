import axios from "./axios";
import { asyncErrorHandler, getFormData, notificationFlash } from "./helper";

export default () => {
	const resetForm = document.querySelector("#resetForm");
	const profileForm = document.querySelector("#profileForm");
	const profileUpload = document.querySelector("#uploadProfile");
	const profileUploadTrigger = document.querySelector("#profile");

	/**
	 * *Profile Password Update Todos
	 * 	TODO #1 : Get values from Input
	 * 	TODO #2 : Send it on server
	 * *Finished
	 */

	resetForm &&
		resetForm.addEventListener(
			"submit",
			asyncErrorHandler(async function(e) {
				e.preventDefault();
				//  TODO #1 :
				const body = getFormData(Array.from(this.querySelectorAll("input")));
				const { status } = await axios.put("/profile/me/update/password", body);
				if (status === 200) {
					this.reset();
					this.insertAdjacentHTML(
						"afterbegin",
						"<div id='flash' class='success'>Password updatd.</div>"
					);
				}
			})
		);

	/**
	 * *Profile Info Update Todos
	 * 	TODO #1 : Collect all input and textarea nodes and get values
	 * 	TODO #2 : Get coordinates & add update location data + create social media link object
	 * 	TODO #3 : Send it on server
	 * *Finished
	 */
	profileForm &&
		profileForm.addEventListener(
			"submit",
			asyncErrorHandler(async function(e) {
				e.preventDefault();
				// TODO #1:
				const [inputEls, textarealEls] = [
					Array.from(this.querySelectorAll("input")),
					Array.from(this.querySelectorAll("textarea"))
				];
				const body = getFormData([...inputEls, ...textarealEls]);

				// TODO #2:
				let { coordinates } = this.querySelector(
					'input[name="location"]'
				).dataset;

				// map and covert long and lat
				coordinates = coordinates
					? coordinates.split(",").map(val => parseFloat(val))
					: [];

				// create new location object and assign it to body.location
				const locationObject = {
					address: body.location,
					coordinates
				};
				body.location = locationObject;
				// create social-media links object and assign it to body.social
				body.social = {
					facebook: body.facebook,
					twitter: body.twitter,
					linkedin: body.linkedin,
					instagram: body.instagram
				};

				//TODO #3 :
				const { status } = await axios.put("/profile/me/info", body);
				if (status === 200) {
					notificationFlash("success", "Info updated.");
				}
			})
		);

	/**
	 * * Profile Upload Todos
	 *  	TODO #1 : Extact Form Data - File
	 *  	TODO #2 : Validate image existence on frontend
	 *  	TODO #3 : Send it on server
	 * *Finished
	 */
	profileUpload &&
		profileUpload.addEventListener(
			"submit",
			asyncErrorHandler(async function(e) {
				e.preventDefault();
				//TODO #1 :
				const body = new FormData(this);
				//TODO #2 :
				if (body.get("image").size === 0) return;
				//TODO #3 :
				const {
					data: { success }
				} = await axios.put("/profile/me/upload", body);
				this.parentElement
					.querySelector("img")
					.setAttribute("src", success.imageUrl);
			})
		);

	/**
	 * * Upload Button Todos
	 * 	TODO #1: Create submit button & add that into form
	 * 	TODO #2: Trigger click on Submit Button and Remove it
	 * *Finished
	 */
	profileUploadTrigger &&
		profileUploadTrigger.addEventListener("change", () => {
			// TODO #1 :
			profileUpload.insertAdjacentHTML(
				"beforeend",
				'<button type="submit"></button>'
			);
			const submitButton = profileUpload.querySelector("button");
			// TODO #2 :
			submitButton.click();
			submitButton.remove();
		});
};
