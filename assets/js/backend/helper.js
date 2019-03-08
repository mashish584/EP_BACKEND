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
