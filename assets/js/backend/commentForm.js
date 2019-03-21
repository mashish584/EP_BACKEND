import axios from "axios";
import { getFormData, showErrors, hideErrors, commentTemplate } from "./helper";
import { lastClickEl } from "../js-utility";
// seperate instance
const $axios = axios.create({
	baseURL: process.env.BASE_URL
});

// intercept request
$axios.interceptors.request.use(
	config => {
		hideErrors();
		lastClickEl.setAttribute("disabled", true);
		return config;
	},
	error => {
		lastClickEl.removeAttribute("disabled");
		return Promise.reject(error);
	}
);

// intercept response
$axios.interceptors.response.use(
	response => {
		hideErrors();
		lastClickEl.removeAttribute("disabled");
		return response;
	},
	error => {
		//! Throw alert,hide loader and stop execution of script immediately
		if (error.message === "Network Error") {
			alert("Network Error");
			return;
		}
		// destruct response
		const {
			status,
			data: { errors }
		} = error.response;

		// show error in alert if status is not 422
		if (status !== 422) {
			alert(`Error:${errors[0].msg}`);
		} else {
			showErrors(errors);
		}

		lastClickEl.removeAttribute("disabled");

		return Promise.reject(error);
	}
);

export default () => {
	const commentForm = document.querySelector("#commentForm");
	const commentSection = document.querySelector(".comments");
	const loadComment = document.querySelector("#loadComment");

	// event delegation approach for submitting reply
	commentSection.addEventListener("click", async function({ target }) {
		if (target.classList.contains("btn-reply")) {
			const replyForm = target.parentElement;
			const { id, comment } = target.dataset;
			const body = getFormData([replyForm.querySelector("textarea")]);
			// return if id is not available
			if (!id) return;
			// send request for reply submission
			const { data, status } = await $axios.post(
				`/event/${id}/comment/${comment}/reply`,
				body
			);
			// reset reply form and generate reply template
			if (status === 200) {
				replyForm.reset();
				const replies = document.querySelector(
					`section[data-target="${comment}"]`
				);
				if (replies.innerHTML === "") {
					replies.innerHTML = commentTemplate(data.success.reply);
				} else {
					replies.insertAdjacentHTML(
						"afterbegin",
						commentTemplate(data.success.reply)
					);
				}
			}
		}
	});

	loadComment &&
		loadComment.addEventListener("click", async function() {
			const { event: id, page, user } = this.dataset;
			// return if page or event id is missing
			if (!event || !page) return;
			// get partial comments from server
			const { status, data } = await $axios.get(`/event/${id}/comments/${page}`);
			//laad comments in UI if success status is 200
			if (status === 200) {
				const commentsEl = document.querySelector(".comments");
				const { comments, pagination } = data.success;
				// remove button if no more data is available to load
				if (pagination.pages <= pagination.page) {
					this.remove();
				}
				this.dataset.page = +page + 1;

				comments.map(comment =>
					commentsEl.insertAdjacentHTML(
						"beforeend",
						commentTemplate(comment, true, user ? true : false)
					)
				);
			}
		});

	commentForm &&
		commentForm.addEventListener("submit", async function(e) {
			e.preventDefault();
			const body = getFormData([this.querySelector("textarea")]);
			const { id } = this.querySelector("button").dataset;
			// return if id is not available
			if (!id) return;
			// save comment for event
			const { data, status } = await $axios.post(`/event/${id}/comment`, body);
			// update ui and reset form is status is 200
			if (status === 200) {
				this.reset();
				const comments = document.querySelector(".comments");
				if (comments.innerHTML === "") {
					comments.innerHTML = commentTemplate(data.success.comment);
				} else {
					comments.insertAdjacentHTML(
						"afterbegin",
						commentTemplate(data.success.comment)
					);
				}
			}
		});
};
