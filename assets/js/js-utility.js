export let lastClickEl = null;

export const catchClickEvent = () =>
	document.addEventListener("mousedown", e => (lastClickEl = e.target));
