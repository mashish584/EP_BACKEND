import axios from "./axios";
import { asyncErrorHandler } from "./helper";

export default () => {
	const eventAddForm = document.querySelector("#addEvent");
	const eventUpdateForm = document.querySelector("#updateEvent");

	/**
	 *  * Event Add Form Todos
	 * 	TODO #1 : Get all input data from form
	 * 	TODO #2 : Create location object & append it on body object
	 * 	TODO #3 : Send it on server
	 *  *Finished
	 */
	eventAddForm &&
		eventAddForm.addEventListener(
			"submit",
			asyncErrorHandler(async function(e) {
				e.preventDefault();
				// TODO #1:
				const body = new FormData(this);

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
					address: body.get("location"),
					coordinates
				};
				body.set("location", JSON.stringify(locationObject));

				// TODO #3:
				const { status } = await axios.post("/host-event", body);
				if (status === 200) {
					this.reset();
					this.insertAdjacentHTML(
						"afterbegin",
						"<div id='flash' class='success'>Event added.</div>"
					);
				}
			})
		);

	/**
	 *  * Event Update Form Todos
	 * 	TODO #1 : Get all input data from form & return if event id is missing
	 * 	TODO #2 : Create location object & append it on body object
	 * 	TODO #3 : Send it on server
	 *  *Finished
	 */
	eventUpdateForm &&
		eventUpdateForm.addEventListener(
			"submit",
			asyncErrorHandler(async function(e) {
				e.preventDefault();
				// TODO #1:
				const body = new FormData(this);
				if (!body.get("eventId")) return;

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
					address: body.get("location"),
					coordinates
				};
				body.set("location", JSON.stringify(locationObject));

				// TODO #3:
				const { status } = await axios.put(
					`/event/${body.get("eventId")}/update`,
					body
				);
				if (status === 200) {
					this.insertAdjacentHTML(
						"afterbegin",
						"<div id='flash' class='success'>Event updated.</div>"
					);
				}
			})
		);
};
