import axios from "axios";
import { showErrors, hideErrors, toggleLoader } from "./helper";

const instance = axios.create({
	baseURL: process.env.BASE_URL
});

// TODO: Intercepts axios requests
instance.interceptors.request.use(
	config => {
		toggleLoader("Wait...", true);
		hideErrors();
		return config;
	},
	error => {
		return Promise.reject(error);
	}
);

//TODO: Intercepts axios response
instance.interceptors.response.use(
	response => {
		toggleLoader("", false);
		hideErrors();
		return response;
	},
	error => {
		//! Throw alert,hide loader and stop execution of script immediately
		if (error.message === "Network Error") {
			alert("Network Error");
			toggleLoader("", false);
			return;
		}

		const {
			status,
			data: { errors }
		} = error.response;
		toggleLoader("", false);

		//! Show error as per match case
		switch (status) {
			case 401:
				const el = document.querySelector(`${errors[0].location}`);
				el.insertAdjacentHTML(
					"afterbegin",
					`<div id="flash" class="error">${errors[0].msg}</div>`
				);
				break;
			case 422:
				showErrors(errors);
				break;
			default:
				alert(`${status} : ${errors[0].msg}`);
		}

		return Promise.reject(error);
	}
);

export default instance;
