export let lastClickEl = null;

export const catchClickEvent = () =>
	document.addEventListener("mousedown", e => (lastClickEl = e.target));

export const toggleCheckout = (e = false) => {
	if (e) {
		e.stopPropagation();
	}
	const overlay = document.querySelector(".modal-overlay");
	overlay.classList.contains("active")
		? overlay.classList.remove("active")
		: overlay.classList.add("active");
};
