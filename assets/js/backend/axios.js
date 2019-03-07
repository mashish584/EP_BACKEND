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
		const {
			status,
			data: { errors }
		} = error.response;
		toggleLoader("", false);

		// show error according to the matched case
		switch (status) {
			case 401:
				const el = document.querySelector(`${errors[0].location}`);
				el.insertAdjacentHTML("afterbegin", `<div id="flash" class="error">${errors[0].msg}</div>`);
				break;
			case 403:
				showErrors(errors);
				break;
		}

		return Promise.reject(error);
	}
);

export default instance;
