/**
 * TODO : Insert/Remove Loader in or from body on each ajax request/response
 * 	@param {"hold a short title of type of submission"} message
 * 	@param {"boolean value for taking action regarding hide/show"} show
 */

export const toggleLoader = (message, show) => {
	const bodyEl = document.querySelector("body");
	const loader = `<div id="loader">
		<div class="lds-default">
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
		</div>
		<span>${message}</span>
	</div>`;
	show
		? bodyEl.insertAdjacentHTML("afterbegin", loader)
		: bodyEl.removeChild(document.querySelector("#loader"));
};

/**
 * TODO : Extract Form Values
 *	 	@param {"[] of form elements"} elements
 */

export const getFormData = elements => {
	const formData = {};
	elements.map(el => (formData[el.name] = el.value));
	return formData;
};

/**
 * TODO : Attach error messages in DOM
 * 	@param {"[] of errors object"} errors
 */

export const showErrors = errors => {
	errors.map(err => {
		const formEl =
			document.querySelector(`input[name=${err.param}]`) ||
			document.querySelector(`textarea[name=${err.param}]`);

		const parentEl = formEl.parentElement;
		parentEl.classList.add("error");
		parentEl.insertAdjacentHTML("beforeend", `<span>${err.msg}</span>`);
	});
};

/**
 *  TODO : Delete all types of errors elements from DOM
 */

export const hideErrors = () => {
	const errorEls = Array.from(document.querySelectorAll(".error"));
	const flashError = document.querySelector("#flash");
	flashError && flashError.remove();
	errorEls.map(el => {
		if (!el.id.includes("flash")) {
			el.classList.remove("error");
			el.removeChild(el.querySelector("span"));
		}
	});
};

/**
 * TODO : Async Error Handler
 */

export const asyncErrorHandler = function(fn) {
	return function(e) {
		return fn
			.call(this, e)
			.catch(error => console.log(`Error : ${error.message}`));
	};
};

/**
 * TODO : Create Notification Flash
 */

export const notificationFlash = (type, message = "Network Error") => {
	const notifFlash = document.querySelector(".notif-flash");
	notifFlash.innerHTML = `<span>${message}</span>
					<button id="closeFlash" class="fa fa-close"></button>`;
	setTimeout(() => {
		notifFlash.classList.add(type);
	}, 500);
};

/**
 * Templates
 */

export const replyFormTemplate = data => {
	return `<form id="replyForm" data-target="${data.id}">
	<div class="profile-image">
		<img src=${data.author.profileImg ||
			"https://www.drupal.org/files/issues/default-avatar.png"} alt="user-image">
	</div>
	<div class="input-group">
		<textarea name="reply" placeholder="Add a reply.."></textarea>
	</div>
	<button type="button" class="btn btn-reply btn-th" data-comment="${
		data.comment
	}" data-id="${data.id}">Reply</button>
</form>`;
};

export const repliesTemplate = replies => {
	return replies.map(reply => commentTemplate(reply)).join("");
};

export const commentTemplate = (comment, showReplies = false, showForm = false) => {
	return `<div class="comment">
		<div class="comment-profile">
			<img src="${comment.author.profileImg ||
				"https://www.drupal.org/files/issues/default-avatar.png"}" alt="user-image">
		</div>
		<div class="comment-content">
			<div class="comment-content--meta">
				<span>${comment.author.fullname}</span>
				<span>${moment(comment.createdAt).calendar()}</span>
			</div>
			<div class="comment-content--comment">${comment.comment}</div>
			<br>
			<br>
			<section id="replies" data-target="${comment._id}">
				${showReplies ? repliesTemplate(comment.replies) : ""}
			</section>
			${
				showForm
					? replyFormTemplate({
							id: comment.event,
							comment: comment._id,
							author: comment.author
					  })
					: ""
			}
		</div>
	</div>`;
};
