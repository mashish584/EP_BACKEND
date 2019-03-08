import axios from "./axios";

export default () => {
	/**
	 * TODO: Store Element Reference
	 */

	const profileUpload = document.querySelector("#uploadProfile");
	const profileUploadTrigger = document.querySelector("#profile");

	/**
	 * * Profile Upload Todos
	 *  	TODO #1 : Extact Form Data - File
	 *  	TODO #2 : Validate image existence on frontend
	 *  	TODO #3 : Send it on server
	 * *Finished
	 */
	profileUpload &&
		profileUpload.addEventListener("submit", async function(e) {
			e.preventDefault();
			//TODO #1 :
			const body = new FormData(this);
			//TODO #2 :
			if (body.get("profile").size === 0) return;
			//TODO #3 :
			const {
				data: { success }
			} = await axios.put("/profile/me/upload", body);
			this.parentElement
				.querySelector("img")
				.setAttribute("src", success.imageUrl);
		});

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
